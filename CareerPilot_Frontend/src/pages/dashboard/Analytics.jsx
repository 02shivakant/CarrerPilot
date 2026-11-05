
import { useEffect, useState } from "react";
import {
  Activity,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import api from "../../services/api";

export default function Analytics() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/applications/");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setApplications(data);
      } catch (err) {
        console.error("Analytics error:", err);
        setError("Unable to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statusCounts = applications.reduce((counts, application) => {
    const status = application.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  const submittedApplications = applications.filter(
    (app) => app.status !== "SAVED"
  );

  const totalApplications = submittedApplications.length;

  const interviewCount = statusCounts.INTERVIEW || 0;
  const selectedCount = statusCounts.SELECTED || 0;

  const responseCount =
    (statusCounts.SHORTLISTED || 0) +
    interviewCount +
    (statusCounts.REJECTED || 0) +
    selectedCount;

  const interviewConversion = totalApplications
    ? Math.round((interviewCount / totalApplications) * 100)
    : 0;

  const responseRate = totalApplications
    ? Math.round((responseCount / totalApplications) * 100)
    : 0;

  // Generate the latest 12 months.
  const now = new Date();

  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 11 + index,
      1
    );

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      count: 0,
    };
  });

  submittedApplications.forEach((application) => {
    const dateValue = application.applied_at || application.created_at;

    if (!dateValue) return;

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const month = monthlyData.find((item) => item.key === key);

    if (month) {
      month.count += 1;
    }
  });

  const maxMonthlyCount = Math.max(
    ...monthlyData.map((item) => item.count),
    1
  );

  const last30Days = submittedApplications.filter((application) => {
    const dateValue = application.applied_at || application.created_at;

    if (!dateValue) return false;

    const date = new Date(dateValue);
    const daysDifference = (now - date) / (1000 * 60 * 60 * 24);

    return daysDifference >= 0 && daysDifference <= 30;
  }).length;

  const momentum =
    last30Days >= 5
      ? "Strong"
      : last30Days >= 2
      ? "Building"
      : last30Days >= 1
      ? "Getting started"
      : "Inactive";

  const funnel = [
    { label: "Saved", key: "SAVED" },
    { label: "Applied", key: "APPLIED" },
    { label: "Shortlisted", key: "SHORTLISTED" },
    { label: "Interview", key: "INTERVIEW" },
    { label: "Selected", key: "SELECTED" },
    { label: "Rejected", key: "REJECTED" },
  ];

  const funnelTotal = applications.length || 1;

  if (loading) {
    return (
      <>
        <PageHeader
          title="Career analytics"
          description="Understand your momentum and make your next move with clarity."
        />
        <div className="glass panel">
          <p>Loading your career analytics...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Career analytics"
        description="Understand your momentum and make your next move with clarity."
      />

      {error && (
        <div className="glass panel" style={{ marginBottom: 20 }}>
          <p style={{ color: "#ff8585" }}>{error}</p>
        </div>
      )}

      <div className="grid stats-grid">
        <StatCard
          label="Total applications"
          value={totalApplications}
          note={`${statusCounts.SAVED || 0} saved opportunities`}
          Icon={Activity}
        />

        <StatCard
          label="Interview conversion"
          value={`${interviewConversion}%`}
          note={`${interviewCount} interviews from ${totalApplications} applications`}
          Icon={Target}
          accent="#59d4e4"
          tint="rgba(83,213,232,.12)"
        />

        <StatCard
          label="Response rate"
          value={`${responseRate}%`}
          note={`${responseCount} applications received a response`}
          Icon={TrendingUp}
          accent="#61dcae"
          tint="rgba(75,214,160,.12)"
        />

        <StatCard
          label="Career momentum"
          value={momentum}
          note={`${last30Days} applications in the last 30 days`}
          Icon={Trophy}
          accent="#f2bd70"
          tint="rgba(247,189,104,.12)"
        />
      </div>

      <div className="grid dashboard-grid">
        {/* Monthly applications chart */}
        <section className="glass panel">
          <div className="panel-head">
            <div>
              <h3>Monthly applications</h3>
              <p>Your application activity over the last 12 months</p>
            </div>

            <span className="pill">{now.getFullYear()}</span>
          </div>

          <div
            className="chart-bars"
            style={{
              height: 245,
              alignItems: "end",
            }}
          >
            {monthlyData.map((month) => (
              <div className="chart-col" key={month.key}>
                <div
                  className="chart-bar"
                  title={`${month.count} applications`}
                  style={{
                    height: `${
                      month.count === 0
                        ? 3
                        : Math.max(
                            (month.count / maxMonthlyCount) * 100,
                            5
                          )
                    }%`,
                    minHeight: 4,
                  }}
                />

                <small>{month.label}</small>
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: 10,
              color: "var(--muted)",
              marginTop: 12,
            }}
          >
            Total submitted applications: {totalApplications}
          </p>
        </section>

        {/* Application funnel */}
        <section className="glass panel">
          <div className="panel-head">
            <div>
              <h3>Application funnel</h3>
              <p>Distribution across your application statuses</p>
            </div>
          </div>

          {funnel.map((item) => {
            const count = statusCounts[item.key] || 0;
            const percentage = Math.round(
              (count / funnelTotal) * 100
            );

            return (
              <div key={item.key} style={{ marginBottom: 21 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    marginBottom: 8,
                  }}
                >
                  <span>{item.label}</span>
                  <strong>
                    {count} ({percentage}%)
                  </strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <section className="glass panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <div>
            <h3>Career insights</h3>
            <p>A quick overview of your current progress</p>
          </div>
        </div>

        <div className="grid stats-grid">
          <div>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              Interviews
            </p>
            <h2>{interviewCount}</h2>
          </div>

          <div>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              Offers / Selected
            </p>
            <h2>{selectedCount}</h2>
          </div>

          <div>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              Shortlisted
            </p>
            <h2>{statusCounts.SHORTLISTED || 0}</h2>
          </div>

          <div>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              Rejected
            </p>
            <h2>{statusCounts.REJECTED || 0}</h2>
          </div>
        </div>
      </section>

      {applications.length === 0 && (
        <p
          style={{
            fontSize: 11,
            color: "var(--muted)",
            marginTop: 15,
          }}
        >
          Your analytics will appear here once you start saving and applying
          to jobs.
        </p>
      )}
    </>
  );
}
