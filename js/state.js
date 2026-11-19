/**
 * MI RUTINA DIARIA — ESTADO CENTRALIZADO (STATE.JS)
 * Gestiona de forma unificada el avatar, nombre, navegación, apoyos y progreso.
 */

import { adminService } from './admin.js';

class AppState {
  constructor() {
    this.state = {
      genero: null,       // 'nino' | 'nina'
      nombre: '',         // Nombre asignado por el niño
      modulo: 0,          // Módulo actual (0, 1, 2)
      seccion: 1,         // Sección actual
      apoyosRegistrados: [], // Registro terapéutico para modo cuidador
      actividadesCompletadas: {},
      audioMuted: false,
      caregiverMode: false
    };

    this.listeners = [];
    this.loadFromSession();
  }

  // Suscripción a cambios de estado
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.saveToSession();
    this.listeners.forEach(cb => {
      try {
        cb(this.state);
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    });
  }

  // Actualizar género
  setAvatar(genero) {
    if (genero !== 'nino' && genero !== 'nina') return;
    this.state.genero = genero;
    this.notify();
  }

  // Actualizar nombre
  setNombre(nombre) {
    // Sanitización básica: evitar inyecciones HTML y recortar espacios
    const sanitized = String(nombre || '').replace(/[<>]/g, '').trim();
    this.state.nombre = sanitized || (this.state.genero === 'nino' ? 'Amiguito' : 'Amiguita');
    this.notify();
  }

  // Navegación de pantalla
  setPantalla(modulo, seccion) {
    this.state.modulo = Number(modulo);
    this.state.seccion = Number(seccion);
    this.notify();
  }

  // Reiniciar estado completo para volver a jugar desde el Módulo 0
  resetForNewGame() {
    this.state.modulo = 0;
    this.state.seccion = 1;
    this.state.actividadesCompletadas = {};
    this.state.genero = null;
    this.state.nombre = '';
    this.notify();
  }

  // Registro de nivel de apoyo y ayudas terapéuticas
  registrarApoyo(actividad, detalle) {
    const registro = {
      timestamp: new Date().toISOString(),
      modulo: this.state.modulo,
      seccion: this.state.seccion,
      actividad,
      detalle
    };
    this.state.apoyosRegistrados.push(registro);
    adminService.registrarApoyo(this.state.modulo, this.state.seccion, actividad, detalle);
    this.notify();
  }

  // Marcar actividad completada
  completarSeccion(modulo, seccion) {
    const key = `m${modulo}_s${seccion}`;
    this.state.actividadesCompletadas[key] = true;
    adminService.registrarActividad(key, {
      nombre: `Módulo ${modulo} Sección ${seccion}`,
      superado: true
    });
    this.notify();
  }

  // Alternar audio
  toggleAudio() {
    this.state.audioMuted = !this.state.audioMuted;
    this.notify();
    return this.state.audioMuted;
  }

  // Alternar modo cuidador
  toggleCaregiverMode() {
    this.state.caregiverMode = !this.state.caregiverMode;
    this.notify();
    return this.state.caregiverMode;
  }

  // Persistencia en sessionStorage
  saveToSession() {
    try {
      sessionStorage.setItem('mrd_app_state', JSON.stringify({
        genero: this.state.genero,
        nombre: this.state.nombre,
        modulo: this.state.modulo,
        seccion: this.state.seccion,
        actividadesCompletadas: this.state.actividadesCompletadas,
        apoyosRegistrados: this.state.apoyosRegistrados
      }));
    } catch (e) {
      // sessionStorage no disponible o restringido
    }
  }

  loadFromSession() {
    try {
      const data = sessionStorage.getItem('mrd_app_state');
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      // Usar estado inicial por defecto
    }
  }

  get() {
    return this.state;
  }
}

export const state = new AppState();
