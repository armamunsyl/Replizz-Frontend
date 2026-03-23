function OverviewActivity({ activity }) {
  return (
    <section className="overview-activity-card anim-pop anim-delay-3 anim-hover-lift" aria-label="Recent activity">
      <header className="overview-activity-head">
        <h2>Recent Inbox Activity</h2>
        <button type="button" className="anim-hover-lift">View all</button>
      </header>

      <div className="overview-activity-list">
        {activity.map((item, index) => (
          <article
            key={item.title}
            className="overview-activity-item anim-pop"
            style={{ animationDelay: `${0.14 + index * 0.05}s` }}
          >
            <div>
              <h3>{item.title}</h3>
              <p>{item.meta}</p>
            </div>
            <span className={`activity-pill ${item.status.toLowerCase()}`}>{item.status}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default OverviewActivity
