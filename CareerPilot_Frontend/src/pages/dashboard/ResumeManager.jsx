
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  UploadCloud,
  MoreHorizontal,
  Download,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";

export default function ResumeManager() {
  const input = useRef(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch resumes
  const fetchResumes = async () => {
    try {
      setError("");
      const response = await api.get("/resumes/");

      const data = response.data;
      setFiles(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load resumes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Upload resumes
  const addFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();

        const title = file.name.replace(/\.[^/.]+$/, "");

        formData.append("title", title);
        formData.append("file", file);

        await api.post("/resumes/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setSuccess(
        selectedFiles.length === 1
          ? "Resume uploaded successfully!"
          : "Resumes uploaded successfully!"
      );

      await fetchResumes();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.file?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        "Resume upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  };

  // Delete resume
  const deleteResume = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    setDeleting(id);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/resumes/${id}/`);

      setFiles((prev) => prev.filter((file) => file.id !== id));
      setSuccess("Resume deleted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to delete resume."
      );
    } finally {
      setDeleting(null);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Recently uploaded";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Extract filename
  const getFileName = (file) => {
    if (!file) return "Resume";

    return decodeURIComponent(file.split("/").pop().split("?")[0]);
  };

  // Open resume
  const downloadResume = (file) => {
    if (!file) return;

    try {
      const base = new URL(api.defaults.baseURL, window.location.origin);
      const fileUrl = file.startsWith("http")
        ? file
        : new URL(file, base.origin).href;

      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } catch {
      setError("Unable to open this resume.");
    }
  };

  return (
    <>
      <PageHeader
        title="Resume manager"
        description="Keep your career story polished, organized and ready to share."
        action={
          <button
            className="btn"
            onClick={() => input.current?.click()}
            disabled={uploading}
          >
            <Plus size={15} />
            Upload resume
          </button>
        }
      />

      <input
        ref={input}
        type="file"
        accept=".pdf,.docx"
        multiple
        hidden
        onChange={addFiles}
      />

      {/* Upload section */}
      <div className="glass upload-zone">
        {uploading ? (
          <Loader2 size={31} className="animate-spin" />
        ) : (
          <UploadCloud size={31} />
        )}

        <h3>
          {uploading
            ? "Uploading your resume..."
            : "Drop your resume files here"}
        </h3>

        <p>
          PDF or DOCX · Keep your latest version close at hand
        </p>

        <button
          className="btn secondary"
          onClick={() => input.current?.click()}
          disabled={uploading}
        >
          Browse files
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="glass panel" style={{ marginTop: 15 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <AlertCircle size={17} color="#ef4444" />
            <span style={{ fontSize: 12 }}>{error}</span>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="glass panel" style={{ marginTop: 15 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <CheckCircle2 size={17} color="#22c55e" />
            <span style={{ fontSize: 12 }}>{success}</span>
          </div>
        </div>
      )}

      {/* Documents header */}
      <div className="panel-head" style={{ marginTop: 25 }}>
        <div>
          <h3>Your documents</h3>
          <p>{files.length} files in your workspace</p>
        </div>

        <span className="pill">Cloud storage</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="glass panel" style={{ textAlign: "center", padding: 35 }}>
          <Loader2 className="animate-spin" size={25} />
          <p style={{ marginTop: 10, fontSize: 12 }}>
            Loading your resumes...
          </p>
        </div>
      ) : files.length === 0 ? (
        <div className="glass panel" style={{ textAlign: "center", padding: 40 }}>
          <FileText size={40} style={{ opacity: 0.5 }} />
          <h3 style={{ marginTop: 12 }}>No resumes yet</h3>
          <p style={{ fontSize: 11, marginTop: 7, color: "var(--muted)" }}>
            Upload your first resume to get started.
          </p>
        </div>
      ) : (
        <div className="grid resume-grid">
          {files.map((f) => (
            <article className="glass resume-card" key={f.id}>
              <div className="resume-preview">
                <FileText size={42} strokeWidth={1.2} />
              </div>

              <h3>{f.title || getFileName(f.file)}</h3>

              <p>Career document · {getFileName(f.file)}</p>

              <div className="resume-meta">
                <span>{formatDate(f.uploaded_at)}</span>

                <div style={{ display: "flex", gap: 7 }}>
                  <button
                    className="icon-button"
                    aria-label="Download resume"
                    onClick={() => downloadResume(f.file)}
                    title="Open resume"
                  >
                    <Download size={16} />
                  </button>

                  <button
                    className="icon-button"
                    aria-label="Delete resume"
                    onClick={() => deleteResume(f.id)}
                    disabled={deleting === f.id}
                    title="Delete resume"
                  >
                    {deleting === f.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* AI insights */}
      <div
        className="glass panel"
        style={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div className="stat-icon">
          <Sparkles size={19} />
        </div>

        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: 12 }}>AI resume insights</strong>
          <p
            style={{
              fontSize: 10,
              color: "var(--muted)",
              marginTop: 5,
            }}
          >
            Resume scoring and job-specific suggestions will appear here
            when connected to the analysis service.
          </p>
        </div>

        <span className="pill amber">Coming soon</span>
      </div>
    </>
  );
}
