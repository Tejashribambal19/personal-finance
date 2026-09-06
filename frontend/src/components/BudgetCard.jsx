function BudgetCard({ budget }) {
  const percentage = Math.min(
    Number(budget.percentageUsed),
    100
  );

  const statusClass =
    budget.status === "EXCEEDED"
      ? "budget-exceeded"
      : budget.status === "WARNING"
      ? "budget-warning"
      : "budget-safe";

  return (
    <div className="budget-item">
      <div className="budget-top">
        <div>
          <h4>{budget.categoryName}</h4>

          <p>
            ₹{Number(budget.spentAmount).toLocaleString("en-IN")}
            {" "}of{" "}
            ₹{Number(budget.budgetAmount).toLocaleString("en-IN")}
          </p>
        </div>

        <span className={`budget-status ${statusClass}`}>
          {budget.status}
        </span>
      </div>

      <div className="budget-progress">
        <div
          className={`budget-progress-fill ${statusClass}`}
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>

      <div className="budget-footer">
        <span>
          {Number(budget.percentageUsed).toFixed(0)}% used
        </span>

        <span>
          ₹{Number(
            budget.remainingAmount
          ).toLocaleString("en-IN")}{" "}
          remaining
        </span>
      </div>
    </div>
  );
}

export default BudgetCard;