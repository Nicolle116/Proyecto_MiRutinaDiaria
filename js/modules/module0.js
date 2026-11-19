/**
 * MI RUTINA DIARIA — MÓDULO 0: INICIO Y PERSONALIZACIÓN
 * Basado estrictamente en IMG/R_M0_S1.png y especificaciones.
 */

import { ASSETS } from '../assets.js';
import { state } from '../state.js';
import { soundManager } from '../audio.js';
import { adminService } from '../admin.js';

export const module0 = {
  renderSection(seccion, stage, router) {
    // Establecer fondo del armario principal
    router.setBackground(ASSETS.getImageUrl('Fondo_principal'));

    // Reproducir bienvenida por voz
    soundManager.playInstruction('B_V1');
    router.setInstruction('¡Hola! Te damos la bienvenida, a Mi Rutina Diaria. Elige el personaje que te acompañará, dinos tu nombre y toca el botón para comenzar.');

    let selectedGender = state.get().genero || 'nina';

    // Construcción del panel central de selección (idéntico a R_M0_S1.png)
    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.maxWidth = '640px';
    panel.style.width = '92%';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span class="panel-title-icon">⭐</span>
        <span>Selecciona tu avatar</span>
        <span class="panel-title-icon">⭐</span>
      </div>

      <div style="display: flex; gap: 24px; justify-content: center; width: 100%; margin: 24px 0 28px;">
        <!-- Tarjeta Niña -->
        <div id="card-nina" class="card-item ${selectedGender === 'nina' ? 'selected' : ''}" style="width: 220px; height: 320px; background: #80451F; border-radius: 26px;">
          <div class="card-item-inner" style="border: none;">
            <img src="${ASSETS.IMG_DIR}niña_interior.png" alt="Personaje niña" style="max-height: 94%;">
          </div>
        </div>

        <!-- Tarjeta Niño -->
        <div id="card-nino" class="card-item ${selectedGender === 'nino' ? 'selected' : ''}" style="width: 220px; height: 320px; background: #80451F; border-radius: 26px;">
          <div class="card-item-inner" style="border: none;">
            <img src="${ASSETS.IMG_DIR}niño_interior.png" alt="Personaje niño" style="max-height: 94%;">
          </div>
        </div>
      </div>

      <button id="btn-seleccionar-avatar" class="btn btn-wood" style="min-width: 240px;">
        Seleccionar
      </button>
    `;

    stage.appendChild(panel);

    const cardNina = panel.querySelector('#card-nina');
    const cardNino = panel.querySelector('#card-nino');
    const btnSeleccionar = panel.querySelector('#btn-seleccionar-avatar');

    cardNina.addEventListener('click', () => {
      selectedGender = 'nina';
      cardNina.classList.add('selected');
      cardNino.classList.remove('selected');
      state.setAvatar('nina');
    });

    cardNino.addEventListener('click', () => {
      selectedGender = 'nino';
      cardNino.classList.add('selected');
      cardNina.classList.remove('selected');
      state.setAvatar('nino');
    });

    // Flujo de popups: solicitar nombre -> saludo personalizado -> reproducir video contexto -> M1S1
    btnSeleccionar.addEventListener('click', () => {
      state.setAvatar(selectedGender);
      this.mostrarModalNombre(stage, router);
    });

    return () => {
      if (typeof this.currentCleanup === 'function') {
        this.currentCleanup();
        this.currentCleanup = null;
      }
    };
  },

  /**
   * Pop up 1: Solicitar nombre del niño
   */
  mostrarModalNombre(stage, router) {
    const s = state.get();
    const modalHtml = `
      <div class="modal-card">
        <div class="panel-title-pill" style="top: -20px;">
          <span>¿Cómo te llamas?</span>
        </div>
        <p class="modal-text">Escribe tu nombre para acompañarte en tu rutina:</p>
        <input id="input-nombre-nino" type="text" class="modal-input" placeholder="Tu nombre aquí" maxlength="20" autofocus value="${s.nombre !== 'Amiguito' && s.nombre !== 'Amiguita' ? s.nombre : ''}">
        <div style="display: flex; gap: 14px;">
          <button id="btn-confirmar-nombre" class="btn btn-coral">Confirmar</button>
        </div>
      </div>
    `;

    router.showModal(modalHtml);

    const input = document.getElementById('input-nombre-nino');
    const btn = document.getElementById('btn-confirmar-nombre');

    if (input) {
      setTimeout(() => input.focus(), 100);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btn.click();
      });
    }

    btn.addEventListener('click', () => {
      const valor = input.value.trim() || (s.genero === 'nino' ? 'Amiguito' : 'Amiguita');
      state.setNombre(valor);
      adminService.iniciarParticipante(valor, s.genero);
      this.mostrarModalSaludo(stage, router);
    });
  },

  /**
   * Pop up 2: Saludo personalizado con botón "Empezar"
   */
  mostrarModalSaludo(stage, router) {
    const s = state.get();
    const saludoPrefijo = s.genero === 'nino' ? '¡Bienvenido' : '¡Bienvenida';
    const modalHtml = `
      <div class="modal-card">
        <div class="panel-title-pill" style="top: -20px;">
          <span>🌟 ¡Todo listo! 🌟</span>
        </div>
        <p class="modal-text" style="font-size: 1.45rem; margin: 20px 0;">
          ${saludoPrefijo} <strong>${s.nombre}</strong>, es hora de comenzar, ¡da click en el botón empezar para continuar!
        </p>
        <button id="btn-empezar-ova" class="btn btn-green" style="font-size: 1.4rem; padding: 14px 48px;">
          Empezar
        </button>
      </div>
    `;

    router.showModal(modalHtml);

    const btnEmpezar = document.getElementById('btn-empezar-ova');
    btnEmpezar.addEventListener('click', () => {
      router.closeModal();
      this.reproducirVideoContexto(stage, router);
    });
  },

  /**
   * Reproduce el video de contexto según el género seleccionado:
   * Niña: IMG/Contexto_na.mp4
   * Niño: IMG/Contexto_no.mp4
   * Al finalizar el video (o al saltar), continúa con el Módulo 1 Sección 1.
   */
  reproducirVideoContexto(stage, router) {
    // Detener cualquier audio y ocultar instrucciones previas
    soundManager.stopCurrentInstruction();
    router.setInstruction('');

    // Limpiar el stage para reproducir el video a pantalla completa
    stage.innerHTML = '';

    const s = state.get();
    const videoUrl = ASSETS.getVideoContexto(s.genero);

    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-scene-container';
    videoContainer.style.backgroundColor = '#2F190D';
    videoContainer.style.zIndex = '90';

    videoContainer.innerHTML = `
      <video id="video-contexto" class="video-scene-player" autoplay playsinline preload="auto" style="width: 100%; height: 100%; object-fit: contain; background: #2F190D; display: block;">
        <source src="${videoUrl}" type="video/mp4">
      </video>
      <div class="intro-bottom-bar">
        <button id="btn-skip-contexto" class="btn btn-wood btn-intro-action" aria-label="Saltar video de contexto">
          <span>Saltar</span> <span>⏭️</span>
        </button>
      </div>
    `;

    stage.appendChild(videoContainer);

    const video = videoContainer.querySelector('#video-contexto');
    const btnSkip = videoContainer.querySelector('#btn-skip-contexto');

    video.src = videoUrl;
    video.load();

    let finalizado = false;
    const irAModulo1 = () => {
      if (finalizado) return;
      finalizado = true;
      try {
        video.pause();
      } catch (e) { }
      router.navigateTo(1, 1);
    };

    video.addEventListener('ended', irAModulo1);
    video.addEventListener('error', (err) => {
      console.warn('Error al cargar video de contexto, avanzando a M1S1:', err);
      irAModulo1();
    });

    if (btnSkip) {
      btnSkip.addEventListener('click', (e) => {
        e.stopPropagation();
        irAModulo1();
      });
    }

    // Reproducir (como el usuario pulsó "Empezar", ya existe interacción de usuario previa)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('No se pudo reproducir con audio directo:', err);
        video.muted = false;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(irAModulo1);
        });
      });
    }

    // Timeout de seguridad en caso de que tarde más de 26 segundos
    const timer = setTimeout(irAModulo1, 26000);

    this.currentCleanup = () => {
      clearTimeout(timer);
      try {
        video.pause();
      } catch (e) { }
    };
  }
};
