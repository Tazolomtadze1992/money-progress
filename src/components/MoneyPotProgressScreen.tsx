import JourneyMap from "./JourneyMap";
import HeaderProgressBar from "./HeaderProgressBar";
import StatCard from "./StatCard";
import {
  formatAmount,
  progressToAmount,
  progressToPercent,
} from "../utils/pathProgress";

interface MoneyPotProgressScreenProps {
  progress: number;
  onBack?: () => void;
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.5 16L6.5 10L12.5 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="11" width="3" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export default function MoneyPotProgressScreen({
  progress,
  onBack,
}: MoneyPotProgressScreenProps) {
  const percent = progressToPercent(progress);
  const savedAmount = progressToAmount(progress);

  return (
    <div className="progress-screen">
      <header className="progress-screen__header">
        <button
          type="button"
          className="progress-screen__back"
          aria-label="უკან"
          onClick={onBack}
        >
          <BackIcon />
        </button>
        <h1 className="progress-screen__title">moneypot პროგრესი</h1>
        <div className="progress-screen__header-spacer" aria-hidden="true" />
      </header>

      <HeaderProgressBar progress={progress} />

      <main className="progress-screen__body">
        <section className="progress-screen__map-card" aria-label="პროგრესის რუკა">
          <JourneyMap progress={progress} />
        </section>

        <section className="progress-screen__stats" aria-label="სტატისტიკა">
          <StatCard
            icon={<GoalIcon />}
            label="მიღწევა"
            subtitle="მიზნის შესრულება"
            value={`${percent}%`}
          />
          <StatCard
            icon={<WalletIcon />}
            label="თანხა"
            subtitle="აგროვებული თანხა"
            value={`${formatAmount(savedAmount)} ₾`}
          />
        </section>
      </main>

      <footer className="progress-screen__footer">
        <button type="button" className="progress-screen__cta" onClick={onBack}>
          უკან დაბრუნება
        </button>
      </footer>
    </div>
  );
}
