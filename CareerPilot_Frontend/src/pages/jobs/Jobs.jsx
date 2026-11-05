import { useState } from "react";
import { Search, MapPin, BriefcaseBusiness, Bookmark, ArrowUpRight } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
const jobs = [
 ["Frontend Developer","BrightLayer","Remote · India","Full-time","₹6–9 LPA","BL"],
 ["Software Engineer I","Northstar Labs","Bengaluru, India","Full-time","₹8–12 LPA","NL"],
 ["React Developer Intern","PixelForge","Hybrid · Noida","Internship","₹20–30K/mo","PF"],
 ["Python Developer","CloudCanvas","Remote · India","Full-time","₹5–8 LPA","CC"],
 ["Backend Engineer Intern","Orbit Systems","Pune, India","Internship","₹25–35K/mo","OS"],
 ["Associate Software Engineer","VertexWorks","Hyderabad, India","Full-time","₹7–10 LPA","VW"]
];
export default function Jobs() {
 const [query,setQuery]=useState(""); const [saved,setSaved]=useState([]);
 const filtered=jobs.filter(j=>j.join(" ").toLowerCase().includes(query.toLowerCase()));
 return <><PageHeader title="Explore opportunities" description="Discover roles that align with your skills and the direction you want to grow." action={<span className="pill green">Curated for you</span>}/>
  <div className="toolbar"><div className="search-box" style={{width:"min(390px,100%)"}}><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search roles, companies or locations..."/></div><select className="select-dark"><option>All job types</option><option>Full-time</option><option>Internship</option></select><select className="select-dark"><option>Any location</option><option>Remote</option><option>Bengaluru</option></select></div>
  <div className="grid" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>{filtered.map((j,i)=><article className="glass panel" key={j[1]}><div style={{display:"flex",justifyContent:"space-between",gap:12}}><div className="company"><div className="company-logo">{j[5]}</div><div><strong>{j[1]}</strong><small>{j[2]}</small></div></div><button className="icon-button" aria-label="Save job" onClick={()=>setSaved(s=>s.includes(j[1])?s.filter(x=>x!==j[1]):[...s,j[1]])}><Bookmark size={15} fill={saved.includes(j[1])?"currentColor":"none"}/></button></div><h3 style={{font:"700 15px Manrope",margin:"18px 0 8px"}}>{j[0]}</h3><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><span className="pill">{j[3]}</span><span className="pill green">{j[4]}</span></div><div className="resume-meta"><span><MapPin size={11} style={{verticalAlign:"middle"}}/> {j[2]}</span><button className="btn secondary" onClick={()=>alert("This is a UI preview. Job application API integration will be added in the next phase.")}>View role <ArrowUpRight size={13}/></button></div></article>)}</div>
  {filtered.length===0&&<div className="glass empty-note">No matching opportunities. Try another search.</div>}
 </>;
}
