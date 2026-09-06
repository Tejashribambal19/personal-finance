import Sidebar from "./Sidebar";

function PageLayout({ title, subtitle, action, children }) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-date">
              FINANCEFLOW
            </p>

            <h1>{title}</h1>

            <p>{subtitle}</p>
          </div>

          <div className="header-actions">
            <div className="user-avatar">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="header-user">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

            {action}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default PageLayout;