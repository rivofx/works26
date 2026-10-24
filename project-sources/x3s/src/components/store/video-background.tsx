export function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-black">
      <video className="h-full w-full object-cover opacity-35 saturate-125" autoPlay muted loop playsInline preload="metadata" poster="/products/cobrax3s-shadow-core-hoodie.png">
        <source src="/banners/cobrax3s-background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(141,255,42,.18),transparent_30%),linear-gradient(180deg,rgba(0,0,0,.35),#050505_82%)]" />
    </div>
  );
}
