import { NavLink } from "react-router-dom";
import "./../../styles/layout.css";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🍳</div>

          <div>
            <h2>Savorly</h2>
            
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span>▦</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/"
            className="sidebar-link"
            onClick={onClose}
          >
            <span>🍽</span>
            Recipes
          </NavLink>

          <NavLink
            to="/recipes/add"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span>＋</span>
            Add Recipe
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              U
            </div>

            <div>
              <strong>User</strong>
              <span>Savorly</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;