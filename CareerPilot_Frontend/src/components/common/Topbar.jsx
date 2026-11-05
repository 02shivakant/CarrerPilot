import { Menu, Search, Bell, Command } from "lucide-react";
export default function Topbar({ onMenu }) {
  return <header className="topbar">
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={18}/></button>
      <div className="search-box"><Search size={15}/><input placeholder="Search anything..." aria-label="Search"/></div>
    </div>
    <div className="top-actions"><span style={{color:"#6f7893",fontSize:10,display:"flex",alignItems:"center",gap:5}}><Command size={12}/> Workspace</span><button className="icon-button" aria-label="Notifications"><Bell size={16}/></button><div className="avatar">CP</div></div>
  </header>;
}
