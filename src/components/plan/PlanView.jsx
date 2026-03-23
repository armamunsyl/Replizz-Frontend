import { motion as _motion } from 'framer-motion'
import ProfilePill from '../ui/ProfilePill'
import { revealItem, sectionReveal, staggerParent, subtleHoverLift } from '../home/motionPresets'

function PlanView({ packages }) {
  return (
    <_motion.section
      className="workspace plan-view"
      aria-label="My plan dashboard"
      variants={sectionReveal}
      initial="hidden"
      animate="show"
    >
      <_motion.header className="workspace-top plan-top" variants={revealItem}>
        <div className="overview-title-wrap">
          <p className="overview-kicker">Workspace</p>
          <h1>My Plan</h1>
        </div>

        <div className="workspace-actions">
          <ProfilePill />
        </div>
      </_motion.header>

      <_motion.div className="plan-content" variants={staggerParent(0.1, 0.08)}>
        <_motion.section className="plan-intro-card" variants={revealItem} whileHover={subtleHoverLift}>
          <h2>Choose Your Package</h2>
          <p>
            Compare plans and pick the package that matches your team size and conversation volume.
          </p>
        </_motion.section>

        <_motion.section className="plan-grid" aria-label="Plan package list" variants={staggerParent(0.12, 0.08)}>
          {packages.map((item) => (
            <_motion.article
              key={item.id}
              className="plan-card"
              variants={revealItem}
              whileHover={subtleHoverLift}
            >
              <header className="plan-card-head">
                <h3>{item.name}</h3>
                <div className="plan-price">
                  <span className="plan-price-currency">$</span>
                  <strong>{item.price}</strong>
                  <span className="plan-price-period">/{item.period}</span>
                </div>
              </header>

              <p className="plan-description">{item.description}</p>

              <ul className="plan-feature-list" aria-label={`${item.name} features`}>
                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <_motion.button
                type="button"
                className="plan-choose-button"
                whileHover={{ y: -1.5 }}
                transition={{ duration: 0.2 }}
              >
                Choose {item.name}
              </_motion.button>
            </_motion.article>
          ))}
        </_motion.section>
      </_motion.div>
    </_motion.section>
  )
}

export default PlanView
