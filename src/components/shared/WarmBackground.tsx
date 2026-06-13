export function WarmBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[220vh] overflow-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(250,245,234,0.94)_0%,rgba(241,225,201,0.88)_34%,rgba(233,212,183,0.76)_100%)]" />
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12] blur-[0.25px] mix-blend-multiply sm:opacity-[0.15]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1775924544360-7b75b26543ec?mark=https%3A%2F%2Fimages.unsplash.com%2Fopengraph%2Flogo.png&mark-w=64&mark-align=top%2Cleft&mark-pad=50&h=630&w=1200&crop=faces%2Cedges&blend-w=1&blend=000000&blend-mode=normal&blend-alpha=10&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzgxMzc5OTE3fA&ixlib=rb-4.1.0')",
        }}
      />
      <div className="fixed inset-x-0 top-0 h-44 bg-linear-to-b from-[#fffaf1] to-transparent opacity-90" />
      <div
        className="absolute left-1/2 top-[112vh] h-136 w-[min(92vw,68rem)] -translate-x-1/2 bg-contain bg-bottom bg-no-repeat opacity-[0.29] mix-blend-multiply sm:top-[118vh] sm:opacity-[0.13] lg:top-[124vh]"
        style={{ backgroundImage: "url('/elder-couple-overlay.svg')" }}
      />
      <div className="absolute inset-x-0 top-[100vh] h-[120vh] bg-[radial-gradient(circle_at_top,rgba(255,248,236,0.14),rgba(255,248,236,0)_58%)]" />
    </div>
  );
}