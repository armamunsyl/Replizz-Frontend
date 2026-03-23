import React, { useEffect } from 'react';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ padding: '6rem 2rem 4rem', maxWidth: '800px', margin: '0 auto', color: '#e8ebf7', lineHeight: '1.6' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Terms of Service</h1>
            <p style={{ color: '#a0aec0', marginBottom: '2rem' }}>Last updated: March 2026</p>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>1. Agreement to Terms</h2>
                <p style={{ marginBottom: '1rem' }}>
                    By accessing or using Replizz, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>2. Description of Service</h2>
                <p style={{ marginBottom: '1rem' }}>
                    Replizz is an AI-powered customer support SaaS platform that connects to Facebook Pages to automate replies to messages. We utilize third-party APIs including OpenAI and Facebook Graph API to provide this service.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>3. User Accounts</h2>
                <p style={{ marginBottom: '1rem' }}>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>4. Facebook Platform Rules</h2>
                <p style={{ marginBottom: '1rem' }}>
                    By using Replizz to automate interactions on Facebook, you agree to comply with all Facebook Platform Policies, Community Standards, and Terms of Service. Replizz is not responsible for any suspension or banning of your Facebook Page due to misuse of the automation capabilities.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>5. Limitation of Liability</h2>
                <p style={{ marginBottom: '1rem' }}>
                    In no event shall Replizz, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>6. Contact Information</h2>
                <p style={{ marginBottom: '1rem' }}>
                    If you have any questions about these Terms, please contact us at support@replizz.com.
                </p>
            </section>
        </div>
    );
};

export default TermsOfService;
