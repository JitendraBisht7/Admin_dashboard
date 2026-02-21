import React, { useEffect, useState } from "react";
import axios from "axios";

export function Classrooms() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await axios.get("/api/teachers");
        setTeachers(res.data);
      } catch (e) {
        setError("Failed to load data.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Build a simple view: subjects as "classrooms" with assigned teachers
  const bySubject = React.useMemo(() => {
    const map = new Map();
    teachers.forEach((t) => {
      const key = t.subject;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return Array.from(map.entries()).map(([subject, list]) => ({
      subject,
      teachers: list,
      totalActivities: list.reduce(
        (acc, t) =>
          acc + t.totalLessons + t.totalQuizzes + t.totalAssessments,
        0
      ),
    }));
  }, [teachers]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="topbar-title">Classrooms</h1>
          <p className="topbar-subtitle">
            Overview by subject and teaching staff
          </p>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">Loading classrooms…</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <section className="page-content">
          <h2 className="section-title">By Subject</h2>
          <div className="classrooms-grid">
            {bySubject.map(({ subject, teachers: list, totalActivities }) => (
              <div key={subject} className="classroom-card">
                <div className="classroom-card-header">
                  <h3 className="classroom-subject">{subject}</h3>
                  <span className="classroom-activity-badge">
                    {totalActivities} activities
                  </span>
                </div>
                <div className="classroom-teachers">
                  <span className="classroom-label">Teachers</span>
                  <ul className="classroom-teacher-list">
                    {list.map((t) => (
                      <li key={t._id}>
                        <span className="teacher-name">{t.name}</span>
                        <span className="teacher-stats-mini">
                          {t.totalLessons} L · {t.totalQuizzes} Q ·{" "}
                          {t.totalAssessments} A
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
