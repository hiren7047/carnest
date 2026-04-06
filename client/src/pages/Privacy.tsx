import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

const Privacy = () => (
  <LegalPageLayout title="Privacy Policy" subtitle="Last updated: April 2026">
    <p>
      Carnest (“we”, “us”) operates the Carnest website and related services. This policy explains how we collect,
      use, and protect your personal information when you use our marketplace in India.
    </p>

    <h2>Information we collect</h2>
    <ul>
      <li>
        <strong>Account data:</strong> name, email address, and password (hashed) when you register.
      </li>
      <li>
        <strong>Listing &amp; transaction data:</strong> details you provide about vehicles, test drive bookings,
        sell requests, and messages you send through contact forms.
      </li>
      <li>
        <strong>Technical data:</strong> IP address, browser type, device information, and cookies (where used) to
        keep the site secure and improve performance.
      </li>
    </ul>

    <h2>How we use your information</h2>
    <ul>
      <li>To provide and improve our services, including search, listings, and customer support.</li>
      <li>To communicate with you about enquiries, bookings, and important service updates.</li>
      <li>To detect fraud, abuse, and to comply with legal obligations.</li>
    </ul>

    <h2>Sharing of information</h2>
    <p>
      We do not sell your personal data. We may share information with service providers who help us host the
      platform, send email, or process payments (where applicable), strictly under confidentiality and only as needed
      to provide the service. We may disclose information if required by law or to protect our rights and users.
    </p>

    <h2>Cookies</h2>
    <p>
      We may use cookies or similar technologies for session management, preferences, and analytics. You can control
      cookies through your browser settings.
    </p>

    <h2>Data retention</h2>
    <p>
      We retain your information for as long as your account is active or as needed to provide services and meet legal,
      tax, or regulatory requirements. You may request deletion of your account subject to applicable law.
    </p>

    <h2>Your rights</h2>
    <p>
      Under applicable Indian law (including principles aligned with reasonable privacy expectations), you may request
      access to or correction of your personal data, or raise concerns by contacting us at the details on our Contact
      page.
    </p>

    <h2>Security</h2>
    <p>
      We use industry-standard measures to protect your data. No method of transmission over the internet is 100%
      secure; we strive to protect your information but cannot guarantee absolute security.
    </p>

    <h2>Changes</h2>
    <p>
      We may update this Privacy Policy from time to time. The “Last updated” date will change accordingly. Continued
      use of the site after changes constitutes acceptance of the revised policy.
    </p>

    <h2>Contact</h2>
    <p>
      For privacy-related questions, please use the Contact page or email us at hello@carnest.in.
    </p>
  </LegalPageLayout>
);

export default Privacy;
