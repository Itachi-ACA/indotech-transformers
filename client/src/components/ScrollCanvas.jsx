import { useRef, useEffect, useCallback } from 'react';

const FRAME_COUNT = 240;

export default function ScrollCanvas() {
    const canvasRef = useRef(null);
    const imagesRef = useRef(new Array(FRAME_COUNT).fill(null));
    const currentFrameRef = useRef(0);
    const loadedCountRef = useRef(0);
    const firstDrawDone = useRef(false);

    // Draw a single frame to canvas
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Find closest loaded frame if this one isn't ready yet
        let img = imagesRef.current[index];
        if (!img || !img.complete || !img.naturalWidth) {
            // Search nearby frames
            for (let d = 1; d < FRAME_COUNT; d++) {
                if (index - d >= 0) {
                    const prev = imagesRef.current[index - d];
                    if (prev && prev.complete && prev.naturalWidth) { img = prev; break; }
                }
                if (index + d < FRAME_COUNT) {
                    const next = imagesRef.current[index + d];
                    if (next && next.complete && next.naturalWidth) { img = next; break; }
                }
            }
            if (!img) return;
        }

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const displayW = window.innerWidth;
        const displayH = window.innerHeight;
        const bufferW = Math.floor(displayW * dpr);
        const bufferH = Math.floor(displayH * dpr);

        if (canvas.width !== bufferW || canvas.height !== bufferH) {
            canvas.width = bufferW;
            canvas.height = bufferH;
        }

        ctx.clearRect(0, 0, bufferW, bufferH);
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, bufferW, bufferH);

        // Cover-fit the image (fills canvas, crops edges)
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(bufferW / iw, bufferH / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (bufferW - dw) / 2;
        const dy = (bufferH - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    // Progressive frame loading — loads frames in priority order
    useEffect(() => {
        const images = imagesRef.current;

        // Priority: load frame 0 first, then every 10th, then fill rest
        const priority = [0];
        for (let i = 10; i < FRAME_COUNT; i += 10) priority.push(i);
        for (let i = 0; i < FRAME_COUNT; i++) {
            if (!priority.includes(i)) priority.push(i);
        }

        let idx = 0;
        const BATCH = 6; // Load 6 at a time

        function loadBatch() {
            const end = Math.min(idx + BATCH, priority.length);
            for (let b = idx; b < end; b++) {
                const frameIdx = priority[b];
                const img = new Image();
                img.src = `/sequence/frame_${frameIdx}.jpg`;
                img.onload = () => {
                    images[frameIdx] = img;
                    loadedCountRef.current++;

                    // Draw first frame as soon as it loads
                    if (frameIdx === 0 && !firstDrawDone.current) {
                        firstDrawDone.current = true;
                        drawFrame(0);
                    }
                };
                img.onerror = () => {
                    loadedCountRef.current++;
                };
            }
            idx = end;
            if (idx < priority.length) {
                setTimeout(loadBatch, 50); // Stagger batches to avoid network congestion
            }
        }

        loadBatch();
    }, [drawFrame]);

    // Scroll listener
    useEffect(() => {
        function onScroll() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (docHeight <= 0) {
                if (currentFrameRef.current !== 0) {
                    currentFrameRef.current = 0;
                    drawFrame(0);
                }
                return;
            }

            const progress = Math.max(0, Math.min(1, scrollTop / docHeight));
            const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * (FRAME_COUNT - 1)));

            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                drawFrame(frameIndex);
            }
        }

        function onResize() {
            drawFrame(currentFrameRef.current);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [drawFrame]);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 0,
                    pointerEvents: 'none',
                    background: '#050505',
                    opacity: 0.55,
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1,
                    pointerEvents: 'none',
                    background: 'linear-gradient(180deg, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.1) 50%, rgba(5,5,5,0.3) 100%)',
                }}
            />
        </>
    );
}
