const integrationItems = ['Meta', 'Shopify', 'Stripe', 'WooCommerce', 'Telegram', 'Zapier']
const proofMetrics = [
  { value: '64%', label: 'Faster Response Time' },
  { value: '3.2x', label: 'More Qualified Leads' },
  { value: '99.9%', label: 'Inbox Uptime' },
  { value: '41%', label: 'Lower Support Cost' },
]

function HomeProofSection() {
  return (
    <section
      className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-4 max-[960px]:grid-cols-1"
      id="contact"
      aria-label="Social proof and metrics"
    >
      <article
        className="rounded-[28px] border border-[rgba(139,156,216,0.24)] p-5 shadow-[0_20px_36px_rgba(10,12,28,0.38)] max-[900px]:rounded-[18px] max-[900px]:p-4"
        style={{
          background:
            'radial-gradient(300px 180px at 12% 0%, rgba(151, 109, 255, 0.24), rgba(151, 109, 255, 0) 78%), linear-gradient(160deg, #10172d 0%, #131c35 58%, #16203d 100%)',
        }}
      >
        <h3 className="text-[1.45rem] leading-[1.15] font-bold text-[#f3f7ff] max-[900px]:text-[1.06rem]">
          Trusted by fast-growing teams handling thousands of conversations weekly
        </h3>
        <p className="mt-2 max-w-[670px] text-[0.86rem] leading-[1.58] text-[#acbce6] max-[900px]:text-[0.74rem]">
          From e-commerce support to high-intent sales chats, Replizz helps teams respond in one
          place, with smarter routing and cleaner reporting.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 max-[560px]:grid-cols-2">
          {integrationItems.map((item) => (
            <span
              key={item}
              className="rounded-xl border border-[rgba(156,172,229,0.3)] bg-[rgba(13,20,38,0.68)] px-3 py-2 text-center text-[0.72rem] font-semibold text-[#d4defc]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-[rgba(154,171,231,0.28)] bg-[rgba(10,16,31,0.7)] p-3">
          <p className="text-[0.7rem] text-[#a8b7df]">Latest feedback</p>
          <p className="mt-1 text-[0.84rem] leading-[1.55] text-[#e8eeff]">
            “The new workflow helped us cut first reply time from minutes to seconds, without
            burning our support team.”
          </p>
          <p className="mt-2 text-[0.66rem] font-semibold tracking-[0.05em] text-[#92a6dd] uppercase">
            Operations Lead, D2C Brand
          </p>
        </div>
      </article>

      <article
        className="rounded-[28px] border border-[rgba(141,158,220,0.26)] p-4 shadow-[0_18px_32px_rgba(10,12,28,0.34)] max-[900px]:rounded-[18px]"
        style={{
          background:
            'radial-gradient(220px 150px at 86% 12%, rgba(148, 107, 255, 0.27), rgba(148, 107, 255, 0) 76%), linear-gradient(155deg, #10172d 0%, #141d36 57%, #17213f 100%)',
        }}
      >
        <h4 className="text-[1.05rem] font-bold text-[#f0f5ff] max-[900px]:text-[0.9rem]">
          Performance Snapshot
        </h4>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {proofMetrics.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[rgba(157,174,231,0.24)] bg-[rgba(10,17,33,0.72)] px-2.5 py-3"
            >
              <p className="text-[1.25rem] leading-none font-extrabold text-[#f4f8ff] max-[900px]:text-[1rem]">
                {item.value}
              </p>
              <p className="mt-1 text-[0.66rem] font-semibold tracking-[0.05em] text-[#9eb0e0] uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default HomeProofSection
