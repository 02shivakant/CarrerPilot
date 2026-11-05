
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import { AuthContext } from "../../context/AuthContext";

const DEFAULT_PREFS = {
  updates: true,
  interviews: true,
  newsletter: false,
  weekly: true,
};

export default function Settings() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("careerpilot_preferences");

      return saved
        ? { ...DEFAULT_PREFS, ...JSON.parse(saved) }
        : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "careerpilot_preferences",
      JSON.stringify(prefs)
    );
  }, [prefs]);

  const toggle = (key) => {
    setPrefs((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const rows = [
    [
      "updates",
      "Application updates",
      "Get notified when your application status changes.",
    ],
    [
      "interviews",
      "Interview reminders",
      "Receive reminders before upcoming interviews.",
    ],
    [
      "newsletter",
      "Career insights",
      "Occasional tips, resources and career inspiration.",
    ],
    [
      "weekly",
      "Weekly progress summary",
      "A quick recap of your career activity each week.",
    ],
  ];

  return (
    <>
      <PageHeader
        title="Settings"
        description="Make CareerPilot work the way you do."
      />

      {/* Notification preferences */}
      <div className="glass panel" style={{ marginBottom: 17 }}>
        <div className="panel-head">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div className="stat-icon">
              <Bell size={16} />
            </div>

            <div>
              <h3>Notifications</h3>
              <p>Choose your notification preferences</p>
            </div>
          </div>
        </div>

        {rows.map(([key, title, desc]) => (
          <div className="settings-row" key={key}>
            <div>
              <strong>{title}</strong>
              <p>{desc}</p>
            </div>

            <button
              type="button"
              className={`toggle ${prefs[key] ? "on" : ""}`}
              onClick={() => toggle(key)}
              aria-label={`Toggle ${title}`}
              aria-pressed={prefs[key]}
            >
              <span />
            </button>
          </div>
        ))}

        <p
          style={{
            fontSize: 10,
            color: "var(--green)",
            marginTop: 15,
          }}
        >
          Preferences are automatically saved on this device.
        </p>
      </div>

      {/* Account and privacy */}
      <div className="glass panel">
        <div className="panel-head">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div className="stat-icon">
              <ShieldCheck size={16} />
            </div>

            <div>
              <h3>Account & privacy</h3>
              <p>Manage your account preferences</p>
            </div>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>Account security</strong>
            <p>
              Your account uses JWT authentication with automatic
              access-token refresh.
            </p>
          </div>

          <span className="pill green">JWT enabled</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Appearance</strong>
            <p>
              CareerPilot is currently using the Midnight Glass theme.
            </p>
          </div>

          <span className="pill">Dark mode</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Preference storage</strong>
            <p>
              Notification preferences are saved locally in your browser.
            </p>
          </div>

          <span className="pill green">Saved locally</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 25,
          }}
        >
          <button
            type="button"
            className="btn"
            onClick={handleLogout}
            style={{
              background: "rgba(255,90,90,.12)",
              color: "#ff8585",
              border: "1px solid rgba(255,90,90,.2)",
            }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
