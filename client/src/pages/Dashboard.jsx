import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [dailyActivity, setDailyActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timePeriod, setTimePeriod] = useState("week");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const gradeParam = encodeURIComponent(selectedGrade);
        const subjectParam = encodeURIComponent(selectedSubject);
        const [insightsRes, dailyRes] = await Promise.all([
          axios.get(`/api/analytics/insights?period=${timePeriod}&grade=${gradeParam}&subject=${subjectParam}`),
          axios.get(`/api/analytics/daily-activity?period=${timePeriod}&grade=${gradeParam}&subject=${subjectParam}`),
        ]);
        setInsights(insightsRes.data);
        setDailyActivity(dailyRes.data);
      } catch (e) {
        setError("Failed to load dashboard data.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timePeriod, selectedGrade, selectedSubject]);

  const chartData = useMemo(() => {
    return dailyActivity.map((day) => ({
      day: day.day,
      lessons: day.lessons,
      quizzes: day.quizzes,
      assessments: day.assessments,
    }));
  }, [dailyActivity]);

  const insightsCards = useMemo(() => {
    if (!insights) return [];

    const periodLabel =
      timePeriod === "week"
        ? "This week"
        : timePeriod === "month"
          ? "This month"
          : "This year";

    return [
      {
        label: "Active Teachers",
        value: insights.activeTeachers,
        icon: "👥",
        bgColor: "#F3E8FF",
        period: periodLabel,
      },
      {
        label: "Lessons Created",
        value: insights.lessonsCreated,
        icon: "📚",
        bgColor: "#D1FAE5",
        period: periodLabel,
      },
      {
        label: "Assessments Made",
        value: insights.assessmentsMade,
        icon: "📝",
        bgColor: "#FED7AA",
        period: periodLabel,
      },
      {
        label: "Quizzes Conducted",
        value: insights.quizzesConducted,
        icon: "📋",
        bgColor: "#FEF3C7",
        period: periodLabel,
      },
      {
        label: "Submission Rate",
        value: `${insights.submissionRate}%`,
        icon: "📊",
        bgColor: "#F9FAFB",
        period: periodLabel,
      },
    ];
  }, [insights, timePeriod]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="topbar-title">Admin Companion</h1>
          <p className="topbar-subtitle">
            See What's Happening Across your School
          </p>
        </div>
        <div className="topbar-right">
          <select
            className="filter-select filter-purple"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option>All Grades</option>
            <option>Grade 7</option>
            <option>Grade 8</option>
            <option>Grade 9</option>
            <option>Grade 10</option>
          </select>
          <select
            className="filter-select filter-white"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>Social Studies</option>
          </select>
          <div className="time-period-buttons">
            <button
              className={`time-btn ${timePeriod === "week" ? "active" : ""}`}
              onClick={() => setTimePeriod("week")}
            >
              This Week
            </button>
            <button
              className={`time-btn ${timePeriod === "month" ? "active" : ""}`}
              onClick={() => setTimePeriod("month")}
            >
              This Month
            </button>
            <button
              className={`time-btn ${timePeriod === "year" ? "active" : ""}`}
              onClick={() => setTimePeriod("year")}
            >
              This Year
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">Loading insights…</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <>
          <section className="insights-section">
            <h2 className="section-title">Insights</h2>
            <div className="insights-cards-grid">
              {insightsCards.map((card) => (
                <div
                  key={card.label}
                  className="insight-card"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <div className="insight-icon">{card.icon}</div>
                  <div className="insight-content">
                    <div className="insight-value">{card.value}</div>
                    <div className="insight-label">{card.label}</div>
                    <div className="insight-period">{card.period}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="content-grid">
            <div className="weekly-activity-panel">
              <div className="panel-header">
                <h2 className="panel-title">Weekly Activity</h2>
                <p className="panel-subtitle">Content creation trends</p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[0, "dataMax + 1"]} />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="lessons" name="Lessons" fill="#22c55e" barSize={28} />
                    <Bar dataKey="assessments" name="Assessments" fill="#a78bfa" barSize={18} />
                    <Line
                      type="monotone"
                      dataKey="quizzes"
                      name="Quizzes"
                      stroke="#f97316"
                      strokeWidth={3}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>


          </section>
        </>
      )}
    </>
  );
}
