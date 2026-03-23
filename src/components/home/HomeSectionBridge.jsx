function HomeSectionBridge({ tone = 'violet' }) {
  const toneMap = {
    violet: {
      top: 'rgba(115, 76, 236, 0.32)',
      mid: 'rgba(152, 112, 255, 0.24)',
      core: 'rgba(186, 151, 255, 0.68)',
      glow: 'rgba(132, 95, 255, 0.52)',
    },
    indigo: {
      top: 'rgba(84, 97, 226, 0.26)',
      mid: 'rgba(119, 143, 255, 0.2)',
      core: 'rgba(150, 172, 255, 0.64)',
      glow: 'rgba(97, 127, 255, 0.45)',
    },
  }

  const palette = toneMap[tone] ?? toneMap.violet

  return (
    <div
      className="anim-glow relative h-14 overflow-hidden max-[900px]:h-12"
      style={{
        background: `linear-gradient(180deg, ${palette.top} 0%, rgba(12, 17, 32, 0.42) 55%, rgba(9, 13, 24, 0) 100%)`,
      }}
      aria-hidden
    >
      <span
        className="pointer-events-none absolute top-1/2 left-[8%] right-[8%] h-px -translate-y-1/2"
        style={{
          background: `linear-gradient(90deg, rgba(176, 192, 240, 0) 0%, ${palette.mid} 20%, ${palette.mid} 80%, rgba(176, 192, 240, 0) 100%)`,
        }}
      />
      <span
        className="pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: palette.core,
          boxShadow: `0 0 0 4px rgba(149, 164, 217, 0.14), 0 0 20px ${palette.glow}`,
        }}
      />
      <span
        className="pointer-events-none absolute top-1/2 left-[28%] h-[6px] w-[6px] -translate-y-1/2 rounded-full"
        style={{ background: 'rgba(167, 181, 228, 0.34)' }}
      />
      <span
        className="pointer-events-none absolute top-1/2 right-[28%] h-[6px] w-[6px] -translate-y-1/2 rounded-full"
        style={{ background: 'rgba(167, 181, 228, 0.34)' }}
      />
    </div>
  )
}

export default HomeSectionBridge
