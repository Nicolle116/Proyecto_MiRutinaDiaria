/**
 * MI RUTINA DIARIA — ENRUTADOR Y NAVEGACIÓN (NAVIGATION.JS)
 * Administra el montaje, desmontaje y transiciones de pantallas y escenarios,
 * retroceso secuencial de pasos/secciones y menú desplegable tipo hamburguesa.
 */

import { state } from './state.js';
import { ASSETS } from './assets.js';
import { soundManager } from './audio.js';

/**
 * Secuencia lineal ordenada de todas las secciones del juego.
 */
export const SECCIONES_APP = [
  { modulo: 0, seccion: 1, id: 'm0_s1', titulo: 'Inicio: Selección de personaje', corto: 'Inicio y Avatar', icono: '🌟' },
  { modulo: 1, seccion: 1, id: 'm1_s1', titulo: 'Módulo 1: El amanecer (video)', corto: '1. El amanecer', icono: '☀️' },
  { modulo: 1, seccion: 2, id: 'm1_s2', titulo: 'Módulo 1: Organizo mi ropa', corto: '2. Organizo mi ropa', icono: '🧺' },
  { modulo: 1, seccion: 3, id: 'm1_s3', titulo: 'Módulo 1: Reconozco mi ropa', corto: '3. Reconozco mi ropa', icono: '👕' },
  { modulo: 1, seccion: 4, id: 'm1_s4', titulo: 'Módulo 1: ¿Dónde se usa cada prenda?', corto: '4. ¿Dónde se usa?', icono: '📍' },
  { modulo: 1, seccion: 5, id: 'm1_s5', titulo: 'Módulo 1: El clima y la ropa', corto: '5. Clima y ropa', icono: '🌧️' },
  { modulo: 1, seccion: 6, id: 'm1_s6', titulo: 'Módulo 1: Mi vestuario completo', corto: '6. Vestuario completo', icono: '🧥' },
  { modulo: 2, seccion: 1, id: 'm2_s1', titulo: 'Módulo 2: Aprendiendo a vestirnos', corto: '1. Introducción', icono: '🎬' },
  { modulo: 2, seccion: 2, id: 'm2_s2', titulo: 'Módulo 2: ¡Hora de desvestirse!', corto: '2. ¡Hora de desvestirse!', icono: '🧦' },
  { modulo: 2, seccion: 3, id: 'm2_s3', titulo: 'Módulo 2: Cómo ponerse la chaqueta', corto: '3. Ponerse la chaqueta', icono: '🧥' },
  { modulo: 2, seccion: 4, id: 'm2_s4', titulo: 'Módulo 2: Cómo ponerse la camiseta', corto: '4. Ponerse la camiseta', icono: '👕' },
  { modulo: 2, seccion: 5, id: 'm2_s5', titulo: 'Módulo 2: Cómo ponerse el pantalón', corto: '5. Ponerse el pantalón', icono: '👖' },
  { modulo: 2, seccion: 6, id: 'm2_s6', titulo: 'Módulo 2: Emparejo clima y vestimenta', corto: '6. Clima y vestimenta', icono: '🧩' },
  { modulo: 2, seccion: 7, id: 'm2_s7', titulo: 'Módulo 2: Reto paso a paso (autonomía)', corto: '7. Reto final paso a paso', icono: '🏆' }
];

class NavigationRouter {
  constructor() {
    this.stage = null;
    this.backgroundEl = null;
    this.instructionEl = null;
    this.instructionText = null;
    this.userChip = null;
    this.moduleBadge = null;
    this.modalOverlay = null;
    this.drawerOverlay = null;
    this.drawerList = null;
    this.btnAnterior = null;

    this.lastInstructionText = '';
    this.currentStepBackHandler = null; // Manejador opcional para retroceder un paso interno

    this.modules = {}; // Registros de módulos
    this.currentCleanUp = null; // Función de limpieza de la pantalla previa
  }

  init({ stageId, backgroundId, instructionId, modalId, drawerOverlayId, drawerListId, btnAnteriorId }) {
    this.stage = document.getElementById(stageId);
    this.backgroundEl = document.getElementById(backgroundId);
    this.instructionEl = document.getElementById(instructionId);
    this.instructionText = document.getElementById('instruction-text');
    this.modalOverlay = document.getElementById(modalId);
    this.userChip = document.getElementById('user-chip');
    this.moduleBadge = document.getElementById('module-badge');
    this.drawerOverlay = document.getElementById(drawerOverlayId);
    this.drawerList = document.getElementById(drawerListId);
    this.btnAnterior = document.getElementById(btnAnteriorId);

    // Suscribirse a cambios de estado
    state.subscribe(s => this.onStateChange(s));

    // Estado inicial de botones de navegación
    this.updateNavigationButtons(state.get());
  }

