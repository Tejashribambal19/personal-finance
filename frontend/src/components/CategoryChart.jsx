import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#496fe5",
  "#8b65df",
  "#ef7187",
  "#f4a754",
  "#45b6a5",
  "#6997f3",
];

function CategoryChart({ data }) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="dashboard-card category-card">
      <div className="card-heading">
        <div>
          <h3>Spending Breakdown</h3>
          <p>This month's expenses</p>
        </div>
      </div>

      <div className="pie-area">
        <div className="pie-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="categoryName"
                innerRadius={61}
                outerRadius={88}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.categoryId}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pie-center">
            <span>Total</span>
            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="category-legend">
          {data.map((item, index) => (
            <div
              className="category-legend-item"
              key={item.categoryId}
            >
              <div className="category-name">
                <i
                  style={{
                    background:
                      COLORS[index % COLORS.length],
                  }}
                ></i>

                <span>{item.categoryName}</span>
              </div>

              <strong>
                {Number(item.percentage).toFixed(1)}%
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryChart;