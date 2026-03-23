import { useEffect, useState } from 'react'

const demoBullets = [
  'AI replies instantly',
  'Understands customer intent',
  'Detects payment screenshots',
  'Works 24/7 without delay',
]

function HomeFeedbackCarousel() {
  const [demoPhase, setDemoPhase] = useState(0)

  useEffect(() => {
    let timeoutId = 0
    const timeline = [
      { phase: 1, delay: 900 },
      { phase: 2, delay: 900 },
      { phase: 3, delay: 1050 },
      { phase: 4, delay: 950 },
      { phase: 5, delay: 900 },
      { phase: 6, delay: 1700 },
      { phase: 0, delay: 900 },
    ]
    let index = 0

    const run = () => {
      const current = timeline[index]
      setDemoPhase(current.phase)

      timeoutId = window.setTimeout(() => {
        index = (index + 1) % timeline.length
        run()
      }, current.delay)
    }

    run()

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section
      className="relative overflow-hidden border-0 px-4 pt-5 pb-8 max-[1280px]:px-3 max-[1280px]:pt-4 max-[1280px]:pb-6 max-[900px]:px-2 max-[900px]:pt-3 max-[900px]:pb-5"
      style={{
        background:
          'radial-gradient(52% 58% at 24% 42%, rgba(177, 76, 255, 0.16), rgba(177, 76, 255, 0) 72%), radial-gradient(50% 46% at 82% 50%, rgba(88, 123, 255, 0.14), rgba(88, 123, 255, 0) 72%), linear-gradient(180deg, #070c18 0%, #060910 100%)',
      }}
      id="demo"
      aria-label="Feature demo"
    >
      <header className="text-center">
        <p className="text-[0.62rem] font-bold tracking-[0.08em] text-[#9ca6c7] uppercase max-[1280px]:text-[0.54rem] max-[900px]:text-[0.46rem]">
          Feature Demo
        </p>
        <h2 className="mt-1 text-[clamp(1.5rem,4vw,2.75rem)] font-extrabold text-[#f2f4ff] max-[1280px]:text-[clamp(1.25rem,3vw,1.9rem)] max-[900px]:text-[1rem]">
          See Replizz Reply Inside Messenger
        </h2>
      </header>

      <div className="mx-auto mt-6 grid max-w-[1040px] grid-cols-[minmax(290px,0.92fr)_minmax(0,1.08fr)] items-center gap-8 max-[960px]:grid-cols-1 max-[960px]:gap-6">
        <article className="relative mx-auto w-[min(340px,84vw)] rounded-[34px] border border-[rgba(145,158,206,0.28)] bg-[rgba(10,15,29,0.72)] p-3 shadow-[0_24px_42px_rgba(7,9,22,0.46)]">
          <span className="pointer-events-none absolute top-[-36px] left-1/2 h-[120px] w-[120px] -translate-x-1/2 rounded-full bg-[rgba(141,107,255,0.2)] blur-3xl" />

          <div className="relative overflow-hidden rounded-[26px] border border-[rgba(161,177,230,0.24)] bg-[linear-gradient(180deg,#10172c_0%,#0d1324_100%)]">
            <div className="flex items-center justify-between border-b border-[rgba(153,167,219,0.18)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#93a4ff] to-[#6c84ff] text-[0.66rem] font-extrabold text-white">
                  RZ
                </span>
                <div>
                  <p className="text-[0.8rem] font-bold text-[#f3f7ff]">Replizz Inbox</p>
                  <p className="text-[0.62rem] text-[#8fa3d8]">Active on Messenger</p>
                </div>
              </div>
              <span className="rounded-full bg-[rgba(106,237,167,0.16)] px-2 py-1 text-[0.56rem] font-bold tracking-[0.08em] text-[#92f0bf] uppercase">
                online
              </span>
            </div>

            <div className="min-h-[382px] space-y-3 bg-[linear-gradient(180deg,rgba(12,18,34,0.96)_0%,rgba(11,17,33,0.92)_100%)] px-3 py-4">
              {demoPhase >= 1 ? (
                <div className="anim-pop flex justify-start">
                  <div className="max-w-[78%] rounded-[18px] rounded-bl-md border border-[rgba(170,183,231,0.22)] bg-[rgba(255,255,255,0.08)] px-3 py-2.5 text-[0.76rem] font-medium text-[#ecf1ff]">
                    <span className="block text-[0.56rem] font-bold tracking-[0.05em] text-[#8da1d8] uppercase">
                      Customer
                    </span>
                    <span className="mt-1 block">&quot;Blue ta available?&quot;</span>
                  </div>
                </div>
              ) : null}

              {demoPhase === 2 ? (
                <div className="anim-pop anim-delay-1 flex justify-end">
                  <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(169,184,238,0.28)] bg-[rgba(79,83,166,0.34)] px-2.5 py-1.5">
                    {[0, 1, 2].map((item) => (
                      <span
                        key={item}
                        className="anim-float-soft h-1.5 w-1.5 rounded-full bg-[#e1e7ff]"
                        style={{ animationDelay: `${item * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {demoPhase >= 3 ? (
                <div className="anim-pop anim-delay-1 flex justify-end">
                  <div className="max-w-[82%] rounded-[18px] rounded-br-md border border-[rgba(141,164,235,0.28)] bg-[rgba(134,144,255,0.2)] px-3 py-2.5 text-[0.76rem] font-medium text-[#f4f6ff]">
                    <span className="block text-[0.56rem] font-bold tracking-[0.05em] text-[#c9d6ff] uppercase">
                      AI
                    </span>
                    <span className="mt-1 block">
                      &quot;Yes, blue is available. Would you like to order?&quot;
                    </span>
                  </div>
                </div>
              ) : null}

              {demoPhase >= 4 ? (
                <div className="anim-pop anim-delay-2 flex justify-start">
                  <div className="max-w-[78%] rounded-[18px] rounded-bl-md border border-[rgba(170,183,231,0.22)] bg-[rgba(255,255,255,0.08)] px-3 py-2.5 text-[0.76rem] font-medium text-[#ecf1ff]">
                    <span className="block text-[0.56rem] font-bold tracking-[0.05em] text-[#8da1d8] uppercase">
                      Customer
                    </span>
                    <span className="mt-1 block">&quot;Delivery koto din?&quot;</span>
                  </div>
                </div>
              ) : null}

              {demoPhase === 5 ? (
                <div className="anim-pop anim-delay-3 flex justify-end">
                  <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(169,184,238,0.28)] bg-[rgba(79,83,166,0.34)] px-2.5 py-1.5">
                    {[0, 1, 2].map((item) => (
                      <span
                        key={item}
                        className="anim-float-soft h-1.5 w-1.5 rounded-full bg-[#e1e7ff]"
                        style={{ animationDelay: `${item * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {demoPhase >= 6 ? (
                <div className="anim-pop anim-delay-3 flex justify-end">
                  <div className="max-w-[84%] rounded-[18px] rounded-br-md border border-[rgba(141,164,235,0.28)] bg-[rgba(134,144,255,0.2)] px-3 py-2.5 text-[0.76rem] font-medium text-[#f4f6ff]">
                    <span className="block text-[0.56rem] font-bold tracking-[0.05em] text-[#c9d6ff] uppercase">
                      AI
                    </span>
                    <span className="mt-1 block">
                      &quot;Delivery takes 2-3 days inside Bangladesh.&quot;
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-[rgba(153,167,219,0.18)] px-3 py-3">
              <div className="rounded-full border border-[rgba(156,172,229,0.22)] bg-[rgba(15,20,36,0.86)] px-4 py-2 text-[0.7rem] text-[#7f92c8]">
                AI is handling the next reply...
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-[rgba(145,159,214,0.24)] bg-[rgba(11,17,34,0.62)] p-6 shadow-[0_20px_36px_rgba(9,12,24,0.34)] max-[900px]:rounded-[18px] max-[900px]:p-4">
          <span className="inline-flex items-center rounded-full border border-[rgba(178,194,241,0.34)] bg-[rgba(15,22,40,0.68)] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.08em] text-[#c4d2f5] uppercase">
            Messenger Automation
          </span>
          <h3 className="mt-4 text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.06] font-bold tracking-[-0.02em] text-[#f3f7ff]">
            Reply to customer questions instantly with brand-aware AI
          </h3>
          <p className="mt-3 max-w-[560px] text-[0.9rem] leading-[1.6] text-[#b1c1e8] max-[900px]:text-[0.76rem]">
            Replizz answers common inbox questions in Bangla or English, keeps the context of the
            conversation, and stays available even when your team is offline.
          </p>

          <ul className="mt-5 grid gap-3" aria-label="Feature explanation bullets">
            {demoBullets.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-[rgba(156,172,229,0.22)] bg-[rgba(12,19,37,0.58)] px-4 py-3 text-[0.84rem] font-semibold text-[#e2e9ff] max-[900px]:text-[0.74rem]"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a180ff] to-[#6f94ff] text-[0.74rem] font-bold text-white shadow-[0_8px_14px_rgba(106,103,236,0.3)]">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default HomeFeedbackCarousel
