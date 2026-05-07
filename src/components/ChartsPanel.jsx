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

const COLLECTIONS_VS_DEMAND_DATA = [
  { month: "Jan", demandNotes: 105, collections: 90 },
  { month: "Feb", demandNotes: 85, collections: 80 },
  { month: "Mar", demandNotes: 78, collections: 65 },
  { month: "Apr", demandNotes: 84, collections: 62 },
  { month: "May", demandNotes: 90, collections: 70 },
  { month: "Jun", demandNotes: 86, collections: 76 },
  { month: "Jul", demandNotes: 95, collections: 68 },
  { month: "Aug", demandNotes: 101, collections: 79 },
  { month: "Sep", demandNotes: 98, collections: 83 },
  { month: "Oct", demandNotes: 100, collections: 78 },
  { month: "Nov", demandNotes: 110, collections: 92 },
  { month: "Dec", demandNotes: 106, collections: 85 },
];

const FCF_BY_PROJECT_DATA = [
  { project: "Amada", fcf: 82 },
  { project: "Verdant P2", fcf: 31 },
  { project: "Supremo", fcf: 28 },
  { project: "Bellefonte", fcf: 90 },
  { project: "Mirabilis", fcf: 78 },
  { project: "Enchante", fcf: 60 },
  { project: "Periwinkle", fcf: 50 },
  { project: "Aurelia", fcf: 40 },
  { project: "Celeste", fcf: 100 },
  { project: "Florence", fcf: 90 },
  { project: "Riviera", fcf: 80 },
];

const LEAD_CONVERSION_FUNNEL_DATA = [
  { stage: "Total enquiries", value: 100 },
  { stage: "Qualified leads", value: 84 },
  { stage: "Site visits", value: 62 },
  { stage: "Negotiation", value: 34 },
  { stage: "Agreement signed", value: 22 },
  { stage: "Booking + payment", value: 19.2 },
];

const CHARTS = [
  { id: "bar", title: "Revenue vs Target ($K)", data: revenueData },
  { id: "pie", title: "Sales by Category", data: categoryData },
  { id: "line", title: "Weekly Users & Sessions", data: trendsData },
  {
    id: "runway",
    title: "Runway analysis",
    data: {
      collectionsVsDemand: COLLECTIONS_VS_DEMAND_DATA,
      fcfByProject: FCF_BY_PROJECT_DATA,
    },
  },
  {
    id: "conversion",
    title: "Lead conversion funnel - monthly",
    data: LEAD_CONVERSION_FUNNEL_DATA,
  },
];

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

          <section className="ai-insights-section" aria-label="AI insights">
            <div className="ai-insights-title-row">
              <h3 className="ai-insights-title">AI Insights</h3>
              <span className="ai-insights-count">2 cards</span>
            </div>

            <div className="finance-ai-card">
              <div className="finance-ai-header">
                <h3 className="finance-ai-title">
                  DrawdownWatch Agent — CF ceiling risk timeline
                </h3>
                <span className="finance-ai-badge">F1 Alert</span>
              </div>
              <p className="finance-highlight">
                74% drawn · ceiling in Month 9 at current pace
              </p>
              <p className="finance-insight-copy">
                At current burn rate ₹48 Cr/month and collections at 82.4%, net
                CF drawdown grows ₹8.6 Cr/month. ₹169 Cr headroom remaining.
                Headroom exhausted in 19.6 months at best case — but if
                Bellefonte delay extends and collections drop to 76%, headroom
                exhausted in 9 months. Supremo and Miralis must pause.
              </p>
              <button
                className="runway-btn"
                onClick={() => openChart("runway")}
              >
                Runway analysis
              </button>
            </div>

            <div className="finance-ai-card conversion-ai-card">
              <div className="finance-ai-header">
                <h3 className="finance-ai-title">
                  ConversionPulse Agent — funnel leakage analysis
                </h3>
                <span className="finance-ai-badge">AI Insight</span>
              </div>
              <p className="finance-highlight">
                Major conversion leakage detected between Site visits and
                Negotiation
              </p>
              <p className="finance-insight-copy">
                Monthly funnel analysis indicates strong top-of-funnel
                acquisition with 84% lead qualification efficiency. However,
                conversion sharply declines after site visits, dropping from 62%
                to 34% during negotiation stages. Agreement closure stabilizes
                at 22%, while final booking conversion reaches only 19.2%.
              </p>
              <p className="finance-insight-copy">
                Primary friction indicators suggest delayed follow-ups, pricing
                resistance, and extended approval cycles during negotiation. If
                current leakage persists, projected revenue realization may
                reduce by 28% over the next quarter.
              </p>
              <button
                className="runway-btn"
                onClick={() => openChart("conversion")}
              >
                Run analysis
              </button>
            </div>
          </section>

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
