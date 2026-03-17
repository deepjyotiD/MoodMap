import { Home, BarChart3, Calendar, Lightbulb, TrendingUp, Settings, PenLine } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'log', label: 'Log Mood', icon: PenLine },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar" id="sidebar-desktop">
        <a className="sidebar-logo" href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
          <div className="sidebar-logo-icon">🧠</div>
          <span className="sidebar-logo-text">MoodMap</span>
        </a>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            id="nav-settings"
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
          >
            <Settings />
            Settings
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav" id="mobile-navigation">
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.id}
            className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
