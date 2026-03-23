function HomeHighlights({ checks }) {
  return (
    <section
      className="relative z-[4] mt-[0.4rem] grid grid-cols-[minmax(365px,0.9fr)_minmax(0,1.45fr)] gap-4 max-[1280px]:mt-4 max-[1280px]:grid-cols-[minmax(290px,0.95fr)_minmax(0,1.08fr)] max-[900px]:grid-cols-1"
      id="info"
      aria-label="Support highlights"
    >
      <article
        className="relative overflow-hidden rounded-[30px] border border-[rgba(144,159,219,0.28)] p-6 text-white shadow-[0_20px_40px_rgba(12,14,31,0.42)] max-[1280px]:rounded-[20px] max-[1280px]:p-4 max-[900px]:rounded-[16px] max-[900px]:p-3"
        style={{
          background:
            'radial-gradient(220px 170px at 12% 92%, rgba(171, 126, 255, 0.34), rgba(171, 126, 255, 0) 72%), radial-gradient(240px 180px at 88% 8%, rgba(116, 154, 255, 0.2), rgba(116, 154, 255, 0) 76%), linear-gradient(145deg, #12172b 0%, #1a1f3b 55%, #262257 100%)',
        }}
      >
        <span className="pointer-events-none absolute top-[-95px] right-[-80px] h-[190px] w-[190px] rounded-full bg-[rgba(150,108,255,0.3)] blur-3xl" />
        <h2 className="relative z-[1] text-[2.18rem] leading-[1.08] font-bold tracking-[-0.01em] text-[#f7f8ff] max-[1280px]:text-[1.75rem] max-[900px]:text-[1.25rem]">
          Always Update Every Day
        </h2>
        <p className="relative z-[1] mt-3 max-w-[95%] text-[0.94rem] leading-[1.5] text-[rgba(219,226,255,0.9)] max-[1280px]:text-[0.82rem] max-[900px]:mt-2 max-[900px]:text-[0.72rem]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit elit tellus luctus nec
          ullamcorper.
        </p>
        <form
          className="relative z-[1] mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2 max-[900px]:mt-3"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <input
            className="min-h-[51px] rounded-full border border-[rgba(160,180,235,0.34)] bg-[rgba(15,20,37,0.72)] px-4 text-[0.9rem] text-white placeholder:text-[rgba(194,208,250,0.74)] focus:border-[rgba(176,198,255,0.62)] focus:outline-none max-[1280px]:min-h-[44px] max-[1280px]:text-[0.82rem] max-[900px]:min-h-10 max-[900px]:text-[0.74rem]"
            type="email"
            placeholder="Your Email"
            aria-label="Your email"
          />
          <button
            className="min-h-[51px] rounded-full bg-gradient-to-br from-[#9f7dff] to-[#6f93ff] px-6 text-[0.9rem] font-bold text-white shadow-[0_12px_18px_rgba(112,106,242,0.34)] max-[1280px]:min-h-[44px] max-[1280px]:px-5 max-[1280px]:text-[0.82rem] max-[900px]:min-h-10 max-[900px]:px-4 max-[900px]:text-[0.74rem]"
            type="submit"
          >
            Request
          </button>
        </form>
      </article>

      <article
        className="grid grid-cols-[minmax(236px,1fr)_minmax(0,1.2fr)] gap-4 overflow-hidden rounded-[30px] border border-[rgba(141,156,213,0.24)] p-5 shadow-[0_20px_40px_rgba(12,14,31,0.38)] max-[1280px]:rounded-[20px] max-[1280px]:p-4 max-[900px]:rounded-[16px] max-[900px]:grid-cols-1 max-[900px]:p-3"
        style={{
          background:
            'radial-gradient(220px 140px at 88% 0%, rgba(142, 106, 255, 0.25), rgba(142, 106, 255, 0) 75%), linear-gradient(150deg, #0f152b 0%, #151d37 55%, #172344 100%)',
        }}
      >
        <ul className="grid gap-2.5" aria-label="Key supports">
          {checks.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[0.93rem] font-medium text-[#d6defa] max-[1280px]:text-[0.82rem] max-[900px]:text-[0.74rem]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#9f7dff] to-[#7ca0ff] text-[0.76rem] font-bold text-white shadow-[0_8px_14px_rgba(114,109,242,0.3)] max-[900px]:h-4 max-[900px]:w-4 max-[900px]:text-[0.67rem]">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div>
          <h2 className="text-[clamp(2rem,3vw,3.1rem)] leading-[1.08] font-bold tracking-[-0.01em] text-[#f4f7ff] max-[900px]:text-[1.18rem]">
            How Can I Help You?
          </h2>
          <p className="mt-3 text-[0.95rem] leading-[1.55] text-[#b7c2e7] max-[1280px]:text-[0.82rem] max-[900px]:mt-2 max-[900px]:text-[0.73rem]">
            Lorem ipsum dolor sit amet, consect adipisci elit, sed do eiusmod tempor incididunt
            labore et dolore magna aliqua consectetur.
          </p>
          <a
            href="#contact"
            className="mt-3 inline-flex items-center gap-1 text-[0.95rem] font-bold text-[#9f84ff] no-underline after:content-['→'] max-[1280px]:text-[0.82rem] max-[900px]:text-[0.73rem]"
          >
            Read More
          </a>
        </div>
      </article>
    </section>
  )
}

export default HomeHighlights
