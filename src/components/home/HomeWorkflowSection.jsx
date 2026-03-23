const workflowSteps = [
  {
    id: '01',
    title: 'Connect Channels',
    text: 'Add Facebook pages, Instagram DM, and web chat in one workspace in minutes.',
  },
  {
    id: '02',
    title: 'Set Playbooks',
    text: 'Create routing rules, priority labels, and saved replies by intent and language.',
  },
  {
    id: '03',
    title: 'Scale Replies',
    text: 'Use AI suggestions and human approvals to keep speed high and quality consistent.',
  },
]

function HomeWorkflowSection() {
  return (
    <section
      className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-4 rounded-[30px] border border-[rgba(141,159,218,0.24)] p-5 shadow-[0_22px_38px_rgba(12,14,31,0.38)] max-[960px]:grid-cols-1 max-[900px]:rounded-[18px] max-[900px]:p-3"
      style={{
        background:
          'radial-gradient(250px 160px at 7% 90%, rgba(146, 104, 255, 0.2), rgba(146, 104, 255, 0) 72%), radial-gradient(280px 180px at 93% 8%, rgba(100, 148, 255, 0.14), rgba(100, 148, 255, 0) 75%), linear-gradient(160deg, #10162b 0%, #141b33 55%, #19223f 100%)',
      }}
      id="about"
      aria-label="Workflow steps"
    >
      <article className="relative min-h-[370px] overflow-hidden rounded-[24px] border border-[rgba(149,167,228,0.28)] bg-[rgba(9,14,28,0.7)] max-[900px]:min-h-[280px] max-[900px]:rounded-[16px]">
        <img className="h-full w-full object-cover object-left-top opacity-90" src="/flat.png" alt="Replizz workspace preview" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(8,12,25,0.85)] via-[rgba(8,12,25,0.1)] to-[rgba(8,12,25,0.12)]" />

        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-[rgba(167,181,232,0.28)] bg-[rgba(11,17,34,0.75)] p-3">
          <p className="text-[0.68rem] font-semibold tracking-[0.08em] text-[#b8c6ed] uppercase">
            Live Status
          </p>
          <div className="mt-1 flex items-center justify-between">
            <strong className="text-[1.1rem] text-[#f3f7ff]">12 Agents Online</strong>
            <span className="rounded-full bg-[rgba(106,237,167,0.18)] px-2 py-1 text-[0.64rem] font-bold text-[#9ff3c8]">
              Healthy SLA
            </span>
          </div>
        </div>
      </article>

      <article className="px-1">
        <span className="inline-flex items-center rounded-full border border-[rgba(178,194,241,0.34)] bg-[rgba(15,22,40,0.68)] px-3 py-1 text-[0.72rem] font-semibold tracking-[0.08em] text-[#c4d2f5] uppercase">
          Workflow
        </span>
        <h2 className="mt-3 text-[clamp(1.9rem,3.5vw,3.2rem)] leading-[1.08] font-bold tracking-[-0.02em] text-[#f4f7ff]">
          Built to Handle High-Volume Conversations Smoothly
        </h2>
        <p className="mt-3 max-w-[650px] text-[0.92rem] leading-[1.58] text-[#afbee6] max-[900px]:text-[0.76rem]">
          Replace scattered chats with a system your team can operate confidently. Every step is
          visible, measurable, and optimized for conversion.
        </p>

        <div className="mt-4 grid gap-2.5 max-[900px]:mt-3">
          {workflowSteps.map((step) => (
            <article
              key={step.id}
              className="flex gap-3 rounded-[16px] border border-[rgba(145,162,220,0.25)] bg-[rgba(12,19,37,0.62)] p-3"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#a180ff] to-[#6f94ff] text-[0.78rem] font-extrabold text-white shadow-[0_8px_14px_rgba(106,103,236,0.35)]">
                {step.id}
              </span>
              <div>
                <h3 className="text-[1rem] font-bold text-[#edf2ff] max-[900px]:text-[0.84rem]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[0.8rem] leading-[1.5] text-[#a6b6e1] max-[900px]:text-[0.7rem]">
                  {step.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}

export default HomeWorkflowSection
