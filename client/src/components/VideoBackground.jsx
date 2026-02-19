export default function VideoBackground() {
    return (
        <>
            <video
                className="video-bg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%230a0a0f' width='1920' height='1080'/%3E%3C/svg%3E"
            >
                <source
                    src="/background.mp4"
                    type="video/mp4"
                />
            </video>
            <div className="video-overlay" />
        </>
    );
}
