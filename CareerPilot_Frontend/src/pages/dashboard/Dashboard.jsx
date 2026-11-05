
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import api from "../../services/api";

const statusLabels = {
  SAVED: "Saved",
  APPLIED: "Application submitted",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview stage",
  REJECTED: "Application rejected",
  SELECTED: "Selected",
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getTimeAgo = (date) => {
  if (!date) return "Recently";

  const diff = Math.max(
    0,
    Date.now() - new Date(date).getTime()
  );

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  return formatDate(date);
};

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [resumeCount, setResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [applicationResult, resumeResult] =
        await Promise.allSettled([
          api.get("/applications/"),
          api.get("/resumes/"),
        ]);

      if (applicationResult.status === "fulfilled") {
        const data = applicationResult.value.data;
        setApplications(
          Array.isArray(data) ? data : data.results || []
        );
      } else {
        throw applicationResult.reason;
      }

      if (resumeResult.status === "fulfilled") {
        const data = resumeResult.value.data;
        const resumes = Array.isArray(data)
          ? data
          : data.results || [];

        setResumeCount(resumes.length);
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = applications.filter(
    (item) => item.status !== "SAVED"
  ).length;

  const savedApplications = applications.filter(
    (item) => item.status === "SAVED"
  ).length;

  const interviews = applications.filter(
    (item) => item.status === "INTERVIEW"
  ).length;

  const selected = applications.filter(
    (item) => item.status === "SELECTED"
  ).length;

  const responded = applications.filter((item) =>
    ["SHORTLISTED", "INTERVIEW", "REJECTED", "SELECTED"].includes(
      item.status
    )
  ).length;

  const responseRate =
    totalApplications > 0
      ? Math.round((responded / totalApplications) * 100)
      : 0;

  const sortedApplications = [...applications].sort(
    (a, b) =>
      new Date(b.applied_at || b.created_at || 0) -
      new Date(a.applied_at || a.created_at || 0)
  );

  const recentApplications = sortedApplications.slice(0, 5);

  // Build the last seven months of application activity.
  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (6 - index));

    const month = date.getMonth();
    const year = date.getFullYear();

    const count = applications.filter((item) => {
      if (item.status === "SAVED") return false;

      const itemDate = new Date(
        item.applied_at || item.created_at
      );

      return (
        itemDate.getMonth() === month &&
        itemDate.getFullYear() === year
      );
    }).length;

    return {
      label: date.toLocaleDateString("en-IN", {
        month: "short",
      }),
      count,
    };
  });

  const maxCount = Math.max(
    ...chartData.map((item) => item.count),
    1
  );

  return (
    <>
      <PageHeader
        eyebrow="YOUR CAREER DASHBOARD"
        title="Your career, in motion."
        description="A clear view of your progress, opportunities and next steps."
        action={
          <button
            className="btn"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <Sparkles size={14} />
            Refresh snapshot
          </button>
        }
      />

      {error && (
        <p
          style={{
            color: "#ff7777",
            fontSize: 12,
            marginBottom: 14,
          }}
        >
          {error}
        </p>
      )}

      <div
        className="glass"
        style={{
          padding: 23,
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          background:
            "linear-gradient(105deg,rgba(105,88,225,.22),rgba(23,33,59,.75) 60%,rgba(41,111,139,.12))",
        }}
      >
        <div>
          <div className="eyebrow">YOUR NEXT MOVE</div>

          <h2
            style={{
              font: "800 19px Manrope",
              marginBottom: 7,
            }}
          >
            Small steps. Big career momentum.
          </h2>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 11,
            }}
          >
            {totalApplications > 0
              ? `You've submitted ${totalApplications} applications. Keep tracking your progress.`
              : "Start exploring opportunities and track your applications here."}
          </p>
        </div>

        <div style={{ textAlign: "right", minWidth: 115 }}>
          <div
            style={{
              font: "800 26px Manrope",
              color: "#b7adff",
            }}
          >
            {selected}
          </div>

          <div
            style={{
              fontSize: 9,
              color: "var(--muted)",
              marginBottom: 9,
            }}
          >
            OFFERS / SELECTED
          </div>
        </div>
      </div>

      <div className="grid stats-grid">
        <StatCard
          label="Applications sent"
          value={loading ? "—" : totalApplications}
          note="Total submitted applications"
          Icon={Send}
        />

        <StatCard
          label="Interviews"
          value={loading ? "—" : interviews}
          note="Currently in interview stage"
          Icon={Users}
          accent="#5ed8e5"
          tint="rgba(83,213,232,.12)"
        />

        <StatCard
          label="Saved opportunities"
          value={loading ? "—" : savedApplications}
          note="Roles worth exploring"
          Icon={BriefcaseBusiness}
          accent="#f2bd70"
          tint="rgba(247,189,104,.12)"
        />

        <StatCard
          label="Response rate"
          value={loading ? "—" : `${responseRate}%`}
          note="Applications with a recorded response"
          Icon={Target}
          accent="#62dcae"
          tint="rgba(75,214,160,.12)"
        />
      </div>

      <div className="grid dashboard-grid">
        <section className="glass panel">
          <div className="panel-head">
            <div>
              <h3>Application activity</h3>
              <p>Your submitted applications over the last 7 months</p>
            </div>

            <span className="pill">Last 7 months</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <strong style={{ font: "800 25px Manrope" }}>
              {loading ? "—" : totalApplications}
              <span
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  fontWeight: 400,
                }}
              >
                {" "}applications
              </span>
            </strong>
          </div>

          <div className="chart-bars">
            {chartData.map((item, index) => (
              <div className="chart-col" key={index}>
                <div
                  className="chart-bar"
                  title={`${item.count} applications`}
                  style={{
                    height: `${Math.max(
                      5,
                      (item.count / maxCount) * 100
                    )}%`,
                  }}
                />

                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="glass panel">
          <div className="panel-head">
            <div>
              <h3>Recent applications</h3>
              <p>Your latest application updates</p>
            </div>

            <a
              className="subtle-link"
              href="/dashboard/applications"
            >
              View all
            </a>
          </div>

          {loading ? (
            <p style={{ color: "var(--muted)", fontSize: 11 }}>
              Loading recent applications...
            </p>
          ) : recentApplications.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 11 }}>
              No applications yet. Explore jobs to get started.
            </p>
          ) : (
            <div className="activity-list">
              {recentApplications.map((item) => {
                const Icon =
                  item.status === "SELECTED"
                    ? CheckCircle2
                    : item.status === "INTERVIEW"
                    ? Clock3
                    : Send;

                const date =
                  item.applied_at || item.created_at;

                return (
                  <div
                    className="activity-item"
                    key={item.id}
                  >
                    <div className="activity-dot">
                      <Icon size={15} />
                    </div>

                    <div>
                      <strong>
                        {statusLabels[item.status] || item.status}
                      </strong>

                      <p>
                        {item.job_title} · {item.company}
                      </p>

                      <time>{getTimeAgo(date)}</time>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section
        className="glass panel"
        style={{ marginTop: 18 }}
      >
        <div className="panel-head">
          <div>
            <h3>Career workspace</h3>
            <p>A quick overview of your career preparation</p>
          </div>
        </div>

        <div className="interview-row">
          <div className="company">
            <div className="company-logo">
              <FileText size={17} />
            </div>

            <div>
              <strong>Resume Manager</strong>
              <small>Your uploaded resumes</small>
            </div>
          </div>

          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {loading ? "—" : resumeCount} resumes
          </span>

          <a
            className="subtle-link"
            href="/dashboard/resumes"
          >
            View
          </a>
        </div>

        <div className="interview-row">
          <div className="company">
            <div className="company-logo">
              <CheckCircle2 size={17} />
            </div>

            <div>
              <strong>Selected applications</strong>
              <small>Opportunities where you were selected</small>
            </div>
          </div>

          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {loading ? "—" : selected}
          </span>

          <a
            className="subtle-link"
            href="/dashboard/applications"
          >
            View
          </a>
        </div>
      </section>
    </>
  );
}
