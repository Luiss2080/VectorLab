# Manual de Usuario - VectorLab

Bienvenido a la documentación oficial de **VectorLab**, una herramienta avanzada para la creación y manipulación de gráficos vectoriales desde el navegador, construida con React y Zustand.

## Interfaz de Usuario

La interfaz está dividida en tres áreas principales que pueden ocultarse para ofrecer un lienzo limpio:

### 1. Barra de Herramientas (Panel Izquierdo)
Permite agregar nuevas figuras al lienzo. Puedes colapsar este panel con el botón en la esquina superior izquierda.
- **Mouse (Puntero):** Deselecciona la figura actual.
- **Cuadrado / Rectángulo:** Crea un rectángulo con color base azul.
- **Círculo:** Crea un círculo con color base naranja.
- **Triángulo:** Crea un polígono triangular con color base verde.
- **Línea:** Crea una línea recta editable con color base rojo.
- **Texto:** Agrega un campo de texto editable.

### 2. Lienzo (Área Central)
Es el área de trabajo interactiva.
- **Mover:** Haz clic y arrastra cualquier figura para moverla.
- **Seleccionar:** Haz clic sobre cualquier figura para mostrar sus propiedades.
- **Fondo:** Haz clic en una zona vacía para deseleccionar.

### 3. Panel de Propiedades (Panel Derecho)
Permite editar milimétricamente el objeto seleccionado. Puedes colapsarlo con el botón en la esquina superior derecha.
- **Color:** Cambia el color de relleno nativamente.
- **Posición (X/Y):** Controla exactamente dónde está ubicado el objeto.
- **Dimensiones:** Ancho/Alto para rectángulos, Radio para círculos, o coordenadas (X2/Y2) para líneas.
- **Capas (Z-Index):** Usa "Al Frente" o "Al Fondo" para ordenar visualmente los objetos si se superponen.
- **Eliminar:** Borra el objeto seleccionado.

## Funciones Avanzadas

### ⏪ Historial (Máquina del Tiempo)
En la barra superior central encontrarás los botones de **Deshacer (Undo)** y **Rehacer (Redo)**.
El sistema registra cada movimiento, cambio de tamaño o modificación de color que realices. Puedes retroceder en el tiempo libremente.

### 💾 Autoguardado y Persistencia
No te preocupes por guardar constantemente. El sistema usa `localStorage` para persistir tu progreso en tiempo real. Si cierras el navegador y vuelves mañana, tu lienzo estará exactamente igual.

### 📤 Exportación
Haz clic en el botón **Exportar** en la esquina superior derecha. Tendrás dos opciones:
1. **Gráfico Vectorial (SVG):** Descarga el lienzo tal como se ve para usarlo en web, Adobe Illustrator u otras herramientas vectoriales.
2. **Datos del Proyecto (JSON):** Descarga un archivo de respaldo con todos los datos puros. Ideal para enviar tu trabajo a un colega o guardarlo como copia de seguridad externa.

---

> _Desarrollado con Vite, React, Zustand y Framer Motion por el equipo de Antigravity._
