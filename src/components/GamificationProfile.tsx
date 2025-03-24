import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';

export default function GamificationProfile() {
  const { userGamification, availableChallenges, badges } = useGamification();

  if (!userGamification) return null;

  return (
    <div className="vintage-paper p-6 rounded-lg shadow-[8px_8px_0_var(--color-ink)] mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Points and Level */}
        <div className="text-center p-4 border-2 border-[var(--color-ink)] rounded-lg">
          <h3 className="text-xl font-bold font-serif mb-2">Level {userGamification.level}</h3>
          <div className="text-3xl font-bold text-[var(--color-accent)]">
            {userGamification.points} Points
          </div>
          <div className="mt-2 text-sm text-[var(--color-ink)]/60">
            Next level at {userGamification.level * 1000} points
          </div>
        </div>

        {/* Badges */}
        <div className="p-4 border-2 border-[var(--color-ink)] rounded-lg">
          <h3 className="text-xl font-bold font-serif mb-4">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map(badge => {
              const earned = userGamification.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-2 p-2 rounded ${earned ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'bg-[var(--color-paper)] text-[var(--color-ink)]/40'}`}
                  title={badge.description}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="p-4 border-2 border-[var(--color-ink)] rounded-lg">
          <h3 className="text-xl font-bold font-serif mb-4">Active Challenges</h3>
          {userGamification.currentChallenges.length > 0 ? (
            <div className="space-y-4">
              {userGamification.currentChallenges.map(challenge => {
                const challengeDetails = availableChallenges.find(c => c.id === challenge.id);
                if (!challengeDetails) return null;

                const progress = (challenge.progress / challengeDetails.target) * 100;
                return (
                  <div key={challenge.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{challengeDetails.title}</span>
                      <span className="text-sm text-[var(--color-accent)]">
                        {challenge.progress}/{challengeDetails.target}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-paper)] border border-[var(--color-ink)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-[var(--color-ink)]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--color-ink)]/60 text-sm">
              No active challenges. Start one to earn more points!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}