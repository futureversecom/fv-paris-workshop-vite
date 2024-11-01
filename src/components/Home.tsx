export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100dvh-6rem-1rem)] flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center mb-6">
          <span className="text-white">Futureverse Workshop</span>
        </h1>
        <div className="flex flex-col items-center justify-center gap-4 uppercase">
          <h2 className="text-2xl tracking-wide  text-white sm:text-[3rem]">
            <span className="font-bold">Paris</span> France
          </h2>
          <div className="text-sm tracking-widest text-slate-400 sm:text-[1.2rem]">
            4th/5th November
          </div>
        </div>
      </div>
    </main>
  );
}
