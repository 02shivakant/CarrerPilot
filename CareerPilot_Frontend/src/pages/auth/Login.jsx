import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser, getProfile } from "../../services/authService";
import { Sparkles } from "lucide-react";

export default function Login() {
 const navigate=useNavigate(); const {login,setUser}=useContext(AuthContext);
 const [formData,setFormData]=useState({username:"",password:""}); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 const handleChange=e=>setFormData({...formData,[e.target.name]:e.target.value});
 const handleSubmit=async e=>{e.preventDefault();setError("");if(!formData.username.trim()||!formData.password){setError("Please enter username and password.");return}try{setLoading(true);const response=await loginUser(formData);login(response.access,response.refresh);try{const profile=await getProfile();setUser(profile)}catch(err){console.error("Profile fetch failed:",err)}navigate("/dashboard")}catch(err){const data=err.response?.data;setError(data?.detail||data?.message||data?.non_field_errors?.[0]||"Invalid username or password.")}finally{setLoading(false)}};
 return <div className="auth-screen"><section className="auth-art"><div className="brand"><span className="brand-mark"><Sparkles size={19}/></span><span>Career<span>Pilot</span></span></div><div className="auth-art-copy"><div className="eyebrow">YOUR CAREER COMMAND CENTER</div><h2>Navigate your future.<br/><span>Own your journey.</span></h2><p>Bring your resumes, opportunities and career progress together in one focused workspace.</p></div><div className="auth-art-foot">© 2026 CareerPilot · Built for what comes next.</div></section>
 <section className="auth-form-side"><div className="auth-card"><div className="eyebrow">WELCOME BACK</div><h1>Sign in to CareerPilot</h1><p className="auth-subtitle">Pick up where you left off. Your next opportunity is waiting.</p>{error&&<div className="error-message">{error}</div>}
 <form onSubmit={handleSubmit}><div className="form-group"><label>USERNAME</label><input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} autoComplete="username"/></div><div className="form-group"><label>PASSWORD</label><input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} autoComplete="current-password"/></div><button type="submit" disabled={loading}>{loading?"Signing in...":"Sign in to workspace"}</button></form><p className="auth-footer">New to CareerPilot? <Link to="/register">Create an account</Link></p></div></section></div>;
}
