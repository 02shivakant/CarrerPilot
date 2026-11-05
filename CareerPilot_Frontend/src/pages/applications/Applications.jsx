
import { useEffect, useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";

const stages = [
  { label: "Saved", value: "SAVED" },
  { label: "Applied", value: "APPLIED" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Offer", value: "SELECTED" },
  { label: "Rejected", value: "REJECTED" },
];

const formatDate = (date) => {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Applications() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/");
      setItems(response.data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await api.patch(`/applications/${id}/`, {
        status,
      });

      setItems((old) =>
        old.map((item) =>
          item.id === id ? response.data : item
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleItems =
    filter === "All"
      ? items
      : items.filter((item) => item.status === filter);

  const getCount = (status) =>
    items.filter((item) => item.status === status).length;

  return (
    <>
      <PageHeader
        title="Application tracker"
        description="One organized space for every opportunity you're pursuing."
        action={
          <button
            className="btn"
            onClick={() =>
              alert("To add an application, visit Explore Jobs and click Apply.")
            }
          >
            <Plus size={14} />
            Add application
          </button>
        }
      />

      <div className="toolbar">
        <span className="pill">
          {items.length} tracked opportunities
        </span>

        <select
          className="select-dark"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {stages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p style={{ color: "#ff7777", fontSize: 12, marginBottom: 12 }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: "var(--muted)", fontSize: 12 }}>
          Loading applications...
        </p>
      ) : items.length === 0 ? (
        <div className="job-card">
          <h4>No applications yet</h4>
          <p>Visit Explore Jobs and apply to start tracking opportunities.</p>
        </div>
      ) : (
        <div className="board">
          {stages.map((stage) => {
            const stageItems = visibleItems.filter(
              (item) => item.status === stage.value
            );

            return (
              <section className="board-column" key={stage.value}>
                <div className="board-title">
                  <span>{stage.label}</span>
                  <span className="board-count">
                    {getCount(stage.value)}
                  </span>
                </div>

                {stageItems.map((item) => (
                  <article className="job-card" key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4>{item.company}</h4>
                      <MoreHorizontal size={15} color="#77819c" />
                    </div>

                    <p>{item.job_title}</p>

                    <div className="job-card-foot">
                      <span>
                        {formatDate(item.applied_at || item.created_at)}
                      </span>

                      <select
                        aria-label={`Change ${item.company} status`}
                        className="select-dark"
                        style={{
                          minWidth: 0,
                          width: 105,
                          padding: "5px",
                          fontSize: 9,
                        }}
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) =>
                          changeStatus(item.id, e.target.value)
                        }
                      >
                        {stages.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
