/**
 * LABORATORIO SVG - INGENIERÍA DE SISTEMAS
 * Versión con Zoom y Pan en Diagrama
 */

document.addEventListener('DOMContentLoaded', () => {
    const NS = "http://www.w3.org/2000/svg";
    const state = { 
        dragEl: null, offset: { x: 0, y: 0 }, audio: null,
        // Estado del zoom/pan del diagrama
        zoom: 1, pan: { x: 0, y: 0 }, isPanning: false, startPan: { x: 0, y: 0 }
    };
    
    const $ = s => document.querySelector(s);
    const els = {
        lab: $('#svg-lab'), diag: $('#svg-diagram'), 
        diagContent: $('#diagram-content'), // Grupo para zoom/pan
        target: $('#target-circle'),
        diff: $('#range-diff'), vLab: $('#view-playground'), vDiag: $('#view-diagram'),
        bLab: $('#btn-playground'), bDiag: $('#btn-diagram')
    };

    // --- 1. NAVEGACIÓN ---
    const toggleView = (isLab) => {
        els.vLab.classList.toggle('active', isLab);
        els.vDiag.classList.toggle('active', !isLab);
        els.bLab.classList.toggle('active', isLab);
        els.bDiag.classList.toggle('active', !isLab);
        if (!isLab) {
            drawFlowchart();
            resetZoom();
        }
    };

    els.bLab.onclick = () => toggleView(true);
    els.bDiag.onclick = () => toggleView(false);

    // --- 2. ZOOM Y PAN (DIAGRAMA) ---
    function resetZoom() {
        state.zoom = 1; state.pan = { x: 0, y: 0 };
        updateDiagramTransform();
    }

    function updateDiagramTransform() {
        els.diagContent.setAttribute('transform', `translate(${state.pan.x}, ${state.pan.y}) scale(${state.zoom})`);
    }

    els.diag.onwheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = state.zoom * delta;
        if (newZoom > 0.5 && newZoom < 5) {
            state.zoom = newZoom;
            updateDiagramTransform();
        }
    };

    els.diag.onmousedown = (e) => {
        if (e.button === 0) { // Click izquierdo
            state.isPanning = true;
            state.startPan = { x: e.clientX - state.pan.x, y: e.clientY - state.pan.y };
        }
    };

    window.addEventListener('mousemove', (e) => {
        if (state.isPanning) {
            state.pan.x = e.clientX - state.startPan.x;
            state.pan.y = e.clientY - state.startPan.y;
            updateDiagramTransform();
        }
    });

    window.addEventListener('mouseup', () => { 
        state.isPanning = false; 
        state.dragEl = null; 
    });

    // --- 3. AUDIO ---
    const beep = (f, d = 0.1) => {
        if (!$('#chk-audio').checked) return;
        if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
        const o = state.audio.createOscillator(), g = state.audio.createGain();
        o.frequency.value = f; g.gain.exponentialRampToValueAtTime(0.0001, state.audio.currentTime + d);
        o.connect(g); g.connect(state.audio.destination);
        o.start(); o.stop(state.audio.currentTime + d);
    };

    // --- 4. LABORATORIO ---
    const getCoords = (e, svg) => {
        const r = svg.getBoundingClientRect();
        return { x: (e.clientX - r.left) * (800 / r.width), y: (e.clientY - r.top) * (600 / r.height) };
    };

    const moveTarget = () => {
        const r = 30;
        els.target.setAttribute('cx', Math.random() * (800 - 2 * r) + r);
        els.target.setAttribute('cy', Math.random() * (600 - 2 * r) + r);
    };

    els.lab.onmousemove = (e) => {
        const m = getCoords(e, els.lab);
        if (state.dragEl) {
            const isR = state.dragEl.tagName === 'rect';
            state.dragEl.setAttribute(isR ? 'x' : 'cx', m.x - state.offset.x);
            state.dragEl.setAttribute(isR ? 'y' : 'cy', m.y - state.offset.y);
            return;
        }
        const d = Math.sqrt((m.x - els.target.getAttribute('cx'))**2 + (m.y - els.target.getAttribute('cy'))**2);
        if (d < parseInt(els.diff.value)) { beep(200, 0.05); moveTarget(); }
    };

    els.target.onmousedown = () => { beep(800, 0.2); moveTarget(); };

    const addShape = (type) => {
        const el = document.createElementNS(NS, type);
        const props = type === 'rect' ? 
            { x: 350, y: 250, width: 100, height: 70, fill: 'rgba(59,130,246,0.1)', stroke: '#3b82f6', 'stroke-width': 2, rx: 8 } :
            { cx: 400, cy: 300, r: 40, fill: 'rgba(245,158,11,0.1)', stroke: '#f59e0b', 'stroke-width': 2 };
        
        Object.entries(props).forEach(([k, v]) => el.setAttribute(k, v));
        
        el.onmousedown = (e) => {
            e.stopPropagation();
            state.dragEl = el;
            const m = getCoords(e, els.lab);
            state.offset.x = m.x - parseFloat(el.getAttribute(type === 'rect' ? 'x' : 'cx'));
            state.offset.y = m.y - parseFloat(el.getAttribute(type === 'rect' ? 'y' : 'cy'));
            els.lab.appendChild(el); 
        };
        els.lab.appendChild(el); beep(400);
    };

    $('#add-rect').onclick = () => addShape('rect');
    $('#add-circle').onclick = () => addShape('circle');
    $('#btn-clear').onclick = () => els.lab.querySelectorAll('rect, circle:not(#target-circle)').forEach(n => n.remove());

    // --- 5. RENDERIZADO DIAGRAMA ---
    const drawFlowchart = () => {
        els.diagContent.innerHTML = '';
        let y = 60;
        const steps = [
            { t: 'Inicio', s: 'oval' }, { t: 'Análisis de Estilo', s: 'box' },
            { t: 'Digitalización SVG', s: 'box' }, { t: '¿Es Correcto?', s: 'diamond' },
            { t: 'Presentación Final', s: 'oval' }
        ];
        steps.forEach((st, i) => {
            const isD = st.s === 'diamond';
            drawElem(st.s, 400, y, 200, isD ? 100 : 60, st.t);
            if (i < steps.length - 1) drawLine(400, y + (isD ? 50 : 30), 400, y + 80);
            y += 110;
        });
    };

    const drawElem = (type, x, y, w, h, txt) => {
        const el = document.createElementNS(NS, type === 'diamond' ? 'polygon' : 'rect');
        const attrs = type === 'diamond' ? 
            { points: `${x},${y-h/2} ${x+w/2},${y} ${x},${y+h/2} ${x-w/2},${y}`, fill: 'rgba(245,158,11,0.05)', stroke: '#f59e0b' } :
            { x: x-w/2, y: y-h/2, width: w, height: h, rx: type === 'oval' ? h/2 : 8, fill: 'rgba(59,130,246,0.05)', stroke: '#3b82f6' };
        Object.entries({ ...attrs, 'stroke-width': 2 }).forEach(([k, v]) => el.setAttribute(k, v));
        els.diagContent.appendChild(el);
        
        const t = document.createElementNS(NS, 'text');
        Object.entries({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: '#fff', 'font-size': '12px', 'font-weight': '600' }).forEach(([k, v]) => t.setAttribute(k, v));
        t.textContent = txt; els.diagContent.appendChild(t);
    };

    const drawLine = (x1, y1, x2, y2) => {
        const l = document.createElementNS(NS, 'line');
        Object.entries({ x1, y1, x2, y2, stroke: '#475569', 'stroke-width': 2 }).forEach(([k, v]) => l.setAttribute(k, v));
        els.diagContent.appendChild(l);
    };

    moveTarget();
});