  registerModule(modNumber, moduleObj) {
    this.modules[modNumber] = moduleObj;
  }

  onStateChange(s) {
    // Actualizar chip de usuario
    if (this.userChip) {
      if (s.nombre) {
        this.userChip.style.display = 'flex';
        const avatarEmoji = s.genero === 'nino' ? '👦' : '👧';
        this.userChip.innerHTML = `<span class="user-chip-avatar">${avatarEmoji}</span> <span>${s.nombre}</span>`;
      } else {
        this.userChip.style.display = 'none';
      }
    }

    // Actualizar título de módulo
    if (this.moduleBadge) {
      if (s.modulo === 0) {
        this.moduleBadge.textContent = 'Módulo 0: Inicio';
      } else if (s.modulo === 1) {
        this.moduleBadge.textContent = `Módulo 1: Reconozco mi ropa (${s.seccion}/6)`;
      } else if (s.modulo === 2) {
        this.moduleBadge.textContent = `Módulo 2: Me visto paso a paso (${s.seccion}/7)`;
      }
    }

    // Actualizar botón de anterior
    this.updateNavigationButtons(s);

    // Si el menú desplegable está abierto, actualizarlo
    if (this.drawerOverlay && !this.drawerOverlay.classList.contains('hidden')) {
      this.renderSectionsDrawer();
    }
  }

  /**
   * Habilita o deshabilita el botón de paso/sección anterior según la posición actual.
   */
  updateNavigationButtons(s) {
    const curMod = s.modulo || 0;
    const curSec = s.seccion || 1;
    const curIndex = SECCIONES_APP.findIndex(sec => sec.modulo === curMod && sec.seccion === curSec);

    if (this.btnAnterior) {
      if (curIndex <= 0) {
        this.btnAnterior.disabled = true;
        this.btnAnterior.style.opacity = '0.4';
        this.btnAnterior.style.cursor = 'not-allowed';
      } else {
        this.btnAnterior.disabled = false;
        this.btnAnterior.style.opacity = '1';
        this.btnAnterior.style.cursor = 'pointer';
      }
    }
  }

  /**
   * Registra un manejador para retroceder un paso interno antes de cambiar de sección completa.
   */
  registerStepBackHandler(handler) {
    this.currentStepBackHandler = handler;
  }

  clearStepBackHandler() {
    this.currentStepBackHandler = null;
  }

  /**
   * Retrocede al paso interno previo o a la sección anterior en la secuencia.
   */
  navigatePrevious() {
    // 1. Manejador de sub-paso registrado por la pantalla actual
    if (typeof this.currentStepBackHandler === 'function') {
      try {
        const handled = this.currentStepBackHandler();
        if (handled) return;
      } catch (err) {
        console.warn('Error en currentStepBackHandler:', err);
      }
    }

    // 2. Retroceso a la sección previa en la lista global
    const s = state.get();
    const curMod = s.modulo || 0;
    const curSec = s.seccion || 1;

    const curIndex = SECCIONES_APP.findIndex(sec => sec.modulo === curMod && sec.seccion === curSec);

    if (curIndex > 0) {
      const prev = SECCIONES_APP[curIndex - 1];
      this.navigateTo(prev.modulo, prev.seccion);
    }
  }

