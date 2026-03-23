import { motion as _motion } from 'framer-motion'
import { revealItem, sectionReveal, staggerParent } from './motionPresets'

const trustMetrics = [
  { value: '24/7', label: 'automated replies' },
  { value: 'Thousands', label: 'of messages handled' },
  { value: 'Instant', label: 'response time' },
]

function HomeFlatSection() {
  return (
    <_motion.section
      className="relative overflow-hidden px-5 pt-7 pb-12 max-[1280px]:px-4 max-[1280px]:pt-6 max-[900px]:px-3 max-[900px]:pt-4 max-[900px]:pb-8"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 110%, rgba(165, 121, 255, 0.42), rgba(165, 121, 255, 0) 52%), linear-gradient(180deg, #090e1f 0%, #1a0f47 30%, #2a1661 66%, #281b55 100%)',
      }}
      id="contact"
      aria-label="Dashboard preview and call to action"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 44% at 14% 22%, rgba(197, 167, 255, 0.16), rgba(197, 167, 255, 0) 72%)',
        }}
        aria-hidden
      />

      <div className="relative z-[2] mx-auto flex max-w-[1100px] flex-col items-center">
        <_motion.div
          className="w-[min(700px,100%)] text-center max-[1280px]:max-w-[560px] max-[900px]:max-w-[340px]"
          variants={staggerParent(0.1, 0.08)}
        >
          <_motion.h2
            variants={revealItem}
            className="text-[clamp(2.05rem,4.8vw,4.25rem)] leading-[1.02] font-extrabold tracking-[-0.02em] text-white max-[1280px]:text-[clamp(1.85rem,4.2vw,3rem)] max-[900px]:text-[1.36rem]"
          >
            Control Every Conversation from One Dashboard
          </_motion.h2>
          <_motion.p
            variants={revealItem}
            className="mt-4 text-[1.04rem] leading-[1.5] text-[#d7dcfa] max-[1280px]:mt-3 max-[1280px]:text-[0.84rem] max-[900px]:mt-2 max-[900px]:text-[0.68rem]"
          >
            View customer messages, configure AI instructions, and monitor automated replies from a
            single interface.
          </_motion.p>
        </_motion.div>

        <_motion.div
          className="relative mt-8 w-[min(92%,1080px)] [perspective:1850px] [perspective-origin:50%_100%] max-[1280px]:w-[min(94%,940px)] max-[900px]:mt-6 max-[900px]:w-[96%]"
          variants={revealItem}
        >
          <span
            className="pointer-events-none absolute right-[10%] left-[10%] z-[-1] h-14 rounded-[50%]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(8, 8, 18, 0.56) 0%, rgba(8, 8, 18, 0) 74%)',
              filter: 'blur(6px)',
            }}
            aria-hidden
          />
          <_motion.div
            className="relative overflow-hidden rounded-[18px] border border-[rgba(146,158,213,0.3)] bg-[#090b13] shadow-[0_48px_64px_rgba(7,9,22,0.58),0_0_0_1px_rgba(72,78,114,0.2)] max-[1280px]:rounded-[14px] max-[900px]:rounded-[10px]"
            style={{ transformOrigin: '50% 100%', transform: 'rotateX(46deg) scale(1)' }}
          >
            <span
              className="pointer-events-none absolute right-[8%] bottom-[6px] left-[8%] h-4 rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(22, 16, 49, 0.44) 0%, rgba(22, 16, 49, 0) 72%)',
                filter: 'blur(2px)',
              }}
              aria-hidden
            />
            <img className="block h-auto w-full object-cover" src="/flat.png" alt="Replizz dashboard preview" loading="lazy" />
          </_motion.div>
        </_motion.div>

        <div className="mt-10 grid w-full max-w-[1080px] grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] gap-4 max-[960px]:grid-cols-1 max-[900px]:mt-8">
          <_motion.article
            className="rounded-[28px] border border-[rgba(154,171,231,0.28)] bg-[rgba(10,16,31,0.58)] p-5 shadow-[0_20px_38px_rgba(9,12,24,0.3)] max-[900px]:rounded-[18px] max-[900px]:p-4"
            variants={staggerParent(0.1, 0.08)}
          >
            <_motion.p
              variants={revealItem}
              className="text-[0.68rem] font-semibold tracking-[0.08em] text-[#c4d2f5] uppercase"
            >
              Social Proof
            </_motion.p>
            <_motion.h3
              variants={revealItem}
              className="mt-3 text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.08] font-bold tracking-[-0.02em] text-[#f3f7ff]"
            >
              Built for Online Businesses
            </_motion.h3>
            <_motion.p
              variants={revealItem}
              className="mt-3 max-w-[640px] text-[0.88rem] leading-[1.58] text-[#acbce6] max-[900px]:text-[0.74rem]"
            >
              Replizz helps page owners automate customer replies and respond instantly without
              hiring support teams.
            </_motion.p>

            <_motion.div
              className="mt-5 grid grid-cols-3 gap-2.5 max-[560px]:grid-cols-1"
              variants={staggerParent(0.08, 0.08)}
            >
              {trustMetrics.map((item) => (
                <_motion.div
                  key={item.label}
                  className="rounded-xl border border-[rgba(157,174,231,0.24)] bg-[rgba(10,17,33,0.72)] px-3 py-4"
                  variants={revealItem}
                >
                  <p className="text-[1.16rem] leading-none font-extrabold text-[#f4f8ff] max-[900px]:text-[0.96rem]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[0.68rem] font-semibold tracking-[0.05em] text-[#9eb0e0] uppercase">
                    {item.label}
                  </p>
                </_motion.div>
              ))}
            </_motion.div>
          </_motion.article>

          <_motion.article
            className="rounded-[28px] border border-[rgba(167,181,232,0.3)] bg-[linear-gradient(160deg,rgba(17,24,48,0.9)_0%,rgba(51,29,115,0.9)_100%)] p-5 shadow-[0_20px_38px_rgba(9,12,24,0.34)] max-[900px]:rounded-[18px] max-[900px]:p-4"
            variants={staggerParent(0.1, 0.08)}
          >
            <_motion.p
              variants={revealItem}
              className="text-[0.68rem] font-semibold tracking-[0.08em] text-[#d9deff] uppercase"
            >
              Start Free
            </_motion.p>
            <_motion.h3
              variants={revealItem}
              className="mt-3 text-[clamp(1.55rem,3vw,2.4rem)] leading-[1.08] font-bold tracking-[-0.02em] text-white"
            >
              Start Automating Your Facebook Inbox Today
            </_motion.h3>
            <_motion.p
              variants={revealItem}
              className="mt-3 text-[0.88rem] leading-[1.58] text-[#dde3ff] max-[900px]:text-[0.74rem]"
            >
              Connect your page, add AI instructions, and let Replizz handle customer replies.
            </_motion.p>
            <_motion.a
              variants={revealItem}
              href="/register"
              className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-xl bg-white px-5 text-[0.9rem] font-bold text-[#221b45] no-underline shadow-[0_16px_28px_rgba(16,12,42,0.28)] transition-transform duration-300 hover:-translate-y-0.5 max-[900px]:min-h-10 max-[900px]:rounded-[10px] max-[900px]:px-4 max-[900px]:text-[0.74rem]"
            >
              Get Started Free
            </_motion.a>
          </_motion.article>
        </div>
      </div>
    </_motion.section>
  )
}

export default HomeFlatSection
