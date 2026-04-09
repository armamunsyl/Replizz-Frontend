function Avatar({ name, src, size = 'md' }) {
  const sizeMap = {
    xs: { wh: 24, font: 10 },
    sm: { wh: 32, font: 12 },
    md: { wh: 40, font: 14 },
    lg: { wh: 48, font: 16 },
  }
  const { wh, font } = sizeMap[size] || sizeMap.md

  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        style={{ width: wh, height: wh, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }

  return (
    <div
      aria-label={name}
      style={{
        width: wh,
        height: wh,
        borderRadius: '50%',
        background: '#2563EB',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: font,
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials || '?'}
    </div>
  )
}

export default Avatar
