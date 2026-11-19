/**
 * MI RUTINA DIARIA — INICIALIZADOR PRINCIPAL (APP.JS)
 */

import { state } from './state.js';
import { router } from './navigation.js';
import { soundManager } from './audio.js';
import { module0 } from './modules/module0.js';
import { module1 } from './modules/module1.js';
import { module2 } from './modules/module2.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar enrutador
  router.init({
    stageId: 'stage-container',
    backgroundId: 'game-background',
    instructionId: 'instruction-banner',
    modalId: 'modal-overlay',
    drawerOverlayId: 'drawer-overlay',
    drawerListId: 'drawer-sections-list',
    btnAnteriorId: 'btn-volver-anterior'
  });

  // Registrar módulos 0, 1 y 2
  router.registerModule(0, module0);
  router.registerModule(1, module1);
  router.registerModule(2, module2);

  // Vincular controles de la barra superior y navegación
  const btnMenu = document.getElementById('btn-menu-secciones');
  const btnAnterior = document.getElementById('btn-volver-anterior');
  const btnInicio = document.getElementById('btn-volver-inicio');
  const btnReplay = document.getElementById('btn-replay-audio');
  const btnSonido = document.getElementById('btn-toggle-sonido');
  const btnCuidador = document.getElementById('btn-modo-cuidador');
  const btnCerrarDrawer = document.getElementById('btn-cerrar-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const btnCloseInstruction = document.getElementById('btn-close-instruction');

  // Menú de secciones (Hamburguesa)
  if (btnMenu) {
    btnMenu.addEventListener('click', () => {
      router.toggleSectionsMenu();
    });
  }

  if (btnCerrarDrawer) {
    btnCerrarDrawer.addEventListener('click', () => {
      router.closeSectionsMenu();
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) {
        router.closeSectionsMenu();
      }
    });
  }

  // Tecla Escape para cerrar drawer o modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      router.closeSectionsMenu();
      router.closeModal();
    }
  });

  // Retroceder al paso o sección anterior
  if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
      router.navigatePrevious();
    });
  }

  // Botón para cerrar subtítulo de audio
  if (btnCloseInstruction) {
    btnCloseInstruction.addEventListener('click', () => {
      const banner = document.getElementById('instruction-banner');
      if (banner) banner.style.display = 'none';
    });
  }

  if (btnSonido) {
    btnSonido.addEventListener('click', () => {
      const isMuted = state.toggleAudio();
      btnSonido.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) {
        soundManager.replayLastInstruction();
        router.reopenInstruction();
      } else {
        soundManager.stopCurrentInstruction();
      }
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      soundManager.replayLastInstruction();
      router.reopenInstruction();
    });
  }

  if (btnInicio) {
    btnInicio.addEventListener('click', () => {
      if (confirm('¿Quieres volver a la pantalla de inicio?')) {
        router.navigateTo(0, 1);
      }
    });
  }

  if (btnCuidador) {
    btnCuidador.addEventListener('click', () => {
      mostrarModalCuidador();
    });
  }

  /**
   * Panel para cuidadores y educadores (⚙️) con registro de apoyos y notas terapéuticas
   */
  function mostrarModalCuidador() {
    const s = state.get();
    const apoyos = s.apoyosRegistrados;

    let apoyosHtml = '<p style="color: #6E4528; font-style: italic;">No se han registrado dificultades ni apoyos adicionales hasta el momento.</p>';
    if (apoyos.length > 0) {
      apoyosHtml = `
        <div style="max-height: 180px; overflow-y: auto; text-align: left; width: 100%; font-size: 0.95rem; margin-top: 10px; border: 2px solid var(--color-wood-tint); border-radius: 12px; padding: 10px; background: #FFF;">
          ${apoyos.map(a => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid #EEE; padding-bottom: 4px;">
              <strong>M${a.modulo} S${a.seccion}:</strong> ${a.actividad} <br>
              <span style="color: #7D421B;">${a.detalle}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    const modalHtml = `
      <div class="modal-card" style="max-width: 600px;">
        <div class="panel-title-pill" style="top: -20px;">
          <span>⚙️ Panel para Cuidadores ⚙️</span>
        </div>
        <p class="modal-text" style="font-size: 1.15rem; margin: 12px 0 8px;">
          <strong>Estudiante:</strong> ${s.nombre || 'No asignado'} (${s.genero === 'nino' ? 'Niño' : 'Niña'})
        </p>
        <div style="background: #FFF9F0; border: 2px dashed #A45C2C; border-radius: 14px; padding: 12px; margin: 10px 0; text-align: left; font-size: 0.95rem; color: #53280B;">
          <strong>💡 Nota terapéutica:</strong> Practicar primero el desvestido puede facilitar la comprensión de la secuencia motora y permitir mayor éxito en niños en etapa de desarrollo de la autonomía.
        </div>
        <div style="width: 100%; margin: 10px 0;">
          <h4 style="font-family: var(--font-display); color: #53280B; text-align: left;">Registro de apoyos requeridos:</h4>
          ${apoyosHtml}
        </div>
        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-wrap: wrap;">
          <a href="admin.html" class="btn btn-yellow" style="text-decoration: none; padding: 10px 22px; font-size: 1.05rem;">
            <span>👑</span> Panel Administrador (Resultados)
          </a>
          <button id="btn-cerrar-cuidador" class="btn btn-wood" style="padding: 10px 22px;">
            Cerrar panel
          </button>
        </div>
      </div>
    `;

    router.showModal(modalHtml);
    document.getElementById('btn-cerrar-cuidador').addEventListener('click', () => {
      router.closeModal();
    });
  }

  // =========================================================================
  // CONTROL DE SECUENCIA INICIAL DE VIDEOS (PORTADA -> MANUAL DE INICIO -> M0)
  // 1. Portada_Mirutinadiaria.mp4 (Loading y presentación inicial)
  // 2. Manual_Inicio.mp4 (Instrucciones generales de inicio)
  // 3. Continuar al Módulo 0: Bienvenida para seleccionar género
  // =========================================================================
  const introScreen = document.getElementById('intro-loading-screen');
  const introVideo = document.getElementById('intro-video');
  const btnSkipIntro = document.getElementById('btn-skip-intro');
  const btnUnmuteIntro = document.getElementById('btn-intro-unmute');

  let pasoIntro = 1; // 1 = Portada_Mirutinadiaria.mp4, 2 = Manual_Inicio.mp4
  let introFinalizada = false;
  let timerSeguridadPortada = null;
  let timerSeguridadManual = null;

  const iniciarFlujoApp = () => {
    // Cargar estado inicial y navegar
    const st = state.get();
    // Si ya tiene género y nombre, ir al módulo guardado; si no, ir al Módulo 0
    if (st.genero && st.nombre) {
      router.navigateTo(st.modulo || 1, st.seccion || 1);
    } else {
      router.navigateTo(0, 1);
    }
  };

  const finalizarIntro = () => {
    if (introFinalizada) return;
    introFinalizada = true;
    if (timerSeguridadPortada) clearTimeout(timerSeguridadPortada);
    if (timerSeguridadManual) clearTimeout(timerSeguridadManual);

    if (introVideo) {
      try {
        introVideo.pause();
      } catch (err) { }
    }

    if (introScreen) {
      introScreen.classList.add('intro-fade-out');
      setTimeout(() => {
        try {
          introScreen.remove();
        } catch (e) {
          introScreen.style.display = 'none';
        }
        iniciarFlujoApp();
      }, 450);
    } else {
      iniciarFlujoApp();
    }
  };

  const reproducirManualInicio = () => {
    if (introFinalizada) return;
    pasoIntro = 2;
    if (timerSeguridadPortada) clearTimeout(timerSeguridadPortada);

    // Ocultar la píldora de carga "Cargando..."
    const loadingPill = introScreen ? introScreen.querySelector('.intro-loading-pill') : null;
    if (loadingPill) {
      loadingPill.style.display = 'none';
    }

    if (!introVideo) {
      finalizarIntro();
      return;
    }

    try {
      introVideo.pause();
      introVideo.src = './IMG/Manual_Inicio.mp4';
      introVideo.load();
      introVideo.muted = false;

      const playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay con audio bloqueado en Manual_Inicio:', err);
          introVideo.muted = true;
          introVideo.play().catch(() => finalizarIntro());
          if (btnUnmuteIntro) {
            btnUnmuteIntro.classList.remove('hidden');
          }
        });
      }
    } catch (e) {
      console.warn('Error al iniciar Manual_Inicio, continuando:', e);
      finalizarIntro();
    }

    // Temporizador de seguridad para Manual de Inicio (duración 23s + margen = 30s)
    timerSeguridadManual = setTimeout(() => {
      if (pasoIntro === 2 && !introFinalizada) {
        finalizarIntro();
      }
    }, 30000);
  };

  const onVideoTerminadoOError = () => {
    if (pasoIntro === 1) {
      reproducirManualInicio();
    } else {
      finalizarIntro();
    }
  };

  if (introScreen && introVideo) {
    // 1. Cuando el video finaliza su reproducción completa
    introVideo.addEventListener('ended', onVideoTerminadoOError);

    // 2. En caso de error al cargar el archivo de video
    introVideo.addEventListener('error', (err) => {
      console.warn('Error en video de intro, continuando al siguiente paso:', err);
      onVideoTerminadoOError();
    });

    // 3. Botón para saltar video voluntariamente
    if (btnSkipIntro) {
      btnSkipIntro.addEventListener('click', (e) => {
        e.stopPropagation();
        onVideoTerminadoOError();
      });
    }

    // 4. Botón para activar sonido si el navegador aplicó política de autoplay silenciado
    if (btnUnmuteIntro) {
      btnUnmuteIntro.addEventListener('click', (e) => {
        e.stopPropagation();
        introVideo.muted = false;
        btnUnmuteIntro.classList.add('hidden');
      });
    }

    // 5. Permitir toque/clic en cualquier parte para activar sonido si está silenciado
    introScreen.addEventListener('click', (e) => {
      if (e.target.closest('#btn-skip-intro')) return;
      if (introVideo.muted) {
        introVideo.muted = false;
        if (btnUnmuteIntro) {
          btnUnmuteIntro.classList.add('hidden');
        }
      }
    });

    // 6. Intento de reproducción automática para el primer video (Portada)
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay bloqueado con audio por el navegador, reproduciendo silenciado:', err);
        introVideo.muted = true;
        introVideo.play().catch(() => onVideoTerminadoOError());
        if (btnUnmuteIntro) {
          btnUnmuteIntro.classList.remove('hidden');
        }
      });
    }

    // 7. Temporizador de seguridad para Portada (8s duración + margen = 10s)
    timerSeguridadPortada = setTimeout(() => {
      if (pasoIntro === 1 && !introFinalizada) {
        reproducirManualInicio();
      }
    }, 10000);
  } else {
    iniciarFlujoApp();
  }
});
