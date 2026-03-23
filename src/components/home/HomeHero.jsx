import { AnimatePresence, motion as _motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { revealItem, sectionReveal, staggerParent } from './motionPresets'

function ChatPreviewContent({ chatPhase }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.58rem] font-bold tracking-[0.08em] text-[#93a8e2] uppercase">
            Messenger Preview
          </p>
          <p className="mt-1 text-[0.86rem] font-semibold text-[#f3f7ff]">Replizz Page AI</p>
        </div>
        <span className="rounded-full bg-[rgba(98,225,163,0.16)] px-2 py-1 text-[0.58rem] font-bold tracking-[0.08em] text-[#8ef1bb] uppercase">
          Live
        </span>
      </div>

      <div className="mt-3 grid gap-2.5">
        <AnimatePresence mode="popLayout">
          {chatPhase >= 1 ? (
            <_motion.div
              key="chat-user"
              className="max-w-[86%] rounded-[18px] rounded-bl-md border border-[rgba(177,190,236,0.28)] bg-[rgba(255,255,255,0.08)] px-3 py-2 text-[0.74rem] font-medium text-[#ecf1ff]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.32 }}
            >
              <span className="block text-[0.58rem] font-bold tracking-[0.06em] text-[#9fb2e9] uppercase">
                Customer
              </span>
              <span className="mt-1 block">Price koto?</span>
            </_motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {chatPhase === 2 ? (
            <_motion.div
              key="chat-typing"
              className="ml-auto inline-flex w-fit items-center gap-1 rounded-full border border-[rgba(169,184,238,0.28)] bg-[rgba(79,83,166,0.34)] px-2.5 py-1.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              aria-label="AI typing"
            >
              {[0, 1, 2].map((item) => (
                <_motion.span
                  key={item}
                  className="h-1.5 w-1.5 rounded-full bg-[#e1e7ff]"
                  animate={{ opacity: [0.28, 1, 0.28], y: [0, -2, 0] }}
                  transition={{ duration: 0.86, repeat: Number.POSITIVE_INFINITY, delay: item * 0.13 }}
                />
              ))}
            </_motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {chatPhase === 3 ? (
            <_motion.div
              key="chat-ai"
              className="ml-auto max-w-[92%] rounded-[18px] rounded-br-md border border-[rgba(141,164,235,0.32)] bg-[rgba(134,144,255,0.22)] px-3 py-2 text-[0.74rem] font-medium text-[#f4f6ff]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <span className="block text-[0.58rem] font-bold tracking-[0.06em] text-[#cbd7ff] uppercase">
                Page AI
              </span>
              <span className="mt-1 block">Price is 850 taka. Delivery 2-3 days.</span>
            </_motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[rgba(167,181,232,0.22)] bg-[rgba(8,13,27,0.52)] px-3 py-2">
        <span className="text-[0.62rem] font-semibold text-[#b9c8ef]">Auto reply active</span>
        <span className="text-[0.62rem] font-semibold text-[#f4f7ff]">Facebook Inbox</span>
      </div>
    </>
  )
}

function HomeHero() {
  const heroRef = useRef(null)
  const [parallaxEnabled, setParallaxEnabled] = useState(false)
  const [chatPhase, setChatPhase] = useState(0)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 62, damping: 19, mass: 0.78 })
  const smoothY = useSpring(pointerY, { stiffness: 62, damping: 19, mass: 0.78 })

  const slowX = useTransform(smoothX, (value) => value * 18)
  const slowY = useTransform(smoothY, (value) => value * 14)
  const mediumX = useTransform(smoothX, (value) => value * 28)
  const mediumY = useTransform(smoothY, (value) => value * 24)
  const fastX = useTransform(smoothX, (value) => value * 36)
  const fastY = useTransform(smoothY, (value) => value * 30)

  useEffect(() => {
    const media = window.matchMedia('(pointer:fine) and (min-width: 901px)')
    const update = () => setParallaxEnabled(media.matches)

    update()

    media.addEventListener('change', update)
    return () => {
      media.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    let timeoutId = 0
    const timeline = [
      { phase: 0, delay: 420 },
      { phase: 1, delay: 1500 },
      { phase: 2, delay: 1200 },
      { phase: 3, delay: 2300 },
    ]
    let index = 0

    const run = () => {
      const current = timeline[index]
      setChatPhase(current.phase)

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

  const handleMove = (event) => {
    if (!parallaxEnabled || !heroRef.current) {
      return
    }

    const rect = heroRef.current.getBoundingClientRect()
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5

    pointerX.set(normalizedX)
    pointerY.set(normalizedY)
  }

  const resetParallax = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const layerStyle = (x, y) =>
    parallaxEnabled
      ? {
          x,
          y,
        }
      : undefined

  return (
    <_motion.section
      ref={heroRef}
      className="relative flex min-h-[620px] flex-col items-center overflow-hidden border-0 px-5 pt-9 pb-8 text-center max-[1280px]:min-h-[550px] max-[1280px]:px-4 max-[1280px]:pt-8 max-[1280px]:pb-7 max-[900px]:min-h-[430px] max-[900px]:px-3 max-[900px]:pt-4 max-[900px]:pb-5"
      style={{
        background:
          'radial-gradient(125% 90% at 50% 108%, rgba(198, 138, 255, 0.54), rgba(198, 138, 255, 0) 48%), linear-gradient(180deg, #05070f 0%, #1a0f47 26%, #4d22b6 70%, #7f58f4 100%)',
      }}
      id="services"
      aria-label="Hero section"
      onMouseMove={handleMove}
      onMouseLeave={resetParallax}
      variants={sectionReveal}
      initial="hidden"
      animate="show"
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[140px]"
        style={{
          background: 'linear-gradient(180deg, #04050b 0%, rgba(4, 5, 11, 0) 100%)',
        }}
        aria-hidden
      />

      <_motion.div variants={staggerParent(0.1, 0.08)} initial="hidden" animate="show" className="relative z-[4]">
        <_motion.p
          variants={revealItem}
          className="inline-flex min-h-[34px] items-center gap-[0.34rem] rounded-xl border border-[rgba(142,156,209,0.25)] bg-[rgba(7,8,14,0.58)] px-3 text-[0.78rem] font-bold text-[#aeb5d1] max-[1280px]:min-h-[31px] max-[1280px]:text-[0.65rem] max-[900px]:min-h-7 max-[900px]:rounded-[10px] max-[900px]:px-2 max-[900px]:text-[0.56rem]"
        >
          Facebook Messenger Automation <span className="text-[#f5f6ff]">Powered by AI</span>
        </_motion.p>

        <_motion.h1
          variants={revealItem}
          className="mt-5 max-w-[1040px] text-[clamp(3rem,7.2vw,7.4rem)] leading-[0.92] font-extrabold tracking-[-0.03em] text-white [text-shadow:0_10px_24px_rgba(12,10,33,0.45)] max-[1280px]:mt-4 max-[1280px]:text-[clamp(2.6rem,7vw,5rem)] max-[900px]:mt-3 max-[900px]:text-[2.36rem]"
        >
          Automate Your
          <br />
          Facebook Inbox with AI
        </_motion.h1>

        <_motion.p
          variants={revealItem}
          className="mx-auto mt-[1.12rem] max-w-[640px] text-[1.06rem] leading-[1.54] text-[#e9e8ff] max-[1280px]:mt-3 max-[1280px]:max-w-[540px] max-[1280px]:text-[0.84rem] max-[900px]:mt-2 max-[900px]:max-w-[320px] max-[900px]:text-[0.72rem]"
        >
          Replizz turns your Facebook page inbox into an intelligent auto-reply system. Instantly
          respond to customers, detect payment screenshots, and manage conversations without
          missing a message.
        </_motion.p>

        <_motion.div
          variants={revealItem}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 max-[1280px]:mt-4 max-[900px]:mt-4"
        >
          <Link
            className="inline-flex min-h-[53px] items-center justify-center rounded-xl bg-white px-6 text-[1.04rem] font-bold text-[#1a2138] no-underline shadow-[0_16px_28px_rgba(16,12,42,0.36)] transition-transform duration-300 hover:-translate-y-0.5 max-[1280px]:min-h-[46px] max-[1280px]:text-[0.86rem] max-[900px]:min-h-10 max-[900px]:rounded-[10px] max-[900px]:px-4 max-[900px]:text-[0.76rem]"
            to="/register"
          >
            Start Free
          </Link>
          <a
            href="#demo"
            className="inline-flex min-h-[53px] items-center justify-center rounded-xl border border-[rgba(255,255,255,0.26)] bg-[rgba(7,8,14,0.18)] px-6 text-[1.04rem] font-bold text-white no-underline shadow-[0_16px_28px_rgba(16,12,42,0.2)] transition-transform duration-300 hover:-translate-y-0.5 max-[1280px]:min-h-[46px] max-[1280px]:text-[0.86rem] max-[900px]:min-h-10 max-[900px]:rounded-[10px] max-[900px]:px-4 max-[900px]:text-[0.76rem]"
          >
            Watch Demo
          </a>
        </_motion.div>

        <_motion.div
          variants={revealItem}
          className="mx-auto mt-4 hidden w-full max-w-[330px] rounded-2xl border border-[rgba(169,184,238,0.28)] bg-[rgba(11,17,34,0.76)] p-3 text-left shadow-[0_16px_26px_rgba(7,9,22,0.45)] max-[900px]:block"
        >
          <ChatPreviewContent chatPhase={chatPhase} />
        </_motion.div>
      </_motion.div>

      <_motion.span
        className="pointer-events-none absolute top-[39%] left-[14%] z-[3] h-[120px] w-[160px] rounded-[22px] shadow-[inset_-8px_-10px_16px_rgba(105,82,228,0.28),0_18px_26px_rgba(9,8,28,0.38)] max-[1280px]:top-[44%] max-[1280px]:left-[10%] max-[1280px]:h-[95px] max-[1280px]:w-[130px] max-[900px]:top-[48%] max-[900px]:left-[5%] max-[900px]:h-[66px] max-[900px]:w-[90px]"
        style={{
          ...layerStyle(mediumX, mediumY),
          background: 'linear-gradient(150deg, #b987ff 0%, #c5a6ff 58%, #9d86ff 100%)',
          clipPath: 'polygon(0 38%, 86% 0, 100% 40%, 34% 100%, 0 86%)',
          rotate: -25,
          skewX: -6,
        }}
        aria-hidden
      />
      <_motion.span
        className="pointer-events-none absolute top-[28%] right-[15%] z-[3] h-[170px] w-[170px] rounded-[36px] shadow-[inset_-8px_-10px_16px_rgba(105,82,228,0.28),0_18px_26px_rgba(9,8,28,0.38)] max-[1280px]:top-[30%] max-[1280px]:right-[11%] max-[1280px]:h-[132px] max-[1280px]:w-[132px] max-[900px]:top-[32%] max-[900px]:right-[6%] max-[900px]:h-[88px] max-[900px]:w-[88px]"
        style={{
          ...layerStyle(fastX, fastY),
          background: 'linear-gradient(150deg, #b987ff 0%, #c5a6ff 58%, #9d86ff 100%)',
          clipPath: 'polygon(14% 0, 100% 10%, 100% 74%, 62% 74%, 45% 100%, 30% 74%, 9% 70%, 0 16%)',
          rotate: -9,
        }}
        aria-hidden
      />
      <_motion.span
        className="pointer-events-none absolute bottom-[-130px] left-1/2 z-[2] flex h-[270px] w-[min(97%,1150px)] -translate-x-1/2 items-center justify-center rounded-[50%] max-[1280px]:bottom-[-110px] max-[1280px]:h-[220px] max-[900px]:bottom-[-90px] max-[900px]:h-[180px]"
        style={{
          ...layerStyle(slowX, slowY),
          background:
            'radial-gradient(85% 88% at 50% 42%, rgba(224, 171, 255, 0.66) 0%, rgba(224, 171, 255, 0.16) 56%, rgba(224, 171, 255, 0) 76%), linear-gradient(180deg, rgba(167, 119, 255, 0.82) 0%, rgba(129, 95, 245, 0.2) 100%)',
          filter: 'blur(0.4px)',
        }}
        aria-hidden
      />

      <_motion.aside
        className="pointer-events-none absolute right-[7%] bottom-[95px] z-[5] w-[min(310px,32vw)] rounded-2xl border border-[rgba(169,184,238,0.3)] bg-[rgba(11,17,34,0.78)] p-3 text-left shadow-[0_16px_26px_rgba(7,9,22,0.45)] max-[1280px]:right-[3%] max-[1280px]:w-[280px] max-[900px]:hidden"
        style={layerStyle(slowX, slowY)}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28 }}
        aria-label="Facebook inbox preview"
      >
        <ChatPreviewContent chatPhase={chatPhase} />
      </_motion.aside>
    </_motion.section>
  )
}

export default HomeHero
