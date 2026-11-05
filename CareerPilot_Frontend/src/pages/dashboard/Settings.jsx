import { useState } from "react";
import { Bell, ShieldCheck, Palette, UserRound } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
export default function Settings() {
 const [prefs,setPrefs]=useState({updates:true,interviews:true,newsletter:false,weekly:true});
 const toggle=(key)=>setPrefs(p=>({...p,[key]:!p[key]}));
 const rows=[["updates","Application updates","Get notified when your application status changes."],["interviews","Interview reminders","Receive reminders before upcoming interviews."],["newsletter","Career insights","Occasional tips, resources and career inspiration."],["weekly","Weekly progress summary","A quick recap of your career activity each week."]];
 return <><PageHeader title="Settings" description="Make CareerPilot work the way you do."/>
  <div className="glass panel" style={{marginBottom:17}}><div className="panel-head"><div style={{display:"flex",alignItems:"center",gap:10}}><div className="stat-icon"><Bell size={16}/></div><div><h3>Notifications</h3><p>Choose what you'd like to hear about</p></div></div></div>{rows.map(([key,title,desc])=><div className="settings-row" key={key}><div><strong>{title}</strong><p>{desc}</p></div><button className={`toggle ${prefs[key]?"on":""}`} onClick={()=>toggle(key)} aria-label={`Toggle ${title}`} aria-pressed={prefs[key]}><span/></button></div>)}</div>
  <div className="glass panel"><div className="panel-head"><div style={{display:"flex",alignItems:"center",gap:10}}><div className="stat-icon"><ShieldCheck size={16}/></div><div><h3>Account & privacy</h3><p>Manage your account preferences</p></div></div></div><div className="settings-row"><div><strong>Account security</strong><p>Your account is protected by your current sign-in credentials.</p></div><span className="pill green">JWT enabled</span></div><div className="settings-row"><div><strong>Appearance</strong><p>CareerPilot is currently using the Midnight Glass theme.</p></div><span className="pill">Dark mode</span></div><div className="settings-row"><div><strong>Preference storage</strong><p>Notification toggles are a local UI preview and are not saved yet.</p></div><span className="pill amber">Preview</span></div></div>
 </>;
}
