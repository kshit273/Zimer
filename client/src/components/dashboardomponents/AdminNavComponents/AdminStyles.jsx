// Shared dark-theme font injector for all Admin components.
// Import and render <AdminStyles /> once at the top of AdminDashboard.

const AdminStyles = () => (
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap"
      rel="stylesheet"
    />
    <style>{`
      .font-bebas   { font-family: 'Bebas Neue', sans-serif; }
      .font-dm-mono { font-family: 'DM Mono', monospace; }

      .admin-grid-bg {
        background-image:
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
        background-size: 48px 48px;
      }

      @keyframes pulse-dot  { 0%,100%{opacity:1} 50%{opacity:.3} }
      .pulse-dot { animation: pulse-dot 2s infinite; }

      @keyframes admin-fade-up {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0);    }
      }
      .fade-up      { animation: admin-fade-up 0.5s ease both; }
      .fade-up-d1   { animation-delay: 0.08s; }
      .fade-up-d2   { animation-delay: 0.16s; }
      .fade-up-d3   { animation-delay: 0.24s; }
      .fade-up-d4   { animation-delay: 0.32s; }
    `}</style>
  </>
);

export default AdminStyles;