import { useContext, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const logoutNow = () => { logout(); navigate("/login"); };
  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} onLogout={logoutNow} />
      {menuOpen && <button aria-label="Close navigation" onClick={() => setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:25,background:"#0009",border:0}} />}
      <main className="main-area">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <div className="content" key={location.pathname}><Outlet /></div>
      </main>
    </div>
  );
}
