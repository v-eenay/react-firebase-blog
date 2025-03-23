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
        
        <div className="space-y-6 font-serif text-[var(--color-ink)]">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this blog, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">2. User Account</h2>
            <p>
              To access certain features of the blog, you may be required to create an account.
              You are responsible for maintaining the confidentiality of your account information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">3. Content</h2>
            <p>
              Users are responsible for the content they post. We reserve the right to remove
              any content that violates these terms or is otherwise objectionable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Intellectual Property</h2>
            <p>
              All content published on this blog is protected by copyright and other intellectual
              property laws. Users may not reproduce, distribute, or create derivative works
              without express permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand
              how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the blog
              after any modifications indicates your acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our blog without prior notice
              for conduct that we believe violates these terms or is harmful to other users.
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