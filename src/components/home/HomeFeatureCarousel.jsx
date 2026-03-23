import { motion as _motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { revealItem, sectionReveal, staggerParent } from './motionPresets'

const slides = [
  {
    title: 'AI Auto Replies',
    text: 'Automatically reply to common customer questions in seconds.',
    icon: '⚡',
    prompt: 'AI auto-replies for your Facebook inbox',
    visual: 'linear-gradient(145deg, #f6d26c 0%, #f2896d 48%, #4f80ff 100%)',
  },
  {
    title: 'Payment Screenshot Detection',
    text: 'Detect payment screenshots instantly and trigger verification.',
    icon: '🧾',
    prompt: 'Detect payment proof and verify faster',
    visual: 'linear-gradient(145deg, #9dd8ff 0%, #69b7ff 40%, #7d6fff 100%)',
  },
  {
    title: 'Smart Context Memory',
    text: 'Replizz remembers previous messages for natural conversations.',
    icon: '🧠',
    prompt: 'Keep context from earlier customer messages',
    visual: 'linear-gradient(145deg, #ffc7e3 0%, #f79797 42%, #7f78ff 100%)',
  },
  {
    title: 'Moderator Handoff',
    text: 'When a human joins the chat, AI pauses automatically.',
    icon: '🤝',
    prompt: 'Human handoff with automatic AI pause',
    visual: 'linear-gradient(145deg, #bcffc8 0%, #8fd5a8 40%, #7598ff 100%)',
  },
  {
    title: 'Custom AI Instructions',
    text: 'Train the assistant using your own business rules.',
    icon: '🛠️',
    prompt: 'Train AI with business-specific rules',
    visual: 'linear-gradient(145deg, #d9cdfc 0%, #a48bff 45%, #79a0ff 100%)',
  },
]

function HomeFeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(2)
  const touchStartX = useRef(null)

  const carouselItems = useMemo(() => {
    const length = slides.length

    return slides.map((item, index) => {
      const rawOffset = index - activeIndex
      let offset = rawOffset

      if (offset > length / 2) {
        offset -= length
      } else if (offset < -length / 2) {
        offset += length
      }

      return {
        ...item,
        offset,
      }
    })
  }, [activeIndex])

  const normalizeIndex = (value) => {
    const length = slides.length
    return ((value % length) + length) % length
  }

  const goPrev = () => setActiveIndex((prev) => normalizeIndex(prev - 1))
  const goNext = () => setActiveIndex((prev) => normalizeIndex(prev + 1))

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 30) {
      delta > 0 ? goPrev() : goNext()
    }
    touchStartX.current = null
  }

  const activeSlide = slides[activeIndex]

  return (
    <_motion.section
      className="relative overflow-hidden px-6 py-12 max-[1280px]:px-5 max-[900px]:px-3 max-[900px]:py-9"
      style={{
        background:
          'radial-gradient(80% 74% at 50% 108%, rgba(132, 92, 255, 0.24), rgba(132, 92, 255, 0) 60%), linear-gradient(180deg, #080d1d 0%, #090f20 100%)',
      }}
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      aria-label="Feature highlights carousel"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[rgba(146,161,218,0.24)]" />

      <_motion.header className="mx-auto max-w-[760px] text-center" variants={staggerParent(0.1, 0.08)}>
        <_motion.p
          variants={revealItem}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(167,182,232,0.32)] bg-[rgba(16,22,40,0.64)] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.09em] text-[#c3d0f3] uppercase"
        >
          Feature Highlights
        </_motion.p>
        <_motion.h3
          variants={revealItem}
          className="mt-3 text-[clamp(1.8rem,3.8vw,3rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-[#f4f8ff]"
        >
          Built for Facebook Page Conversations That Never Stop
        </_motion.h3>
      </_motion.header>

      <div className="relative mx-auto mt-7 flex max-w-[1100px] items-center gap-3 max-[900px]:gap-2">
        <button
          type="button"
          aria-label="Scroll left"
          className="grid h-12 w-12 place-items-center rounded-full border border-[rgba(172,187,236,0.54)] bg-[rgba(12,18,34,0.86)] text-[1.6rem] leading-none font-bold text-[#dfe8ff] shadow-[0_12px_20px_rgba(7,9,22,0.36)] transition-transform duration-200 hover:-translate-y-0.5 max-[900px]:h-10 max-[900px]:w-10 max-[900px]:text-[1.3rem]"
          onClick={goPrev}
        >
          ‹
        </button>

        <div
          className="relative grid min-h-[520px] w-full place-items-center overflow-hidden rounded-[26px] border border-[rgba(156,172,229,0.28)] bg-[rgba(8,13,27,0.72)] px-3 py-6 max-[900px]:min-h-[450px]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(140,160,220,0.2) 1px, transparent 0), radial-gradient(220px 180px at 50% 86%, rgba(120,86,255,0.22), rgba(120,86,255,0))',
            backgroundSize: '20px 20px, auto',
          }}
        >
          <_motion.div
            key={activeSlide.prompt}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="absolute top-8 left-1/2 z-[14] w-[min(350px,88%)] -translate-x-1/2 rounded-[16px] border border-[rgba(208,219,255,0.6)] bg-[rgba(17,22,36,0.94)] px-5 py-3 shadow-[0_0_0_2px_rgba(181,146,255,0.12),0_16px_28px_rgba(7,10,22,0.48)]"
          >
            <p className="text-[1.16rem] leading-[1.08] font-semibold text-[#f2f6ff] max-[900px]:text-[0.94rem]">
              {activeSlide.prompt}
            </p>
          </_motion.div>

          <span className="pointer-events-none absolute top-[95px] left-1/2 z-[13] h-[12px] w-[12px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_2px_rgba(180,198,255,0.26)]" />
          <span className="pointer-events-none absolute top-[107px] left-1/2 z-[12] h-[94px] w-px -translate-x-1/2 bg-[rgba(225,234,255,0.72)]" />
          <span className="pointer-events-none absolute top-[198px] left-1/2 z-[13] h-[14px] w-[14px] -translate-x-1/2 rounded-full border border-[rgba(195,212,255,0.72)] bg-[rgba(255,255,255,0.95)]" />

          <div className="relative mt-12 h-[280px] w-full max-w-[760px] max-[900px]:h-[250px]">
            {carouselItems.map((item) => {
              const isVisible = Math.abs(item.offset) <= 1
              const distance = Math.min(Math.abs(item.offset), 2)
              const cardStyle = {
                transform: `translateX(${item.offset * 212}px) rotate(${item.offset * 8}deg) scale(${1 - distance * 0.08})`,
                opacity: isVisible ? 1 - distance * 0.22 : 0,
                zIndex: 12 - distance,
                boxShadow:
                  item.offset === 0
                    ? '0 30px 42px rgba(5,8,18,0.58), 0 0 0 1px rgba(193,207,250,0.24)'
                    : '0 20px 30px rgba(5,8,18,0.5)',
              }

              return (
                <_motion.article
                  key={item.title}
                  className={`absolute left-1/2 top-1/2 h-[248px] w-[228px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[26px] border border-[rgba(204,216,255,0.42)] bg-[#11182a] text-left transition-[transform,opacity,box-shadow] duration-[420ms] max-[900px]:h-[210px] max-[900px]:w-[186px] max-[900px]:rounded-[20px] ${isVisible ? '' : 'pointer-events-none'}`}
                  style={cardStyle}
                  onClick={() => setActiveIndex(normalizeIndex(activeIndex + item.offset))}
                >
                  <div className="h-[152px] p-3 max-[900px]:h-[124px]">
                    <div
                      className="flex h-full w-full items-end rounded-[18px] border border-[rgba(243,247,255,0.34)] p-3"
                      style={{ background: item.visual }}
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(9,13,27,0.42)] text-[1.24rem] text-white shadow-[0_8px_16px_rgba(8,11,24,0.36)]">
                        {item.icon}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <h4 className="line-clamp-2 text-[0.92rem] leading-[1.22] font-bold text-[#f1f6ff] max-[900px]:text-[0.8rem]">
                      {item.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-[0.74rem] leading-[1.42] text-[#c2cfef] max-[900px]:text-[0.68rem]">
                      {item.text}
                    </p>
                  </div>
                </_motion.article>
              )
            })}
          </div>

          <div className="absolute right-6 bottom-9 z-[14] flex items-center gap-2 max-[900px]:hidden">
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-[18px] border border-[rgba(202,214,255,0.34)] bg-[rgba(17,22,37,0.88)] text-[1.3rem] text-[#e5ecff]"
              aria-label="Expand card"
            >
              ↗
            </button>
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-[18px] border border-[rgba(202,214,255,0.34)] bg-[rgba(17,22,37,0.88)] text-[1.2rem] text-[#e5ecff]"
              aria-label="Inspect card"
            >
              ⌕
            </button>
          </div>

          <div className="absolute left-5 bottom-6 z-[14] flex min-h-[56px] items-center gap-3 rounded-[18px] border border-[rgba(190,203,250,0.28)] bg-[linear-gradient(135deg,rgba(32,16,64,0.88)_0%,rgba(21,16,40,0.9)_100%)] px-3 pr-4 shadow-[0_16px_28px_rgba(7,9,22,0.44)] max-[900px]:left-3 max-[900px]:right-3 max-[900px]:min-h-[50px]">
            <span className="text-[0.84rem] text-[#ccd8fa] max-[900px]:text-[0.72rem]">Describe your reply flow...</span>
            <span className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(227,149,255,0.6)] bg-[linear-gradient(135deg,#bd4fff_0%,#7d54ff_100%)] text-[0.9rem] text-white">
              ↑
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll right"
          className="grid h-12 w-12 place-items-center rounded-full border border-[rgba(172,187,236,0.54)] bg-[rgba(12,18,34,0.86)] text-[1.6rem] leading-none font-bold text-[#dfe8ff] shadow-[0_12px_20px_rgba(7,9,22,0.36)] transition-transform duration-200 hover:-translate-y-0.5 max-[900px]:h-10 max-[900px]:w-10 max-[900px]:text-[1.3rem]"
          onClick={goNext}
        >
          ›
        </button>
      </div>
    </_motion.section>
  )
}

export default HomeFeatureCarousel
