import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-paper)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full space-y-8 p-8 vintage-paper rounded-lg shadow-[8px_8px_0_var(--color-ink)] relative overflow-hidden"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold font-serif mb-4 text-[var(--color-ink)]">Binaya Koirala</h1>
          <p className="text-lg font-serif text-[var(--color-accent)]">IT Lecturer | Computer Engineering & Business Administration Graduate</p>
        </div>

        <div className="space-y-8">
          <section className="bg-[var(--color-paper)] p-6 border-2 border-[var(--color-ink)]">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-serif font-semibold text-[var(--color-ink)]">Contact</h3>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span className="text-[var(--color-accent)]">+9779862035470</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <a href="mailto:binaya.koirala@iic.edu.np" className="text-[var(--color-accent)] hover:underline">binaya.koirala@iic.edu.np</a>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔗</span>
                  <a href="https://github.com/v-eenay" className="text-[var(--color-accent)] hover:underline">github.com/v-eenay</a>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p className="font-serif text-[var(--color-ink)]">
                  Versatile IT lecturer with an MBA and B.Tech in Computer Science Engineering, experienced in both academic and business settings. Committed to fostering dynamic learning environments integrating technology and innovative practices.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[var(--color-paper)] p-6 border-2 border-[var(--color-ink)]">
            <h2 className="text-2xl font-serif font-bold mb-4 text-[var(--color-ink)]">Milestones</h2>
            <div className="space-y-4">
              <div className="pl-4 border-l-4 border-[var(--color-accent)]">
                <h3 className="font-serif font-semibold text-[var(--color-ink)]">2023 Launch</h3>
                <p className="text-sm font-serif text-[var(--color-accent)]">Successfully deployed initial version with core blogging features</p>
              </div>
              <div className="pl-4 border-l-4 border-[var(--color-accent)]">
                <h3 className="font-serif font-semibold text-[var(--color-ink)]">500+ Users</h3>
                <p className="text-sm font-serif text-[var(--color-accent)]">Reached active academic community members within first 6 months</p>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="inline-block btn-retro px-6 py-2 text-[var(--color-paper)] bg-[var(--color-ink)]">Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
