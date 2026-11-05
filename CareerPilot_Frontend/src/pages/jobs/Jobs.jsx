
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Bookmark,
  ArrowUpRight,
  ExternalLink,
  Clock,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Send,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [workType, setWorkType] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [saved, setSaved] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch jobs and existing applications
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsResponse, applicationsResponse] =
        await Promise.all([
          api.get("/jobs/"),
          api.get("/applications/"),
        ]);

      const jobsData = jobsResponse.data;
      const applicationsData = applicationsResponse.data;

      setJobs(
        Array.isArray(jobsData)
          ? jobsData
          : jobsData.results || []
      );

      setApplications(
        Array.isArray(applicationsData)
          ? applicationsData
          : applicationsData.results || []
      );
    } catch (err) {
      console.error("Jobs fetch error:", err);

      setError(
        err.response?.data?.detail ||
        "Unable to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get unique locations
  const locations = useMemo(() => {
    return [
      ...new Set(
        jobs.map((job) => job.location).filter(Boolean)
      ),
    ];
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const skills = Array.isArray(job.required_skills)
        ? job.required_skills
        : [job.required_skills || ""];

      const searchText = [
        job.title,
        job.company,
        job.location,
        job.description,
        ...skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        query.toLowerCase()
      );

      const matchesType =
        workType === "ALL" ||
        job.work_type?.toUpperCase() === workType;

      const matchesLocation =
        location === "ALL" ||
        job.location === location;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [jobs, query, workType, location]);

  // Check whether the user already applied
  const hasApplied = (jobId) => {
    return applications.some(
      (application) =>
        Number(application.job) === Number(jobId) &&
        application.status !== "SAVED"
    );
  };

  // Bookmark job
  const toggleSave = (id) => {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((jobId) => jobId !== id)
        : [...previous, id]
    );
  };

  // Submit application
  const applyForJob = async (job) => {
    if (hasApplied(job.id)) {
      setError("You have already applied for this job.");
      return;
    }

    setApplying(job.id);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/applications/", {
        job: job.id,
        status: "APPLIED",
        applied_at: new Date().toISOString(),
        notes: "",
      });

      setApplications((previous) => [
        ...previous,
        response.data,
      ]);

      setSuccess(
        `Successfully applied for ${job.title} at ${job.company}!`
      );
    } catch (err) {
      console.error("Application error:", err);

      const message = err.response?.data;

      setError(
        message?.non_field_errors?.[0] ||
        message?.job?.[0] ||
        message?.detail ||
        "Unable to submit your application. Please try again."
      );

      // Refresh applications in case the application
      // was already submitted elsewhere.
      try {
        const response = await api.get("/applications/");
        const data = response.data;

        setApplications(
          Array.isArray(data) ? data : data.results || []
        );
      } catch (refreshError) {
        console.error("Application refresh error:", refreshError);
      }
    } finally {
      setApplying(null);
    }
  };

  // Format work type
  const formatWorkType = (type) => {
    if (!type) return "Not specified";

    return type.charAt(0).toUpperCase() +
      type.slice(1).toLowerCase();
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Recently posted";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get skills
  const getSkills = (skills) => {
    if (Array.isArray(skills)) return skills;

    if (typeof skills === "string") {
      return skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    return [];
  };

  // Open external application link
  const openExternalApplication = (job) => {
    if (job.application_url) {
      window.open(
        job.application_url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <>
      <PageHeader
        title="Explore opportunities"
        description="Discover roles that align with your skills and the direction you want to grow."
        action={
          <span className="pill green">
            {jobs.length} Active Jobs
          </span>
        }
      />

      {/* Search and filters */}
      <div className="toolbar">
        <div
          className="search-box"
          style={{ width: "min(390px,100%)" }}
        >
          <Search size={15} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, companies or locations..."
          />
        </div>

        <select
          className="select-dark"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        >
          <option value="ALL">All job types</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">Onsite</option>
        </select>

        <select
          className="select-dark"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="ALL">Any location</option>

          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="glass panel"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 15,
          }}
        >
          <AlertCircle size={17} color="#ef4444" />
          <span style={{ fontSize: 12 }}>{error}</span>

          <button
            className="icon-button"
            style={{ marginLeft: "auto" }}
            onClick={() => setError("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          className="glass panel"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 15,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span style={{ fontSize: 12 }}>{success}</span>

          <button
            className="icon-button"
            style={{ marginLeft: "auto" }}
            onClick={() => setSuccess("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          className="glass panel"
          style={{ textAlign: "center", padding: 40 }}
        >
          <Loader2 size={28} className="animate-spin" />

          <p style={{ marginTop: 12, fontSize: 12 }}>
            Finding opportunities for you...
          </p>
        </div>
      )}

      {/* Job details */}
      {!loading && selectedJob && (
        <div className="glass panel" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <span className="pill green">Job details</span>

              <h2 style={{ fontSize: 19, marginTop: 13 }}>
                {selectedJob.title}
              </h2>

              <p style={{ fontSize: 12, marginTop: 6 }}>
                {selectedJob.company}
              </p>
            </div>

            <button
              className="icon-button"
              onClick={() => setSelectedJob(null)}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 9,
              flexWrap: "wrap",
              marginTop: 17,
            }}
          >
            <span className="pill">
              <BriefcaseBusiness size={11} />{" "}
              {formatWorkType(selectedJob.work_type)}
            </span>

            <span className="pill">
              <MapPin size={11} /> {selectedJob.location}
            </span>

            <span className="pill">
              <Clock size={11} />{" "}
              {formatDate(selectedJob.posted_at)}
            </span>
          </div>

          <div style={{ marginTop: 23 }}>
            <h3 style={{ fontSize: 13 }}>Job description</h3>

            <p
              style={{
                fontSize: 12,
                lineHeight: 1.8,
                color: "var(--muted)",
                marginTop: 10,
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedJob.description ||
                "No description available."}
            </p>
          </div>

          <div style={{ marginTop: 22 }}>
            <h3 style={{ fontSize: 13 }}>Required skills</h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 11,
              }}
            >
              {getSkills(selectedJob.required_skills).length > 0 ? (
                getSkills(selectedJob.required_skills).map(
                  (skill, i) => (
                    <span className="pill green" key={`${skill}-${i}`}>
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p style={{ fontSize: 11, color: "var(--muted)" }}>
                  No specific skills listed.
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <button
              className="btn"
              onClick={() => applyForJob(selectedJob)}
              disabled={
                applying === selectedJob.id ||
                hasApplied(selectedJob.id)
              }
            >
              {applying === selectedJob.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : hasApplied(selectedJob.id) ? (
                <CheckCircle2 size={14} />
              ) : (
                <Send size={14} />
              )}

              {applying === selectedJob.id
                ? "Applying..."
                : hasApplied(selectedJob.id)
                  ? "Already Applied"
                  : "Apply Now"}
            </button>

            {selectedJob.application_url && (
              <button
                className="btn secondary"
                onClick={() => openExternalApplication(selectedJob)}
              >
                External link <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Job listing */}
      {!loading && !error && (
        <>
          <div className="panel-head" style={{ marginBottom: 15 }}>
            <div>
              <h3>Available opportunities</h3>
              <p>
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
            </div>

            <span className="pill">
              {applications.filter(
                (app) => app.status !== "SAVED"
              ).length} Applied
            </span>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            }}
          >
            {filteredJobs.map((job) => (
              <article className="glass panel" key={job.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div className="company">
                    <div className="company-logo">
                      {job.company?.slice(0, 2).toUpperCase() || "CO"}
                    </div>

                    <div>
                      <strong>{job.company}</strong>
                      <small>{job.location}</small>
                    </div>
                  </div>

                  <button
                    className="icon-button"
                    aria-label="Save job"
                    onClick={() => toggleSave(job.id)}
                  >
                    <Bookmark
                      size={15}
                      fill={
                        saved.includes(job.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <h3
                  style={{
                    font: "700 15px Manrope",
                    margin: "18px 0 8px",
                  }}
                >
                  {job.title}
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span className="pill">
                    {formatWorkType(job.work_type)}
                  </span>

                  <span className="pill green">
                    <Clock size={11} />{" "}
                    {formatDate(job.posted_at)}
                  </span>
                </div>

                <div
                  className="resume-meta"
                  style={{ flexWrap: "wrap", gap: 10 }}
                >
                  <span>
                    <MapPin
                      size={11}
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    {job.location}
                  </span>

                  <div style={{ display: "flex", gap: 7 }}>
                    <button
                      className="btn secondary"
                      onClick={() => setSelectedJob(job)}
                    >
                      View role <ArrowUpRight size={13} />
                    </button>

                    <button
                      className="btn"
                      onClick={() => applyForJob(job)}
                      disabled={
                        applying === job.id ||
                        hasApplied(job.id)
                      }
                    >
                      {applying === job.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : hasApplied(job.id) ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Send size={13} />
                      )}

                      {applying === job.id
                        ? "Applying"
                        : hasApplied(job.id)
                          ? "Applied"
                          : "Apply"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div
              className="glass empty-note"
              style={{ textAlign: "center", padding: 35 }}
            >
              <BriefcaseBusiness size={30} />

              <h3 style={{ marginTop: 12 }}>
                No matching opportunities
              </h3>

              <p style={{ fontSize: 11, marginTop: 7 }}>
                Try changing your search or filters.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
