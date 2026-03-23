import { motion as _motion } from 'framer-motion'
import { revealItem, sectionReveal, staggerParent, subtleHoverLift } from './motionPresets'
import { useCountUp } from './useCountUp'

function AnimatedStatValue({ value }) {
  const { ref, display } = useCountUp(value, 1500)

  return (
    <span ref={ref}>
      {display}
    </span>
  )
}

function HomeStats({ stats }) {
  return (
    <_motion.section
      className="mt-4 mb-1 grid grid-cols-4 gap-3 max-[1280px]:mt-5 max-[900px]:mt-5 max-[900px]:grid-cols-2"
      id="contact"
      aria-label="Platform stats"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <_motion.div className="contents" variants={staggerParent(0.1, 0.08)}>
        {stats.map((item) => (
          <_motion.article
            key={item.label}
            className="group relative min-h-[98px] overflow-hidden rounded-[18px] border border-[rgba(136,154,214,0.24)] bg-gradient-to-b from-[#141c36] to-[#10172c] px-2 py-3 text-center shadow-[0_16px_28px_rgba(9,11,24,0.42)]"
            variants={revealItem}
            whileHover={subtleHoverLift}
          >
            <span className="pointer-events-none absolute top-[-45px] left-1/2 h-[95px] w-[110px] -translate-x-1/2 rounded-full bg-[rgba(139,107,255,0.28)] blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
            <h3 className="relative z-[1] text-[clamp(1.8rem,2.5vw,2.6rem)] leading-none font-bold text-[#f3f7ff] max-[900px]:text-[1.02rem]">
              <AnimatedStatValue value={item.value} />
            </h3>
            <p className="relative z-[1] mt-2 text-[0.8rem] font-semibold tracking-[0.04em] text-[#acb9e0] uppercase max-[900px]:text-[0.62rem]">
              {item.label}
            </p>
          </_motion.article>
        ))}
      </_motion.div>
    </_motion.section>
  )
}

export default HomeStats
