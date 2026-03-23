import Icon from '../ui/Icon'

function OverviewChart({ days, series }) {
  const max = Math.max(...series)
  const min = Math.min(...series)
  const range = max - min || 1

  const points = series
    .map((value, index) => {
      const x = (index / (series.length - 1)) * 100
      const y = 92 - ((value - min) / range) * 70
      return `${x},${y}`
    })
    .join(' ')

  return (
    <section className="overview-chart-card anim-pop anim-delay-2 anim-hover-lift" aria-label="Conversation analytics">
      <header className="overview-chart-head">
        <div>
          <h2>Weekly Analytics</h2>
          <p>Conversation trend and response performance</p>
        </div>
        <button type="button" className="overview-more anim-hover-lift">
          <Icon name="dots" />
        </button>
      </header>

      <div className="overview-chart-wrap">
        <svg className="overview-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
          <polyline points={points} />
        </svg>

        <div className="overview-bars" aria-hidden>
          {series.map((value, index) => {
            const height = 30 + ((value - min) / range) * 70
            return (
              <span
                key={`${days[index]}-${value}`}
                style={{ '--bar-h': `${height}%`, '--bar-delay': `${index * 80}ms` }}
              />
            )
          })}
        </div>
      </div>

      <footer className="overview-days" aria-label="Days">
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </footer>
    </section>
  )
}

export default OverviewChart
