/**
 * MI RUTINA DIARIA — RESOLUCIÓN DE RECURSOS MULTIMEDIA (ASSETS.JS)
 * Mapea rutas relativas exactas y resuelve variantes dinámicamente según el género del avatar.
 */

export const ASSETS = {
  // Rutas base
  IMG_DIR: './IMG/',
  AUDIO_DIR: './AUDIO/',

  // Video de portada de inicio tipo loading y manual de inicio
  PORTADA_VIDEO: './IMG/Portada_Mirutinadiaria.mp4',
  MANUAL_INICIO_VIDEO: './IMG/Manual_Inicio.mp4',

  // Recursos de Audio con sus nombres reales en disco
  AUDIOS: {
    // Módulo 0
    B_V1: 'B_M0.mpeg',

    // Módulo 1
    M1_V1: 'M1_V1.mp3.mpeg',
    M1_V2: 'M1_V2.mp3.mpeg',
    M1_V3_1_1: 'M1_V3.1.1.mp3.mpeg',
    M1_V4_1_2: 'M1_V4_1.3.mpeg',
    M1_V5_1_2: 'M1_V5_1.3.mpeg',
    M1_V6_1_3: 'M1_V6_1.3.mp3.mpeg',
    M1_V7_1_4: 'M1_V25_S6.mpeg',
    M1_V8_1_4C: 'M1_V8_1.4C.mp3.mpeg',
    M1_V9_1_4IC: 'M1_V9_1.4IC.mp3.mpeg',
    M1_V10: 'M2_V11.2.3.mp3',
    M1_V11_1_3: 'M1_V11_1.4.mpeg',
    M1_V12_1_4: 'M1_V12.1.4.mp3',
    M1_insignia: 'M1_insignia.mpeg',

    // Nombres individuales de prendas
    M1_camiseta: 'M1_camiseta.mp3',
    M1_falda: 'M1_pantalón.mp3',
    M1_pantalon: 'M1_pantalón.mp3',
    M1_medias: 'M1_medias.mp3',
    M1_zapatos: 'M1_zapatos.mp3',
    M1_gorra: 'M1_gorra.mp3',
    M1_chaqueta: 'M1_chaqueta.mp3',

    // Módulo 2
    M2_BV1: 'M2_BV1.mp3.mpeg',
    M2_V2_2_1: 'M2_V2.2.1.mp3',
    M2_V3_2_1: 'M2_V3.2.1.mp3',
    M2_V4_3_2: 'M2_V4.3.2.mp3',
    M2_V5_2_3: 'M2_V5.2.3.mp3',
    M2_V6_2_4: 'M2_V6_2.4.mp3',
    M2_V7_2_4: 'M2_V7_2.4.mp3',
    M2_V10_2_2: 'M2_V10.2.2.mp3',
    M2_V10_2_1: 'M2_V9_S6P1.mpeg',
    M2_V10_2_6: 'M2_V10_S6.mpeg',
    M2_V11_2_3: 'M2_V11.2.3.mpeg',
    M2_V13_2_6: 'M2_V13.2.6.mp3',
    M2_V14_2_6: 'M2_V14.2.6.mpeg',
    'M2_V14.2.6': 'M2_V14.2.6.mpeg',
    M2_V15_2_1: 'M2_V14_S7V.mpeg',
    M2_V15_2_7: 'M2_V15_S7.mpeg',
    M2_V16_2_7: 'M2_V16.2.7.mp3',
    M2_V17_2: 'M2_V17_2.2.mpeg',
    M2_V18_2_2: 'M2_V18.2.2.mp3',
    M2_V20: 'M2_V20.mpeg',
    M2_insignia: 'M2_insignia.mp3'
  },

  // Recursos Gráficos fijos
  IMAGES: {
    // Fondos universales
    Fondo_principal: 'Fondo_principal.png',
    Fondo_desorganizado: 'Fondo_desorganizado.png',
    Fondo_armario_org1: 'Fondo_armario_org1.png',
    Fondo_armario_org2: 'Fondo_armario_org2.png',
    Fondo_armario_org3: 'Fondo_armario_org3.png',

    // Feedback
    Bien_chulo: 'Bien_chulo.png',
    Mal_X: 'Mal_X.png',
    M1_estrella: 'M1_estrella.png',
    M1_insignia: 'M1_insignia.png',
    M2_insignia: 'M2_insignia.png',
    M3_insignia: 'M3_insignia3.png',

    // Clima
    Clima_sol: 'M1_Sol.png',
    Clima_lluvia: 'M1_lluvia.png',
    Clima_frio: 'M1_frío.png',
    Clima_viento: 'M1_viento.png'
  },

  /**
   * Resuelve la ruta completa de un archivo de audio.
   */
  getAudioUrl(key) {
    const filename = this.AUDIOS[key] || key;
    return `${this.AUDIO_DIR}${filename}`;
  },

  /**
   * Resuelve la ruta completa de una imagen fija.
   */
  getImageUrl(key) {
    const filename = this.IMAGES[key] || key;
    return `${this.IMG_DIR}${filename}`;
  },

  /**
   * Resuelve el personaje base según el género.
   */
  getPersonajeInterior(genero) {
    const file = genero === 'nino' ? 'niño_interior.png' : 'niña_interior.png';
    return `${this.IMG_DIR}${file}`;
  },


  /**
   * Resuelve el personaje sentado (Módulo 2 Sección 4).
   */
  getPersonajeSentado(genero) {
    const file = genero === 'nino' ? 'M2_niño_sentado.png' : 'M2_niña_sentada.png';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve el personaje vestido para lluvia (Módulo 1 Sección 6).
   */
  getPersonajeConBotas(genero) {
    const file = genero === 'nino' ? 'niño_conbotas.png' : 'niña_conbotas.png';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve el video de portada / loading de inicio del aplicativo.
   */
  getPortadaVideoUrl() {
    return `${this.IMG_DIR}Portada_Mirutinadiaria.mp4`;
  },

  /**
   * Resuelve el video de contexto según el género seleccionado (Módulo 0).
   */
  getVideoContexto(genero) {
    const file = genero === 'nino' ? 'Contexto_no.mp4' : 'Contexto_na.mp4';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve el video de amanecer (Módulo 1 Sección 1).
   */
  getVideoAmanecer(genero) {
    const file = genero === 'nino' ? 'amanecer_niño.mp4' : 'amanecer_niña.mp4';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve el video de instrucción de arrastre (Módulo 1 Sección 3 al finalizar).
   */
  getVideoInstArrastre(genero) {
    const file = genero === 'nino' ? 'Inst_Arrastre_no.mp4' : 'Inst_Arrastre.mp4';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve el video de secuencia de vestido (Módulo 2 Sección 6).
   */
  getVideoSecuencia(genero) {
    const file = genero === 'nino' ? 'secuencia_no_completo (1).mp4' : 'secuencia_na_completo.mp4';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve el fondo de noche lluviosa (Módulo 1 Sección 5).
   */
  getFondoNocheLluvia(genero) {
    const file = genero === 'nino' ? 'Fondo_noche_lluvia_no.png' : 'Fondo_noche_lluvia_na.png';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve el fondo de día lluvioso (Módulo 1 Sección 6).
   */
  getFondoDiaLluvioso(genero) {
    const file = genero === 'nino' ? 'Fondo_dia_lluvioso_no.png' : 'Fondo_sol_lluvia_na.png';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve los fondos de organización de habitación (Módulo 2 Sección 2).
   */
  getFondosOrganizarHabitacion(genero) {
    if (genero === 'nino') {
      return {
        desorg: `${this.IMG_DIR}Fondo_desorg_no.png`,
        paso1: `${this.IMG_DIR}Fondo_org_cama.png`,
        paso2: `${this.IMG_DIR}Fondo_org_juguetes.png`,
        completo: `${this.IMG_DIR}Fondo_dormitorio.png`
      };
    } else {
      return {
        desorg: `${this.IMG_DIR}Fondo_desorg_na.png`,
        paso1: `${this.IMG_DIR}Fondo_org_juguetes_na.png`,
        paso2: `${this.IMG_DIR}Fondo_org_cama_na.png`,
        completo: `${this.IMG_DIR}Fondo_dormitorio_na.png`
      };
    }
  },

  /**
   * Resuelve el fondo de dormitorio limpio (Módulo 2).
   */
  getFondoDormitorio(genero) {
    const file = genero === 'nino' ? 'Fondo_dormitorio.png' : 'Fondo_dormitorio_na.png';
    return `${this.IMG_DIR}${file}`;
  },

  /**
   * Resuelve las tarjetas de prendas para la galería (Módulo 1 Sección 3).
   */
  getPrendasGaleria(genero) {
    if (genero === 'nino') {
      return [
        { id: 'camiseta', nombre: 'Camiseta', img: `${this.IMG_DIR}M1_camiseta_no.png`, audio: 'M1_camiseta', silueta: `${this.IMG_DIR}silueta_niño_camiseta.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niño_ocultar_camiseta.png` },
        { id: 'pantalon', nombre: 'Pantalón', img: `${this.IMG_DIR}M1_pantalón.png`, audio: 'M1_pantalon', silueta: `${this.IMG_DIR}silueta_niño_pantalon.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niño_ocultar_pantalon.png` },
        { id: 'medias', nombre: 'Medias', img: `${this.IMG_DIR}M1_medias_n.png`, audio: 'M1_medias', silueta: `${this.IMG_DIR}silueta_niño_medias.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niño_ocultar_medias.png` },
        { id: 'zapatos', nombre: 'Zapatos', img: `${this.IMG_DIR}M1_zapatos_n.png`, audio: 'M1_zapatos', silueta: `${this.IMG_DIR}silueta_niño_zapatos.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niño_ocultar_zapatos.png` },
        { id: 'gorra', nombre: 'Gorra', img: `${this.IMG_DIR}M1_gorra_no.png`, audio: 'M1_gorra', silueta: `${this.IMG_DIR}silueta_niño_gorra.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niño_ocultar_gorra.png` },
        { id: 'chaqueta', nombre: 'Chaqueta', img: `${this.IMG_DIR}M1_chaqueta.png`, audio: 'M1_chaqueta', silueta: `${this.IMG_DIR}silueta_niño_chaqueta.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niño_ocultar_chaqueta.png` }
      ];
    } else {
      return [
        { id: 'camiseta', nombre: 'Camiseta', img: `${this.IMG_DIR}M1_camiseta_na.png`, audio: 'M1_camiseta', silueta: `${this.IMG_DIR}silueta_niña_camiseta.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niña_ocultar_camiseta.png` },
        { id: 'pantalon', nombre: 'Pantalón', img: `${this.IMG_DIR}Pantalon_na.png`, audio: 'M1_falda', silueta: `${this.IMG_DIR}silueta_niña_pantalon.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niña_ocultar_pantalon.png` },
        { id: 'medias', nombre: 'Medias', img: `${this.IMG_DIR}M1_medias.png`, audio: 'M1_medias', silueta: `${this.IMG_DIR}silueta_niña_medias.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niña_ocultar_medias.png` },
        { id: 'zapatos', nombre: 'Zapatos', img: `${this.IMG_DIR}Zapatos_na.png`, audio: 'M1_zapatos', silueta: `${this.IMG_DIR}silueta_niña_zapatos.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niña_ocultar_zapatos.png` },
        { id: 'gorra', nombre: 'Gorra', img: `${this.IMG_DIR}M1_gorra_na.png`, audio: 'M1_gorra', silueta: `${this.IMG_DIR}silueta_niña_gorra.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niña_ocultar_gorra.png` },
        { id: 'chaqueta', nombre: 'Chaqueta', img: `${this.IMG_DIR}Chaqueta_na.png`, audio: 'M1_chaqueta', silueta: `${this.IMG_DIR}silueta_niña_chaqueta.png`, siluetaOcultar: `${this.IMG_DIR}silueta_niña_ocultar_chaqueta.png` }
      ];
    }
  },

  /**
   * Resuelve las capas superpuestas para Módulo 1 Sección 4 en el orden estricto especificado:
   * 1. silueta_[género]_m1s4_comp (base)
   * 2. silueta_[género]_ocultar_camiseta
   * 3. silueta_[género]_ocultar_chaqueta
   * 4. silueta_[género]_ocultar_gorra
   * 5. silueta_[género]_ocultar_medias
   * 6. silueta_[género]_ocultar_pantalon
   * 7. silueta_[género]_ocultar_zapatos
   */
  getSiluetasM1S4(genero) {
    const gen = genero === 'nino' ? 'niño' : 'niña';
    return {
      base: `${this.IMG_DIR}silueta_${gen}_m1s4_comp.png`,
      layers: [
        { id: 'camiseta', nombre: 'Camiseta', src: `${this.IMG_DIR}silueta_${gen}_ocultar_camiseta.png`, zIndex: 2 },
        { id: 'chaqueta', nombre: 'Chaqueta', src: `${this.IMG_DIR}silueta_${gen}_ocultar_chaqueta.png`, zIndex: 3 },
        { id: 'gorra', nombre: 'Gorra', src: `${this.IMG_DIR}silueta_${gen}_ocultar_gorra.png`, zIndex: 4 },
        { id: 'medias', nombre: 'Medias', src: `${this.IMG_DIR}silueta_${gen}_ocultar_medias.png`, zIndex: 5 },
        { id: 'pantalon', nombre: 'Pantalón', src: `${this.IMG_DIR}silueta_${gen}_ocultar_pantalon.png`, zIndex: 6 },
        { id: 'zapatos', nombre: 'Zapatos', src: `${this.IMG_DIR}silueta_${gen}_ocultar_zapatos.png`, zIndex: 7 }
      ]
    };
  },

  /**
   * Resuelve las tarjetas para el escenario de lluvia (Módulo 1 Sección 6).
   */
  getPrendasClimaLluvia(genero) {
    if (genero === 'nino') {
      return [
        { id: 'botas', img: `${this.IMG_DIR}niño_botas.png`, correcta: true, nombre: 'Botas para lluvia' },
        { id: 'impermeable', img: `${this.IMG_DIR}niño_chaquetaimpermeable.png`, correcta: true, nombre: 'Chaqueta impermeable' },
        { id: 'pantalon', img: `${this.IMG_DIR}M1_pantalón.png`, correcta: true, nombre: 'Pantalón largo' },
        { id: 'camiseta', img: `${this.IMG_DIR}M1_camiseta_no.png`, correcta: true, nombre: 'Camiseta' },
        { id: 'short', img: `${this.IMG_DIR}Short_no.png`, correcta: false, nombre: 'Pantaloneta' },
        { id: 'gorra', img: `${this.IMG_DIR}M1_gorra_no.png`, correcta: false, nombre: 'Gorra de sol' },
        { id: 'chaqueta_comun', img: `${this.IMG_DIR}M1_chaqueta.png`, correcta: false, nombre: 'Chaqueta regular' },
        { id: 'pijama', img: `${this.IMG_DIR}M1_pijama_no.png`, correcta: false, nombre: 'Pijama' }
      ];
    } else {
      return [
        { id: 'botas', img: `${this.IMG_DIR}niña_botas.png`, correcta: true, nombre: 'Botas para lluvia' },
        { id: 'impermeable', img: `${this.IMG_DIR}niña_chaquetaimpermeable.png`, correcta: true, nombre: 'Chaqueta impermeable' },
        { id: 'pantalon', img: `${this.IMG_DIR}Pantalon_na.png`, correcta: true, nombre: 'Pantalón largo' },
        { id: 'camiseta', img: `${this.IMG_DIR}M1_camiseta_na.png`, correcta: true, nombre: 'Camiseta' },
        { id: 'falda', img: `${this.IMG_DIR}M1_falda.png`, correcta: false, nombre: 'Falda de verano' },
        { id: 'gorra', img: `${this.IMG_DIR}M1_gorra_na.png`, correcta: false, nombre: 'Gorra de sol' },
        { id: 'chaqueta_comun', img: `${this.IMG_DIR}Chaqueta_na.png`, correcta: false, nombre: 'Chaqueta regular' },
        { id: 'pijama', img: `${this.IMG_DIR}pijama_niña.png`, correcta: false, nombre: 'Pijama' }
      ];
    }
  },

  /**
   * Resuelve los pasos para colocarse la chaqueta (Módulo 2 Sección 4).
   */
  getPasosChaqueta(genero) {
    const sufijo = genero === 'nino' ? 'no' : 'na';
    return [
      { paso: 1, id: 'brazo1', img: `${this.IMG_DIR}chaqueta_brazo1_${sufijo}.png`, desc: 'Meter un brazo' },
      { paso: 2, id: 'brazo2', img: `${this.IMG_DIR}chaqueta_brazo2_${sufijo}.png`, desc: 'Meter el otro brazo' },
      { paso: 3, id: 'cierre', img: `${this.IMG_DIR}chaqueta_cierre_${sufijo}.png`, desc: 'Subir el cierre' }
    ];
  },

  /**
   * Resuelve los pasos para ponerse la camiseta (Módulo 2 Sección 5).
   */
  getPasosCamiseta(genero) {
    const sufijo = genero === 'nino' ? '' : 'na';
    return [
      { paso: 1, id: 'paso1', img: `${this.IMG_DIR}M2_paso1${sufijo}.png`, desc: 'Tomar la camiseta con las dos manos' },
      { paso: 2, id: 'paso2', img: `${this.IMG_DIR}M2_paso2${sufijo}.png`, desc: 'Identificar el cuello' },
      { paso: 3, id: 'paso3', img: `${this.IMG_DIR}M2_paso3${sufijo}.png`, desc: 'Pasar la cabeza' },
      { paso: 4, id: 'paso4', img: `${this.IMG_DIR}M2_paso4${sufijo}.png`, desc: 'Introducir un brazo' },
      { paso: 5, id: 'paso5', img: `${this.IMG_DIR}M2_paso5${sufijo}.png`, desc: 'Introducir el otro brazo' },
      { paso: 6, id: 'paso6', img: `${this.IMG_DIR}M2_paso6${sufijo}.png`, desc: 'Bajar la camiseta' }
    ];
  },

  /**
   * Resuelve parejas clima-vestimenta (Módulo 2 Sección 6 Parte 1).
   */
  getParejasClimaVestimenta(genero) {
    const sufijo = genero === 'nino' ? 'no' : 'na';
    return [
      {
        id: 'frio',
        climaImg: `${this.IMG_DIR}M1_frío.png`,
        climaNombre: 'Frío',
        vestimentaImg: `${this.IMG_DIR}${genero === 'nino' ? 'niño_medias_pantalon_camiseta_zapatos_chaqueta.png' : 'niña_medias_pantalon_camiseta_zapatos_chaqueta.png'}`,
        vestimentaNombre: 'Ropa abrigada'
      },
      {
        id: 'lluvia',
        climaImg: `${this.IMG_DIR}M1_lluvia.png`,
        climaNombre: 'Lluvia',
        vestimentaImg: `${this.IMG_DIR}${genero === 'nino' ? 'vestimenta_frío_sombrilla_no.png' : 'vestimenta_frío_sombrilla_na.png'}`,
        vestimentaNombre: 'Impermeable y sombrilla'
      },
      {
        id: 'sol',
        climaImg: `${this.IMG_DIR}M1_Sol.png`,
        climaNombre: 'Sol',
        vestimentaImg: `${this.IMG_DIR}${genero === 'nino' ? 'niño_medias_short_camiseta_zapatos.png' : 'niña_medias_falda_camiseta_zapatos.png'}`,
        vestimentaNombre: 'Ropa fresca'
      }
    ];
  },

  /**
   * Resuelve secuencias de evaluación (Módulo 2 Sección 7).
   */
  getSecuenciaEvaluacionVestir(genero) {
    if (genero === 'nino') {
      return [
        { paso: 1, img: `${this.IMG_DIR}medias_niño.png` },
        { paso: 2, img: `${this.IMG_DIR}niño_medias_pantalon.png` },
        { paso: 3, img: `${this.IMG_DIR}niño_medias_pantalon_camiseta.png` },
        { paso: 4, img: `${this.IMG_DIR}niño_medias_pantalon_camiseta_zapatos.png` }
      ];
    } else {
      return [
        { paso: 1, img: `${this.IMG_DIR}medias_nina.png` },
        { paso: 2, img: `${this.IMG_DIR}niña_medias_pantalon.png` },
        { paso: 3, img: `${this.IMG_DIR}niña_medias_pantalon_camiseta.png` },
        { paso: 4, img: `${this.IMG_DIR}niña_medias_pantalon_camiseta_zapatos.png` }
      ];
    }
  },

  getSecuenciaEvaluacionDesvestir(genero) {
    if (genero === 'nino') {
      return [
        { paso: 1, img: `${this.IMG_DIR}niño_medias_pantalon_camiseta_zapatos_chaqueta.png` },
        { paso: 2, img: `${this.IMG_DIR}niño_medias_pantalon_camiseta_zapatos.png` },
        { paso: 3, img: `${this.IMG_DIR}niño_medias_pantalon_camiseta.png` },
        { paso: 4, img: `${this.IMG_DIR}niño_medias_pantalon.png` },
        { paso: 5, img: `${this.IMG_DIR}medias_niño.png` },
        { paso: 6, img: `${this.IMG_DIR}niño_interior.png` }
      ];
    } else {
      return [
        { paso: 1, img: `${this.IMG_DIR}niña_medias_pantalon_camiseta_zapatos_chaqueta.png` },
        { paso: 2, img: `${this.IMG_DIR}niña_medias_pantalon_camiseta_zapatos.png` },
        { paso: 3, img: `${this.IMG_DIR}niña_medias_pantalon_camiseta.png` },
        { paso: 4, img: `${this.IMG_DIR}niña_medias_pantalon.png` },
        { paso: 5, img: `${this.IMG_DIR}medias_nina.png` },
        { paso: 6, img: `${this.IMG_DIR}niña_interior.png` }
      ];
    }
  }
};
