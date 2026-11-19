/**
 * MI RUTINA DIARIA — MÓDULO 2: ORGANIZO MI ROPA Y ME VISTO PASO A PASO
 * Secciones 1 a 7 completamente funcionales según especificaciones y referencias visuales.
 */

import { ASSETS } from '../assets.js';
import { state } from '../state.js';
import { soundManager } from '../audio.js';
import { adminService } from '../admin.js';

export const module2 = {
  renderSection(seccion, stage, router) {
    switch (Number(seccion)) {
      case 1: return this.renderSeccion1(stage, router);
      case 2: return this.renderSeccion2(stage, router);
      case 3: return this.renderSeccion3(stage, router);
      case 4: return this.renderSeccion4(stage, router);
      case 5: return this.renderSeccion5(stage, router);
      case 6: return this.renderSeccion6(stage, router);
      case 7: return this.renderSeccion7(stage, router);
      default:
        router.navigateTo(2, 1);
        return () => { };
    }
  },

  // =========================================================================
  // SECCIÓN 1: BIENVENIDA AL MÓDULO 2 (R_M2_S1_no / R_M2_S1_na)
  // =========================================================================
  renderSeccion1(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getImageUrl('Fondo_desorganizado'));

    soundManager.playInstruction('M2_BV1');
    router.setInstruction('Ya conoces tus prendas. Ahora vamos a organizarlas y a vestirnos paso a paso. Puedes intentarlo despacio.');

    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.cssText = 'max-width: 820px; width: 92%; padding: 32px 36px 26px;';

    panel.innerHTML = `
      <div class="panel-title-pill" style="top: -24px;">
        <span>✨ Bienvenido al Módulo 2 ✨</span>
      </div>

      <div style="display: flex; gap: 26px; width: 100%; align-items: center; justify-content: center; margin: 18px 0 24px;">
        <div style="width: 220px; height: 300px; display: flex; align-items: center; justify-content: center;">
          <img src="${ASSETS.getPersonajeInterior(s.genero)}" alt="Personaje saludando" style="height: 100%; object-fit: contain;">
        </div>
        <div style="flex: 1; background: #FFF9F0; border: 3.5px solid var(--color-wood); border-radius: 22px; padding: 22px; box-shadow: var(--shadow-card);">
          <p style="font-family: var(--font-body); font-size: 1.35rem; font-weight: 800; color: #53280B; line-height: 1.45;">
            ¡Hola <strong>${s.nombre}</strong>! En este módulo aprenderemos a ordenar nuestra habitación, revisar que nuestra ropa no esté al revés y vestirnos con autonomía paso a paso.
          </p>
        </div>
      </div>

      <button id="btn-m2-s1-continuar" class="btn btn-yellow" style="min-width: 260px; font-size: 1.35rem;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const btn = panel.querySelector('#btn-m2-s1-continuar');
    btn.addEventListener('click', () => {
      router.navigateTo(2, 2);
    });

    return () => { };
  },

  // =========================================================================
  // SECCIÓN 2: ORGANIZO LA HABITACIÓN (R_M2_S2_no / R_M2_S2_na)
  // =========================================================================
  renderSeccion2(stage, router) {
    const s = state.get();
    const fondos = ASSETS.getFondosOrganizarHabitacion(s.genero);

    router.setBackground(fondos.desorg);
    soundManager.playInstruction('M2_V20');
    router.setInstruction('La habitación está desordenada. Lleva cada objeto a su lugar.');

    const container = document.createElement('div');
    container.style.cssText = 'position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding-bottom: 30px;';

    const titlePill = document.createElement('div');
    titlePill.className = 'panel-title-pill';
    titlePill.style.cssText = 'position: relative; top: 12px; font-size: 1.7rem; padding: 8px 36px;';
    titlePill.textContent = 'Organizo la habitación';
    container.appendChild(titlePill);

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'position: absolute; bottom: 25px; z-index: 20;';
    btnContainer.innerHTML = `
      <button id="btn-organizar-habitacion" class="btn btn-blue" style="font-size: 1.35rem; padding: 12px 42px;">
        Organizar habitación
      </button>
    `;
    container.appendChild(btnContainer);

    stage.appendChild(container);

    const btnAccion = container.querySelector('#btn-organizar-habitacion');
    let paso = 0;
    let timeouts = [];

    // Manejador para devolver al paso anterior en la habitación
    router.registerStepBackHandler(() => {
      timeouts.forEach(clearTimeout);
      if (paso === 2 || paso === 1) {
        paso = 0;
        router.setBackground(fondos.desordenada);
        btnAccion.disabled = false;
        btnAccion.textContent = 'Organizar habitación';
        btnAccion.className = 'btn btn-blue';
        soundManager.playInstruction('M2_BV1');
        router.setInstruction('La habitación está desordenada. Lleva cada objeto a su lugar.');
        return true;
      }
      return false;
    });

    btnAccion.addEventListener('click', () => {
      if (paso === 0) {
        paso = 1;
        btnAccion.disabled = true;
        btnAccion.textContent = 'Organizando juguetes y cama... 🧸';

        // 1er paso: Cama organizada
        router.setBackground(fondos.paso1);

        // 2do paso: Juguetes organizados tras 3s
        const t1 = setTimeout(() => {
          router.setBackground(fondos.paso2);
        }, 3000);

        // 3er paso: Habitación completamente limpia tras otros 3s
        const t2 = setTimeout(() => {
          router.setBackground(fondos.completo);
          soundManager.playInstruction('M2_V17_2');
          router.setInstruction('¡Muy bien! Cuando organizamos la habitación, podemos encontrar lo que necesitamos con facilidad.');

          btnAccion.disabled = false;
          btnAccion.textContent = 'Continuar';
          btnAccion.className = 'btn btn-pink';
          paso = 2;
        }, 6000);

        timeouts.push(t1, t2);
      } else if (paso === 2) {
        router.navigateTo(2, 3);
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  },

  // =========================================================================
  // SECCIÓN 3: ¿ESTÁ AL DERECHO O AL REVÉS? (R_M2_S3.png)
  // =========================================================================
  renderSeccion3(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getImageUrl('Fondo_armario_org3'));

    soundManager.playInstruction('M2_V4_3_2');
    router.setInstruction('Observa las 4 tarjetas e identifica cuál se encuentra al revés, da click sobre ella para ponerla al derecho.');

    const panel = document.createElement('div');
    panel.className = 'game-panel panel-stitched';
    panel.style.cssText = 'max-width: 780px; width: 92%; padding: 30px 32px 24px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>⭐ ¿Está al derecho o al revés? ⭐</span>
      </div>

      <!-- Cuadrícula 2x2 de prendas -->
      <div id="grid-reves" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; margin: 18px 0 22px;"></div>

      <!-- Botones grandes según referencia R_M2_S3 -->
      <div style="display: flex; gap: 20px; width: 100%; justify-content: center;">
        <button id="btn-esta-bien" class="btn btn-yellow" style="min-width: 200px;">
          Está bien
        </button>
        <button id="btn-dar-vuelta" class="btn btn-yellow" style="min-width: 200px;">
          Dale la vuelta
        </button>
      </div>

      <button id="btn-reves-continuar" class="btn btn-coral" style="min-width: 240px; margin-top: 16px; display: none;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-reves');
    const btnEstaBien = panel.querySelector('#btn-esta-bien');
    const btnDarVuelta = panel.querySelector('#btn-dar-vuelta');
    const btnContinuar = panel.querySelector('#btn-reves-continuar');

    // 4 prendas: camiseta al revés, chaqueta al revés, pantalón al revés, falda/prenda al derecho
    const items = [
      {
        id: 'camiseta',
        imgReves: `${ASSETS.IMG_DIR}M2_camiseta_reves.png`,
        imgDerecho: `${ASSETS.IMG_DIR}${s.genero === 'nino' ? 'M1_camiseta_no.png' : 'M1_camiseta_na.png'}`,
        estaAlReves: true
      },
      {
        id: 'chaqueta',
        imgReves: `${ASSETS.IMG_DIR}${s.genero === 'nino' ? 'chaqueta_reves_np.png' : 'chaqueta_reves_na.png'}`,
        imgDerecho: `${ASSETS.IMG_DIR}${s.genero === 'nino' ? 'M1_chaqueta.png' : 'Chaqueta_na.png'}`,
        estaAlReves: true
      },
      {
        id: 'pantalon',
        imgReves: `${ASSETS.IMG_DIR}M2_pantalon_reves.png`,
        imgDerecho: `${ASSETS.IMG_DIR}${s.genero === 'nino' ? 'M1_pantalón.png' : 'Pantalon_na.png'}`,
        estaAlReves: true
      },
      {
        id: 'falda_short',
        imgReves: `${ASSETS.IMG_DIR}${s.genero === 'nino' ? 'Short_no.png' : 'M1_falda.png'}`,
        imgDerecho: `${ASSETS.IMG_DIR}${s.genero === 'nino' ? 'Short_no.png' : 'M1_falda.png'}`,
        estaAlReves: false // Ya está al derecho
      }
    ];

    let seleccion = null;

    const renderGrid = () => {
      grid.innerHTML = '';
      items.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = `card-item ${seleccion === item ? 'selected' : ''}`;
        card.style.cssText = 'height: 140px; background: #80451F; border-radius: 20px;';
        card.innerHTML = `
          <div class="card-item-inner" style="border: none;">
            <img src="${item.estaAlReves ? item.imgReves : item.imgDerecho}" alt="Prenda" style="max-height: 85%;">
          </div>
        `;

        card.addEventListener('click', () => {
          seleccion = item;
          renderGrid();
        });

        grid.appendChild(card);
      });

      // Si todas están al derecho
      const todasAlDerecho = items.every(it => !it.estaAlReves);
      if (todasAlDerecho) {
        btnContinuar.style.display = 'inline-flex';
        soundManager.playSound('M2_V10_2_2');
      }
    };

    renderGrid();

    // Acción: Dale la vuelta
    btnDarVuelta.addEventListener('click', () => {
      if (!seleccion) return;

      if (seleccion.estaAlReves) {
        // Estaba mal y la volteó a bien -> Éxito
        seleccion.estaAlReves = false;
        router.showFeedback(true);
        soundManager.playSound('M2_V10_2_2');
      } else {
        // Ya estaba bien y la puso al revés -> Mal_X
        seleccion.estaAlReves = true;
        router.showFeedback(false);
      }
      renderGrid();
    });

    // Acción: Está bien
    btnEstaBien.addEventListener('click', () => {
      if (!seleccion) return;

      if (!seleccion.estaAlReves) {
        // Estaba al derecho y confirmó que está bien -> Éxito
        router.showFeedback(true);
        soundManager.playSound('M2_V10_2_2');
      } else {
        // Estaba al revés y dijo que está bien -> Mal_X
        router.showFeedback(false);
        soundManager.playSound('M2_V18_2_2');
        state.registrarApoyo('M2_S3_Orientacion', 'Dijo que estaba bien una prenda que estaba al revés');
      }
    });

    btnContinuar.addEventListener('click', () => {
      router.navigateTo(2, 4);
    });

    return () => { };
  },

  // =========================================================================
  // SECCIÓN 4: ME COLOCO UNA PRENDA (CHAQUETA) (R_M2_S4_no / R_M2_S4_na)
  // =========================================================================
  renderSeccion4(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getFondoDormitorio(s.genero));

    soundManager.playInstruction('M2_V5_2_3');
    router.setInstruction('Vamos a ponernos la chaqueta. Ordena los pasos arrastrando o tocando cada tarjeta.');

    const panel = document.createElement('div');
    panel.className = 'game-panel panel-stitched';
    panel.style.cssText = 'max-width: 860px; width: 92%; padding: 28px 30px 22px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>⭐ Me coloco una prenda ⭐</span>
      </div>

      <!-- Personaje sentado en silla arriba -->
      <div style="width: 100%; height: 210px; display: flex; align-items: center; justify-content: center; margin: 12px 0 16px; background: #80451F; border-radius: 20px; border: 3px solid #53280B;">
        <img id="char-sentado" src="${ASSETS.getPersonajeSentado(s.genero)}" alt="Personaje sentado" style="height: 90%; object-fit: contain;">
      </div>

      <!-- 3 tarjetas de pasos -->
      <div id="grid-pasos-chaqueta" style="display: flex; gap: 16px; width: 100%; justify-content: center; margin-bottom: 18px;"></div>

      <button id="btn-chaqueta-continuar" class="btn btn-wood" style="min-width: 240px; display: none;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-pasos-chaqueta');
    const btnContinuar = panel.querySelector('#btn-chaqueta-continuar');

    let ronda = 1; // Ronda 1: con números; Ronda 2: sin números
    let pasos = ASSETS.getPasosChaqueta(s.genero);
    let pasoEsperado = 1;

    const renderPasos = () => {
      grid.innerHTML = '';
      pasos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.style.cssText = 'flex: 1; max-width: 240px; height: 160px; background: #80451F; border-radius: 20px;';
        card.innerHTML = `
          ${ronda === 1 ? `<div class="card-step-badge">${p.paso}</div>` : ''}
          <div class="card-item-inner" style="border: none;">
            <img src="${p.img}" alt="${p.desc}" style="max-height: 85%;">
          </div>
        `;

        card.addEventListener('click', () => {
          if (p.paso === pasoEsperado) {
            card.classList.add('correct');
            card.style.pointerEvents = 'none';
            soundManager.playSound('M2_V11_2_3');
            router.showFeedback(true, null, 1200);
            pasoEsperado++;

            if (pasoEsperado > 3) {
              if (ronda === 1) {
                // Avanzar a Ronda 2: barajar y quitar números
                setTimeout(() => {
                  ronda = 2;
                  pasoEsperado = 1;
                  pasos = [...pasos].sort(() => Math.random() - 0.5);
                  renderPasos();
                }, 1400);
              } else {
                // Ronda 2 terminada
                btnContinuar.style.display = 'inline-flex';
              }
            }
          } else {
            router.showFeedback(false);
            state.registrarApoyo('M2_S4_Chaqueta', `Error de orden en ronda ${ronda}`);
          }
        });

        grid.appendChild(card);
      });
    };

    renderPasos();

    btnContinuar.addEventListener('click', () => {
      router.navigateTo(2, 5);
    });

    return () => { };
  },

  // =========================================================================
  // SECCIÓN 5: ME PONGO LA CAMISETA (R_M2_S5_no / R_M2_S5_na)
  // =========================================================================
  renderSeccion5(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getImageUrl('Fondo_armario_org3'));

    soundManager.playInstruction('M2_V6_2_4');
    router.setInstruction('Toma la camiseta con las dos manos. Busca el cuello. Pasa la cabeza, después un brazo y luego el otro. Finalmente, baja la camiseta.');

    const panel = document.createElement('div');
    panel.className = 'game-panel panel-stitched';
    panel.style.cssText = 'max-width: 900px; width: 94%; padding: 26px 30px 20px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>⭐ Me pongo la camiseta ⭐</span>
      </div>

      <!-- Cuadrícula 3x2 de 6 pasos numerados -->
      <div id="grid-pasos-camiseta" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 100%; margin: 18px 0 20px;"></div>

      <button id="btn-camiseta-continuar" class="btn btn-wood" style="min-width: 240px; display: none;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-pasos-camiseta');
    const btnContinuar = panel.querySelector('#btn-camiseta-continuar');

    const pasos = ASSETS.getPasosCamiseta(s.genero);
    let pasoEsperado = 1;

    pasos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.style.cssText = 'height: 145px; background: #80451F; border-radius: 20px;';
      card.innerHTML = `
        <div class="card-step-badge">${p.paso}</div>
        <div class="card-item-inner" style="border: none;">
          <img src="${p.img}" alt="${p.desc}" style="max-height: 85%;">
        </div>
      `;

      card.addEventListener('click', () => {
        if (p.paso === pasoEsperado) {
          card.classList.add('correct');
          card.style.pointerEvents = 'none';
          soundManager.playSound('M2_V11_2_3');
          router.showFeedback(true, null, 1000);
          pasoEsperado++;

          if (pasoEsperado > 6) {
            soundManager.playInstruction('M2_V7_2_4');
            btnContinuar.style.display = 'inline-flex';
          }
        } else {
          router.showFeedback(false);
          state.registrarApoyo('M2_S5_Camiseta', `Paso incorrecto seleccionado. Esperado: ${pasoEsperado}`);
        }
      });

      grid.appendChild(card);
    });

    btnContinuar.addEventListener('click', () => {
      router.navigateTo(2, 6);
    });

    return () => { };
  },

  // =========================================================================
  // SECCIÓN 6: ME VISTO EN ORDEN (PARTE 1: PAREJAS + PARTE 2: VESTIDO SECUENCIAL)
  // =========================================================================
  renderSeccion6(stage, router) {
    // Iniciar con Parte 1: Parejas clima-vestimenta
    return this.renderSeccion6Parte1(stage, router);
  },

  /**
   * Parte 1: Juego de Parejas Clima y Vestimenta (R_M2_S6_p1)
   */
  renderSeccion6Parte1(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getFondoDormitorio(s.genero));

    soundManager.playInstruction('M2_V10_2_1');
    router.setInstruction('Forma las parejas: toca un clima y luego la vestimenta que le corresponde.');

    const panel = document.createElement('div');
    panel.className = 'game-panel panel-stitched';
    panel.style.cssText = 'max-width: 880px; width: 94%; padding: 26px 30px 20px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>🌸 Me visto en orden: Parejas 🌸</span>
      </div>

      <!-- Fila superior: Climas -->
      <div id="fila-climas" style="display: flex; gap: 18px; width: 100%; justify-content: center; margin: 16px 0 14px;"></div>

      <!-- Fila inferior: Vestimentas -->
      <div id="fila-vestimentas" style="display: flex; gap: 18px; width: 100%; justify-content: center; margin-bottom: 20px;"></div>
    `;

    stage.appendChild(panel);

    const filaClimas = panel.querySelector('#fila-climas');
    const filaVest = panel.querySelector('#fila-vestimentas');

    const parejas = ASSETS.getParejasClimaVestimenta(s.genero);
    // Barajar vestimentas para que el niño deba emparejar
    const vestimentasShuffled = [...parejas].sort(() => Math.random() - 0.5);

    let climaSeleccionado = null;
    let vestSeleccionada = null;
    let parejasCompletadas = 0;

    parejas.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.style.cssText = 'width: 170px; height: 160px; background: #80451F; border-radius: 20px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${p.climaImg}" alt="${p.climaNombre}" style="max-height: 75%;">
          <span class="card-label">${p.climaNombre}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (card.classList.contains('correct')) return;
        filaClimas.querySelectorAll('.card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        climaSeleccionado = p.id;
        this.verificarPareja();
      });

      filaClimas.appendChild(card);
    });

    vestimentasShuffled.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.dataset.id = p.id;
      card.style.cssText = 'width: 170px; height: 160px; background: #80451F; border-radius: 20px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${p.vestimentaImg}" alt="${p.vestimentaNombre}" style="max-height: 85%;">
        </div>
      `;

      card.addEventListener('click', () => {
        if (card.classList.contains('correct')) return;
        filaVest.querySelectorAll('.card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        vestSeleccionada = p.id;
        this.verificarPareja();
      });

      filaVest.appendChild(card);
    });

    this.verificarPareja = () => {
      if (climaSeleccionado && vestSeleccionada) {
        if (climaSeleccionado === vestSeleccionada) {
          router.showFeedback(true);
          soundManager.playSound('M2_V13_2_6');

          // Marcar ambas como correctas
          filaClimas.querySelector(`.card-item.selected`).classList.replace('selected', 'correct');
          filaVest.querySelector(`.card-item.selected`).classList.replace('selected', 'correct');

          parejasCompletadas++;
          climaSeleccionado = null;
          vestSeleccionada = null;

          if (parejasCompletadas >= 3) {
            // Avanzar automáticamente a Parte 2
            setTimeout(() => {
              this.renderSeccion6Parte2(stage, router);
            }, 1800);
          }
        } else {
          router.showFeedback(false);
          soundManager.playSound('M2_V14_2_6');
          state.registrarApoyo('M2_S6_Parejas', `Pareja incorrecta: ${climaSeleccionado} con ${vestSeleccionada}`);

          setTimeout(() => {
            filaClimas.querySelectorAll('.card-item.selected').forEach(c => c.classList.remove('selected'));
            filaVest.querySelectorAll('.card-item.selected').forEach(c => c.classList.remove('selected'));
            climaSeleccionado = null;
            vestSeleccionada = null;
          }, 1200);
        }
      }
    };

    return () => { };
  },

  /**
   * Parte 2: Video de refuerzo + Vistiendo en orden (R_M2_S6_p2)
   */
  renderSeccion6Parte2(stage, router) {
    const s = state.get();
    stage.innerHTML = '';

    // Paso 1: Reproducir video de secuencia
    const videoUrl = ASSETS.getVideoSecuencia(s.genero);

    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-scene-container';
    videoContainer.innerHTML = `
      <video id="video-secuencia-completa" class="video-scene-player" autoplay playsinline>
        <source src="${videoUrl}" type="video/mp4">
      </video>
      <div class="intro-bottom-bar">
        <button id="btn-skip-secuencia" class="btn btn-wood btn-intro-action" aria-label="Saltar video">
          <span>Saltar</span> <span>⏭️</span>
        </button>
      </div>
    `;
    stage.appendChild(videoContainer);

    const video = videoContainer.querySelector('#video-secuencia-completa');
    const btnSkip = videoContainer.querySelector('#btn-skip-secuencia');

    let finalizado = false;
    const iniciarTableroVestido = () => {
      if (finalizado) return;
      finalizado = true;
      try {
        video.pause();
      } catch (e) { }
      videoContainer.remove();
      this.mostrarTableroVistiendoEnOrden(stage, router);
    };

    video.addEventListener('ended', iniciarTableroVestido);
    video.addEventListener('error', iniciarTableroVestido);

    if (btnSkip) {
      btnSkip.addEventListener('click', (e) => {
        e.stopPropagation();
        iniciarTableroVestido();
      });
    }

    const timeout = setTimeout(iniciarTableroVestido, 22000);

    return () => {
      clearTimeout(timeout);
      try {
        video.pause();
      } catch (e) { }
    };
  },

  mostrarTableroVistiendoEnOrden(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getFondoDormitorio(s.genero));

    soundManager.playInstruction('M2_V10_2_6');
    router.setInstruction('Viste a tu personaje en el orden correcto.');

    const panel = document.createElement('div');
    panel.className = 'game-panel panel-stitched';
    panel.style.cssText = 'max-width: 960px; width: 94%; padding: 26px 30px 20px;';

    const charInitialImg = s.genero === 'nino'
      ? `${ASSETS.IMG_DIR}niño_interior.png`
      : `${ASSETS.IMG_DIR}niña_interior.png`;

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>🌸 Vistiendo en orden 🌸</span>
      </div>

      <div style="display: flex; gap: 24px; width: 100%; margin: 18px 0; align-items: center; justify-content: space-between;">
        <!-- Cuadrícula 3x2 de prendas -->
        <div id="grid-vistiendo-orden" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 62%;"></div>

        <!-- Personaje a vestir -->
        <div class="character-box" style="width: 35%; height: 380px; background: #80451F; border-radius: 24px; border: 3px solid #53280B; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <img id="char-orden-display" src="${charInitialImg}" alt="Personaje" style="height: 92%; object-fit: contain;">
        </div>
      </div>

      <button id="btn-orden-continuar" class="btn btn-coral" style="min-width: 240px; display: none;">
        Continuar
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-vistiendo-orden');
    const charDisplay = panel.querySelector('#char-orden-display');
    const btnContinuar = panel.querySelector('#btn-orden-continuar');

    // Tarjetas a mostrar según especificación exacta para cada género
    const prendas = s.genero === 'nino' ? [
      { id: 'camiseta', nombre: 'Camiseta', img: `${ASSETS.IMG_DIR}M1_camiseta_no.png` },
      { id: 'pantalon', nombre: 'Pantalón', img: `${ASSETS.IMG_DIR}M1_pantalón.png` },
      { id: 'medias', nombre: 'Medias', img: `${ASSETS.IMG_DIR}M1_medias_n.png` },
      { id: 'zapatos', nombre: 'Zapatos', img: `${ASSETS.IMG_DIR}M1_zapatos_no.png` },
      { id: 'gorra', nombre: 'Gorra', img: `${ASSETS.IMG_DIR}M1_gorra_no.png` },
      { id: 'chaqueta', nombre: 'Chaqueta', img: `${ASSETS.IMG_DIR}M1_chaqueta.png` }
    ] : [
      { id: 'camiseta', nombre: 'Camiseta', img: `${ASSETS.IMG_DIR}M1_camiseta_na.png` },
      { id: 'falda', nombre: 'Falda', img: `${ASSETS.IMG_DIR}M1_falda.png` },
      { id: 'zapatos', nombre: 'Zapatos', img: `${ASSETS.IMG_DIR}Zapatos_na.png` },
      { id: 'gorra', nombre: 'Gorra', img: `${ASSETS.IMG_DIR}M1_gorra_na.png` },
      { id: 'medias', nombre: 'Medias', img: `${ASSETS.IMG_DIR}M1_medias.png` },
      { id: 'chaqueta', nombre: 'Chaqueta', img: `${ASSETS.IMG_DIR}Chaqueta_na.png` }
    ];

    // Secuencia correcta especificada:
    // Niño: Camiseta -> Pantalón -> Medias -> Zapatos -> Gorra -> Chaqueta
    // Niña: Camiseta -> Falda -> Medias -> Chaqueta -> Zapatos -> Gorra
    const ordenSecuencia = s.genero === 'nino'
      ? ['medias', 'pantalon', 'camiseta', 'zapatos', 'chaqueta', 'gorra']
      : ['medias', 'falda', 'camiseta', 'zapatos', 'gorra', 'chaqueta'];

    // Imágenes del personaje reflejando cada prenda agregada sucesivamente
    const imagenesPaso = s.genero === 'nino' ? [
      `${ASSETS.IMG_DIR}medias_niño.png`,
      `${ASSETS.IMG_DIR}niño_medias_pantalon.png`,
      `${ASSETS.IMG_DIR}niño_medias_pantalon_camiseta.png`,
      `${ASSETS.IMG_DIR}niño_medias_pantalon_camiseta_zapatos.png`,
      `${ASSETS.IMG_DIR}niño_medias_pantalon_camiseta_zapatos_chaqueta.png`,
      `${ASSETS.IMG_DIR}niño_completo_pantalon.png`
    ] : [
      `${ASSETS.IMG_DIR}medias_nina.png`,
      `${ASSETS.IMG_DIR}niña_medias_falda.png`,
      `${ASSETS.IMG_DIR}niña_medias_falda_camiseta.png`,
      `${ASSETS.IMG_DIR}niña_medias_falda_camiseta_zapatos.png`,
      `${ASSETS.IMG_DIR}niña_medias_falda_camiseta_zapatos_gorra.png`,
      `${ASSETS.IMG_DIR}niña_completa_falda.png`
    ];

    let indicePaso = 0;

    prendas.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.dataset.id = p.id;
      card.style.cssText = 'height: 115px; background: #80451F; border-radius: 20px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${p.img}" alt="${p.nombre}" style="max-height: 85%;">
        </div>
      `;

      card.addEventListener('click', () => {
        const idEsperado = ordenSecuencia[indicePaso];
        if (p.id === idEsperado) {
          card.classList.add('correct');
          card.style.pointerEvents = 'none';
          soundManager.playSound('M2_V13_2_6');
          router.showFeedback(true);

          if (imagenesPaso[indicePaso]) {
            charDisplay.src = imagenesPaso[indicePaso];
          }

          indicePaso++;

          if (indicePaso >= ordenSecuencia.length) {
            btnContinuar.style.display = 'inline-flex';
          }
        } else {
          // Si el usuario selecciona la tarjeta incorrecta mostrar en pantalla IMG/Mal_X.png
          router.showFeedback(false);
          soundManager.playSound('M2_V14_2_6');
          card.classList.add('wrong');
          setTimeout(() => card.classList.remove('wrong'), 800);
          state.registrarApoyo('M2_S6_Orden', `Prenda en orden incorrecto: ${p.id}. Se esperaba: ${idEsperado}`);
        }
      });

      grid.appendChild(card);
    });

    btnContinuar.addEventListener('click', () => {
      router.navigateTo(2, 7);
    });
  },

  // =========================================================================
  // SECCIÓN 7: EVALUACIÓN FORMATIVA (3 RETOS CONSECUTIVOS)
  // =========================================================================
  renderSeccion7(stage, router) {
    const s = state.get();
    router.setBackground(ASSETS.getFondoDormitorio(s.genero));

    soundManager.playInstruction('M2_V15_2_1');
    router.setInstruction('Muéstrame cómo te vistes paso a paso.');

    let retoActual = 1;

    // Manejador para devolver al reto anterior dentro de la evaluación
    router.registerStepBackHandler(() => {
      if (retoActual === 3) {
        retoActual = 2;
        renderReto();
        return true;
      } else if (retoActual === 2) {
        retoActual = 1;
        renderReto();
        return true;
      }
      return false; // Permite retroceder a Sección 6
    });

    const renderReto = () => {
      stage.innerHTML = '';
      if (retoActual === 1) {
        this.renderReto1Vestir(stage, router, () => {
          retoActual = 2;
          renderReto();
        });
      } else if (retoActual === 2) {
        this.renderReto2Desvestir(stage, router, () => {
          retoActual = 3;
          renderReto();
        });
      } else if (retoActual === 3) {
        this.renderReto3Orientacion(stage, router, () => {
          this.mostrarCierreFinal(router);
        });
      }
    };

    renderReto();

    return () => { };
  },

  /**
   * Reto 1: Secuencia de Vestir (R_M2_S7_v)
   */
  renderReto1Vestir(stage, router, onSiguiente) {
    const s = state.get();
    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.cssText = 'max-width: 940px; width: 95%; padding: 28px 32px 22px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>⭐ Evaluación Módulo 2 — Reto 1: Vestir ⭐</span>
      </div>
      <p style="font-family: var(--font-body); font-weight: 700; font-size: 1.25rem; margin: 12px 0 16px; color: #53280B;">
        Ordena las tarjetas de la secuencia de vestirse:
      </p>
      <div id="grid-reto-vestir" style="display: flex; gap: 16px; width: 100%; justify-content: center; margin-bottom: 24px;"></div>
      <button id="btn-reto-vestir-accion" class="btn btn-wood" style="min-width: 220px;">
        Vestir
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-reto-vestir');
    const btnAccion = panel.querySelector('#btn-reto-vestir-accion');

    const secuencia = ASSETS.getSecuenciaEvaluacionVestir(s.genero);
    // Mostrar en desorden
    const secuenciaShuffled = [...secuencia].sort(() => Math.random() - 0.5);
    let pasoEsperado = 1;

    secuenciaShuffled.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.style.cssText = 'flex: 1; max-width: 210px; height: 260px; background: #80451F; border-radius: 20px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${item.img}" alt="Paso de vestido" style="max-height: 90%;">
        </div>
      `;

      card.addEventListener('click', () => {
        if (item.paso === pasoEsperado) {
          card.classList.add('correct');
          card.style.pointerEvents = 'none';
          soundManager.playSound('M2_V11_2_3');
          router.showFeedback(true);
          pasoEsperado++;

          if (pasoEsperado > secuencia.length) {
            btnAccion.className = 'btn btn-green';
            btnAccion.textContent = '¡Muy bien! Siguiente reto';
            btnAccion.onclick = onSiguiente;
          }
        } else {
          router.showFeedback(false);
          state.registrarApoyo('M2_S7_Reto1_Vestir', 'Orden incorrecto en secuencia de vestir');
        }
      });

      grid.appendChild(card);
    });
  },

  /**
   * Reto 2: Secuencia de Desvestir (R_M2_S7_dv)
   */
  renderReto2Desvestir(stage, router, onSiguiente) {
    const s = state.get();
    soundManager.playInstruction('M2_V15_2_7');
    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.cssText = 'max-width: 980px; width: 96%; padding: 26px 28px 20px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>⭐ Evaluación Módulo 2 — Reto 2: Desvestir ⭐</span>
      </div>
      <p style="font-family: var(--font-body); font-weight: 700; font-size: 1.25rem; margin: 12px 0 16px; color: #53280B;">
        Ordena las tarjetas para desvestirse antes de ir a dormir:
      </p>
      <div id="grid-reto-desvestir" style="display: flex; gap: 12px; width: 100%; justify-content: center; margin-bottom: 22px;"></div>
      <button id="btn-reto-desvestir-accion" class="btn btn-wood" style="min-width: 220px;">
        Desvestir
      </button>
    `;

    stage.appendChild(panel);

    const grid = panel.querySelector('#grid-reto-desvestir');
    const btnAccion = panel.querySelector('#btn-reto-desvestir-accion');

    const secuencia = ASSETS.getSecuenciaEvaluacionDesvestir(s.genero);
    const secuenciaShuffled = [...secuencia].sort(() => Math.random() - 0.5);
    let pasoEsperado = 1;

    secuenciaShuffled.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.style.cssText = 'flex: 1; max-width: 155px; height: 230px; background: #80451F; border-radius: 18px;';
      card.innerHTML = `
        <div class="card-item-inner" style="border: none;">
          <img src="${item.img}" alt="Paso de desvestir" style="max-height: 90%;">
        </div>
      `;

      card.addEventListener('click', () => {
        if (item.paso === pasoEsperado) {
          card.classList.add('correct');
          card.style.pointerEvents = 'none';
          soundManager.playSound('M2_V11_2_3');
          router.showFeedback(true);
          pasoEsperado++;

          if (pasoEsperado > secuencia.length) {
            btnAccion.className = 'btn btn-green';
            btnAccion.textContent = '¡Excelente! Último reto';
            btnAccion.onclick = onSiguiente;
          }
        } else {
          router.showFeedback(false);
          state.registrarApoyo('M2_S7_Reto2_Desvestir', 'Orden incorrecto en desvestido');
        }
      });

      grid.appendChild(card);
    });
  },

  /**
   * Reto 3: Orientación de Prenda
   */
  renderReto3Orientacion(stage, router, onSiguiente) {
    const s = state.get();
    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.style.cssText = 'max-width: 620px; width: 90%; padding: 28px 32px 22px;';

    panel.innerHTML = `
      <div class="panel-title-pill">
        <span>⭐ Reto 3: ¿Derecho o Revés? ⭐</span>
      </div>
      <p style="font-family: var(--font-body); font-weight: 700; font-size: 1.25rem; margin: 12px 0 16px; color: #53280B;">
        ¿Cómo está esta prenda?
      </p>
      <div id="card-reto-orientacion" class="card-item" style="width: 220px; height: 220px; background: #80451F; border-radius: 22px; margin-bottom: 20px;">
        <div class="card-item-inner" style="border: none;">
          <img id="img-reto-prenda" src="${ASSETS.IMG_DIR}M2_camiseta_reves.png" alt="Prenda" style="max-height: 85%;">
        </div>
      </div>
      <div style="display: flex; gap: 18px;">
        <button id="btn-reto-esta-bien" class="btn btn-yellow" style="min-width: 170px;">Está bien</button>
        <button id="btn-reto-dar-vuelta" class="btn btn-yellow" style="min-width: 170px;">Dale la vuelta</button>
      </div>
    `;

    stage.appendChild(panel);

    const imgPrenda = panel.querySelector('#img-reto-prenda');
    const btnEstaBien = panel.querySelector('#btn-reto-esta-bien');
    const btnDarVuelta = panel.querySelector('#btn-reto-dar-vuelta');

    let estaAlReves = true;

    btnDarVuelta.addEventListener('click', () => {
      if (estaAlReves) {
        estaAlReves = false;
        imgPrenda.src = `${ASSETS.IMG_DIR}${s.genero === 'nino' ? 'M1_camiseta_no.png' : 'M1_camiseta_na.png'}`;
        router.showFeedback(true);
        soundManager.playSound('M2_V16_2_7');
        setTimeout(onSiguiente, 1500);
      }
    });

    btnEstaBien.addEventListener('click', () => {
      if (estaAlReves) {
        router.showFeedback(false);
        state.registrarApoyo('M2_S7_Reto3', 'Afirmó que estaba bien la camiseta al revés');
      }
    });
  },

  /**
   * Cierre con Insignia "Me visto paso a paso"
   */
  mostrarCierreFinal(router) {
    soundManager.playInstruction('M2_insignia');

    // Finalizar y consolidar la sesión del participante en el administrador
    adminService.finalizarParticipante();

    const modalHtml = `
      <div class="modal-card">
        <div class="panel-title-pill" style="top: -20px;">
          <span>🏆 ¡Felicidades! 🏆</span>
        </div>
        <img src="${ASSETS.getImageUrl('M2_insignia')}" alt="Insignia Me visto paso a paso" class="badge-reward-img">
        <p class="modal-text" style="font-size: 1.55rem; font-weight: 800; color: #7D421B; margin: 10px 0 6px;">
          Insignia: “Me visto paso a paso”
        </p>
        <div class="stars-cluster">
          <img src="${ASSETS.getImageUrl('M1_estrella')}" alt="Estrella" class="star-icon">
          <img src="${ASSETS.getImageUrl('M1_estrella')}" alt="Estrella" class="star-icon" style="animation-delay: 0.15s;">
          <img src="${ASSETS.getImageUrl('M1_estrella')}" alt="Estrella" class="star-icon" style="animation-delay: 0.3s;">
        </div>
        <p class="modal-text" style="font-size: 1.2rem; margin-bottom: 22px;">
          ¡Has completado exitosamente los Módulos 0, 1 y 2 de Mi Rutina Diaria!
        </p>
        <div style="display: flex; gap: 14px;">
          <button id="btn-jugar-otra-vez" class="btn btn-green" style="font-size: 1.25rem; padding: 12px 32px;">
            Jugar otra vez
          </button>
        </div>
      </div>
    `;

    router.showModal(modalHtml);

    const btn = document.getElementById('btn-jugar-otra-vez');
    if (btn) {
      btn.addEventListener('click', () => {
        soundManager.stopCurrentInstruction();
        router.closeModal();
        state.resetForNewGame();
        router.navigateTo(0, 1);
      });
    }
  }
};
