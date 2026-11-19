# Mi Rutina Diaria — Aplicación Web Educativa Infantil

**Mi Rutina Diaria** es un Objeto Virtual de Aprendizaje (OVA) interactivo diseñado para niños y niñas en etapas tempranas de desarrollo psicomotor y autonomía personal. Favorece el reconocimiento de prendas de vestir, la relación prenda-zona del cuerpo, la elección de ropa según el clima, la orientación espacial (al derecho o al revés) y la secuenciación del proceso de vestido y desvestido.

---

## 🚀 Tecnologías Utilizadas

- **HTML5 Semántico:** Estructura limpia y accesible sin frameworks pesados.
- **CSS3 Vanilla:** Sistema de diseño infantil basado en variables CSS, paneles físicos de apariencia de madera y crema, botones acolchados, sombras volumétricas y diseño adaptable (*responsive*).
- **JavaScript Vanilla (ES6 Modules):** Arquitectura desacoplada y orientada a eventos para el estado, enrutamiento, gestión de audio y actividades interactivas.
- **Despliegue Estático:** Totalmente compatible con **Netlify**, **GitHub Pages** y cualquier servidor web sin requerir pasos de transpilación o *build*.

---

## 📁 Estructura del Proyecto

```text
Proyecto_MiRutinaDiaria/
│
├── index.html              # Punto de entrada principal estático
├── README.md               # Documentación general y guía de despliegue
├── netlify.toml            # Configuración para despliegue en Netlify
│
├── IMG/                    # Recursos gráficos (fondos, avatares, prendas, videos)
├── AUDIO/                  # Recursos sonoros (voces de narración, audios MPEG)
│
├── css/
│   ├── styles.css          # Variables globales, paleta infantil y resets
│   ├── layout.css          # Marco del juego, capas de fondo y barras de navegación
│   ├── components.css      # Paneles crema, botones acolchados, tarjetas y modales
│   └── responsive.css      # Adaptación a móviles, tabletas y computadores
│
├── js/
│   ├── app.js              # Inicializador y bootstrapping de la experiencia
│   ├── state.js            # Estado centralizado (avatar, nombre, progreso y apoyos)
│   ├── assets.js           # Resolución de variantes por género y rutas de archivo
│   ├── audio.js            # Gestor de audio con prevención de solapamientos y autoplay
│   ├── navigation.js       # Enrutador de pantallas y transiciones fluidas
│   └── modules/
│       ├── module0.js      # Módulo 0: Selección de avatar y nombre
│       ├── module1.js      # Módulo 1: Reconozco y elijo mi ropa (Secciones 1 a 6)
│       └── module2.js      # Módulo 2: Me visto paso a paso (Secciones 1 a 7)
│
└── docs/
    ├── inventario-recursos.md   # Inventario exhaustivo de archivos multimedia
    └── matriz-trazabilidad.md   # Matriz de trazabilidad de módulos y pantallas
```

---

## 🎮 Módulos y Secciones Implementados

### Módulo 0: Inicio y Personalización
- Selección entre avatar de niña (`niña_interior.png`) y niño (`niño_interior.png`).
- Diálogo modal accesible para registrar el nombre del niño.
- Saludo personalizado con botón de inicio.

### Módulo 1: Reconozco y Elijo mi Ropa
- **Sección 1:** Animación del amanecer según género (`amanecer_niño.mp4` / `amanecer_niña.mp4`).
- **Sección 2:** Organización del armario con transición temporizada entre estados (`Fondo_armario_org1` -> `org2` -> `org3`) sin remover al avatar.
- **Sección 3:** Galería de 6 prendas con pronunciación sonora y siluetas reactivas en el personaje.
- **Sección 4:** ¿Dónde va cada prenda? Colocación de prendas en las zonas corporales correspondientes.
- **Sección 5:** Observación del clima desde la ventana (identificación del clima lluvioso con refuerzo sonoro).
- **Sección 6:** ¿Qué me pongo? Selección de las 4 prendas adecuadas para lluvia, transformación del personaje a ropa impermeable y entrega de la insignia *"Explorador de prendas y clima"*.

### Módulo 2: Me Visto Paso a Paso
- **Sección 1:** Bienvenida al módulo y presentación de objetivos.
- **Sección 2:** Organización secuencial de la habitación (cama, juguetes y dormitorio ordenado).
- **Sección 3:** ¿Está al derecho o al revés? Identificación de prendas volteadas con botones *"Está bien"* y *"Dale la vuelta"* con retroalimentación visual inmediata.
- **Sección 4:** Colocación de la chaqueta en dos rondas: Ronda 1 numerada (1, 2, 3) y Ronda 2 barajada sin apoyos numéricos.
- **Sección 5:** Secuencia de 6 pasos para vestirse la camiseta.
- **Sección 6:** Me visto en orden. Parejas de clima-vestimenta seguido de animación guiada y secuenciación de prendas sobre el avatar.
- **Sección 7:** Evaluación formativa con tres retos (Vestir, Desvestir y Orientación), registro de apoyos para cuidadores y entrega de la insignia *"Me visto paso a paso"*.

---

## ⚙️ Modo para Cuidadores (Botón ⚙️)

La aplicación incluye un panel exclusivo para terapeutas, educadores y cuidadores:
- Muestra el nombre y avatar seleccionado.
- Incluye la **nota terapéutica** sobre la conveniencia de practicar el desvestido antes del vestido.
- Mantiene un **registro de los apoyos requeridos** (selecciones incorrectas o reintentos) durante las actividades de secuenciación y orientación.

---

## 🛠️ Cómo Ejecutar Localmente

Dado que el proyecto utiliza módulos de JavaScript (`type="module"`), debe servirse a través de un servidor HTTP local para evitar restricciones de CORS del protocolo `file://`:

### Opción 1: Con Python (si está instalado)
```bash
python -m http.server 8000
```
Luego abre en tu navegador: `http://localhost:8000`

### Opción 2: Con VS Code o IDE Antigravity
Instala la extensión **Live Server** o haz click derecho en `index.html` -> **Open with Live Server**.

### Opción 3: Con PowerShell (servidor HTTP ligero integrado)
```powershell
# Puedes usar cualquier utilidad estática o publicar directamente en Netlify
```

---

## 🌐 Publicación en Netlify y GitHub

1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: Implementación completa de Módulos 0, 1 y 2 de Mi Rutina Diaria"
   git branch -M main
   git remote add origin <URL_DE_TU_REPOSITORIO>
   git push -u origin main
   ```

2. **Desplegar en Netlify:**
   - Inicia sesión en [Netlify](https://www.netlify.com/).
   - Selecciona **Add new site** -> **Import an existing project** -> Selecciona tu repositorio de GitHub.
   - En configuración de despliegue:
     - **Build command:** *(dejar vacío)*
     - **Publish directory:** `.` *(directorio raíz)*
   - Haz clic en **Deploy site**. ¡El sitio se publicará al instante sin pasos adicionales!

---

## 🧩 Cómo Añadir el Módulo 3 en el Futuro

La arquitectura fue construida para ser fácilmente extensible:
1. Crea el archivo `js/modules/module3.js` implementando el método `renderSection(seccion, stage, router)`.
2. En `js/app.js`, importa `module3` y regístralo con `router.registerModule(3, module3);`.
3. Registra cualquier nuevo recurso multimedia en `js/assets.js`.
