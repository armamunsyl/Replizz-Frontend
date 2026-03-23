import { motion as _motion } from 'framer-motion'
import { revealItem, sectionReveal, staggerParent } from './motionPresets'

const insightBlocks = [
  {
    title: 'Unified Inbox',
    text: 'All customer messages flow into one timeline so you never miss a conversation.',
  },
  {
    title: 'AI Auto Replies',
    text: 'Automatically respond to customer questions with intelligent AI replies.',
  },
  {
    title: 'Smart Context Memory',
    text: 'Replizz remembers previous messages and keeps conversations natural.',
  },
  {
    title: 'Payment Screenshot Detection',
    text: 'Automatically detect payment proofs and trigger verification flows.',
  },
  {
    title: 'Moderator Handoff',
    text: 'When a human joins the conversation, AI steps back automatically.',
  },
  {
    title: 'Custom AI Instructions',
    text: 'Train the assistant with your own business rules and responses.',
  },
]

const tickerItems = [
  'Facebook Inbox',
  'Auto Reply',
  'Payment Proof',
  'Moderator Handoff',
  'Context Memory',
  'AI Instructions',
  'Messenger Timeline',
  '24/7 Response',
]

function HomeInsightSection() {
  return (
    <_motion.section
      className="relative overflow-hidden px-6 py-12 max-[1280px]:px-5 max-[900px]:px-3 max-[900px]:py-10"
      id="about"
      aria-label="Platform insights"
      style={{
        background:
          'radial-gradient(85% 95% at 50% -10%, rgba(152, 104, 255, 0.18), rgba(152, 104, 255, 0) 62%), linear-gradient(180deg, #0a1020 0%, #0b1122 100%)',
      }}
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[rgba(146,161,218,0.24)]" />

      <_motion.header className="mx-auto max-w-[760px] text-center" variants={staggerParent(0.1, 0.08)}>
        <_motion.p
          variants={revealItem}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(167,182,232,0.32)] bg-[rgba(16,22,40,0.64)] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.09em] text-[#c3d0f3] uppercase"
        >
          Why Replizz
        </_motion.p>
        <_motion.h2
          variants={revealItem}
          className="mt-3 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.06] font-extrabold tracking-[-0.02em] text-[#f4f8ff]"
        >
          Built for Facebook Page Conversations That Never Stop
        </_motion.h2>
        <_motion.p
          variants={revealItem}
          className="mx-auto mt-3 max-w-[640px] text-[0.92rem] leading-[1.58] text-[#b1c0e7] max-[900px]:text-[0.76rem]"
        >
          Replizz gives page owners one AI inbox for instant replies, payment proof handling, and
          seamless human takeover when needed.
        </_motion.p>
      </_motion.header>

      <_motion.div
        className="mx-auto mt-9 grid max-w-[1080px] grid-cols-3 gap-5 max-[1180px]:grid-cols-2 max-[760px]:grid-cols-1"
        variants={staggerParent(0.12, 0.08)}
      >
        {insightBlocks.map((item, index) => (
          <_motion.article
            key={item.title}
            className="group relative overflow-hidden rounded-[24px] border border-[rgba(174,136,255,0.35)] bg-[radial-gradient(240px_200px_at_12%_14%,rgba(167,118,255,0.32),rgba(167,118,255,0)_70%),radial-gradient(240px_200px_at_88%_86%,rgba(111,144,255,0.22),rgba(111,144,255,0)_76%),linear-gradient(145deg,#1e1344_0%,#28195c_55%,#1b103f_100%)] p-6 shadow-[0_18px_34px_rgba(31,15,71,0.32)] transition-transform duration-200"
            variants={revealItem}
            whileHover={{ y: -6, boxShadow: '0 22px 40px rgba(6,9,22,0.4)' }}
          >
            <div className="absolute left-5 top-5 z-[2] inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-[rgba(204,176,255,0.65)] bg-[linear-gradient(145deg,#6c4bff_0%,#a35bff_100%)] text-[0.9rem] font-extrabold tracking-[0.08em] text-[#f8f2ff] shadow-[0_8px_18px_rgba(53,25,109,0.45)]">
              {(index + 1).toString().padStart(2, '0')}
            </div>
            <div className="absolute right-[-40px] top-[-40px] h-[110px] w-[110px] rounded-full bg-[rgba(147,110,255,0.32)] blur-3xl" />
            <div className="absolute left-[-46px] bottom-[-42px] h-[110px] w-[110px] rounded-full bg-[rgba(99,126,255,0.24)] blur-3xl" />
            <div className="pt-14">
              <h3 className="text-[1.26rem] font-bold text-[#f4f7ff] max-[900px]:text-[1.08rem]">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-[1.58] text-[#a8b6d8] max-[900px]:text-[0.84rem]">
                {item.text}
              </p>
            </div>
          </_motion.article>
        ))}
      </_motion.div>

      <_motion.div
        className="group mx-auto mt-8 w-[min(1060px,100%)] overflow-hidden rounded-full border border-[rgba(158,174,231,0.26)] bg-[rgba(11,16,31,0.68)]"
        variants={revealItem}
      >
        <div className="anim-marquee-track flex w-max items-center gap-2 px-3 py-2.5">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-[rgba(160,177,230,0.34)] bg-[rgba(17,23,42,0.78)] px-3 py-1 text-[0.66rem] font-semibold text-[#d3ddfb]"
            >
              {item}
            </span>
          ))}
        </div>
      </_motion.div>
    </_motion.section>
  )
}

export default HomeInsightSection
