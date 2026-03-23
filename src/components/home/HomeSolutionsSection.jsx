import { Link } from 'react-router-dom'

const channelItems = ['Messenger', 'Instagram', 'WhatsApp', 'Website Chat']
const automationItems = [
  'AI Auto Reply',
  'Lead Qualifier',
  'Follow-up Sequence',
  'Order Update Bot',
  'FAQ Knowledge Brain',
  'Smart Intent Tagging',
]

function HomeSolutionsSection() {
  return (
    <section
      className="mt-2 grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-4 max-[960px]:grid-cols-1"
      id="info"
      aria-label="Replizz feature overview"
    >
      <article
        className="relative overflow-hidden rounded-[28px] border border-[rgba(137,153,216,0.3)] p-6 text-white shadow-[0_20px_38px_rgba(11,13,29,0.42)] max-[900px]:rounded-[18px] max-[900px]:p-4"
        style={{
          background:
            'radial-gradient(260px 170px at 8% 92%, rgba(149, 104, 255, 0.32), rgba(149, 104, 255, 0) 70%), radial-gradient(300px 190px at 96% 4%, rgba(95, 145, 255, 0.23), rgba(95, 145, 255, 0) 74%), linear-gradient(150deg, #11162b 0%, #1a2040 56%, #1d2450 100%)',
        }}
      >
        <span className="inline-flex items-center rounded-full border border-[rgba(179,194,243,0.35)] bg-[rgba(18,23,40,0.7)] px-3 py-1 text-[0.72rem] font-semibold tracking-[0.08em] text-[#c9d4f5] uppercase">
          Core Features
        </span>
        <h2 className="mt-3 max-w-[590px] text-[clamp(2rem,3.2vw,3.35rem)] leading-[1.08] font-bold tracking-[-0.02em] text-[#f5f8ff]">
          One Inbox to Sell, Support, and Follow Up Faster
        </h2>
        <p className="mt-3 max-w-[640px] text-[0.95rem] leading-[1.6] text-[#b3c1e7] max-[900px]:text-[0.78rem]">
          Replizz brings your social DMs and website chat into one response workflow. Assign
          instantly, auto-route by intent, and close more conversations without losing tone.
        </p>

        <ul className="mt-4 grid gap-2.5 max-[900px]:mt-3">
          <li className="flex items-center gap-2.5 text-[0.9rem] text-[#dbe4ff] max-[900px]:text-[0.74rem]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#9f7dff] to-[#7a9fff] text-[0.8rem] font-bold text-white shadow-[0_8px_14px_rgba(113,108,240,0.32)]">
              ✓
            </span>
            Agent handoff with full customer context
          </li>
          <li className="flex items-center gap-2.5 text-[0.9rem] text-[#dbe4ff] max-[900px]:text-[0.74rem]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#9f7dff] to-[#7a9fff] text-[0.8rem] font-bold text-white shadow-[0_8px_14px_rgba(113,108,240,0.32)]">
              ✓
            </span>
            AI suggestions trained on your own brand responses
          </li>
          <li className="flex items-center gap-2.5 text-[0.9rem] text-[#dbe4ff] max-[900px]:text-[0.74rem]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#9f7dff] to-[#7a9fff] text-[0.8rem] font-bold text-white shadow-[0_8px_14px_rgba(113,108,240,0.32)]">
              ✓
            </span>
            Real-time SLA tracking for response performance
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {channelItems.map((channel) => (
            <span
              key={channel}
              className="rounded-full border border-[rgba(164,178,230,0.36)] bg-[rgba(16,21,37,0.64)] px-3 py-1.5 text-[0.72rem] font-semibold text-[#d2ddff]"
            >
              {channel}
            </span>
          ))}
        </div>

        <Link
          className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#a07fff] to-[#6e93ff] px-6 py-2.5 text-[0.86rem] font-bold text-white no-underline shadow-[0_14px_24px_rgba(102,109,231,0.34)] max-[900px]:mt-4 max-[900px]:px-4 max-[900px]:py-2"
          to="/overview"
        >
          Open Dashboard
        </Link>
      </article>

      <article
        className="rounded-[28px] border border-[rgba(140,158,221,0.28)] p-5 shadow-[0_18px_34px_rgba(11,13,29,0.35)] max-[900px]:rounded-[18px] max-[900px]:p-4"
        style={{
          background:
            'radial-gradient(220px 140px at 84% -8%, rgba(145, 102, 255, 0.22), rgba(145, 102, 255, 0) 76%), linear-gradient(155deg, #0f152b 0%, #141c36 57%, #182041 100%)',
        }}
      >
        <h3 className="text-[1.3rem] font-bold tracking-[-0.01em] text-[#f2f6ff] max-[900px]:text-[1rem]">
          Automation Modules
        </h3>
        <p className="mt-1 text-[0.8rem] text-[#aebde8]">Toggle what your team needs right now.</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
          {automationItems.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-[rgba(159,176,228,0.28)] bg-[rgba(16,22,40,0.68)] px-3 py-2 text-[0.75rem] font-semibold text-[#d8e2ff]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-[rgba(151,168,227,0.28)] bg-[rgba(12,18,34,0.66)] p-3">
          <div className="flex items-center justify-between text-[0.74rem] text-[#b6c4eb]">
            <span>Avg. first response</span>
            <strong className="text-[#eff4ff]">22s</strong>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-[rgba(82,98,150,0.4)]">
            <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[#a281ff] to-[#6f93ff]" />
          </div>
          <div className="mt-2 text-[0.7rem] text-[#8fa2d7]">
            +31% faster than previous workflow this month
          </div>
        </div>
      </article>
    </section>
  )
}

export default HomeSolutionsSection
