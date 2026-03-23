const aboutMainImage =
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80'
const aboutSubImage =
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=700&q=80'

function HomeAbout({ points }) {
  return (
    <section
      className="relative mt-[1.1rem] grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-5 overflow-hidden rounded-[32px] border border-[rgba(140,154,211,0.24)] p-6 shadow-[0_22px_42px_rgba(11,13,29,0.38)] max-[1280px]:grid-cols-1 max-[1280px]:p-5 max-[900px]:gap-3 max-[900px]:rounded-[20px] max-[900px]:p-3"
      style={{
        background:
          'radial-gradient(300px 220px at 10% 90%, rgba(150, 112, 255, 0.2), rgba(150, 112, 255, 0) 72%), radial-gradient(320px 230px at 88% 8%, rgba(98, 143, 255, 0.15), rgba(98, 143, 255, 0) 74%), linear-gradient(155deg, #0f1428 0%, #141b33 56%, #17203d 100%)',
      }}
      id="about"
      aria-label="About company"
    >
      <span className="pointer-events-none absolute top-[-120px] left-[28%] h-[220px] w-[220px] rounded-full bg-[rgba(140,98,255,0.22)] blur-3xl" />
      <div className="relative min-h-[560px] max-[1280px]:min-h-[460px] max-[900px]:min-h-[340px]">
        <div className="h-[500px] w-[min(100%,510px)] overflow-hidden rounded-3xl border border-[rgba(157,173,229,0.34)] shadow-[0_18px_36px_rgba(10,13,28,0.46)] max-[1280px]:h-[400px] max-[1280px]:rounded-[20px] max-[900px]:h-[280px] max-[900px]:rounded-[16px]">
          <img
            className="h-full w-full object-cover"
            src={aboutMainImage}
            alt="Business professional smiling with card"
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-0 left-0 h-[230px] w-[min(60%,310px)] overflow-hidden rounded-3xl border border-[rgba(157,173,229,0.34)] shadow-[0_16px_30px_rgba(10,13,28,0.46)] max-[1280px]:h-[180px] max-[1280px]:rounded-[18px] max-[900px]:h-[130px] max-[900px]:w-[62%] max-[900px]:rounded-xl">
          <img className="h-full w-full object-cover" src={aboutSubImage} alt="Customer using payment card" loading="lazy" />
        </div>
        <div className="absolute bottom-[18px] left-[44%] flex min-h-[96px] min-w-[150px] -translate-x-1/2 flex-col items-center justify-center rounded-full border border-[rgba(212,220,255,0.3)] bg-gradient-to-br from-[#8f62ff] to-[#6f86ff] px-4 py-3 text-white shadow-[0_20px_34px_rgba(106,92,202,0.45)] max-[1280px]:bottom-3 max-[1280px]:min-h-[82px] max-[1280px]:min-w-[130px] max-[900px]:bottom-2 max-[900px]:left-[48%] max-[900px]:min-h-[70px] max-[900px]:min-w-[100px] max-[900px]:px-2">
          <strong className="text-[1.7rem] leading-none font-extrabold max-[1280px]:text-[1.25rem] max-[900px]:text-[0.95rem]">
            1,485+
          </strong>
          <span className="mt-0.5 text-[0.76rem] font-semibold opacity-95 max-[900px]:text-[0.5rem]">
            Trusted Clients
          </span>
        </div>
      </div>

      <div>
        <p className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-[#b7c3ea] max-[900px]:text-[0.66rem]">
          <span className="h-2 w-2 rounded-full bg-[#9a7dff]" />
          About Company
        </p>
        <h2 className="mt-3 text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[1.08] font-bold tracking-[-0.01em] text-[#f4f7ff] max-[900px]:text-[1.32rem]">
          We Are The Best Online Payment Gateway Agency
        </h2>
        <p className="mt-3 text-[0.96rem] leading-[1.57] text-[#b4c0e6] max-[1280px]:text-[0.84rem] max-[900px]:text-[0.74rem]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris minim veniam.
        </p>

        <div className="mt-4 flex flex-col gap-3 max-[900px]:mt-3 max-[900px]:gap-2">
          {points.map((point) => (
            <article key={point.title} className="flex items-start gap-3 rounded-2xl border border-[rgba(142,159,219,0.24)] bg-[rgba(12,19,38,0.62)] p-3">
              <span className="inline-flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border border-[rgba(170,184,238,0.35)] bg-gradient-to-br from-[#9f7dff] to-[#749cff] text-[1.1rem] text-white shadow-[0_10px_16px_rgba(109,99,232,0.32)] max-[900px]:h-7 max-[900px]:w-7 max-[900px]:text-[0.7rem]">
                {point.icon}
              </span>
              <div>
                <h3 className="text-[1.6rem] leading-[1.05] font-bold text-[#edf2ff] max-[900px]:text-[0.95rem]">
                  {point.title}
                </h3>
                <p className="mt-1 max-w-[670px] text-[0.93rem] leading-[1.45] text-[#a9b7df] max-[1280px]:text-[0.82rem] max-[900px]:text-[0.7rem]">
                  {point.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeAbout
