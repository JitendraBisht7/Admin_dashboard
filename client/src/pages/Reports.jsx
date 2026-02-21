import React, { useEffect, useState } from "react";
import axios from "axios";

export function Reports() {
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [summaryRes, insightsRes] = await Promise.all([
          axios.get("/api/analytics/weekly-summary"),
          axios.get(`/api/analytics/insights?period=${period}`),
        ]);
        setWeeklySummary(summaryRes.data);
        setInsights(insightsRes.data);
      } catch (e) {
        setError("Failed to load report data.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [period]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="topbar-title">Reports</h1>
          <p className="topbar-subtitle">
            Summary reports and analytics overview
          </p>
        </div>
        <div className="topbar-right">
          <div className="time-period-buttons">
            <button
              type="button"
              className={`time-btn ${period === "week" ? "active" : ""}`}
              onClick={() => setPeriod("week")}
            >
              This Week
            </button>
            <button
              type="button"
              className={`time-btn ${period === "month" ? "active" : ""}`}
              onClick={() => setPeriod("month")}
            >
              This Month
            </button>
            <button
              type="button"
              className={`time-btn ${period === "year" ? "active" : ""}`}
              onClick={() => setPeriod("year")}
            >
              This Year
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">Loading report…</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <section className="page-content reports-content">
          <div className="report-section">
            <h2 className="section-title">Summary metrics</h2>
            {insights && (
              <div className="insights-cards-grid">
                <div
                  className="insight-card"
                  style={{ backgroundColor: "#F3E8FF" }}
                >
                  <div className="insight-icon">👥</div>
                  <div className="insight-content">
                    <div className="insight-value">
                      {insights.activeTeachers}
                    </div>
                    <div className="insight-label">Active Teachers</div>
                  </div>
                </div>
                <div
                  className="insight-card"
                  style={{ backgroundColor: "#D1FAE5" }}
                >
                  <div className="insight-icon">📚</div>
                  <div className="insight-content">
                    <div className="insight-value">
                      {insights.lessonsCreated}
                    </div>
                    <div className="insight-label">Lessons Created</div>
                  </div>
                </div>
                <div
                  className="insight-card"
                  style={{ backgroundColor: "#FEF3C7" }}
                >
                  <div className="insight-icon">📋</div>
                  <div className="insight-content">
                    <div className="insight-value">
                      {insights.quizzesConducted}
                    </div>
                    <div className="insight-label">Quizzes Conducted</div>
                  </div>
                </div>
                <div
                  className="insight-card"
                  style={{ backgroundColor: "#FED7AA" }}
                >
                  <div className="insight-icon">📝</div>
                  <div className="insight-content">
                    <div className="insight-value">
                      {insights.assessmentsMade}
                    </div>
                    <div className="insight-label">Assessments Made</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="report-section">
            <h2 className="section-title">Weekly summary</h2>
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Week starting</th>
                    <th>Lessons</th>
                    <th>Quizzes</th>
                    <th>Assessments</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySummary.map((w, i) => (
                    <tr key={i}>
                      <td>
                        {new Date(w.weekStart).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>{w.lessonsCreated}</td>
                      <td>{w.quizzesCreated}</td>
                      <td>{w.assessmentsCreated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </section>
      )}
    </>
  );
}
