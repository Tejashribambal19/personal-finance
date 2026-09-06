import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MonthlyChart({ data }) {
  const chartData = data.map((item) => ({
    ...item,
    monthName:
      item.monthName.charAt(0) +
      item.monthName.slice(1).toLowerCase(),
  }));

  const formatCompact = (value) => {
    if (value >= 1000) {
      return `₹${value / 1000}k`;
    }

    return `₹${value}`;
  };

  return (
    <div className="dashboard-card chart-card">
      <div className="card-heading">
        <div>
          <h3>Income vs Expenses</h3>
          <p>Monthly financial performance</p>
        </div>

        <span className="chart-year">
          {new Date().getFullYear()}
        </span>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 15,
              right: 5,
              left: -15,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="incomeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#4f73e8"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="#4f73e8"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#f06f86"
                  stopOpacity={0.2}
                />

                <stop
                  offset="95%"
                  stopColor="#f06f86"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#edf0f5"
            />

            <XAxis
              dataKey="monthName"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#8d96a8",
                fontSize: 11,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompact}
              tick={{
                fill: "#8d96a8",
                fontSize: 11,
              }}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
              ]}
            />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#4f73e8"
              strokeWidth={3}
              fill="url(#incomeGradient)"
            />

            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#f06f86"
              strokeWidth={3}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <span>
          <i className="legend-income"></i>
          Income
        </span>

        <span>
          <i className="legend-expense"></i>
          Expenses
        </span>
      </div>
    </div>
  );
}

export default MonthlyChart;