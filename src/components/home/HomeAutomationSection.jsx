import { motion as _motion } from 'framer-motion'
import { revealItem, sectionReveal, staggerParent, subtleHoverLift } from './motionPresets'

const workflowSteps = [
  {
    id: '01',
    label: 'Customer Message',
    note: 'Customer sends a message to your Facebook page.',
  },
  {
    id: '02',
    label: 'AI Processing',
    note: 'Replizz AI analyzes intent and conversation context.',
  },
  {
    id: '03',
    label: 'Instant Reply',
    note: 'AI automatically sends a relevant reply.',
  },
  {
    id: '04',
    label: 'Conversation Logged',
    note: 'All messages are stored inside the Replizz dashboard.',
  },
]

const chips = ['Messenger Inbox', 'AI Context', 'Auto Replies', 'Dashboard Log']

function HomeAutomationSection() {
  return (
    <_motion.section
      className="relative overflow-hidden px-6 py-12 max-[1280px]:px-5 max-[900px]:px-3 max-[900px]:py-10"
      id="info"
      aria-label="Automation layer"
      style={{
        background:
          'radial-gradient(90% 95% at 50% 110%, rgba(118, 92, 244, 0.2), rgba(118, 92, 244, 0) 62%), linear-gradient(180deg, #0a1121 0%, #0b1326 100%)',
      }}
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[rgba(146,161,218,0.22)]" />

      <_motion.header className="mx-auto max-w-[760px] text-center" variants={staggerParent(0.1, 0.08)}>
        <_motion.p
          variants={revealItem}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(167,182,232,0.32)] bg-[rgba(16,22,40,0.64)] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.09em] text-[#c3d0f3] uppercase"
        >
          Automation Flow
        </_motion.p>
        <_motion.h2
          variants={revealItem}
          className="mt-3 text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.06] font-extrabold tracking-[-0.02em] text-[#f4f8ff]"
        >
          From Customer Message to Logged Reply in Four Steps
        </_motion.h2>
        <_motion.p
          variants={revealItem}
          className="mx-auto mt-3 max-w-[680px] text-[0.92rem] leading-[1.58] text-[#afbee6] max-[900px]:text-[0.76rem]"
        >
          Replizz watches your Facebook inbox, understands what the customer wants, sends the
          reply, and stores the full timeline in your dashboard automatically.
        </_motion.p>
      </_motion.header>

      <div className="mx-auto mt-8 grid max-w-[1060px] grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] items-start gap-6 max-[960px]:grid-cols-1">
        <_motion.article
          className="rounded-[28px] border border-[rgba(152,170,228,0.24)] bg-[rgba(12,18,34,0.6)] p-6 shadow-[0_20px_38px_rgba(9,12,24,0.3)] max-[900px]:rounded-[18px] max-[900px]:p-4"
          variants={staggerParent(0.1, 0.08)}
        >
          <_motion.p
            variants={revealItem}
            className="text-[0.68rem] font-semibold tracking-[0.08em] text-[#c3d0f3] uppercase"
          >
            Workflow Visualization
          </_motion.p>
          <_motion.h3
            variants={revealItem}
            className="mt-3 text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.02em] text-[#f4f8ff]"
          >
            Every inbox action is handled in sequence without manual follow-up
          </_motion.h3>
          <_motion.p
            variants={revealItem}
            className="mt-3 text-[0.88rem] leading-[1.6] text-[#aebee6] max-[900px]:text-[0.74rem]"
          >
            The workflow stays simple for page owners: a message arrives, AI understands it, a
            reply goes out, and the conversation is saved for review inside Replizz.
          </_motion.p>

          <_motion.div className="mt-5 flex flex-wrap gap-2" variants={staggerParent(0.08, 0.08)}>
            {chips.map((chip) => (
              <_motion.span
                key={chip}
                className="rounded-full border border-[rgba(160,177,230,0.34)] bg-[rgba(17,23,42,0.78)] px-3 py-1 text-[0.66rem] font-semibold text-[#d3ddfb]"
                variants={revealItem}
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                {chip}
              </_motion.span>
            ))}
          </_motion.div>
        </_motion.article>

        <_motion.div
          className="grid w-full grid-cols-2 gap-3 max-[900px]:grid-cols-1"
          variants={staggerParent(0.12, 0.08)}
        >
          {workflowSteps.map((step) => (
            <_motion.article
              key={step.label}
              className="flex h-full flex-col gap-2 rounded-2xl border border-[rgba(152,170,228,0.26)] bg-[rgba(12,18,34,0.66)] p-4 shadow-[0_16px_30px_rgba(9,12,24,0.28)]"
              variants={revealItem}
              whileHover={subtleHoverLift}
              transition={{ duration: 0.24 }}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#a180ff] to-[#6f94ff] text-[0.8rem] font-extrabold tracking-[0.08em] text-white shadow-[0_10px_18px_rgba(106,103,236,0.32)]">
                  {step.id}
                </span>
                <div>
                  <h3 className="text-[0.98rem] font-bold text-[#edf2ff] max-[900px]:text-[0.86rem]">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-[0.78rem] leading-[1.55] text-[#a6b6e1] max-[900px]:text-[0.68rem]">
                    {step.note}
                  </p>
                </div>
              </div>
            </_motion.article>
          ))}
        </_motion.div>
      </div>
    </_motion.section>
  )
}

export default HomeAutomationSection
