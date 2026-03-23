import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ padding: '6rem 2rem 4rem', maxWidth: '800px', margin: '0 auto', color: '#e8ebf7', lineHeight: '1.6' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Privacy Policy</h1>
            <p style={{ color: '#a0aec0', marginBottom: '2rem' }}>Last updated: March 2026</p>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>1. Introduction</h2>
                <p style={{ marginBottom: '1rem' }}>
                    Welcome to Replizz. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>2. Data We Collect</h2>
                <p style={{ marginBottom: '1rem' }}>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Facebook Page Data:</strong> includes page IDs, access tokens, and messages managed by our AI bot on your behalf.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>3. How We Use Your Data</h2>
                <p style={{ marginBottom: '1rem' }}>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li style={{ marginBottom: '0.5rem' }}>To process and deliver AI-generated responses to your Facebook Page messages.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>4. Data Security</h2>
                <p style={{ marginBottom: '1rem' }}>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>5. Contact Us</h2>
                <p style={{ marginBottom: '1rem' }}>
                    If you have any questions about this privacy policy or our privacy practices, please contact us at support@replizz.com.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
