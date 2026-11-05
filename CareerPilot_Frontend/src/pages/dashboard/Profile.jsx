import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../services/authService";
import { UserRound, Save } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
export default function Profile() {
 const {user,setUser}=useContext(AuthContext);
 const [form,setForm]=useState({full_name:"",email:"",graduation_year:"",target_role:"",preferred_location:"",skills:""});
 const [loading,setLoading]=useState(false); const [message,setMessage]=useState("");
 useEffect(()=>{let active=true;getProfile().then(data=>{if(!active)return;setUser(data);setForm({full_name:data.full_name||"",email:data.email||"",graduation_year:data.graduation_year||"",target_role:data.target_role||"",preferred_location:data.preferred_location||"",skills:Array.isArray(data.skills)?data.skills.join(", "):data.skills||""})}).catch(()=>{if(user)setForm(f=>({...f,full_name:user.full_name||"",email:user.email||""}))});return()=>{active=false}},[]);
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const save=async e=>{e.preventDefault();setLoading(true);setMessage("");try{const payload={...form,skills:form.skills.split(",").map(s=>s.trim()).filter(Boolean)};const result=await updateProfile(payload);setUser(result);setMessage("Profile updated successfully.")}catch(err){setMessage(err.response?.data?.detail||"Profile update could not be saved. Check the API fields.")}finally{setLoading(false)}};
 return <><PageHeader title="My profile" description="Make it easy for opportunities to find the right version of you."/>
  <div className="profile-layout"><aside className="glass profile-card"><div className="profile-avatar"><UserRound size={31}/></div><h3>{form.full_name||"Your name"}</h3><p>{form.target_role||"Add your target role"}</p><div style={{textAlign:"left",marginTop:25}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:9}}><span style={{color:"var(--muted)"}}>Profile completion</span><strong>72%</strong></div><div className="progress-track"><div className="progress-fill" style={{width:"72%"}}/></div></div><span className="pill" style={{marginTop:18}}>Career profile</span></aside>
   <form className="glass profile-form" onSubmit={save}><div className="panel-head"><div><h3>Personal information</h3><p>Keep your details current</p></div></div><div className="form-grid">{[["full_name","Full name"],["email","Email address"],["graduation_year","Graduation year"],["target_role","Target role"],["preferred_location","Preferred location"],["skills","Skills (comma separated)"]].map(([name,label])=><div className="form-field" key={name}><label>{label}</label><input name={name} value={form[name]} onChange={change} placeholder={label}/></div>)}</div>{message&&<p style={{color:message.includes("success")?"var(--green)":"var(--red)",fontSize:11,marginTop:15}}>{message}</p>}<div style={{display:"flex",justifyContent:"flex-end",marginTop:22}}><button className="btn" disabled={loading}><Save size={14}/>{loading?"Saving...":"Save changes"}</button></div></form>
  </div>
 </>;
}
