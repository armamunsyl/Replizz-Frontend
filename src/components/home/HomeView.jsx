import HomeAutomationSection from './HomeAutomationSection'
import HomeFlatSection from './HomeFlatSection'
import HomeFeedbackCarousel from './HomeFeedbackCarousel'
import HomeHero from './HomeHero'
import HomeInsightSection from './HomeInsightSection'
import HomeFeatureCarousel from './HomeFeatureCarousel'
import HomeSectionBridge from './HomeSectionBridge'

function HomeView() {
  return (
    <div className="bg-[#060910] text-[#d7def6]">
      <main className="mx-auto w-[min(1230px,calc(100%-2rem))] pt-[7.2rem] pb-0 max-[1280px]:w-[min(1220px,calc(100%-1.4rem))] max-[1280px]:pt-[6.7rem] max-[900px]:w-[calc(100%-1rem)] max-[900px]:pt-[5.6rem]">
        <section
          className="overflow-hidden rounded-[34px] border border-[rgba(132,149,206,0.2)] max-[1280px]:rounded-[24px] max-[900px]:rounded-[16px]"
          style={{
            background:
              'radial-gradient(130% 80% at 50% 102%, rgba(136, 90, 255, 0.2), rgba(136, 90, 255, 0) 55%), linear-gradient(180deg, #060a16 0%, #0a1020 48%, #070c18 100%)',
          }}
        >
          <HomeHero />
          <HomeSectionBridge tone="violet" />
          <HomeInsightSection />
          <HomeFeatureCarousel />
          <HomeSectionBridge tone="indigo" />
          <HomeFeedbackCarousel />
          <HomeSectionBridge tone="violet" />
          <HomeAutomationSection />
          <HomeSectionBridge tone="indigo" />
          <HomeFlatSection />
        </section>
      </main>
    </div>
  )
}

export default HomeView