  /**
   * Renderiza la lista de secciones agrupada en el cajón desplegable (Hamburguesa).
   */
  renderSectionsDrawer() {
    if (!this.drawerList) return;
    const currentState = state.get();
    const curMod = currentState.modulo;
    const curSec = currentState.seccion;
    const completadas = currentState.actividadesCompletadas || {};

    const modulosInfo = [
      {
        num: 0,
        titulo: 'Módulo 0: Inicio',
        icono: '🌟',
        secciones: SECCIONES_APP.filter(s => s.modulo === 0)
      },
      {
        num: 1,
        titulo: 'Módulo 1: Reconozco y elijo mi ropa',
        icono: '👕',
        secciones: SECCIONES_APP.filter(s => s.modulo === 1)
      },
      {
        num: 2,
        titulo: 'Módulo 2: Me visto paso a paso',
        icono: '👟',
        secciones: SECCIONES_APP.filter(s => s.modulo === 2)
      }
    ];

    let html = '';
    modulosInfo.forEach(m => {
      html += `
        <div class="drawer-module-group">
          <div class="drawer-module-title">
            <span>${m.icono}</span>
            <span>${m.titulo}</span>
          </div>
          <div class="drawer-items">
            ${m.secciones.map(sec => {
              const isCurrent = (curMod === sec.modulo && curSec === sec.seccion);
              const isDone = completadas[`m${sec.modulo}_s${sec.seccion}`];
              return `
                <button class="drawer-item ${isCurrent ? 'current' : ''}" data-modulo="${sec.modulo}" data-seccion="${sec.seccion}">
                  <span class="drawer-item-title">
                    <span>${sec.icono}</span>
                    <span>${sec.corto}</span>
                  </span>
                  <span class="drawer-item-badge">
                    ${isCurrent ? '📍' : isDone ? '✅' : '⚪'}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    html += `
      <div style="margin-top: 18px; padding-top: 14px; border-top: 2px dashed rgba(125, 66, 27, 0.3); text-align: center;">
        <a href="admin.html" class="btn btn-wood" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; font-size: 0.95rem; padding: 10px 14px;">
          <span>👑</span> <span>Panel Administrador</span>
        </a>
      </div>
    `;

    this.drawerList.innerHTML = html;

    // Vincular clics de cada sección del drawer
    this.drawerList.querySelectorAll('.drawer-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const mod = Number(btn.dataset.modulo);
        const sec = Number(btn.dataset.seccion);

        // Si salta desde Módulo 0 a otro módulo sin haber elegido personaje, asignar valores por defecto
        if (mod > 0 && !state.get().genero) {
          state.setAvatar('nina');
          state.setNombre('Amiguito');
        }

        this.closeSectionsMenu();
        this.navigateTo(mod, sec);
      });
    });
  }

  openSectionsMenu() {
    this.renderSectionsDrawer();
    if (this.drawerOverlay) {
      this.drawerOverlay.classList.remove('hidden');
      this.drawerOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  closeSectionsMenu() {
    if (this.drawerOverlay) {
      this.drawerOverlay.classList.add('hidden');
      this.drawerOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSectionsMenu() {
    if (!this.drawerOverlay) return;
    if (this.drawerOverlay.classList.contains('hidden')) {
      this.openSectionsMenu();
    } else {
      this.closeSectionsMenu();
    }
  }

  /**
   * Cambia el fondo del escenario de manera fluida.
   */
  setBackground(imgUrl) {
    if (!this.backgroundEl) return;
    this.backgroundEl.style.backgroundImage = `url("${imgUrl}")`;
  }

  /**
   * Muestra u oculta el subtítulo de instrucción vocal.
   */
  setInstruction(text) {
    if (!this.instructionEl || !this.instructionText) return;
    if (text) {
      this.lastInstructionText = text;
      this.instructionText.textContent = text;
      this.instructionEl.style.display = 'flex';
    } else {
      this.instructionEl.style.display = 'none';
    }
  }

  /**
   * Reabre el cartel de instrucción si estaba oculto.
   */
  reopenInstruction() {
    if (this.instructionEl && this.lastInstructionText) {
      this.instructionText.textContent = this.lastInstructionText;
      this.instructionEl.style.display = 'flex';
    }
  }

  /**
   * Muestra un popup breve de retroalimentación (Bien_chulo o Mal_X)
   */
  showFeedback(esCorrecto, callback = null, duracionMs = 1800) {
    const overlay = document.createElement('div');
    overlay.className = 'feedback-overlay';
    const imgKey = esCorrecto ? 'Bien_chulo' : 'Mal_X';
    overlay.innerHTML = `<img src="${ASSETS.getImageUrl(imgKey)}" alt="${esCorrecto ? 'Correcto' : 'Intentar de nuevo'}">`;

    this.stage.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      if (typeof callback === 'function') {
        callback();
      }
    }, duracionMs);
  }

  /**
   * Muestra un modal en pantalla.
   */
  showModal(contentHtml) {
    if (!this.modalOverlay) return;
    this.modalOverlay.innerHTML = contentHtml;
    this.modalOverlay.classList.remove('hidden');
  }

  /**
   * Cierra el modal activo.
   */
  closeModal() {
    if (!this.modalOverlay) return;
    this.modalOverlay.innerHTML = '';
    this.modalOverlay.classList.add('hidden');
  }

  /**
   * Navega a un módulo y sección específicos.
   */
  navigateTo(modulo, seccion) {
    // Detener audios y limpiar listeners anteriores
    soundManager.stopCurrentInstruction();

    if (typeof this.currentCleanUp === 'function') {
      this.currentCleanUp();
      this.currentCleanUp = null;
    }

    this.clearStepBackHandler();
    this.closeModal();
    this.closeSectionsMenu();
    this.setInstruction('');
    this.stage.innerHTML = '';

    state.setPantalla(modulo, seccion);

    const mod = this.modules[modulo];
    if (mod && typeof mod.renderSection === 'function') {
      this.currentCleanUp = mod.renderSection(seccion, this.stage, this);
    } else {
      console.warn(`Módulo ${modulo} no registrado o sin renderSection.`);
    }

    this.updateNavigationButtons(state.get());
  }
}

export const router = new NavigationRouter();
