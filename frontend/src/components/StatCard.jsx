function StatCard({
  title,
  value,
  icon,
  className = "",
  subtitle,
}) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-top">
        <span>{title}</span>

        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <h2>{value}</h2>

      {subtitle && (
        <p className="stat-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default StatCard;