import { useEffect, useRef, useCallback } from 'react';

// Vertex shader — simple fullscreen quad
const VERT_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader — radial displacement ripple with time decay
const FRAG_SRC = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform vec2 u_cursor;
  uniform float u_time;
  uniform float u_intensity;
  uniform float u_active;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 cursor = u_cursor / u_resolution;
    cursor.y = 1.0 - cursor.y;
    
    float dist = distance(uv, cursor);
    
    // Ripple wave equation
    float ripple = sin(dist * 60.0 - u_time * 8.0) * 0.5 + 0.5;
    ripple *= exp(-dist * 12.0);
    ripple *= exp(-u_time * 3.0);
    ripple *= u_intensity * u_active;
    
    // Very subtle white displacement — blends into #050505
    float brightness = ripple * 0.08;
    gl_FragColor = vec4(vec3(brightness), brightness * 0.6);
  }
`;

export default function PremiumCursor() {
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const uniformsRef = useRef({});
    const cursorRef = useRef({ x: -100, y: -100 });
    const smoothCursorRef = useRef({ x: -100, y: -100 });
    const dotRef = useRef(null);
    const lastMoveRef = useRef(0);
    const intensityRef = useRef(0);
    const rafRef = useRef(null);
    const isTouchRef = useRef(false);

    // Init WebGL
    const initGL = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return false;

        const gl = canvas.getContext('webgl', {
            alpha: true,
            premultipliedAlpha: false,
            antialias: false,
        });
        if (!gl) return false;

        // Compile shaders
        const vert = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vert, VERT_SRC);
        gl.compileShader(vert);

        const frag = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(frag, FRAG_SRC);
        gl.compileShader(frag);

        const program = gl.createProgram();
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Fullscreen quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1,
        ]), gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        glRef.current = gl;
        programRef.current = program;
        uniformsRef.current = {
            resolution: gl.getUniformLocation(program, 'u_resolution'),
            cursor: gl.getUniformLocation(program, 'u_cursor'),
            time: gl.getUniformLocation(program, 'u_time'),
            intensity: gl.getUniformLocation(program, 'u_intensity'),
            active: gl.getUniformLocation(program, 'u_active'),
        };

        return true;
    }, []);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        const gl = glRef.current;
        if (!canvas || !gl) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        // Detect touch device
        isTouchRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchRef.current) return;

        const ok = initGL();
        if (!ok) return;
        resize();

        let startTime = performance.now();

        function onMouseMove(e) {
            cursorRef.current = { x: e.clientX, y: e.clientY };
            lastMoveRef.current = performance.now();
            intensityRef.current = 1.0;
        }

        function onResize() {
            resize();
        }

        function tick() {
            const gl = glRef.current;
            const u = uniformsRef.current;
            if (!gl) return;

            const now = performance.now();
            const elapsed = (now - startTime) / 1000;
            const timeSinceMove = (now - lastMoveRef.current) / 1000;

            // Lerp smooth cursor
            const lerp = 0.15;
            smoothCursorRef.current.x += (cursorRef.current.x - smoothCursorRef.current.x) * lerp;
            smoothCursorRef.current.y += (cursorRef.current.y - smoothCursorRef.current.y) * lerp;

            // Decay intensity
            intensityRef.current = Math.max(0, 1.0 - timeSinceMove * 2.0);

            // Update dot
            if (dotRef.current) {
                dotRef.current.style.transform =
                    `translate(${smoothCursorRef.current.x}px, ${smoothCursorRef.current.y}px) translate(-50%, -50%)`;
            }

            // Render
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform2f(u.resolution, window.innerWidth * dpr, window.innerHeight * dpr);
            gl.uniform2f(u.cursor, smoothCursorRef.current.x * dpr, smoothCursorRef.current.y * dpr);
            gl.uniform1f(u.time, timeSinceMove);
            gl.uniform1f(u.intensity, intensityRef.current);
            gl.uniform1f(u.active, lastMoveRef.current > 0 ? 1.0 : 0.0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            rafRef.current = requestAnimationFrame(tick);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);
        rafRef.current = requestAnimationFrame(tick);

        // Add cursor: none to body
        document.body.classList.add('cursor-hidden');

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            document.body.classList.remove('cursor-hidden');

            const gl = glRef.current;
            if (gl) {
                const ext = gl.getExtension('WEBGL_lose_context');
                if (ext) ext.loseContext();
            }
        };
    }, [initGL, resize]);

    // On touch devices, render nothing
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return null;
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                className="premium-cursor-canvas"
            />
            <div ref={dotRef} className="premium-cursor-dot" />
        </>
    );
}
