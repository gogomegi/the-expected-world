"use client";

import { useState, useEffect, useCallback } from "react";

interface Entry {
  id: string;
  quote: string;
  author: string;
  source: string;
  dateWritten: string;
  predictedDate: string;
  predictedDateNormalized: string;
  category: string;
  annotation: string;
  actualOutcome?: string;
  tags: string[];
  source_type?: "ai" | "human";
  status?: "pending" | "confirmed" | "rejected";
  verification_status?: "verified" | "paraphrased" | "unverified" | "fabricated";
  source_url?: string;
  verification_note?: string;
}

interface Submission {
  id: string;
  text: string;
  author: string;
  source: string;
  yearWritten: number;
  yearImagined?: string;
  topic?: string;
  sourceUrl?: string;
  email?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const CATEGORIES = [
  "Technology",
  "Governance",
  "Governance & Power",
  "Environment",
  "Environment & Resources",
  "Daily Life",
  "Space",
  "Space & Exploration",
  "Medicine",
  "Medicine & the Body",
  "War & Conflict",
  "Culture",
  "Culture & Society",
];

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Entry | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterVerification, setFilterVerification] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"corpus" | "submissions">("corpus");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState("");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [subSearch, setSubSearch] = useState("");
  const [subFilterStatus, setSubFilterStatus] = useState<string>("all");
  const [actioningSub, setActioningSub] = useState<string | null>(null);

  // Check if already authenticated
  useEffect(() => {
    fetch("/api/admin/auth").then((res) => {
      setAuthed(res.ok);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setPassword("");
    } else {
      setAuthError("Invalid password");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
    setEntries([]);
    setSelected(null);
    setEditing(null);
  };

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/corpus");
    if (!res.ok) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setSubmissionsLoading(true);
    setSubmissionsError("");
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        const err = await res.json().catch(() => ({}));
        setSubmissionsError(err.error || `Failed to load submissions (${res.status})`);
      }
    } catch (e) {
      setSubmissionsError(e instanceof Error ? e.message : "Network error loading submissions");
    }
    setSubmissionsLoading(false);
  }, []);

  useEffect(() => {
    if (authed) {
      fetchEntries();
      fetchSubmissions();
    }
  }, [authed, fetchEntries, fetchSubmissions]);

  // Auth check in progress
  if (authed === null) {
    return (
      <div style={styles.container}>
        <p style={styles.mono}>Checking authentication...</p>
      </div>
    );
  }

  // Login screen
  if (!authed) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
      }}>
        <form onSubmit={handleLogin} style={{
          width: "100%",
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
          <h1 style={{
            fontFamily: "var(--font-chrome), system-ui, sans-serif",
            fontSize: "1.125rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            margin: 0,
          }}>
            Admin
          </h1>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.6875rem",
            color: "var(--color-secondary)",
            letterSpacing: "0.04em",
            margin: 0,
          }}>
            The Expected World
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            autoFocus
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.8125rem",
              padding: "10px 14px",
              border: "1px solid rgba(120,113,103,0.3)",
              borderRadius: "3px",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              outline: "none",
            }}
          />
          {authError && (
            <p style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.6875rem",
              color: "#C03A1E",
              margin: 0,
            }}>
              {authError}
            </p>
          )}
          <button type="submit" style={{
            fontFamily: "var(--font-chrome), system-ui, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
            padding: "8px 16px",
            border: "1px solid var(--color-text)",
            borderRadius: "3px",
            background: "var(--color-text)",
            color: "var(--color-bg)",
            cursor: "pointer",
          }}>
            sign in
          </button>
        </form>
      </div>
    );
  }

  const filtered = entries.filter((e) => {
    if (filterStatus !== "all" && (e.status || "pending") !== filterStatus)
      return false;
    if (filterSource !== "all" && (e.source_type || "ai") !== filterSource)
      return false;
    if (
      filterCategory !== "all" &&
      e.category.toLowerCase() !== filterCategory.toLowerCase()
    )
      return false;
    if (filterVerification !== "all" && (e.verification_status || "unverified") !== filterVerification)
      return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !e.quote.toLowerCase().includes(q) &&
        !e.author.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await fetch("/api/corpus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    await fetchEntries();
    setSelected(editing);
    setEditing(null);
    setSaving(false);
  };

  const handleStatus = async (id: string, status: string) => {
    await fetch("/api/corpus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchEntries();
    if (selected?.id === id) {
      setSelected((prev) =>
        prev ? { ...prev, status: status as Entry["status"] } : null
      );
    }
  };

  const handleSubAction = async (id: string, action: "approve" | "reject") => {
    setActioningSub(id);
    await fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    await fetchSubmissions();
    if (action === "approve") await fetchEntries();
    if (selectedSub?.id === id) setSelectedSub(null);
    setActioningSub(null);
  };

  const statusColor = (status: string | undefined) => {
    switch (status) {
      case "confirmed":
        return "#2d6a30";
      case "rejected":
        return "#C03A1E";
      default:
        return "#787167";
    }
  };

  const verificationColor = (vs: string | undefined) => {
    switch (vs) {
      case "verified":
        return "#2d6a30";
      case "paraphrased":
        return "#a67c00";
      case "fabricated":
        return "#C03A1E";
      default:
        return "#787167";
    }
  };

  const subStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "#2d6a30";
      case "rejected": return "#C03A1E";
      default: return "#a67c00";
    }
  };

  const statusCounts = {
    all: entries.length,
    pending: entries.filter((e) => (e.status || "pending") === "pending")
      .length,
    confirmed: entries.filter((e) => e.status === "confirmed").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  const verificationCounts = {
    all: entries.length,
    verified: entries.filter((e) => e.verification_status === "verified").length,
    paraphrased: entries.filter((e) => e.verification_status === "paraphrased").length,
    unverified: entries.filter((e) => (e.verification_status || "unverified") === "unverified").length,
    fabricated: entries.filter((e) => e.verification_status === "fabricated").length,
  };

  const filteredSubs = submissions.filter((s) => {
    if (subFilterStatus !== "all" && s.status !== subFilterStatus) return false;
    if (subSearch) {
      const q = subSearch.toLowerCase();
      if (
        !s.text.toLowerCase().includes(q) &&
        !s.author.toLowerCase().includes(q) &&
        !(s.email || "").toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const subStatusCounts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.mono}>Loading corpus...</p>
      </div>
    );
  }

  // Submission detail view
  if (selectedSub) {
    const sub = selectedSub;
    return (
      <div style={styles.container}>
        <div style={styles.topBar}>
          <button onClick={() => setSelectedSub(null)} style={styles.backBtn}>
            ← back to submissions
          </button>
        </div>

        <div style={styles.statusBar}>
          <span style={{ ...styles.statusBadge, color: subStatusColor(sub.status) }}>
            {sub.status.toUpperCase()}
          </span>
          <span style={styles.mono}>
            submitted {new Date(sub.submittedAt).toLocaleDateString()}
          </span>
          {sub.status === "pending" && (
            <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleSubAction(sub.id, "approve")}
                disabled={actioningSub === sub.id}
                style={{ ...styles.smallBtn, borderColor: "#2d6a30", color: "#2d6a30" }}
              >
                {actioningSub === sub.id ? "..." : "approve"}
              </button>
              <button
                onClick={() => handleSubAction(sub.id, "reject")}
                disabled={actioningSub === sub.id}
                style={{ ...styles.smallBtn, borderColor: "#C03A1E", color: "#C03A1E" }}
              >
                {actioningSub === sub.id ? "..." : "reject"}
              </button>
            </div>
          )}
        </div>

        <div style={styles.fieldGrid}>
          <Field label="ID" value={sub.id} />
          <Field label="Prediction Text" value={sub.text} multiline />
          <Field label="Author" value={sub.author} />
          <Field label="Source" value={sub.source || "—"} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Year Written" value={String(sub.yearWritten)} />
            <Field label="Year Imagined" value={sub.yearImagined || "—"} />
          </div>
          <Field label="Topic" value={sub.topic || "—"} />
          <Field label="Source URL" value={sub.sourceUrl || "—"} />
          <Field label="Email" value={sub.email || "—"} />
          <Field label="Submitted At" value={new Date(sub.submittedAt).toLocaleString()} />
        </div>
      </div>
    );
  }

  // Detail/edit view
  if (selected || editing) {
    const entry = editing || selected!;
    const isEditing = !!editing;

    return (
      <div style={styles.container}>
        <div style={styles.topBar}>
          <button
            onClick={() => {
              setSelected(null);
              setEditing(null);
            }}
            style={styles.backBtn}
          >
            ← back to list
          </button>
          <div style={{ display: "flex", gap: "8px" }}>
            {!isEditing && (
              <button
                onClick={() => setEditing({ ...entry })}
                style={styles.actionBtn}
              >
                edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={() => setEditing(null)}
                  style={styles.actionBtn}
                >
                  cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ ...styles.actionBtn, ...styles.confirmBtn }}
                >
                  {saving ? "saving..." : "save"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div style={styles.statusBar}>
          <span
            style={{
              ...styles.statusBadge,
              color: statusColor(entry.status),
            }}
          >
            {(entry.status || "pending").toUpperCase()}
          </span>
          <span
            style={{
              ...styles.verificationBadge,
              color: verificationColor(entry.verification_status),
              borderColor: verificationColor(entry.verification_status),
            }}
          >
            {(entry.verification_status || "unverified").toUpperCase()}
          </span>
          <span style={styles.mono}>
            {entry.source_type || "ai"} · {entry.category}
          </span>
          {!isEditing && (
            <div
              style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
            >
              <button
                onClick={() => handleStatus(entry.id, "confirmed")}
                style={{
                  ...styles.smallBtn,
                  borderColor: "#2d6a30",
                  color: "#2d6a30",
                }}
              >
                confirm
              </button>
              <button
                onClick={() => handleStatus(entry.id, "rejected")}
                style={{
                  ...styles.smallBtn,
                  borderColor: "#C03A1E",
                  color: "#C03A1E",
                }}
              >
                reject
              </button>
              <button
                onClick={() => handleStatus(entry.id, "pending")}
                style={styles.smallBtn}
              >
                reset
              </button>
            </div>
          )}
        </div>

        {/* Fields */}
        <div style={styles.fieldGrid}>
          <Field label="ID" value={entry.id} />
          <Field
            label="Quote"
            value={isEditing ? editing!.quote : entry.quote}
            multiline
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, quote: v })}
          />
          <Field
            label="Author"
            value={isEditing ? editing!.author : entry.author}
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, author: v })}
          />
          <Field
            label="Source"
            value={isEditing ? editing!.source : entry.source}
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, source: v })}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <Field
              label="Date Written"
              value={isEditing ? editing!.dateWritten : entry.dateWritten}
              editable={isEditing}
              onChange={(v) =>
                setEditing((e) => e && { ...e, dateWritten: v })
              }
            />
            <Field
              label="Predicted Date"
              value={
                isEditing ? editing!.predictedDate : entry.predictedDate
              }
              editable={isEditing}
              onChange={(v) =>
                setEditing((e) => e && { ...e, predictedDate: v })
              }
            />
            <Field
              label="Predicted (Normalized)"
              value={
                isEditing
                  ? editing!.predictedDateNormalized
                  : entry.predictedDateNormalized
              }
              editable={isEditing}
              onChange={(v) =>
                setEditing((e) => e && { ...e, predictedDateNormalized: v })
              }
            />
          </div>
          {isEditing ? (
            <div>
              <label style={styles.fieldLabel}>Category</label>
              <select
                value={editing!.category}
                onChange={(e) =>
                  setEditing(
                    (prev) => prev && { ...prev, category: e.target.value }
                  )
                }
                style={styles.select}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <Field label="Category" value={entry.category} />
          )}
          <Field
            label="Annotation"
            value={isEditing ? editing!.annotation : entry.annotation}
            multiline
            editable={isEditing}
            onChange={(v) =>
              setEditing((e) => e && { ...e, annotation: v })
            }
          />
          <Field
            label="What Actually Happened"
            value={
              isEditing
                ? editing!.actualOutcome || ""
                : entry.actualOutcome || ""
            }
            multiline
            editable={isEditing}
            onChange={(v) =>
              setEditing((e) => e && { ...e, actualOutcome: v })
            }
          />
          <Field
            label="Tags (comma-separated)"
            value={
              isEditing
                ? editing!.tags.join(", ")
                : entry.tags.join(", ")
            }
            editable={isEditing}
            onChange={(v) =>
              setEditing((e) =>
                e && {
                  ...e,
                  tags: v
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                }
              )
            }
          />
          {isEditing ? (
            <div>
              <label style={styles.fieldLabel}>Verification Status</label>
              <select
                value={editing!.verification_status || "unverified"}
                onChange={(e) =>
                  setEditing(
                    (prev) => prev && { ...prev, verification_status: e.target.value as Entry["verification_status"] }
                  )
                }
                style={styles.select}
              >
                <option value="unverified">unverified</option>
                <option value="verified">verified</option>
                <option value="paraphrased">paraphrased</option>
                <option value="fabricated">fabricated</option>
              </select>
            </div>
          ) : (
            <Field label="Verification Status" value={entry.verification_status || "unverified"} />
          )}
          <Field
            label="Source URL"
            value={isEditing ? editing!.source_url || "" : entry.source_url || ""}
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, source_url: v })}
          />
          <Field
            label="Verification Note"
            value={isEditing ? editing!.verification_note || "" : entry.verification_note || ""}
            multiline
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, verification_note: v })}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
        <h1 style={styles.title}>Admin Panel</h1>
        <button onClick={handleLogout} style={{
          ...styles.smallBtn,
          color: "var(--color-secondary)",
          borderColor: "rgba(120,113,103,0.3)",
        }}>
          sign out
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          onClick={() => setActiveTab("corpus")}
          style={{
            ...styles.tabBtn,
            ...(activeTab === "corpus" ? styles.tabBtnActive : {}),
          }}
        >
          Corpus ({entries.length})
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          style={{
            ...styles.tabBtn,
            ...(activeTab === "submissions" ? styles.tabBtnActive : {}),
          }}
        >
          Submissions ({submissions.length})
          {subStatusCounts.pending > 0 && (
            <span style={styles.pendingBadge}>{subStatusCounts.pending}</span>
          )}
        </button>
      </div>

      {activeTab === "submissions" ? (
        <>
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="search author, quote, or email..."
              value={subSearch}
              onChange={(e) => setSubSearch(e.target.value)}
              style={styles.searchInput}
            />
            <div style={styles.filterGroup}>
              {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSubFilterStatus(s)}
                  style={{
                    ...styles.filterBtn,
                    ...(subFilterStatus === s ? styles.filterBtnActive : {}),
                    ...(subFilterStatus !== s && s !== "all"
                      ? { borderColor: subStatusColor(s), color: subStatusColor(s) }
                      : {}),
                  }}
                >
                  {s} ({subStatusCounts[s]})
                </button>
              ))}
            </div>
          </div>
          <p style={styles.resultCount}>{filteredSubs.length} submissions shown</p>
          {submissionsError ? (
            <p style={{ ...styles.mono, color: "#C03A1E" }}>Error: {submissionsError}</p>
          ) : submissionsLoading ? (
            <p style={styles.mono}>Loading submissions...</p>
          ) : filteredSubs.length === 0 ? (
            <p style={styles.mono}>No submissions found.</p>
          ) : (
            <div>
              {filteredSubs.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  style={styles.row}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,234,224,0.4)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={styles.rowLeft}>
                    <span style={{ ...styles.statusDot, backgroundColor: subStatusColor(sub.status) }} />
                    <span style={styles.rowYear}>{sub.yearWritten}</span>
                    <span style={styles.rowQuote}>
                      {sub.text.length > 100 ? sub.text.slice(0, 100) + "..." : sub.text}
                    </span>
                  </div>
                  <div style={styles.rowRight}>
                    <span style={styles.rowAuthor}>{sub.author}</span>
                    <span style={styles.rowMeta}>
                      <span style={{ color: subStatusColor(sub.status) }}>{sub.status}</span>
                      {" · "}
                      {new Date(sub.submittedAt).toLocaleDateString()}
                      {sub.email && ` · ${sub.email}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p style={styles.subtitle}>{entries.length} entries in corpus</p>

          {/* Filters */}
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="search author or quote..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <div style={styles.filterGroup}>
              {(["all", "pending", "confirmed", "rejected"] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    style={{
                      ...styles.filterBtn,
                      ...(filterStatus === s ? styles.filterBtnActive : {}),
                    }}
                  >
                    {s} ({statusCounts[s]})
                  </button>
                )
              )}
            </div>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              style={styles.select}
            >
              <option value="all">all sources</option>
              <option value="ai">ai</option>
              <option value="human">human</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={styles.select}
            >
              <option value="all">all categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
            <div style={styles.filterGroup}>
              {(["all", "verified", "paraphrased", "unverified", "fabricated"] as const).map(
                (v) => (
                  <button
                    key={v}
                    onClick={() => setFilterVerification(v)}
                    style={{
                      ...styles.filterBtn,
                      ...(filterVerification === v ? styles.filterBtnActive : {}),
                      ...(filterVerification !== v && v !== "all"
                        ? { borderColor: verificationColor(v), color: verificationColor(v) }
                        : {}),
                    }}
                  >
                    {v} ({verificationCounts[v]})
                  </button>
                )
              )}
            </div>
          </div>

          <p style={styles.resultCount}>{filtered.length} entries shown</p>

          {/* Entry list */}
          <div>
            {filtered.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelected(entry)}
                style={styles.row}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(240,234,224,0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div style={styles.rowLeft}>
                  <span
                    style={{
                      ...styles.statusDot,
                      backgroundColor: statusColor(entry.status),
                    }}
                  />
                  <span style={styles.rowYear}>
                    {entry.predictedDateNormalized.slice(0, 4)}
                  </span>
                  <span style={styles.rowQuote}>
                    {entry.quote.length > 100
                      ? entry.quote.slice(0, 100) + "..."
                      : entry.quote}
                  </span>
                </div>
                <div style={styles.rowRight}>
                  <span style={styles.rowAuthor}>{entry.author}</span>
                  <span style={styles.rowMeta}>
                    {entry.source_type || "ai"} ·{" "}
                    {entry.status || "pending"} ·{" "}
                    <span style={{ color: verificationColor(entry.verification_status) }}>
                      {entry.verification_status || "unverified"}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  multiline,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      {editable ? (
        multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={5}
            style={styles.textarea}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            style={styles.input}
          />
        )
      ) : (
        <p style={multiline ? styles.fieldValueMulti : styles.fieldValue}>
          {value || "—"}
        </p>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1040px",
    margin: "0 auto",
    padding: "48px 64px 96px",
  },
  title: {
    fontFamily: "var(--font-chrome)",
    fontSize: "1.5rem",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    margin: 0,
    marginBottom: "4px",
  },
  subtitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem",
    color: "var(--color-secondary)",
    letterSpacing: "0.04em",
    margin: 0,
    marginBottom: "32px",
  },
  tabBar: {
    display: "flex",
    gap: "0",
    marginBottom: "24px",
    borderBottom: "1px solid rgba(120,113,103,0.2)",
  },
  tabBtn: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.8125rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
    padding: "10px 20px",
    border: "none",
    borderBottom: "2px solid transparent",
    background: "transparent",
    color: "var(--color-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tabBtnActive: {
    color: "var(--color-text)",
    borderBottomColor: "var(--color-text)",
  },
  pendingBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.5625rem",
    fontWeight: 600,
    background: "#a67c00",
    color: "#fff",
    borderRadius: "8px",
    padding: "1px 6px",
    lineHeight: "1.4",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(120,113,103,0.2)",
  },
  searchInput: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.8125rem",
    padding: "6px 12px",
    border: "1px solid rgba(120,113,103,0.3)",
    borderRadius: "2px",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    width: "240px",
    outline: "none",
  },
  filterGroup: {
    display: "flex",
    gap: "4px",
  },
  filterBtn: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.6875rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    padding: "4px 10px",
    border: "1px solid rgba(120,113,103,0.2)",
    borderRadius: "2px",
    background: "transparent",
    color: "var(--color-secondary)",
    cursor: "pointer",
  },
  filterBtnActive: {
    background: "var(--color-text)",
    color: "var(--color-bg)",
    borderColor: "var(--color-text)",
  },
  select: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.75rem",
    padding: "5px 8px",
    border: "1px solid rgba(120,113,103,0.3)",
    borderRadius: "2px",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    cursor: "pointer",
  },
  resultCount: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem",
    color: "var(--color-secondary)",
    letterSpacing: "0.04em",
    marginBottom: "8px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "12px 8px",
    borderBottom: "1px solid rgba(120,113,103,0.12)",
    cursor: "pointer",
    transition: "background 100ms ease",
    gap: "16px",
  },
  rowLeft: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
    flex: 1,
    minWidth: 0,
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
    position: "relative",
    top: "-1px",
    display: "inline-block",
  },
  rowYear: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "var(--color-accent)",
    flexShrink: 0,
  },
  rowQuote: {
    fontFamily: "var(--font-body)",
    fontSize: "0.8125rem",
    color: "var(--color-text)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  rowRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    flexShrink: 0,
    gap: "2px",
  },
  rowAuthor: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem",
    color: "var(--color-secondary)",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  rowMeta: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.625rem",
    color: "var(--color-secondary)",
    letterSpacing: "0.04em",
    opacity: 0.6,
  },
  mono: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem",
    color: "var(--color-secondary)",
    letterSpacing: "0.04em",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  backBtn: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    color: "var(--color-secondary)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  actionBtn: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.6875rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    padding: "5px 14px",
    border: "1px solid rgba(120,113,103,0.3)",
    borderRadius: "2px",
    background: "transparent",
    color: "var(--color-text)",
    cursor: "pointer",
  },
  confirmBtn: {
    background: "var(--color-text)",
    color: "var(--color-bg)",
    borderColor: "var(--color-text)",
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(120,113,103,0.2)",
    marginBottom: "32px",
  },
  statusBadge: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.6875rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
  },
  verificationBadge: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.625rem",
    fontWeight: 500,
    letterSpacing: "0.06em",
    padding: "2px 8px",
    border: "1px solid",
    borderRadius: "2px",
  },
  smallBtn: {
    fontFamily: "var(--font-chrome)",
    fontSize: "0.625rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    padding: "3px 10px",
    border: "1px solid rgba(120,113,103,0.3)",
    borderRadius: "2px",
    background: "transparent",
    color: "var(--color-secondary)",
    cursor: "pointer",
  },
  fieldGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldLabel: {
    display: "block",
    fontFamily: "var(--font-chrome)",
    fontSize: "0.625rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--color-secondary)",
    marginBottom: "6px",
  },
  fieldValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8125rem",
    color: "var(--color-text)",
    lineHeight: 1.5,
    margin: 0,
  },
  fieldValueMulti: {
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    color: "var(--color-text)",
    lineHeight: 1.65,
    margin: 0,
  },
  input: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8125rem",
    width: "100%",
    padding: "6px 10px",
    border: "1px solid rgba(120,113,103,0.3)",
    borderRadius: "2px",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    boxSizing: "border-box" as const,
  },
  textarea: {
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    lineHeight: 1.65,
    width: "100%",
    padding: "8px 10px",
    border: "1px solid rgba(120,113,103,0.3)",
    borderRadius: "2px",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
  },
};
