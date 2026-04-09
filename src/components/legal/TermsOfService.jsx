import { useEffect } from 'react'

const sections = [
  {
    title: '1. Agreement to Terms',
    content: 'By accessing or using Replizz, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.',
  },
  {
    title: '2. Description of Service',
    content: 'Replizz is a SaaS platform that enables Facebook Page owners to automate customer replies using AI. The service connects to your Facebook Page via the Messenger API and generates responses to incoming messages.',
  },
  {
    title: '3. Account Registration',
    content: 'You must create an account to use Replizz. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
  },
  {
    title: '4. Acceptable Use',
    content: 'You agree not to use Replizz to send spam, illegal content, or messages that violate Facebook\'s Community Standards or Platform Policies. You are solely responsible for the content generated and sent through your connected Facebook Pages.',
  },
  {
    title: '5. Facebook Integration',
    content: 'Use of Replizz requires compliance with Meta\'s Terms of Service and Facebook Platform Policies. We reserve the right to suspend accounts that violate these policies or whose pages are flagged by Facebook.',
  },
  {
    title: '6. Subscription and Billing',
    content: 'Some features of Replizz require a paid subscription. Subscription fees are billed in advance on a monthly basis. You may cancel your subscription at any time. Refunds are not provided for unused portions of a billing period.',
  },
  {
    title: '7. Intellectual Property',
    content: 'The Replizz platform, including its design, code, and content, is owned by Replizz and protected by intellectual property laws. You retain ownership of the content on your Facebook Pages.',
  },
  {
    title: '8. Limitation of Liability',
    content: 'Replizz is provided "as is" without warranty of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including lost profits or data.',
  },
  {
    title: '9. Termination',
    content: 'We reserve the right to suspend or terminate your account at any time for violations of these Terms. You may also delete your account at any time by contacting support or through the dashboard.',
  },
  {
    title: '10. Changes to Terms',
    content: 'We may update these Terms of Service from time to time. We will notify you of significant changes via email or through the platform. Continued use after changes constitutes acceptance of the updated terms.',
  },
  {
    title: '11. Contact Us',
    content: 'If you have any questions about these Terms, please contact us at legal@replizz.com.',
  },
]

function TermsOfService() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ padding: '80px 24px 64px', maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 8 }}>Terms of Service</h1>
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

export default TermsOfService
