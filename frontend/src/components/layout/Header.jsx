import { useLocation } from "react-router-dom";

function Header({ onMenuClick }) {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/") {
      return "Dashboard";
    }

    if (location.pathname === "/recipes/add") {
      return "Add Recipe";
    }

    if (location.pathname.includes("/recipes/edit")) {
      return "Edit Recipe";
    }

    if (location.pathname.includes("/recipe/")) {
      return "Recipe Details";
    }

    return "Recipe Management";
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          type="button"
        >
          ☰
        </button>

        <div>
          <h1>{getTitle()}</h1>
          <p>Manage your recipes easily</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="notification-button"
          type="button"
        >
          🔔
        </button>

        <div className="header-user">
          <div className="user-avatar">
            U
          </div>

          <div className="header-user-info">
            <strong>User</strong>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;