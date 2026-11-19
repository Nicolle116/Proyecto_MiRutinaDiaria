/**
 * MI RUTINA DIARIA — SERVICIO DE ADMINISTRACIÓN Y SEGUIMIENTO (ADMIN.JS)
 * Gestiona el registro de participantes, consolida resultados, calcula conclusiones pedagógicas
 * y almacena en localStorage para persistencia en Netlify y navegadores.
 */

const STORAGE_KEY = 'mrd_admin_participantes';
const ACTIVE_SESSION_KEY = 'mrd_active_participant';

class AdminService {
  constructor() {
    this.activeParticipant = this.loadActiveSession();
  }

  /**
   * Carga la sesión activa desde sessionStorage si existe
   */
  loadActiveSession() {
    try {
      const data = sessionStorage.getItem(ACTIVE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Guarda la sesión activa en sessionStorage
   */
  saveActiveSession() {
    try {
      if (this.activeParticipant) {
        sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(this.activeParticipant));
      } else {
        sessionStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (e) {
      console.warn('No se pudo guardar la sesión activa en sessionStorage:', e);
    }
  }

  /**
   * Inicia el registro de un nuevo participante al ingresar su nombre y avatar en Módulo 0
   */
  iniciarParticipante(nombre, genero) {
    const limpio = (nombre || '').trim();
    const id = `part_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    this.activeParticipant = {
      id,
      nombre: limpio || (genero === 'nino' ? 'Amiguito' : 'Amiguita'),
      genero: genero || 'nino',
      fechaInicio: new Date().toISOString(),
      fechaFin: null,
      duracionSegundos: 0,
      completado: false,
      actividades: {},
      apoyos: [],
      totalErrores: 0,
      totalAciertos: 0
    };

    this.saveActiveSession();
    return this.activeParticipant;
  }

  /**
   * Obtiene la sesión activa actual o crea una por defecto
   */
  obtenerParticipanteActivo() {
    if (!this.activeParticipant) {
      this.iniciarParticipante('Estudiante', 'nino');
    }
    return this.activeParticipant;
  }

  /**
   * Registra el resultado de una actividad o reto interactivo
   */
  registrarActividad(clave, { nombre, superado = true, errores = 0, detalle = '' }) {
    const act = this.obtenerParticipanteActivo();
    if (!act.actividades) act.actividades = {};

    const previa = act.actividades[clave] || { intentos: 0, errores: 0 };
    act.actividades[clave] = {
      clave,
      nombre: nombre || clave,
      superado: Boolean(superado),
      intentos: (previa.intentos || 0) + 1,
      errores: (previa.errores || 0) + errores,
      detalle: detalle || previa.detalle || '',
      timestamp: new Date().toISOString()
    };

    if (superado) {
      act.totalAciertos = (act.totalAciertos || 0) + 1;
    }
    if (errores > 0) {
      act.totalErrores = (act.totalErrores || 0) + errores;
    }

    this.saveActiveSession();
  }

  /**
   * Registra un apoyo / error terapéutico capturado por el sistema
   */
  registrarApoyo(modulo, seccion, actividad, detalle) {
    const act = this.obtenerParticipanteActivo();
    if (!act.apoyos) act.apoyos = [];

    const registro = {
      timestamp: new Date().toISOString(),
      modulo,
      seccion,
      actividad,
      detalle
    };

    act.apoyos.push(registro);
    act.totalErrores = (act.totalErrores || 0) + 1;
    this.saveActiveSession();
  }

  /**
   * Finaliza la sesión del participante cuando concluye el último módulo (Módulo 2 Insignia)
   * Consolida resultados, calcula conclusiones y almacena permanentemente en localStorage.
   */
  finalizarParticipante() {
    const act = this.obtenerParticipanteActivo();
    act.fechaFin = new Date().toISOString();
    act.completado = true;

    // Calcular duración
    const inicio = new Date(act.fechaInicio).getTime();
    const fin = new Date(act.fechaFin).getTime();
    act.duracionSegundos = Math.max(1, Math.round((fin - inicio) / 1000));

    // Generar conclusión pedagógica y terapéutica
    act.conclusion = this.generarConclusion(act);

    // Guardar en la lista permanente de localStorage
    const lista = this.getParticipantes();
    const indexExistente = lista.findIndex(p => p.id === act.id);
    if (indexExistente >= 0) {
      lista[indexExistente] = act;
    } else {
      lista.unshift(act); // Los más recientes primero
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      console.error('Error al persistir participante en localStorage:', e);
    }

    // Limpiar sesión activa
    this.activeParticipant = null;
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);

    return act;
  }

  /**
   * Genera el informe pedagógico y conclusión basada en el desempeño
   */
  generarConclusion(p) {
    const totalErrores = (p.apoyos ? p.apoyos.length : 0);
    const apoyos = p.apoyos || [];

    // Análisis de categorías de errores
    const erroresClima = apoyos.filter(a => a.actividad && (a.actividad.includes('Clima') || a.actividad.includes('Lluvia'))).length;
    const erroresOrientacion = apoyos.filter(a => a.actividad && (a.actividad.includes('Orientacion') || a.actividad.includes('Reto3'))).length;
    const erroresSecuencia = apoyos.filter(a => a.actividad && (a.actividad.includes('Chaqueta') || a.actividad.includes('Camiseta') || a.actividad.includes('Orden') || a.actividad.includes('Reto1') || a.actividad.includes('Reto2'))).length;

    let nivel = 'Autonomía Consolidada';
    let nivelColor = '#37A24A';
    let badgeClass = 'badge-green';
    let resumen = '';
    const fortalezas = [];
    const aspectosMejora = [];
    let recomendacion = '';

    if (totalErrores === 0) {
      nivel = 'Autonomía Excelente (Consolidada)';
      nivelColor = '#2E7D32';
      badgeClass = 'badge-green';
      resumen = `¡Desempeño sobresaliente! ${p.nombre} completó todas las actividades de reconocimiento de prendas, discriminación de clima y secuencias motoras de vestido y desvestido sin requerir apoyos correctivos.`;
      fortalezas.push('Dominio completo de la secuencia lógica para vestirse y desvestirse.');
      fortalezas.push('Excelente discriminación sensorial y reconocimiento del derecho/revés.');
      fortalezas.push('Elección acertada de prendas según las condiciones del clima.');
      recomendacion = 'Felicitar y motivar a mantener su independencia cotidiana en el hogar al vestirse por la mañana.';
    } else if (totalErrores <= 3) {
      nivel = 'Autonomía en Progreso (Favorable)';
      nivelColor = '#DDA211';
      badgeClass = 'badge-yellow';
      resumen = `${p.nombre} demuestra una comprensión adecuada del proceso de vestido y la relación entre prendas y clima. Logró superar los retos con un nivel mínimo de apoyos correctivos (${totalErrores} observación/es).`;
      
      if (erroresClima === 0) fortalezas.push('Comprende muy bien la relación entre ropa adecuada y clima.');
      if (erroresOrientacion === 0) fortalezas.push('Reconoce la orientación correcta de prendas (derecho/revés).');
      if (erroresSecuencia === 0) fortalezas.push('Sigue la secuencia lógica paso a paso para vestirse.');

      if (erroresClima > 0) aspectosMejora.push('Afianzar la asociación de prendas específicas para días lluviosos o fríos.');
      if (erroresOrientacion > 0) aspectosMejora.push('Reforzar la verificación de etiquetas y costuras antes de ponerse una prenda.');
      if (erroresSecuencia > 0) aspectosMejora.push('Practicar el orden progresivo de colocación (ropa interior -> prendas intermedias -> calzado).');

      recomendacion = 'Permitirle elegir su vestuario a diario haciéndole preguntas guía ("¿Cómo está el clima hoy?", "¿Hacia dónde va la etiqueta?").';
    } else {
      nivel = 'Requiere Acompañamiento y Guía';
      nivelColor = '#D4394E';
      badgeClass = 'badge-coral';
      resumen = `${p.nombre} participó con entusiasmo a lo largo de los módulos. Se detectaron dificultades en momentos puntuales del recorrido (${totalErrores} apoyos requeridos), especialmente en secuencias y discriminación de prendas.`;

      if (erroresSecuencia > 0) aspectosMejora.push('Se beneficiaría de apoyos visuales (pictogramas en el armario) para recordar el orden de vestido.');
      if (erroresOrientacion > 0) aspectosMejora.push('Ejercitar la orientación espacial de las prendas antes de introducir la cabeza o extremidades.');
      if (erroresClima > 0) aspectosMejora.push('Promover el hábito de mirar por la ventana antes de seleccionar el atuendo del día.');

      fortalezas.push('Disposición para completar la rutina y explorar las prendas del armario.');
      recomendacion = 'Implementar la técnica de modelado (hacerlo juntos paso a paso) y empezar practicando primero el desvestido antes de exigir el vestido completo.';
    }

    return {
      nivel,
      nivelColor,
      badgeClass,
      totalErrores,
      resumen,
      fortalezas,
      aspectosMejora,
      recomendacion
    };
  }

  /**
   * Retorna todos los participantes almacenados
   */
  getParticipantes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Error al leer participantes de localStorage:', e);
      return [];
    }
  }

  /**
   * Obtiene un participante por su ID
   */
  getParticipanteById(id) {
    const list = this.getParticipantes();
    return list.find(p => p.id === id) || null;
  }

  /**
   * Elimina un participante individual
   */
  eliminarParticipante(id) {
    let list = this.getParticipantes();
    list = list.filter(p => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error al guardar tras eliminar participante:', e);
    }
    return list;
  }

  /**
   * Elimina todos los registros de participantes
   */
  limpiarTodos() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error al limpiar registros:', e);
    }
    return [];
  }

  /**
   * Exporta los datos en formato JSON descargable
   */
  exportarJSON() {
    const participantes = this.getParticipantes();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(participantes, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `mi_rutina_diaria_participantes_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
  }

  /**
   * Exporta los datos en formato CSV descargable para Excel
   */
  exportarCSV() {
    const participantes = this.getParticipantes();
    if (participantes.length === 0) return;

    const headers = ['ID', 'Nombre', 'Género', 'Fecha Inicio', 'Fecha Fin', 'Duración (seg)', 'Total Errores', 'Nivel de Autonomía'];
    const rows = participantes.map(p => [
      `"${p.id}"`,
      `"${p.nombre}"`,
      `"${p.genero}"`,
      `"${p.fechaInicio || ''}"`,
      `"${p.fechaFin || ''}"`,
      p.duracionSegundos || 0,
      p.totalErrores || (p.apoyos ? p.apoyos.length : 0),
      `"${(p.conclusion && p.conclusion.nivel) || 'Completado'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_participantes_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  }
}

export const adminService = new AdminService();

