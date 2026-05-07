import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  ComposedChart,
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
  Legend,
  ReferenceLine,
} from "recharts";
import "./ChartModal.css";

const PIE_COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4"];

const DRILLDOWN = {
  "Category A": [
    { label: "Enterprise", value: 18 },
    { label: "Mid-Market", value: 13 },
    { label: "SMB", value: 8 },
    { label: "Startup", value: 4 },
  ],
  "Category B": [
    { label: "APAC", value: 11 },
    { label: "EMEA", value: 9 },
    { label: "US", value: 5 },
    { label: "LATAM", value: 2 },
  ],
  "Category C": [
    { label: "Online", value: 10 },
    { label: "Retail", value: 5 },
    { label: "Partner", value: 3 },
  ],
  "Category D": [
    { label: "Renewal", value: 7 },
    { label: "Upsell", value: 3 },
    { label: "New", value: 2 },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="modal-tooltip">
      {label && <p className="modal-tooltip-label">{label}</p>}
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

const AI_REPLIES = [
  "Updated — color scheme shifted to match your request.",
  "Done. Chart title and axis labels refined.",
  "Applied. Legend repositioned to the right side.",
  "Done — data smoothed using 2-period moving average.",
  "Updated. Bar radius increased for a softer look.",
];

export default function ChartModal({ chart, onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSlice, setActiveSlice] = useState(null);
  const [runwayStage, setRunwayStage] = useState(0);
  const inputRef = useRef();
  const messagesEndRef = useRef();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (chart.id !== "runway") {
      setRunwayStage(0);
      return undefined;
    }

    setRunwayStage(0);
    const first = setTimeout(() => setRunwayStage(1), 120);
    const second = setTimeout(() => setRunwayStage(2), 700);

    return () => {
      clearTimeout(first);
      clearTimeout(second);
    };
  }, [chart.id]);

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)],
        },
      ]);
      setLoading(false);
    }, 900);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const renderChart = () => {
    if (chart.id === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chart.data}
            barGap={4}
            margin={{ top: 16, right: 24, bottom: 8, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e1e2a"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#7777aa", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7777aa", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#ffffff06" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 13, color: "#7777aa" }}
            />
            <Bar
              dataKey="revenue"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Bar
              dataKey="target"
              fill="#2a2a3a"
              radius={[4, 4, 0, 0]}
              name="Target"
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    if (chart.id === "pie") {
      const drillData = activeSlice ? DRILLDOWN[activeSlice.name] : null;
      const sliceColor = activeSlice
        ? PIE_COLORS[chart.data.findIndex((d) => d.name === activeSlice.name)]
        : "#8b5cf6";

      return (
        <div className="pie-modal-layout">
          {/* Pie side — shrinks to 30% when drill active */}
          <div className={`pie-modal-left ${activeSlice ? "pie-shrunk" : ""}`}>
            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  innerRadius="28%"
                  outerRadius="60%"
                  paddingAngle={4}
                  dataKey="value"
                  onClick={(d) =>
                    setActiveSlice((prev) => (prev?.name === d.name ? null : d))
                  }
                  cursor="pointer"
                  isAnimationActive
                  animationDuration={500}
                >
                  {chart.data.map((d, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[i]}
                      opacity={
                        activeSlice && activeSlice.name !== d.name ? 0.3 : 1
                      }
                      stroke={
                        activeSlice?.name === d.name ? "#fff" : "transparent"
                      }
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{
                    background: "#1a1a24",
                    border: "1px solid #2e2e3e",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-modal-legend">
              {chart.data.map((d, i) => (
                <div
                  key={i}
                  className={`pie-modal-legend-item ${activeSlice?.name === d.name ? "active" : ""} ${activeSlice && activeSlice.name !== d.name ? "dimmed" : ""}`}
                  onClick={() =>
                    setActiveSlice((prev) => (prev?.name === d.name ? null : d))
                  }
                >
                  <span
                    className="pie-modal-dot"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  <span className="pie-modal-name">{d.name}</span>
                  <span className="pie-modal-pct">{d.value}%</span>
                </div>
              ))}
            </div>
            {!activeSlice && (
              <p className="pie-click-hint">Click a slice to drill down</p>
            )}
          </div>

          {/* Drill-down bar chart — slides in from right */}
          <div
            className={`pie-modal-right ${activeSlice ? "drill-visible" : ""}`}
          >
            {drillData && (
              <>
                <div className="drill-header">
                  <span
                    className="drill-dot"
                    style={{ background: sliceColor }}
                  />
                  <span className="drill-title">
                    {activeSlice.name} — Breakdown
                  </span>
                  <button
                    className="drill-close"
                    onClick={() => setActiveSlice(null)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart
                    data={drillData}
                    layout="vertical"
                    margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e1e2a"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#7777aa", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fill: "#aaaacc", fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                      width={72}
                    />
                    <Tooltip
                      formatter={(v) => [`${v}%`, "Share"]}
                      contentStyle={{
                        background: "#1a1a24",
                        border: "1px solid #2e2e3e",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                      cursor={{ fill: "#ffffff06" }}
                    />
                    <Bar
                      dataKey="value"
                      fill={sliceColor}
                      radius={[0, 4, 4, 0]}
                      name="Share"
                      isAnimationActive
                      animationDuration={600}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="drill-hint">% share within {activeSlice.name}</p>
              </>
            )}
          </div>
        </div>
      );
    }
    if (chart.id === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chart.data}
            margin={{ top: 16, right: 24, bottom: 8, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e1e2a"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "#7777aa", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7777aa", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1a24",
                border: "1px solid #2e2e3e",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 13, color: "#7777aa" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={{ fill: "#8b5cf6", r: 4 }}
              name="Users"
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ fill: "#06b6d4", r: 4 }}
              name="Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chart.id === "runway") {
      return (
        <div className="runway-modal-layout">
          <div
            className={`runway-modal-chart ${runwayStage >= 1 ? "visible" : ""}`}
          >
            <div className="runway-modal-title-row">
              <span className="runway-modal-title">
                Collections vs demand notes - monthly (₹ Cr)
              </span>
              <span className="runway-modal-chip">Bar + Line</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart
                data={chart.data.collectionsVsDemand}
                margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e1e2a"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#7777aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#7777aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `₹${value} Cr`,
                    name === "demandNotes"
                      ? "Demand notes raised"
                      : "Collections received",
                  ]}
                  contentStyle={{
                    background: "#1a1a24",
                    border: "1px solid #2e2e3e",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  cursor={{ fill: "#ffffff06" }}
                />
                <Bar
                  dataKey="demandNotes"
                  fill="#8b5cf6"
                  radius={[5, 5, 0, 0]}
                  name="demandNotes"
                  isAnimationActive
                  animationDuration={600}
                />
                <Line
                  type="monotone"
                  dataKey="collections"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ fill: "#06b6d4", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="collections"
                  isAnimationActive
                  animationDuration={800}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: 12,
                    fontSize: 12,
                    color: "#9b9bc2",
                  }}
                  formatter={(value) =>
                    value === "demandNotes"
                      ? "Demand notes raised"
                      : "Collections received"
                  }
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`runway-modal-chart ${runwayStage >= 2 ? "visible" : ""}`}
          >
            <div className="runway-modal-title-row">
              <span className="runway-modal-title">FCF by project (₹ Cr)</span>
              <span className="runway-modal-chip">Vertical bars</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={chart.data.fcfByProject}
                barGap={4}
                barSize={80}
                margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e1e2a"
                  vertical={false}
                />
                <XAxis
                  dataKey="project"
                  tick={{ fill: "#7777aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  height={54}
                />
                <YAxis
                  tick={{ fill: "#7777aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a24",
                    border: "1px solid #2e2e3e",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  cursor={{ fill: "#ffffff06" }}
                  formatter={(value) => [`₹${value} Cr`, "FCF"]}
                />
                <ReferenceLine y={0} stroke="#44445a" strokeDasharray="4 4" />
                <Bar
                  dataKey="fcf"
                  fill="#8b5cf6"
                  radius={[5, 5, 0, 0]}
                  name="FCF"
                  isAnimationActive
                  animationDuration={500}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="runway-modal-legend">
              <span>
                <span className="dot" style={{ background: "#8b5cf6" }} />
                FCF by project
              </span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
              <path
                d="M3 9h18M9 21V9"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <h2 className="modal-title">{chart.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Chart area */}
        <div className="modal-chart-area">{renderChart()}</div>

        {/* AI chat log */}
        {messages.length > 0 && (
          <div className="modal-chat-log">
            {messages.map((m, i) => (
              <div key={i} className={`modal-msg modal-msg-${m.role}`}>
                {m.role === "ai" && <span className="modal-ai-label">AI</span>}
                <span className="modal-msg-text">{m.text}</span>
              </div>
            ))}
            {loading && (
              <div className="modal-msg modal-msg-ai">
                <span className="modal-ai-label">AI</span>
                <span className="modal-thinking">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* AI input */}
        <div className="modal-input-area">
          <div className="modal-input-wrapper">
            <div className="modal-input-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              ref={inputRef}
              className="modal-input"
              placeholder="Ask AI to modify this chart… e.g. 'change bar color to teal' or 'add a trend line'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className={`modal-send ${input.trim() ? "active" : ""}`}
              onClick={send}
              disabled={!input.trim() || loading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="modal-input-hint">Enter to send · Esc to close</p>
        </div>
      </div>
    </div>
  );
}
