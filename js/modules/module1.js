/**
 * MI RUTINA DIARIA — MÓDULO 1: RECONOZCO Y ELIJO MI ROPA
 * Secciones 1 a 6 completamente funcionales con fidelidad a las referencias.
 */

import { ASSETS } from '../assets.js';
import { state } from '../state.js';
import { soundManager } from '../audio.js';
import { adminService } from '../admin.js';

export const module1 = {
  renderSection(seccion, stage, router) {
    switch (Number(seccion)) {
      case 1: return this.renderSeccion1(stage, router);
      case 2: return this.renderSeccion2(stage, router);
      case 3: return this.renderSeccion3(stage, router);
      case 4: return this.renderSeccion4(stage, router);
      case 5: return this.renderSeccion5(stage, router);
      case 6: return this.renderSeccion6(stage, router);
      default:
        router.navigateTo(1, 1);
        return () => { };
    }
  },

  // =========================================================================
  // SECCIÓN 1: BIENVENIDA AL MÓDULO (VIDEO AMANECER)
  // =========================================================================
  renderSeccion1(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getImageUrl('Fondo_principal'));

    const videoUrl = ASSETS.getVideoAmanecer(s.genero);

    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-scene-container';
    videoContainer.innerHTML = `
      <video id="video-amanecer" class="video-scene-player" autoplay playsinline>
        <source src="${videoUrl}" type="video/mp4">
      </video>
    `;
    stage.appendChild(videoContainer);

    soundManager.playInstruction('M1_V1');
    router.setInstruction('¡Buenos días! Hoy aprenderemos a reconocer nuestra ropa y a elegirla para cada ocasión. Mira por la ventana y descubramos qué clima nos espera.');

    const video = videoContainer.querySelector('#video-amanecer');

    const mostrarBotonVestir = () => {
      router.showModal(`
        <div class="modal-card">
          <div class="panel-title-pill" style="top: -20px;">
            <span>☀️ ¡Hora de levantarse! ☀️</span>
          </div>
          <p class="modal-text" style="font-size: 1.35rem; margin: 20px 0;">
            El sol ya salió. ¡Vamos a descubrir nuestra ropa!
          </p>
          <button id="btn-a-vestirnos" class="btn btn-coral" style="font-size: 1.35rem; padding: 14px 44px;">
            ¡A vestirnos!
          </button>
        </div>
      `);

      const btn = document.getElementById('btn-a-vestirnos');
      if (btn) {
        btn.addEventListener('click', () => {
          router.closeModal();
          router.navigateTo(1, 2);
        });
      }
    };

    video.addEventListener('ended', mostrarBotonVestir);
    // Timeout de seguridad en caso de que el video tarde o termine
    const timer = setTimeout(mostrarBotonVestir, 6000);

    return () => {
      clearTimeout(timer);
      video.pause();
    };
  },

  // =========================================================================
  // SECCIÓN 2: ORGANIZO MI ROPA (R_M1_S2_no / R_M1_S2_na)
  // =========================================================================
  renderSeccion2(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getImageUrl('Fondo_principal'));

    const container = document.createElement('div');
    container.style.cssText = 'position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding-bottom: 30px;';

    // Título superior estilo pill (como en R_M1_S2)
    const titlePill = document.createElement('div');
    titlePill.className = 'panel-title-pill';
    titlePill.style.cssText = 'position: relative; top: 10px; font-size: 1.7rem; padding: 8px 36px;';
    titlePill.textContent = 'Organizo mi ropa';
    container.appendChild(titlePill);

    // Personaje sobre la alfombra (centrado inicialmente, se desplaza a la derecha al abrir armario)
    const charBox = document.createElement('div');
    charBox.className = 'char-wardrobe-actor';
    charBox.style.cssText = 'position: absolute; bottom: 90px; left: 50%; height: 68%; display: flex; align-items: flex-end; justify-content: center; z-index: 12; transform: translateX(-50%); transition: transform 0.75s cubic-bezier(0.25, 1, 0.5, 1); pointer-events: none;';
    charBox.innerHTML = `
      <img src="${ASSETS.getPersonajeInterior(s.genero)}" alt="Personaje" style="height: 100%; object-fit: contain; filter: drop-shadow(0 10px 14px rgba(0,0,0,0.3));">
    `;
    container.appendChild(charBox);

    // Botón de acción inferior
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'position: absolute; bottom: 25px; z-index: 20;';
    btnContainer.innerHTML = `
      <button id="btn-armario-accion" class="btn btn-blue" style="font-size: 1.35rem; padding: 12px 42px;">
        Abrir armario
      </button>
    `;
    container.appendChild(btnContainer);

    stage.appendChild(container);

    const btnAccion = container.querySelector('#btn-armario-accion');
    let paso = 0;
    let seqTimeouts = [];

    // Manejador para devolver al paso anterior dentro de la actividad
    router.registerStepBackHandler(() => {
      seqTimeouts.forEach(clearTimeout);
      if (paso === 3 || paso === 2) {
        paso = 1;
        charBox.style.transform = 'translateX(calc(-50% + min(26vw, 240px)))';
        router.setBackground(ASSETS.getImageUrl('Fondo_desorganizado'));
        btnAccion.disabled = false;
        btnAccion.textContent = 'Organizar armario';
        btnAccion.className = 'btn btn-coral';
        soundManager.playInstruction('M2_V2_2_1');
        router.setInstruction('La ropa está mezclada. Lleva cada prenda a su lugar.');
        return true;
      } else if (paso === 1) {
        paso = 0;
        charBox.style.transform = 'translateX(-50%)';
        router.setBackground(ASSETS.getImageUrl('Fondo_principal'));
        btnAccion.disabled = false;
        btnAccion.textContent = 'Abrir armario';
        btnAccion.className = 'btn btn-blue';
        router.setInstruction('');
        return true;
      }
      return false;
    });

    btnAccion.addEventListener('click', () => {
      if (paso === 0) {
        // Paso 1: Abrir armario -> desplazar personaje a la derecha y mantenerlo
        paso = 1;
        charBox.style.transform = 'translateX(calc(-50% + min(26vw, 240px)))';
        router.setBackground(ASSETS.getImageUrl('Fondo_desorganizado'));
        btnAccion.textContent = 'Organizar armario';
        btnAccion.className = 'btn btn-coral';
        soundManager.playInstruction('M2_V2_2_1');
        router.setInstruction('La ropa está mezclada. Lleva cada prenda a su lugar.');
      } else if (paso === 1) {
        // Paso 2: Organizar armario -> Secuencia Fondo_armario_org1 -> org2 -> org3
        paso = 2;
        charBox.style.transform = 'translateX(calc(-50% + min(26vw, 240px)))';
        btnAccion.disabled = true;
        btnAccion.textContent = 'Organizando... ⏳';

        // 1er estado (org1)
        router.setBackground(ASSETS.getImageUrl('Fondo_armario_org1'));

        // 2do estado (org2) tras 3s
        const t1 = setTimeout(() => {
          router.setBackground(ASSETS.getImageUrl('Fondo_armario_org2'));
        }, 3000);

        // 3er estado (org3) tras otros 3s
        const t2 = setTimeout(() => {
          router.setBackground(ASSETS.getImageUrl('Fondo_armario_org3'));
          soundManager.playInstruction('M2_V3_2_1');
          router.setInstruction('¡Muy bien! Cuando organizamos la ropa, podemos encontrarla con facilidad.');

          btnAccion.disabled = false;
          btnAccion.textContent = 'Continuar';
          btnAccion.className = 'btn btn-pink';
          paso = 3;
        }, 6000);

        seqTimeouts.push(t1, t2);
      } else if (paso === 3) {
        router.navigateTo(1, 3);
      }
    });

    return () => {
      seqTimeouts.forEach(clearTimeout);
    };
  },

  // =========================================================================
  // SECCIÓN 3: RECONOZCO MI ROPA (R_M1_S3_no / R_M1_S3_na)
  // =========================================================================
  renderSeccion3(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getImageUrl('Fondo_armario_org3'));
    soundManager.playInstruction('M1_V2');
    router.setInstruction('Toca una prenda para conocer su nombre y descubrir dónde se usa.');

    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.cssText = 'max-width: 920px; width: 94%; display: flex; flex-direction: column; align-items: center; padding: 28px 32px 22px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>❤️ Reconozco mi ropa ❤️</span>
      </div>

      <div style="display: flex; gap: 28px; width: 100%; margin: 18px 0; justify-content: center; align-items: center;">
        <!-- Cuadrícula 3x2 de prendas -->
        <div id="grid-prendas" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; width: 48%;">
        </div>

        <!-- Panel del personaje con siluetas dinámicas -->
        <div class="character-box" style="width: 48%; height: 380px; background: #FFF6E7;">
          <img id="char-base-display" src="${ASSETS.getPersonajeInterior(s.genero)}" alt="Personaje" style="height: 100%; object-fit: contain;">
        </div>
      </div>

      <button id="btn-reconozco-continuar" class="btn btn-pink" style="min-width: 260px; font-size: 1.35rem;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-prendas');
    const charDisplay = panel.querySelector('#char-base-display');
    const prendas = ASSETS.getPrendasGaleria(s.genero);

    prendas.forEach(prenda => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.style.cssText = 'height: 110px; background: #80451F; border-radius: 20px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${prenda.img}" alt="${prenda.nombre}" style="max-height: 85%;">
        </div>
      `;

      card.addEventListener('click', () => {
        // Deseleccionar previas
        grid.querySelectorAll('.card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Reproducir audio de la prenda
        soundManager.playSound(prenda.audio);

        // Actualizar silueta del personaje
        charDisplay.src = prenda.silueta;
      });

      grid.appendChild(card);
    });

    const btnContinuar = panel.querySelector('#btn-reconozco-continuar');
    btnContinuar.addEventListener('click', () => {
      this.reproducirVideoInstArrastre(stage, router);
    });

    return () => { };
  },

  /**
   * Reproduce el video de instrucción de arrastre según el género al finalizar la Sección 3:
   * Niña: IMG/Inst_Arrastre.mp4
   * Niño: IMG/Inst_Arrastre_no.mp4
   * Al finalizar o saltar, avanza a la Sección 4.
   */
  reproducirVideoInstArrastre(stage, router) {
    soundManager.stopCurrentInstruction();
    router.setInstruction('');
    stage.innerHTML = '';

    const s = state.get();
    const videoUrl = ASSETS.getVideoInstArrastre(s.genero);

    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-scene-container';
    videoContainer.style.backgroundColor = '#2F190D';
    videoContainer.style.zIndex = '90';

    videoContainer.innerHTML = `
      <video id="video-inst-arrastre" class="video-scene-player" autoplay playsinline preload="auto" style="width: 100%; height: 100%; object-fit: contain; background: #2F190D; display: block;">
        <source src="${videoUrl}" type="video/mp4">
      </video>
      <div class="intro-bottom-bar">
        <button id="btn-skip-inst" class="btn btn-wood btn-intro-action" aria-label="Saltar video de instrucción">
          <span>Saltar</span> <span>⏭️</span>
        </button>
      </div>
    `;

    stage.appendChild(videoContainer);

    const video = videoContainer.querySelector('#video-inst-arrastre');
    const btnSkip = videoContainer.querySelector('#btn-skip-inst');

    video.src = videoUrl;
    video.load();

    let finalizado = false;
    const irASeccion4 = () => {
      if (finalizado) return;
      finalizado = true;
      try {
        video.pause();
      } catch (e) { }
      router.navigateTo(1, 4);
    };

    video.addEventListener('ended', irASeccion4);
    video.addEventListener('error', (err) => {
      console.warn('Error al cargar video de instrucción de arrastre, avanzando a M1S4:', err);
      irASeccion4();
    });

    if (btnSkip) {
      btnSkip.addEventListener('click', (e) => {
        e.stopPropagation();
        irASeccion4();
      });
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay con audio bloqueado en video de instrucción:', err);
        video.muted = false;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(irASeccion4);
        });
      });
    }

    // Temporizador de seguridad (duración del video es ~7s, damos 12s de margen)
    const timer = setTimeout(irASeccion4, 12000);

    return () => {
      clearTimeout(timer);
      try {
        video.pause();
      } catch (e) { }
    };
  },

  // =========================================================================
  // SECCIÓN 4: ¿DÓNDE VA CADA PRENDA?
  // =========================================================================
  renderSeccion4(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getImageUrl('Fondo_armario_org3'));

    soundManager.playInstruction('M1_V4_1_2');
    router.setInstruction('Arrastra cada prenda a la parte del cuerpo donde se usa (o toca la prenda y luego toca al personaje).');

    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.cssText = 'max-width: 960px; width: 94%; display: flex; flex-direction: column; align-items: center; padding: 28px 30px 20px;';

    const siluetasData = ASSETS.getSiluetasM1S4(s.genero);

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>👗 ¿Dónde va cada prenda? 👖</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin: 18px 0; gap: 20px;">
        <!-- Banco izquierdo de prendas -->
        <div id="banco-prendas-izq" style="display: flex; flex-direction: column; gap: 12px; width: 25%;"></div>

        <!-- Personaje central interactivo con capas superpuestas -->
        <div id="target-personaje" class="character-box" style="position: relative; width: 44%; height: 420px; cursor: pointer; border-width: 4px; background: #FFF7EB; overflow: hidden;">
          <div id="m1s4-layers-wrapper" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <!-- Capa base compuesta -->
            <img id="layer-m1s4-base" src="${siluetasData.base}" alt="Silueta completa" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1;">
            
            <!-- Capas de siluetas que se muestran al inicio una sobre otra y se ocultan al arrastrar su prenda -->
            ${siluetasData.layers.map(layer => `
              <img id="layer-ocultar-${layer.id}" class="m1s4-layer-ocultar" data-id="${layer.id}" src="${layer.src}" alt="Ocultar ${layer.nombre}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; z-index: ${layer.zIndex}; transition: opacity 0.3s ease;">
            `).join('')}
          </div>
        </div>

        <!-- Banco derecho de prendas -->
        <div id="banco-prendas-der" style="display: flex; flex-direction: column; gap: 12px; width: 25%;"></div>
      </div>

      <button id="btn-donde-continuar" class="btn btn-coral" style="min-width: 240px; display: none;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const bancoIzq = panel.querySelector('#banco-prendas-izq');
    const bancoDer = panel.querySelector('#banco-prendas-der');
    const targetPersonaje = panel.querySelector('#target-personaje');
    const btnContinuar = panel.querySelector('#btn-donde-continuar');

    const prendas = ASSETS.getPrendasGaleria(s.genero);
    let prendaSeleccionada = null;
    let prendasColocadasHistory = [];

    const normalizeKey = (key) => {
      return String(key || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    };

    // Manejador para devolver al paso anterior (deshacer prendas colocadas una a una)
    router.registerStepBackHandler(() => {
      if (prendasColocadasHistory.length > 0) {
        const lastNormKey = prendasColocadasHistory.pop();

        // Mostrar de nuevo la silueta correspondiente
        const layerEl = panel.querySelector(`#layer-ocultar-${lastNormKey}`);
        if (layerEl) {
          layerEl.style.display = 'block';
          layerEl.style.opacity = '1';
        }

        // Reactivar la tarjeta correspondiente
        const cardEl = panel.querySelector(`.card-item[data-norm="${lastNormKey}"]`);
        if (cardEl) {
          cardEl.classList.remove('disabled');
          cardEl.style.opacity = '1';
          cardEl.style.pointerEvents = 'auto';
          cardEl.draggable = true;
        }

        btnContinuar.style.display = 'none';
        return true;
      }
      return false; // Permite volver a Sección 3
    });

    prendas.forEach((prenda, idx) => {
      const normKey = normalizeKey(prenda.id);
      const card = document.createElement('div');
      card.className = 'card-item';
      card.dataset.id = prenda.id;
      card.dataset.norm = normKey;
      card.draggable = true;
      card.style.cssText = 'height: 105px; background: #80451F; border-radius: 18px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${prenda.img}" alt="${prenda.nombre}" style="max-height: 80%;">
          <span class="card-label" style="font-size: 0.95rem;">${prenda.nombre}</span>
        </div>
      `;

      // Selección por toque / clic
      card.addEventListener('click', () => {
        if (card.classList.contains('disabled')) return;
        panel.querySelectorAll('.card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        prendaSeleccionada = prenda;
      });

      // Drag & Drop nativo
      card.addEventListener('dragstart', (e) => {
        if (card.classList.contains('disabled')) {
          e.preventDefault();
          return;
        }
        prendaSeleccionada = prenda;
        e.dataTransfer.setData('text/plain', normKey);
        card.classList.add('dragging');
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      if (idx < 3) bancoIzq.appendChild(card);
      else bancoDer.appendChild(card);
    });

    // Función que procesa la colocación de la prenda y oculta la silueta correspondiente
    const colocarPrenda = (prenda) => {
      if (!prenda) return;
      const normKey = normalizeKey(prenda.id);

      const cardEl = panel.querySelector(`.card-item[data-norm="${normKey}"]`);
      if (!cardEl || cardEl.classList.contains('disabled')) return;

      const layerEl = panel.querySelector(`#layer-ocultar-${normKey}`);
      if (!layerEl) return;

      // Ocultar la capa de silueta correspondiente a esta prenda
      layerEl.style.display = 'none';

      // Deshabilitar la tarjeta en los bancos laterales
      cardEl.classList.remove('selected');
      cardEl.classList.add('disabled');
      cardEl.style.opacity = '0.35';
      cardEl.style.pointerEvents = 'none';
      cardEl.draggable = false;

      // Reproducir audio de la prenda y feedback visual
      soundManager.playSound(prenda.audio || 'M1_V4_1_2');
      router.showFeedback(true, null, 1100);

      prendasColocadasHistory.push(normKey);
      prendaSeleccionada = null;

      // Si se colocaron todas las prendas, mostrar botón continuar y narración final
      if (prendasColocadasHistory.length >= prendas.length) {
        btnContinuar.style.display = 'inline-flex';
        soundManager.playInstruction('M1_V10');
      }
    };

    // Interacción por toque en el personaje tras seleccionar una prenda
    targetPersonaje.addEventListener('click', () => {
      if (prendaSeleccionada) {
        colocarPrenda(prendaSeleccionada);
      }
    });

    // Soporte para soltar (Drop)
    targetPersonaje.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      targetPersonaje.style.borderColor = 'var(--color-yellow)';
      targetPersonaje.style.boxShadow = '0 0 0 4px var(--color-yellow)';
    });

    targetPersonaje.addEventListener('dragleave', () => {
      targetPersonaje.style.borderColor = 'var(--color-wood)';
      targetPersonaje.style.boxShadow = 'none';
    });

    targetPersonaje.addEventListener('drop', (e) => {
      e.preventDefault();
      targetPersonaje.style.borderColor = 'var(--color-wood)';
      targetPersonaje.style.boxShadow = 'none';

      const droppedId = e.dataTransfer.getData('text/plain') || (prendaSeleccionada ? prendaSeleccionada.id : null);
      if (droppedId) {
        const prendaEncontrada = prendas.find(p => normalizeKey(p.id) === normalizeKey(droppedId));
        if (prendaEncontrada) {
          colocarPrenda(prendaEncontrada);
        }
      }
    });

    btnContinuar.addEventListener('click', () => {
      router.navigateTo(1, 5);
    });

    return () => { };
  },

  // =========================================================================
  // SECCIÓN 5: OBSERVO EL CLIMA (R_M1_S5_no / R_M1_S5_na)
  // =========================================================================
  renderSeccion5(stage, router) {
    const s = state.get();
    const fondoNoche = ASSETS.getFondoNocheLluvia(s.genero);
    router.setBackground(fondoNoche);

    soundManager.playInstruction('M1_V6_1_3');
    router.setInstruction('Mira por la ventana. ¿Qué clima observas?');

    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.cssText = 'max-width: 840px; width: 92%; padding: 26px 32px 22px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>🌧️ Observo el clima 🌧️</span>
      </div>

      <!-- Ventana de vista previa (centrada en la ventana hacia abajo para que se vea completa) -->
      <div class="clima-window-container" style="width: 100%; height: 260px; border-radius: 20px; overflow: hidden; border: 4px solid var(--color-wood); box-shadow: var(--shadow-card); margin: 16px 0 20px;">
        <img src="${fondoNoche}" alt="Ventana con clima" class="clima-window-preview" style="width: 100%; height: 100%; object-fit: cover; object-position: center 6%;">
      </div>

      <!-- 4 tarjetas de clima -->
      <div id="grid-climas" style="display: flex; gap: 18px; justify-content: center; width: 100%; margin-bottom: 22px;">
      </div>

      <button id="btn-clima-continuar" class="btn btn-yellow" style="min-width: 240px; display: none;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-climas');
    const btnContinuar = panel.querySelector('#btn-clima-continuar');

    const climas = [
      { id: 'sol', nombre: 'Sol', img: ASSETS.getImageUrl('Clima_sol'), correcta: false },
      { id: 'lluvia', nombre: 'Lluvia', img: ASSETS.getImageUrl('Clima_lluvia'), correcta: true },
      { id: 'frio', nombre: 'Frío', img: ASSETS.getImageUrl('Clima_frio'), correcta: false },
      { id: 'viento', nombre: 'Viento', img: ASSETS.getImageUrl('Clima_viento'), correcta: false }
    ];

    climas.forEach(clima => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.style.cssText = 'width: 150px; height: 150px; background: #80451F; border-radius: 22px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${clima.img}" alt="${clima.nombre}" style="max-height: 75%;">
          <span class="card-label">${clima.nombre}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (clima.correcta) {
          card.classList.add('correct');
          soundManager.playSound('M1_V11_1_3');
          router.showFeedback(true);
          btnContinuar.style.display = 'inline-flex';
          adminService.registrarActividad('m1_s5_clima', {
            nombre: 'Observo el clima (Lluvia)',
            superado: true,
            detalle: 'Identificó correctamente el clima lluvioso'
          });
        } else {
          card.classList.add('disabled');
          soundManager.playSound('M2_V14.2.6');
          router.showFeedback(false);
          state.registrarApoyo('M1_S5_Clima', `Selección incorrecta: ${clima.nombre}`);
        }
      });

      grid.appendChild(card);
    });

    btnContinuar.addEventListener('click', () => {
      router.navigateTo(1, 6);
    });

    return () => { };
  },

  // =========================================================================
  // SECCIÓN 6: ¿QUÉ ME PONGO? (R_M1_S6_no / R_M1_S6_na)
  // =========================================================================
  renderSeccion6(stage, router) {
    const s = state.get();
    const fondoLluvia = ASSETS.getFondoDiaLluvioso(s.genero);
    router.setBackground(fondoLluvia);

    soundManager.playInstruction('M1_V7_1_4');
    router.setInstruction('Está lloviendo. Elige la ropa adecuada para sentirte cómodo y protegido.');

    const panel = document.createElement('div');
    panel.className = 'game-panel panel-stitched';
    panel.style.cssText = 'max-width: 980px; width: 95%; padding: 26px 30px 22px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>💕 ¿Qué me pongo? 💕</span>
      </div>

      <div style="display: flex; gap: 24px; width: 100%; margin: 18px 0; align-items: center; justify-content: space-between;">
        <!-- Cuadrícula 4x2 de 8 prendas -->
        <div id="grid-ropa-lluvia" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 62%;"></div>

        <!-- Personaje -->
        <div class="character-box" style="width: 35%; height: 380px; background: #FFF6E7; border-radius: 26px;">
          <img id="char-clima-display" src="${ASSETS.getPersonajeInterior(s.genero)}" alt="Personaje" style="height: 100%; object-fit: contain;">
        </div>
      </div>

      <button id="btn-clima-vestir" class="btn btn-coral" style="min-width: 260px; font-size: 1.4rem;">
        Vestir
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-ropa-lluvia');
    const charDisplay = panel.querySelector('#char-clima-display');
    const btnVestir = panel.querySelector('#btn-clima-vestir');

    const basePrendas = ASSETS.getPrendasClimaLluvia(s.genero);
    // Mezclar tarjetas en orden aleatorio cada vez que se carga la sección
    const prendas = [...basePrendas];
    for (let i = prendas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [prendas[i], prendas[j]] = [prendas[j], prendas[i]];
    }
    const seleccionadas = new Set();

    prendas.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.style.cssText = 'height: 110px; background: #80451F; border-radius: 20px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${p.img}" alt="${p.nombre}" style="max-height: 85%;">
        </div>
      `;

      card.addEventListener('click', () => {
        if (seleccionadas.has(p.id)) {
          seleccionadas.delete(p.id);
          card.classList.remove('selected');
        } else {
          seleccionadas.add(p.id);
          card.classList.add('selected');
        }
      });

      grid.appendChild(card);
    });

    btnVestir.addEventListener('click', () => {
      const correctas = prendas.filter(p => p.correcta).map(p => p.id);
      const seleccionArray = Array.from(seleccionadas);

      const sonIguales = correctas.length === seleccionArray.length &&
        correctas.every(id => seleccionadas.has(id));

      if (sonIguales) {
        soundManager.playInstruction('M1_V8_1_4C');
        charDisplay.src = ASSETS.getPersonajeConBotas(s.genero);
        router.showFeedback(true);
        adminService.registrarActividad('m1_s6_ropa_lluvia', {
          nombre: '¿Qué me pongo? (Ropa lluvia)',
          superado: true,
          detalle: `Conjunto completado (${seleccionArray.join(', ')})`
        });

        // Mostrar Insignia y Estrellas de Cierre de Módulo 1
        setTimeout(() => {
          this.mostrarCierreModulo1(router);
        }, 1500);
      } else {
        soundManager.playInstruction('M1_V9_1_4IC');
        router.showFeedback(false);
        state.registrarApoyo('M1_S6_RopaLluvia', 'Selección de ropa para lluvia incorrecta');
      }
    });

    return () => { };
  },

  /**
   * Cierre con Insignia "Explorador de prendas y clima" y 3 estrellas
   */
  mostrarCierreModulo1(router) {
    soundManager.playInstruction('M1_insignia');

    const modalHtml = `
      <div class="modal-card">
        <div class="panel-title-pill" style="top: -20px;">
          <span>🎉 ¡Módulo 1 Completado! 🎉</span>
        </div>
        <img src="${ASSETS.getImageUrl('M1_insignia')}" alt="Insignia Explorador" class="badge-reward-img">
        <p class="modal-text" style="font-size: 1.45rem; font-weight: 800; color: #7D421B; margin: 10px 0 6px;">
          ¡Explorador de prendas y clima!
        </p>
        <div class="stars-cluster">
          <img src="${ASSETS.getImageUrl('M1_estrella')}" alt="Estrella" class="star-icon">
          <img src="${ASSETS.getImageUrl('M1_estrella')}" alt="Estrella" class="star-icon" style="animation-delay: 0.15s;">
          <img src="${ASSETS.getImageUrl('M1_estrella')}" alt="Estrella" class="star-icon" style="animation-delay: 0.3s;">
        </div>
        <p class="modal-text" style="font-size: 1.15rem; margin-bottom: 22px;">
          Has aprendido a reconocer y elegir tu ropa adecuadamente.
        </p>
        <button id="btn-ir-modulo2" class="btn btn-green" style="font-size: 1.35rem; padding: 14px 44px;">
          Continuar al Módulo 2
        </button>
      </div>
    `;

    router.showModal(modalHtml);

    const btn = document.getElementById('btn-ir-modulo2');
    btn.addEventListener('click', () => {
      soundManager.stopCurrentInstruction();
      router.closeModal();
      router.navigateTo(2, 1); // Ir a Módulo 2 Sección 1
    });
  }
};
