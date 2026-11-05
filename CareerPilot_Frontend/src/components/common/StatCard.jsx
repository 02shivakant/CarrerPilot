export default function StatCard({ label, value, note, Icon, accent="#a99fff", tint="rgba(139,124,255,.13)" }) {
  return <div className="glass stat-card" style={{"--accent":accent,"--tint":tint,"--glow":tint}}><div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={17}/></span></div><div className="stat-value">{value}</div><div className="stat-foot">{note}</div></div>;
}
