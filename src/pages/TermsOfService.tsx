import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-paper)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8 p-8 vintage-paper rounded-lg shadow-[8px_8px_0_var(--color-ink)] relative overflow-hidden"
      >
        <h1 className="text-4xl font-bold font-serif text-[var(--color-ink)] text-center">
          Terms of Service
        </h1>
        
        <div className="space-y-8 font-serif text-[var(--color-ink)]">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Retro Blog, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Retro Blog regarding your use of our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. User Accounts and Registration</h2>
            <p>
              To access certain features of Retro Blog, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly notify us of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. Content and Conduct</h2>
            <p>
              As a Retro Blog user, you retain ownership of the content you post. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content. You agree not to post content that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violates any applicable laws or regulations</li>
              <li>Infringes upon the rights of others</li>
              <li>Is harmful, fraudulent, or deceptive</li>
              <li>Contains malware or harmful code</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Intellectual Property Rights</h2>
            <p>
              The Retro Blog platform, including its original content, features, and functionality, is owned by us and protected by international copyright, trademark, and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Copy or reproduce any part of our platform without permission</li>
              <li>Modify or create derivative works</li>
              <li>Use our trademarks or branding</li>
              <li>Attempt to gain unauthorized access to any part of our services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Privacy and Data Protection</h2>
            <p>
              We take your privacy seriously. Our Privacy Policy, which is incorporated into these Terms of Service, explains how we collect, use, and protect your personal information. By using Retro Blog, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of Retro Blog at any time. We may also:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Update these terms to reflect changes in our services or laws</li>
              <li>Change or eliminate features</li>
              <li>Introduce new fees or charges</li>
              <li>Modify our content policies</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Termination</h2>
            <p>
              We may terminate or suspend your access to Retro Blog immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, our business, or third parties, or for any other reason at our sole discretion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Retro Blog and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t-2 border-[var(--color-ink)]">
            <p className="text-sm text-[var(--color-accent)]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}