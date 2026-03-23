import { motion as _motion } from 'framer-motion'
import { revealItem, sectionReveal, staggerParent, subtleHoverLift } from '../home/motionPresets'

const footerColumns = [
  {
    title: 'Products',
    links: ['Analytics Platform', 'Insights Engine', 'Reporting Suite', 'Data Visualization'],
  },
  {
    title: 'Solutions',
    links: ['For Startups', 'For Enterprise', 'For Marketing', 'For Sales'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Case Studies', 'Documentation', 'API Reference'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Contact', 'Partners'],
  },
]

const policyLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security']

function PublicFooter() {
  return (
    <_motion.footer
      className="bg-[#060910] px-0 pt-2 pb-6 mt-10"
      id="contact"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <_motion.div
        className="mx-auto w-[min(1230px,calc(100%-2rem))] overflow-hidden rounded-[26px] border border-[rgba(162,179,232,0.22)] text-[#e7ebf5] shadow-[0_26px_52px_rgba(8,11,25,0.48)] max-[900px]:w-[calc(100%-1rem)] max-[900px]:rounded-[16px]"
        style={{
          background:
            'radial-gradient(420px 220px at 12% 12%, rgba(143, 99, 255, 0.26), rgba(143, 99, 255, 0) 72%), radial-gradient(420px 220px at 88% 88%, rgba(99, 151, 255, 0.2), rgba(99, 151, 255, 0) 74%), linear-gradient(180deg, #121628 0%, #101422 100%)',
        }}
        variants={revealItem}
        whileHover={subtleHoverLift}
      >
        <_motion.section
          className="border-b border-[rgba(255,255,255,0.08)] px-5 pt-6 pb-4 text-center max-[900px]:px-3"
          variants={staggerParent(0.08, 0.06)}
        >
          <_motion.h2 variants={revealItem} className="text-[1.75rem] leading-[1.1] font-extrabold text-[#f4f7ff] max-[900px]:text-[1.3rem]">
            Continue Your <span className="text-[#9b7dff]">Success Story</span>
          </_motion.h2>
          <_motion.p variants={revealItem} className="mx-auto mt-2 max-w-[650px] text-[0.68rem] leading-[1.55] text-[#a9b3cc] max-[900px]:max-w-[95%] max-[900px]:text-[0.62rem]">
            Join 10,000+ teams who get weekly insights on turning data into decisions. Be the first
            to know about new chapters in product innovation.
          </_motion.p>

          <_motion.form
            variants={revealItem}
            className="mx-auto mt-3 grid w-[min(460px,100%)] grid-cols-[minmax(0,1fr)_auto] gap-2 max-[900px]:grid-cols-1"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <input
              className="min-h-10 rounded-[9px] border border-[rgba(156,171,216,0.3)] bg-[rgba(30,35,53,0.94)] px-4 text-[0.9rem] text-[#edf1fb] placeholder:text-[#8d97b3] focus:border-[rgba(188,198,236,0.5)] focus:outline-none"
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
            />
            <button
              className="min-h-10 rounded-xl border-0 bg-gradient-to-br from-[#8e71ff] to-[#6f95ff] px-7 text-[0.9rem] font-bold text-white shadow-[0_12px_20px_rgba(112,108,244,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
              type="submit"
            >
              Subscribe
            </button>
          </_motion.form>

          <_motion.small variants={revealItem} className="mt-2 block text-[0.56rem] text-[#8e98b5]">
            No spam, just stories worth telling. Unsubscribe anytime.
          </_motion.small>
        </_motion.section>

        <_motion.section
          className="grid grid-cols-[minmax(220px,0.95fr)_minmax(0,2fr)] gap-6 border-b border-[rgba(255,255,255,0.08)] px-5 py-4 max-[900px]:grid-cols-1 max-[900px]:px-3"
          variants={staggerParent(0.08, 0.06)}
        >
          <_motion.article variants={revealItem}>
            <div className="inline-flex items-center gap-2">
              <img className="h-6 w-6 rounded-lg object-cover" src="/replizz-logo.png" alt="Replizz logo" />
              <strong className="text-[2rem] font-extrabold tracking-[-0.02em] text-[#f3f5ff] max-[900px]:text-[1.5rem]">
                Replizz
              </strong>
            </div>

            <p className="mt-3 max-w-[250px] text-[0.68rem] leading-[1.55] text-[#8e98b5] max-[900px]:max-w-full">
              Empowering businesses to transform data into compelling narratives. Every number tells
              a story we help you tell yours.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <a
                className="grid h-7 w-7 place-items-center rounded-md border border-[rgba(163,176,220,0.34)] text-[0.68rem] font-bold text-[#dce3f7] no-underline transition-transform duration-300 hover:-translate-y-0.5"
                href="/"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                className="grid h-7 w-7 place-items-center rounded-md border border-[rgba(163,176,220,0.34)] text-[0.68rem] font-bold text-[#dce3f7] no-underline transition-transform duration-300 hover:-translate-y-0.5"
                href="/"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                className="grid h-7 w-7 place-items-center rounded-md border border-[rgba(163,176,220,0.34)] text-[0.68rem] font-bold text-[#dce3f7] no-underline transition-transform duration-300 hover:-translate-y-0.5"
                href="/"
                aria-label="GitHub"
              >
                gh
              </a>
            </div>
          </_motion.article>

          <_motion.div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2" variants={staggerParent(0.06, 0.04)}>
            {footerColumns.map((column) => (
              <_motion.article key={column.title} variants={revealItem}>
                <h3 className="text-[0.86rem] font-bold text-[#f2f5ff]">{column.title}</h3>
                <ul className="mt-2 grid gap-1">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a className="text-[0.66rem] text-[#8e98b5] no-underline transition-colors duration-200 hover:text-[#d9e2fa]" href="/">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </_motion.article>
            ))}
          </_motion.div>
        </_motion.section>

        <_motion.section
          className="flex items-center justify-between gap-3 px-5 py-3 max-[900px]:flex-col max-[900px]:items-start max-[900px]:px-3"
          variants={revealItem}
        >
          <p className="text-[0.58rem] text-[#7f8bab]">
            © {new Date().getFullYear()} Replizz. Every great story starts with data.
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3 max-[900px]:justify-start">
            {policyLinks.map((item) => (
              <a className="text-[0.58rem] text-[#7f8bab] no-underline transition-colors duration-200 hover:text-[#dce3f6]" key={item} href="/">
                {item}
              </a>
            ))}
          </div>
        </_motion.section>
      </_motion.div>
    </_motion.footer>
  )
}

export default PublicFooter
