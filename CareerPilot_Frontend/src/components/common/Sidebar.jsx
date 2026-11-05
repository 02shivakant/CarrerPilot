import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, BriefcaseBusiness, KanbanSquare, UserRound, ChartNoAxesCombined, Settings, Sparkles, LogOut, X } from "lucide-react";

const mainLinks = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/dashboard/resumes", "Resume manager", FileText],
  ["/dashboard/jobs", "Explore jobs", BriefcaseBusiness],
  ["/dashboard/applications", "Applications", KanbanSquare],
];
const accountLinks = [
  ["/dashboard/profile", "My profile", UserRound],
  ["/dashboard/analytics", "Analytics", ChartNoAxesCombined],
  ["/dashboard/settings", "Settings", Settings],
];

export default function Sidebar({ open, close, onLogout }) {
  const links = (items) => items.map(([to,label,Icon]) => (
    <NavLink key={to} to={to} end={to === "/dashboard"} onClick={close} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>
      <Icon size={17} strokeWidth={1.8}/>{label}
    </NavLink>
  ));
  return <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand"><span className="brand-mark"><Sparkles size={19}/></span><span>Career<span>Pilot</span></span></div>
    <div className="nav-label">WORKSPACE</div><nav className="nav-list">{links(mainLinks)}</nav>
    <div className="nav-label" style={{marginTop:22}}>PREFERENCES</div><nav className="nav-list">{links(accountLinks)}</nav>
    <div className="sidebar-bottom">
      <div className="help-card"><Sparkles size={17} color="#b3aaff"/><strong>Your next chapter starts here</strong><p>Keep your profile sharp and stay ready for your next opportunity.</p><a href="/dashboard/profile">Complete your profile →</a></div>
      <div className="user-mini"><div className="avatar">CP</div><div style={{flex:1}}><strong>CareerPilot member</strong><small>Personal workspace</small></div><button className="icon-button" aria-label="Logout" onClick={onLogout}><LogOut size={15}/></button></div>
    </div>
  </aside>;
}
