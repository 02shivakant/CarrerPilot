import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
const initial = [
 {company:"Google",role:"Frontend Developer",date:"Nov 03",status:"Applied",tag:"green"},
 {company:"Microsoft",role:"Product Intern",date:"Oct 29",status:"Interview",tag:"amber"},
 {company:"Atlassian",role:"Software Engineer",date:"Oct 22",status:"Shortlisted",tag:""},
 {company:"Adobe",role:"Associate Developer",date:"Oct 18",status:"Applied",tag:"green"},
 {company:"Flipkart",role:"SDE Intern",date:"Oct 12",status:"Rejected",tag:"red"},
 {company:"Razorpay",role:"Backend Intern",date:"Oct 08",status:"Interview",tag:"amber"},
];
const stages=["Applied","Shortlisted","Interview","Offer"];
export default function Applications() {
 const [items,setItems]=useState(initial);
 const [filter,setFilter]=useState("All");
 const changeStatus=(company,status)=>setItems(old=>old.map(x=>x.company===company?{...x,status}:x));
 const visible=filter==="All"?items:items.filter(x=>x.status===filter);
 return <><PageHeader title="Application tracker" description="One organized space for every opportunity you're pursuing." action={<button className="btn" onClick={()=>alert("Application creation will be connected to the backend in the integration phase.")}><Plus size={14}/> Add application</button>}/>
  <div className="toolbar"><span className="pill"> {items.length} tracked opportunities</span><select className="select-dark" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{[...stages,"Rejected"].map(s=><option key={s}>{s}</option>)}</select></div>
  <div className="board">{stages.map(stage=><section className="board-column" key={stage}><div className="board-title"><span>{stage}</span><span className="board-count">{items.filter(x=>x.status===stage).length}</span></div>{items.filter(x=>x.status===stage&& (filter==="All"||filter===stage)).map(x=><article className="job-card" key={x.company}><div style={{display:"flex",justifyContent:"space-between"}}><h4>{x.company}</h4><MoreHorizontal size={15} color="#77819c"/></div><p>{x.role}</p><div className="job-card-foot"><span>{x.date}, 2026</span><select aria-label={`Change ${x.company} status`} className="select-dark" style={{minWidth:0,width:105,padding:"5px",fontSize:9}} value={x.status} onChange={e=>changeStatus(x.company,e.target.value)}>{[...stages,"Rejected"].map(s=><option key={s}>{s}</option>)}</select></div></article>)}</section>)}</div>
  <p style={{color:"var(--muted)",fontSize:10,marginTop:14}}>Demo records are held in page state only. Backend persistence will be connected separately.</p>
 </>;
}
