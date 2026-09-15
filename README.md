<div align="center">
  <br />
  <img src="public/favicon.svg" alt="Sistema SVG Pro Logo" width="100" />
  <h1>✨ Sistema SVG Pro Editor</h1>
  <p>
    <strong>El entorno de diseño vectorial más rápido, moderno y colaborativo de la web.</strong>
  </p>
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-18.3-blue.svg?style=for-the-badge&logo=react" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5-blue.svg?style=for-the-badge&logo=typescript" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css" />
    <img alt="Zustand" src="https://img.shields.io/badge/Zustand-State-black.svg?style=for-the-badge&logo=react" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-Build-646CFF.svg?style=for-the-badge&logo=vite" />
  </p>
</div>

---

## 🎨 Sobre el Proyecto

**Sistema SVG Pro Editor** es un editor de gráficos vectoriales altamente interactivo y colaborativo (estilo Figma/Miro). Desarrollado con las últimas tecnologías del ecosistema frontend, este proyecto ofrece una experiencia "Desktop-like" directamente en tu navegador, impulsado por *React*, *Zustand* y un lienzo de SVG nativo para garantizar rendimiento puro a 60 FPS.

## 🚀 Características Principales

- ✏️ **Dibujo Libre (Pizarra Digital):** Vectorización compleja con soporte para trazos fluidos a mano alzada.
- 👥 **Multijugador en Tiempo Real:** Motor colaborativo integrado vía **WebRTC** y **Yjs** para editar en paralelo de forma descentralizada.
- 🗂️ **Inserción de Imágenes:** Arrastra, suelta y renderiza archivos `JPG/PNG` locales directamente en tu lienzo con compresión inteligente.
- ⏪ **Máquina del Tiempo (Undo/Redo):** Navega por el historial de tus acciones con `Ctrl+Z` y `Ctrl+Y` potenciado por *Zundo*.
- 💾 **Exportación de Alta Resolución:** Descarga tus proyectos en `SVG` (para diseño), en `JSON` (datos) o directamente rasterizado a imagen de alta calidad `PNG`.
- 🧲 **Snapping Inteligente:** Modo opcional para alinear automáticamente tus figuras en rejillas magnéticas (Snap-to-Grid).
- ⌨️ **Atajos de Teclado Profesionales:** Soporte global para Copiar (`Ctrl+C`), Pegar/Duplicar (`Ctrl+V`) y Eliminar (`Supr`).
- 🌙 **Moderna Interfaz Glassmorphism:** Menús flotantes altamente estéticos diseñados con *Framer Motion* y utilidades *Tailwind CSS v4*.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [React 18](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestor de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Historial de Estado:** [Zundo](https://github.com/charkour/zundo)
- **Colaboración P2P:** [Yjs](https://yjs.dev/) + [y-webrtc](https://github.com/yjs/y-webrtc)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Testing:** [Vitest](https://vitest.dev/) + React Testing Library

---

## 📦 Instalación y Uso Local

Sigue estos pasos para arrancar el entorno en tu máquina:

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/figuras-vectoriales.git
   cd FigurasVectoriales
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo local**
   ```bash
   npm run dev
   ```

4. **Ejecuta la suite de Pruebas Unitarias (Opcional)**
   ```bash
   npm run test
   ```

5. **Construye la versión de Producción**
   ```bash
   npm run build
   ```

---

## 🤝 Contribución

¡Las contribuciones son 100% bienvenidas! Si tienes ideas para mejorar las arquitecturas, nuevas herramientas de dibujo o simplemente quieres resolver un bug reportado:
1. Haz un *Fork* del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/NuevaIdea`).
3. Haz un commit de tus cambios (`git commit -m 'Añadido X feature'`).
4. Sube la rama (`git push origin feature/NuevaIdea`).
5. Abre un **Pull Request**.

## 📝 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Eres libre de usarlo para fines comerciales, de estudio o de distribución sin restricciones.

---
<div align="center">
  <i>Construido con amor ❤️ y pasión por el diseño de interfaces moderno.</i>
</div>
