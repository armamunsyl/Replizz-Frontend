function Icon({ name, className = '' }) {
  const shared = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  }

  const icons = {
    home: (
      <svg {...shared}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13V10.5" />
      </svg>
    ),
    user: (
      <svg {...shared}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 19c1.3-2.8 3.8-4.2 7-4.2S17.7 16.2 19 19" />
      </svg>
    ),
    clock: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.8v4.5l2.8 1.8" />
      </svg>
    ),
    chat: (
      <svg {...shared}>
        <path d="M5 6.5h14v9H9l-4 3v-12Z" />
      </svg>
    ),
    ban: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.8 8.8 6.4 6.4" />
      </svg>
    ),
    trash: (
      <svg {...shared}>
        <path d="M4.5 7.5h15" />
        <path d="M9 7.5V5.8c0-.7.5-1.3 1.3-1.3h3.4c.8 0 1.3.6 1.3 1.3v1.7" />
        <path d="m7.2 7.5.9 11.1c0 .8.6 1.4 1.4 1.4h5.1c.8 0 1.4-.6 1.4-1.4l.8-11.1" />
      </svg>
    ),
    search: (
      <svg {...shared}>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </svg>
    ),
    bell: (
      <svg {...shared}>
        <path d="M6.5 15.5h11c-1.3-1.2-1.8-2.8-1.8-5.2a3.7 3.7 0 1 0-7.4 0c0 2.4-.5 4-1.8 5.2Z" />
        <path d="M10.3 18.1a2 2 0 0 0 3.4 0" />
      </svg>
    ),
    settings: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L14.4 3h-4.8l-.4 2.9a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 1.7 1l.4 2.9h4.8l.4-2.9a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1Z" />
      </svg>
    ),
    box: (
      <svg {...shared}>
        <path d="m3.5 8.2 8.5-4.7 8.5 4.7-8.5 4.7-8.5-4.7Z" />
        <path d="M3.5 8.2V16l8.5 4.8 8.5-4.8V8.2" />
        <path d="M12 12.9V20.8" />
      </svg>
    ),
    clip: (
      <svg {...shared}>
        <path d="m8.7 12.7 5.6-5.6a2.6 2.6 0 1 1 3.7 3.6l-6.6 6.7a4 4 0 1 1-5.6-5.6l6.2-6.2" />
      </svg>
    ),
    mic: (
      <svg {...shared}>
        <rect x="9" y="4" width="6" height="10" rx="3" />
        <path d="M6.5 11.5a5.5 5.5 0 1 0 11 0" />
        <path d="M12 17v3" />
      </svg>
    ),
    send: (
      <svg {...shared}>
        <path d="M3 11.8 20 4l-5.8 16-3.4-5.1L3 11.8Z" />
      </svg>
    ),
    chevron: (
      <svg {...shared}>
        <path d="m8 10 4 4 4-4" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#1877F2" />
        <path
          d="M13.7 8.2h2V5.4h-2.4c-2.6 0-3.8 1.5-3.8 3.9V11H7.7v2.7h1.8v4.9h2.9v-4.9h2.5l.4-2.7h-2.9V9.5c0-.8.3-1.3 1.3-1.3Z"
          fill="#fff"
        />
      </svg>
    ),
    plus: (
      <svg {...shared}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
    checkCircle: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.8 12.2 2.1 2.2 4.4-4.7" />
      </svg>
    ),
    timer: (
      <svg {...shared}>
        <circle cx="12" cy="13" r="7.5" />
        <path d="M9.8 3.6h4.4" />
        <path d="M12 13 15 11" />
      </svg>
    ),
    star: (
      <svg {...shared}>
        <path d="m12 4.6 2.3 4.6 5.1.7-3.7 3.6.9 5.1L12 16.2 7.4 18.6l.9-5.1-3.7-3.6 5.1-.7L12 4.6Z" />
      </svg>
    ),
    globe: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5c2.4 2.2 3.8 5.3 3.8 8.5S14.4 18.3 12 20.5c-2.4-2.2-3.8-5.3-3.8-8.5S9.6 5.7 12 3.5Z" />
        <path d="M3.8 12h16.4" />
      </svg>
    ),
    trendUp: (
      <svg {...shared}>
        <path d="m4 15 5-5 4 3 6-7" />
        <path d="M14 6h5v5" />
      </svg>
    ),
    trendDown: (
      <svg {...shared}>
        <path d="m4 9 5 5 4-3 6 7" />
        <path d="M14 18h5v-5" />
      </svg>
    ),
    dots: (
      <svg {...shared}>
        <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    chart: (
      <svg {...shared}>
        <path d="M4 20V10" />
        <path d="M9 20V4" />
        <path d="M14 20v-8" />
        <path d="M19 20v-4" />
      </svg>
    ),
    message: (
      <svg {...shared}>
        <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.2-2.5L3 21l2.5-2.8A9 9 0 1 1 21 12Z" />
      </svg>
    ),
    shield: (
      <svg {...shared}>
        <path d="M12 3 4 7v5c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V7l-8-4Z" />
      </svg>
    ),
  }

  return icons[name] ?? null
}

export default Icon
