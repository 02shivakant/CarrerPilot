import { Activity, Target, TrendingUp, Trophy } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
export default function Analytics() {
 const bars=[34,52,43,68,57,82,65,91,72,78,61,88];
 return <><PageHeader title="Career analytics" description="Understand your momentum and make your next move with clarity."/>
  <div className="grid stats-grid"><StatCard label="Total applications" value="24" note="Across 6 companies" Icon={Activity}/><StatCard label="Interview conversion" value="33%" note="8 interviews from 24 applications" Icon={Target} accent="#59d4e4" tint="rgba(83,213,232,.12)"/><StatCard label="Response rate" value="32%" note="A useful signal to keep improving" Icon={TrendingUp} accent="#61dcae" tint="rgba(75,214,160,.12)"/><StatCard label="Career momentum" value="Strong" note="Consistent activity this month" Icon={Trophy} accent="#f2bd70" tint="rgba(247,189,104,.12)"/></div>
  <div className="grid dashboard-grid"><section className="glass panel"><div className="panel-head"><div><h3>Monthly applications</h3><p>Illustrative activity across the year</p></div><span className="pill">2026</span></div><div className="chart-bars" style={{height:245}}>{bars.map((v,i)=><div className="chart-col" key={i}><div className="chart-bar" style={{height:`${v}%`}}/><small>{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</small></div>)}</div></section>
  <section className="glass panel"><div className="panel-head"><div><h3>Application funnel</h3><p>Progress through your pipeline</p></div></div>{[["Applied",24,100],["Shortlisted",12,50],["Interview",8,33],["Offer",2,8]].map(([label,n,p])=><div key={label} style={{marginBottom:21}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:8}}><span>{label}</span><strong>{n}</strong></div><div className="progress-track"><div className="progress-fill" style={{width:`${p}%`}}/></div></div>)}</section></div>
  <p style={{fontSize:10,color:"var(--muted)",marginTop:15}}>Analytics currently use illustrative demo metrics. Live calculations will be connected to your application records.</p>
 </>;
}
