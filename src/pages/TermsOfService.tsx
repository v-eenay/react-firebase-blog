import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function TermsOfService() {
  const { currentLanguage, translate, isTranslating } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const translateContent = async () => {
      if (currentLanguage !== 'en') {
        const sections = [
          { key: 'title', text: 'Terms of Service' },
          { key: 'acceptance', text: 'By accessing and using Retro Blog, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Retro Blog regarding your use of our services.' },
          { key: 'accounts', text: 'To access certain features of Retro Blog, you must create an account. You agree to provide accurate and complete registration information, maintain the security of your account credentials, promptly notify us of any unauthorized use of your account, and accept responsibility for all activities that occur under your account.' },
          { key: 'content', text: 'As a Retro Blog user, you retain ownership of the content you post. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content.' },
          { key: 'intellectual', text: 'The Retro Blog platform, including its original content, features, and functionality, is owned by us and protected by international copyright, trademark, and other intellectual property laws.' },
          { key: 'privacy', text: 'We take your privacy seriously. Our Privacy Policy, which is incorporated into these Terms of Service, explains how we collect, use, and protect your personal information. By using Retro Blog, you consent to our data practices as described in the Privacy Policy.' },
          { key: 'modifications', text: 'We reserve the right to modify, suspend, or discontinue any part of Retro Blog at any time.' },
          { key: 'termination', text: 'We may terminate or suspend your access to Retro Blog immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, our business, or third parties, or for any other reason at our sole discretion.' },
          { key: 'liability', text: 'To the maximum extent permitted by law, Retro Blog and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.' },
          { key: 'governing', text: 'These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.' }
        ];

        const translations = {};
        for (const section of sections) {
          translations[section.key] = await translate(section.text, currentLanguage);
        }
        setTranslatedContent(translations);
      } else {
        setTranslatedContent({});
      }
    };

    translateContent();
  }, [currentLanguage, translate]);
  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-paper)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8 p-8 vintage-paper rounded-lg shadow-[8px_8px_0_var(--color-ink)] relative overflow-hidden"
      >
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h1 className="text-4xl font-bold font-serif text-[var(--color-ink)] text-center">
          {isTranslating ? (
            <span className="text-[var(--color-accent)]">Translating...</span>
          ) : (
            translatedContent['title'] || 'Terms of Service'
          )}
        </h1>
        
        <div className="space-y-8 font-serif text-[var(--color-ink)]">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            <p>
              {isTranslating ? (
                <span className="text-[var(--color-accent)]">Translating...</span>
              ) : (
                translatedContent['acceptance'] || 'By accessing and using Retro Blog, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Retro Blog regarding your use of our services.'
              )}
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
              <li>Is considered spam or excessive self-promotion</li>
              <li>Contains hate speech or discriminatory content</li>
              <li>Includes excessive use of capital letters or repetitive characters</li>
              <li>Contains personal information of others without consent</li>
              <li>Promotes violence or dangerous activities</li>
              <li>Contains sexually explicit or adult content</li>
              <li>Impersonates another person or organization</li>
              <li>Contains false or misleading information</li>
            </ul>
            <p className="mt-4">
              We employ automated content moderation systems to detect and prevent spam, inappropriate content, and violations of our content policies. Users can report any content they believe violates these terms using the reporting feature. Reported content will be reviewed by our moderation team, and appropriate action will be taken, which may include content removal and account suspension.
            </p>
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
              <li>Reverse engineer or decompile our software</li>
              <li>Use our content for commercial purposes without permission</li>
              <li>Remove or alter any copyright notices</li>
              <li>Use our platform to create competing services</li>
            </ul>
            <p className="mt-4">
              For content you post on Retro Blog:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain all ownership rights to your content</li>
              <li>You grant us a license to use, display, and distribute your content</li>
              <li>You are responsible for ensuring you have the rights to post the content</li>
              <li>We may remove content that infringes on others' rights</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Privacy and Data Protection</h2>
            <p>
              We take your privacy seriously. Our Privacy Policy, which is incorporated into these Terms of Service, explains how we collect, use, and protect your personal information. By using Retro Blog, you consent to our data practices as described in the Privacy Policy.
            </p>
            <p className="mt-4">
              We collect and process the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Profile information (avatar, bio, social links)</li>
              <li>Content you post and interactions with other users</li>
              <li>Technical data (IP address, browser type, device information)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
            </ul>
            <p className="mt-4">
              We use this information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about your account and our services</li>
              <li>Protect against fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
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
              <li>Change our pricing structure</li>
              <li>Update our security measures</li>
              <li>Modify our user interface</li>
              <li>Change our data retention policies</li>
            </ul>
            <p className="mt-4">
              We will notify users of significant changes through:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email notifications</li>
              <li>In-app announcements</li>
              <li>Updates to our documentation</li>
              <li>Blog posts or social media announcements</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Termination</h2>
            <p>
              We may terminate or suspend your access to Retro Blog immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, our business, or third parties, or for any other reason at our sole discretion.
            </p>
            <p className="mt-4">
              Grounds for termination include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violation of these Terms of Service</li>
              <li>Repeated posting of inappropriate content</li>
              <li>Harassment of other users</li>
              <li>Creation of multiple accounts to evade bans</li>
              <li>Attempting to compromise platform security</li>
              <li>Engaging in fraudulent activities</li>
              <li>Inactivity for an extended period</li>
            </ul>
            <p className="mt-4">
              Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your account will be deactivated</li>
              <li>Your content may be removed or preserved</li>
              <li>You will lose access to premium features</li>
              <li>You may not create new accounts without permission</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Retro Blog and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
            <p className="mt-4">
              This includes, but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Loss of data or business interruption</li>
              <li>Errors or inaccuracies in content</li>
              <li>Personal injury or property damage</li>
              <li>Third-party actions or content</li>
              <li>Service interruptions or technical issues</li>
              <li>Security breaches or data leaks</li>
              <li>User-generated content</li>
              <li>External links or resources</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
            </p>
            <p className="mt-4">
              For users in different jurisdictions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to submit to the exclusive jurisdiction of our courts</li>
              <li>You waive any objections to venue or forum non conveniens</li>
              <li>You agree to resolve disputes through arbitration</li>
              <li>You acknowledge that these terms may be enforced in any court</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">10. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: support@retroblog.com</li>
              <li>Address: 123 Retro Street, Digital City, 12345</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
            <p className="mt-4">
              We aim to respond to all inquiries within 48 hours during business days.
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