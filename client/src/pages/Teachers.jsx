import React, { useEffect, useState } from "react";
import axios from "axios";

export function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        setLoading(true);
        const res = await axios.get("/api/teachers");
        setTeachers(res.data);
        if (res.data.length > 0 && !selectedId) {
          setSelectedId(res.data[0]._id);
          setSelectedTeacher(res.data[0]);
        }
      } catch (e) {
        setError("Failed to load teachers.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedId && teachers.length) {
      const t = teachers.find((x) => x._id === selectedId) || teachers[0];
      setSelectedTeacher(t);
    }
  }, [selectedId, teachers]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="topbar-title">Teachers</h1>
          <p className="topbar-subtitle">
            View and manage teacher performance and activity
          </p>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">Loading teachers…</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <section className="page-content">
          <div className="teachers-layout">
            <div className="teachers-list-panel">
              <h2 className="panel-title">All Teachers</h2>
              <ul className="teachers-list">
                {teachers.map((t) => (
                  <li key={t._id}>
                    <button
                      type="button"
                      className={`teacher-list-item ${
                        selectedId === t._id ? "active" : ""
                      }`}
                      onClick={() => setSelectedId(t._id)}
                    >
                      <span className="teacher-list-name">{t.name}</span>
                      <span className="teacher-list-subject">{t.subject}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="teacher-detail-panel">
              {selectedTeacher ? (
                <>
                  <h2 className="panel-title">
                    {selectedTeacher.name} · {selectedTeacher.subject}
                  </h2>
                  <div className="teacher-stats-grid">
                    <div
                      className="insight-card"
                      style={{ backgroundColor: "#F3E8FF" }}
                    >
                      <div className="insight-icon">📚</div>
                      <div className="insight-content">
                        <div className="insight-value">
                          {selectedTeacher.totalLessons}
                        </div>
                        <div className="insight-label">Lessons</div>
                      </div>
                    </div>
                    <div
                      className="insight-card"
                      style={{ backgroundColor: "#FEF3C7" }}
                    >
                      <div className="insight-icon">📋</div>
                      <div className="insight-content">
                        <div className="insight-value">
                          {selectedTeacher.totalQuizzes}
                        </div>
                        <div className="insight-label">Quizzes</div>
                      </div>
                    </div>
                    <div
                      className="insight-card"
                      style={{ backgroundColor: "#FED7AA" }}
                    >
                      <div className="insight-icon">📝</div>
                      <div className="insight-content">
                        <div className="insight-value">
                          {selectedTeacher.totalAssessments}
                        </div>
                        <div className="insight-label">Assessments</div>
                      </div>
                    </div>
                  </div>
                  <div className="teacher-weekly-section">
                    <h3 className="subsection-title">Weekly activity</h3>
                    {selectedTeacher.weeklyActivity?.length ? (
                      <ul className="weekly-activity-list">
                        {selectedTeacher.weeklyActivity.map((w, i) => (
                          <li key={i} className="weekly-activity-item">
                            <span className="week-label">
                              {new Date(w.weekStart).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </span>
                            <span className="week-stats">
                              Lessons: {w.lessonsCreated} · Quizzes:{" "}
                              {w.quizzesCreated} · Assessments:{" "}
                              {w.assessmentsCreated}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No weekly data yet.</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-muted">Select a teacher to view details.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
