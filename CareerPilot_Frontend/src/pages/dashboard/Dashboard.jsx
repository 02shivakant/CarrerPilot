import { ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, FileText, Send, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

const activity = [
  ["Application submitted","Frontend Developer · Google","2 hours ago",Send],
  ["Resume updated","Software Engineer Resume","Yesterday",FileText],
  ["Interview scheduled","Product Intern · Microsoft","2 days ago",CalendarDays],
  ["Profile milestone","Skills section completed","3 days ago",CheckCircle2],
];
const interviews = [
  ["MS","Microsoft","Product Intern","Tomorrow · 10:30 AM"],
  ["NV","NovaTech","Frontend Engineer","Fri, Nov 08 · 2:00 PM"],
];
export default function Dashboard() {
  return <>
    <PageHeader eyebrow="WEDNESDAY, NOVEMBER 05" title="Your career, in motion." description="A clear view of your progress, opportunities and next steps." action={<button className="btn"><Sparkles size={14}/> Career snapshot</button>}/>
    <div className="glass" style={{padding:23,marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,background:"linear-gradient(105deg,rgba(105,88,225,.22),rgba(23,33,59,.75) 60%,rgba(41,111,139,.12))"}}>
      <div><div className="eyebrow">YOUR NEXT MOVE</div><h2 style={{font:"800 19px Manrope",marginBottom:7}}>Small steps. Big career momentum.</h2><p style={{color:"var(--muted)",fontSize:11}}>Complete your profile and keep your applications moving forward.</p></div><div style={{textAlign:"right",minWidth:115}}><div style={{font:"800 26px Manrope",color:"#b7adff"}}>72%</div><div style={{fontSize:9,color:"var(--muted)",marginBottom:9}}>PROFILE STRENGTH</div><div className="progress-track"><div className="progress-fill" style={{width:"72%"}}/></div></div>
    </div>
    <div className="grid stats-grid">
      <StatCard label="Applications sent" value="24" note={<><span className="positive">↑ 18%</span> compared to last month</>} Icon={Send}/>
      <StatCard label="Interviews" value="08" note={<><span className="positive">↑ 2</span> new this month</>} Icon={Users} accent="#5ed8e5" tint="rgba(83,213,232,.12)"/>
      <StatCard label="Saved opportunities" value="16" note="Roles worth exploring" Icon={BriefcaseBusiness} accent="#f2bd70" tint="rgba(247,189,104,.12)"/>
      <StatCard label="Response rate" value="32%" note={<><span className="positive">↑ 6.4%</span> from previous period</>} Icon={Target} accent="#62dcae" tint="rgba(75,214,160,.12)"/>
    </div>
    <div className="grid dashboard-grid">
      <section className="glass panel"><div className="panel-head"><div><h3>Application activity</h3><p>Your job search rhythm over the last 7 months</p></div><span className="pill">This year</span></div>
        <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:6}}><strong style={{font:"800 25px Manrope"}}>24 <span style={{fontSize:10,color:"var(--muted)",fontWeight:400}}>applications</span></strong><span className="positive" style={{fontSize:10}}>↗ 18.2%</span></div>
        <div className="chart-bars">{[36,52,43,72,58,88,66].map((v,i)=><div className="chart-col" key={i}><div className="chart-bar" style={{height:`${v}%`}}/><small>{["May","Jun","Jul","Aug","Sep","Oct","Nov"][i]}</small></div>)}</div>
      </section>
      <section className="glass panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Latest updates from your workspace</p></div><a className="subtle-link" href="/dashboard/applications">View all</a></div>
        <div className="activity-list">{activity.map(([title,desc,time,Icon])=><div className="activity-item" key={title}><div className="activity-dot"><Icon size={15}/></div><div><strong>{title}</strong><p>{desc}</p><time>{time}</time></div></div>)}</div>
      </section>
    </div>
    <section className="glass panel" style={{marginTop:18}}><div className="panel-head"><div><h3>Upcoming interviews</h3><p>Be prepared for the conversations ahead</p></div><a className="subtle-link" href="/dashboard/applications">Open tracker →</a></div>
      {interviews.map(([initials,company,role,date])=><div className="interview-row" key={company}><div className="company"><div className="company-logo">{initials}</div><div><strong>{company}</strong><small>{role}</small></div></div><span style={{fontSize:10,color:"var(--muted)"}}><Clock3 size={12} style={{verticalAlign:"middle",marginRight:5}}/>{date}</span><span className="pill green">Upcoming</span></div>)}
    </section>
  </>;
}
