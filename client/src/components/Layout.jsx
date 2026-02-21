import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

export function Layout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">SAVRA</div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">MAIN</div>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/dashboard/teachers"
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <span className="nav-icon">👥</span>
            <span>Teachers</span>
          </NavLink>
          <NavLink
            to="/dashboard/classrooms"
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <span className="nav-icon">🏫</span>
            <span>Classrooms</span>
          </NavLink>
          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <span className="nav-icon">📄</span>
            <span>Reports</span>
          </NavLink>
        </nav>
        <div className="sidebar-profile">
          <div className="profile-avatar">SA</div>
          <div className="profile-info">
            <div className="profile-role">ADMIN</div>
            <div className="profile-name">SAMBHA</div>
          </div>
          <button onClick={handleLogout} className="profile-logout" title="Logout">
            🚪
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
