export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[920px] overflow-hidden"
    >
      <div className="ff-grid absolute inset-0" />

      <div className="ff-blob absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-blue-400/30 blur-3xl" />
      <div
        className="ff-blob absolute -right-20 top-10 h-[380px] w-[380px] rounded-full bg-violet-400/25 blur-3xl"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="ff-blob absolute left-1/3 top-72 h-[360px] w-[360px] rounded-full bg-indigo-300/25 blur-3xl"
        style={{ animationDelay: "-9s" }}
      />

      {/* Fades the bottom into the white page so there is no hard edge */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-white" />
    </div>
  );
}