import { Link, useLocation } from 'react-router-dom'

function HomeNavbar({ items }) {
  const location = useLocation()

  const getHref = (hash) => {
    if (location.pathname === '/') {
      return hash
    }

    return `/${hash}`
  }

  return (
    <header
      className="anim-reveal fixed top-[0.95rem] left-1/2 z-[120] w-[min(1040px,calc(100%-6rem))] -translate-x-1/2 max-[1280px]:w-[min(980px,calc(100%-4rem))] max-[900px]:top-[0.55rem] max-[900px]:w-[calc(100%-1.3rem)]"
      id="home"
    >
      <div className="flex min-h-[72px] items-center justify-between gap-3 rounded-full border border-[rgba(229,232,242,0.92)] bg-[rgba(255,255,255,0.96)] px-4 py-2 shadow-[0_16px_30px_rgba(93,95,142,0.14)] max-[1280px]:min-h-[66px] max-[900px]:min-h-[56px] max-[900px]:rounded-[18px] max-[900px]:px-[0.65rem]">
        <Link to="/" className="inline-flex items-center gap-2 no-underline anim-hover-lift">
          <span className="h-[47px] w-[47px] shrink-0 overflow-hidden rounded-[14px] max-[1280px]:h-[41px] max-[1280px]:w-[41px] max-[900px]:h-[34px] max-[900px]:w-[34px] max-[900px]:rounded-[10px]">
            <img className="block h-full w-full object-cover" src="/replizz-logo.png" alt="Replizz logo" />
          </span>
          <span className="text-[1.95rem] font-extrabold text-[#1b1e3b] max-[1280px]:text-[1.45rem] max-[900px]:text-[1.04rem]">
            Replizz
          </span>
        </Link>

        <nav className="inline-flex items-center gap-5 max-[900px]:hidden" aria-label="Landing navigation">
          {items.map((item) => (
            <a
              key={item.label}
              href={getHref(item.href)}
              className="inline-flex items-center gap-1 text-[0.93rem] font-bold text-[#252941] no-underline transition-colors duration-200 hover:text-[#7b59e7] max-[1280px]:text-[0.82rem] anim-hover-lift"
            >
              {item.label}
              {item.hasChevron ? <span className="translate-y-[-0.02rem] text-[0.7rem] leading-none">▾</span> : null}
            </a>
          ))}
        </nav>

        <Link
          className="inline-flex min-h-[50px] items-center justify-center gap-[0.42rem] rounded-full bg-gradient-to-br from-[#8d62ff] to-[#6e87ff] px-5 text-[0.87rem] font-bold text-white no-underline shadow-[0_14px_24px_rgba(118,98,224,0.28)] max-[1280px]:min-h-[44px] max-[1280px]:px-4 max-[1280px]:text-[0.8rem] max-[900px]:min-h-[37px] max-[900px]:px-3 max-[900px]:text-[0.72rem] anim-hover-lift"
          to="/register"
        >
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] text-[0.55rem]">
            ▸
          </span>
          <span>Start Free</span>
        </Link>
      </div>
    </header>
  )
}

export default HomeNavbar
