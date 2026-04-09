import { useEffect } from 'react'

const sections = [
  {
    title: '1. Introduction',
    content: 'Welcome to Replizz. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our Facebook Messenger automation platform.',
  },
  {
    title: '2. Information We Collect',
    content: 'We collect information you provide directly, including your name, email address, and Facebook Page credentials. We also collect usage data such as message counts, conversation logs, and AI token usage to operate and improve our services.',
  },
  {
    title: '3. How We Use Your Information',
    content: 'We use your information to provide and maintain the Replizz platform, process AI replies on your behalf, send service-related communications, and improve our product. We do not sell your personal data to third parties.',
  },
  {
    title: '4. Facebook Data',
    content: 'Replizz integrates with the Facebook Messenger API. When you connect a Facebook Page, we receive access to messages sent to that page. This data is used solely to generate and deliver AI responses. We comply with Facebook Platform Policies and Meta\'s data use requirements.',
  },
  {
    title: '5. Data Security',
    content: 'We implement industry-standard security measures including encrypted connections (TLS), secure token storage, and access controls. However, no method of transmission over the Internet is 100% secure.',
  },
  {
    title: '6. Data Retention',
    content: 'We retain conversation and analytics data for as long as your account is active or as needed to provide our services. You may request deletion of your data at any time by contacting us.',
  },
  {
    title: '7. Your Rights',
    content: 'You have the right to access, update, or delete your personal information. You may also disconnect your Facebook Page at any time from within the Replizz dashboard, which will stop AI processing for that page.',
  },
  {
    title: '8. Contact Us',
    content: 'If you have any questions about this Privacy Policy, please contact us at privacy@replizz.com.',
  },
]

function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ padding: '80px 24px 64px', maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>Last updated: March 2026</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {sections.map(section => (
          <section key={section.title}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>{section.title}</h2>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

export default PrivacyPolicy
