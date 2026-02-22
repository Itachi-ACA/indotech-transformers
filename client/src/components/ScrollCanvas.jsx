import { useRef, useEffect, useCallback } from 'react';

const FRAME_COUNT = 224;

export default function ScrollCanvas() {
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(-1);
    const rafIdRef = useRef(null);
    const loadedRef = useRef(false);

    // Preload all frames
    useEffect(() => {
        let loaded = 0;
        const images = new Array(FRAME_COUNT);

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/sequence/frame_${i}.jpg`;
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded === FRAME_COUNT) {
                    imagesRef.current = images;
                    loadedRef.current = true;
                    drawFrame(0);
                }
            };
            images[i] = img;
        }
    }, []);

    // Draw a single frame to canvas
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const img = imagesRef.current[index];
        if (!img || !img.complete || !img.naturalWidth) return;

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

        // Fill background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, bufferW, bufferH);

        // Contain-fit the image
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.min(bufferW / iw, bufferH / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (bufferW - dw) / 2;
        const dy = (bufferH - dh) / 2;

        ctx.globalAlpha = 0.3; // Subtle background
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.globalAlpha = 1.0;
    }, []);

    // Scroll listener — maps scroll position to frame index
    useEffect(() => {
        function onScroll() {
            if (!loadedRef.current) return;

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
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.floor(progress * (FRAME_COUNT - 1))
            );

            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                drawFrame(frameIndex);
            }
        }

        function onResize() {
            if (loadedRef.current && currentFrameRef.current >= 0) {
                drawFrame(currentFrameRef.current);
            }
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
                }}
            />
            {/* Dark overlay for text readability */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1,
                    pointerEvents: 'none',
                    background: 'linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.45) 50%, rgba(5,5,5,0.6) 100%)',
                }}
            />
        </>
    );
}
