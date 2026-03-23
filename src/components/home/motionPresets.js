export const motionEase = [0.22, 1, 0.36, 1]

export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: motionEase,
    },
  },
}

export const revealItem = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      ease: motionEase,
    },
  },
}

export function staggerParent(staggerChildren = 0.1, delayChildren = 0.04) {
  return {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }
}

export const subtleHoverLift = {
  y: -4,
  boxShadow: '0 16px 30px rgba(10, 13, 30, 0.24)',
  transition: {
    duration: 0.24,
    ease: motionEase,
  },
}
