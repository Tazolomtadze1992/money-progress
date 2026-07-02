interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  value: React.ReactNode;
}

export default function StatCard({ icon, label, subtitle, value }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__subtitle">{subtitle}</p>
      <p className="stat-card__value">{value}</p>
    </article>
  );
}
