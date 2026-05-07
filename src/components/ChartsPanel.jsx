import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartModal from "./ChartModal.jsx";
import "./ChartsPanel.css";

const revenueData = [
  { month: "Jan", revenue: 1200, target: 1000 },
  { month: "Feb", revenue: 1480, target: 1200 },
  { month: "Mar", revenue: 1350, target: 1300 },
  { month: "Apr", revenue: 1800, target: 1400 },
  { month: "May", revenue: 1650, target: 1500 },
  { month: "Jun", revenue: 2100, target: 1600 },
  { month: "Jul", revenue: 2400, target: 1700 },
  { month: "Aug", revenue: 2250, target: 1800 },
];

const categoryData = [
  { name: "Category A", value: 43 },
  { name: "Category B", value: 27 },
  { name: "Category C", value: 18 },
  { name: "Category D", value: 12 },
];

const trendsData = [
  { week: "W1", users: 320, sessions: 890 },
  { week: "W2", users: 440, sessions: 1100 },
  { week: "W3", users: 380, sessions: 970 },
  { week: "W4", users: 560, sessions: 1380 },
  { week: "W5", users: 620, sessions: 1540 },
  { week: "W6", users: 780, sessions: 1920 },
];

const PIE_COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4"];

const CHARTS = [
  { id: "bar", title: "Revenue vs Target ($K)", data: revenueData },
  { id: "pie", title: "Sales by Category", data: categoryData },
  { id: "line", title: "Weekly Users & Sessions", data: trendsData },
];

const KPI_CARDS = [
  { title: "Free cash flow YTD", value: "₹118 Cr" },
  { title: "Cash burn rate", value: "₹48 Cr" },
  { title: "CF drawdown", value: "₹481 Cr" },
  {
    title: "Collections efficiency",
    value: "82.4%",
    subtitle: "Receivables aging",
  },
  { title: "Interest rate (wtd)", value: "11.8%", subtitle: "Trial balance" },
];

const SUGGESTIONS = [
  {
    icon: "📈",
    summary:
      "Revenue beat target 6 of 8 months. Q3 peak at $2.4M — highest in dataset.",
    action: "Investigate Q3 drivers and replicate conditions in Q4 planning.",
    priority: "high",
  },
  {
    icon: "🏆",
    summary: "Category A holds 43% share — 1.6× next largest category.",
    action: "Expand Category A inventory before next cycle to capture demand.",
    priority: "medium",
  },
  {
    icon: "👥",
    summary:
      "Sessions growing 2.2× faster than users (W1→W6). Engagement rising.",
    action:
      "Identify top-session flows and convert them into onboarding steps.",
    priority: "medium",
  },
];

const PRIORITY_COLOR = { high: "#f59e0b", medium: "#8b5cf6", low: "#22c55e" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="tooltip-label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}:{" "}
          <strong>
            {typeof p.value === "number" && p.value > 999
              ? `$${(p.value / 1000).toFixed(1)}K`
              : p.value}
          </strong>
        </p>
      ))}
    </div>
  );
};

const ExpandIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ChartsPanel() {
  const [activeChart, setActiveChart] = useState(null);

  const openChart = (chartId) =>
    setActiveChart(CHARTS.find((c) => c.id === chartId));

  return (
    <>
      <aside className="charts-panel">
        <div className="panel-header">
          <h2 className="panel-title">Insights</h2>
          <span className="badge">Static</span>
        </div>

        <div className="charts-scroll">
          {/* KPI Row */}
          <div
            className="insights-kpi-grid"
            aria-label="Casagrand KPI summary cards"
          >
            {KPI_CARDS.map((kpi) => (
              <article className="insights-kpi-card" key={kpi.title}>
                <p className="insights-kpi-title">{kpi.title}</p>
                <p className="insights-kpi-value">{kpi.value}</p>
                {kpi.subtitle ? (
                  <p className="insights-kpi-subtitle">{kpi.subtitle}</p>
                ) : (
                  <p className="insights-kpi-subtitle spacer">&nbsp;</p>
                )}
              </article>
            ))}
          </div>

          {/* Bar Chart */}
          <div
            className="chart-card clickable"
            onClick={() => openChart("bar")}
          >
            <div className="chart-title-row">
              <span className="chart-title">Revenue vs Target ($K)</span>
              <span className="expand-hint">
                <ExpandIcon />
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={revenueData}
                barGap={2}
                margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e1e2a"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#55556a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#55556a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#ffffff08" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[3, 3, 0, 0]}
                  name="revenue"
                />
                <Bar
                  dataKey="target"
                  fill="#2a2a3a"
                  radius={[3, 3, 0, 0]}
                  name="target"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <span>
                <span className="dot" style={{ background: "#8b5cf6" }} />
                Revenue
              </span>
              <span>
                <span
                  className="dot"
                  style={{ background: "#2a2a3a", border: "1px solid #44445a" }}
                />
                Target
              </span>
            </div>
          </div>

          {/* Pie Chart */}
          <div
            className="chart-card clickable"
            onClick={() => openChart("pie")}
          >
            <div className="chart-title-row">
              <span className="chart-title">Sales by Category</span>
              <span className="expand-hint">
                <ExpandIcon />
              </span>
            </div>
            <div className="pie-wrapper">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={{
                      background: "#1a1a24",
                      border: "1px solid #2e2e3e",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {categoryData.map((d, i) => (
                  <div key={i} className="pie-legend-item">
                    <span
                      className="dot"
                      style={{ background: PIE_COLORS[i] }}
                    />
                    <span className="pie-name">{d.name}</span>
                    <span className="pie-pct">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="ai-suggestion-card">
            <div className="ai-suggestion-header">
              <div className="ai-suggestion-title-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ai-suggestion-title">AI Suggestion</span>
              </div>
              <span className="ai-badge">AI</span>
            </div>
            <p className="ai-suggestion-desc">
              Based on your sources, here are next steps:
            </p>
            <div className="ai-suggestion-list">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="ai-suggestion-item">
                  <div className="ai-suggestion-top">
                    <span className="ai-suggestion-icon">{s.icon}</span>
                    <span
                      className="ai-priority-dot"
                      style={{ background: PRIORITY_COLOR[s.priority] }}
                      title={s.priority}
                    />
                  </div>
                  <p className="ai-summary">{s.summary}</p>
                  <div className="ai-action">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {s.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div
            className="chart-card clickable"
            onClick={() => openChart("line")}
          >
            <div className="chart-title-row">
              <span className="chart-title">Weekly Users &amp; Sessions</span>
              <span className="expand-hint">
                <ExpandIcon />
              </span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart
                data={trendsData}
                margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e1e2a"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#55556a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#55556a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a24",
                    border: "1px solid #2e2e3e",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 3 }}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4", r: 3 }}
                  name="Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <span>
                <span className="dot" style={{ background: "#8b5cf6" }} />
                Users
              </span>
              <span>
                <span className="dot" style={{ background: "#06b6d4" }} />
                Sessions
              </span>
            </div>
          </div>
        </div>
      </aside>

      {activeChart && (
        <ChartModal chart={activeChart} onClose={() => setActiveChart(null)} />
      )}
    </>
  );
}
