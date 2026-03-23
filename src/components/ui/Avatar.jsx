function Avatar({ name, src, colors, size = 'md' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`avatar avatar-${size}`}
        style={{ objectFit: 'cover' }}
      />
    )
  }

  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

  return (
    <span
      className={`avatar avatar-${size}`}
      style={{
        '--avatar-a': colors?.[0] || '#e2e8f0',
        '--avatar-b': colors?.[1] || '#cbd5e1',
      }}
      aria-label={name}
    >
      {initials}
    </span>
  )
}

export default Avatar
