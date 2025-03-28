import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">{t('terms.title')}</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-sm text-gray-500 mb-8">
          {t('terms.lastUpdated')}: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('terms.acceptance')}</h2>
          <p>{t('terms.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('terms.useLicense')}</h2>
          <p>{t('terms.permission')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('terms.disclaimer')}</h2>
          <p>{t('terms.warranty')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('terms.limitations')}</h2>
          <p>{t('terms.liability')}</p>
        </section>
      </div>
    </motion.div>
  );
}