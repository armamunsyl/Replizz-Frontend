import Icon from '../ui/Icon'

function OverviewStats({ stats }) {
  return (
    <section className="overview-stats" aria-label="Key metrics">
      {stats.map((item, index) => (
        <article
          key={item.title}
          className="overview-stat-card anim-pop anim-hover-lift"
          style={{ animationDelay: `${0.12 + index * 0.06}s` }}
        >
          <div className="overview-stat-head">
            <span className="overview-stat-icon">
              <Icon name={item.icon} />
            </span>
            <span className={`overview-stat-change ${item.trend === 'down' ? 'down' : 'up'}`}>
              <Icon name={item.trend === 'down' ? 'trendDown' : 'trendUp'} />
              {item.change}
            </span>
          </div>
          <p className="overview-stat-title">{item.title}</p>
          <p className="overview-stat-value">{item.value}</p>
        </article>
      ))}
    </section>
  )
}

export default OverviewStats
