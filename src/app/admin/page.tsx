"use client";

import { useState, useEffect, useCallback } from "react";
import type { Entry } from "@/types/quote";

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

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/corpus");
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filtered = entries.filter((e) => {
    if (filterStatus !== "all" && (e.status || "pending-review") !== filterStatus)
      return false;
    if (filterSource !== "all" && (e.quoteSource || "ai") !== filterSource)
      return false;
    if (
      filterCategory !== "all" &&
      (e.categories[0] || "").toLowerCase() !== filterCategory.toLowerCase()
    )
      return false;
    if (filterVerification !== "all" && (e.verificationStatus || "unverified") !== filterVerification)
      return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !e.text.toLowerCase().includes(q) &&
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

  const handleStatus = async (slug: string, status: string) => {
    await fetch("/api/corpus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, status }),
    });
    await fetchEntries();
    if (selected?.slug === slug) {
      setSelected((prev) =>
        prev ? { ...prev, status: status as Entry["status"] } : null
      );
    }
  };

  const statusColor = (status: string | undefined) => {
    switch (status) {
      case "published":
        return "#2d6a30";
      case "draft":
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

  const statusCounts = {
    all: entries.length,
    "pending-review": entries.filter((e) => (e.status || "pending-review") === "pending-review")
      .length,
    published: entries.filter((e) => e.status === "published").length,
    draft: entries.filter((e) => e.status === "draft").length,
  };

  const verificationCounts = {
    all: entries.length,
    verified: entries.filter((e) => e.verificationStatus === "verified").length,
    paraphrased: entries.filter((e) => e.verificationStatus === "paraphrased").length,
    unverified: entries.filter((e) => (e.verificationStatus || "unverified") === "unverified").length,
    fabricated: entries.filter((e) => e.verificationStatus === "fabricated").length,
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.mono}>Loading corpus…</p>
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
                  {saving ? "saving…" : "save"}
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
            {(entry.status || "pending-review").toUpperCase()}
          </span>
          <span
            style={{
              ...styles.verificationBadge,
              color: verificationColor(entry.verificationStatus),
              borderColor: verificationColor(entry.verificationStatus),
            }}
          >
            {(entry.verificationStatus || "unverified").toUpperCase()}
          </span>
          <span style={styles.mono}>
            {entry.quoteSource || "ai"} · {entry.categories[0]}
          </span>
          {!isEditing && (
            <div
              style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
            >
              <button
                onClick={() => handleStatus(entry.slug, "published")}
                style={{
                  ...styles.smallBtn,
                  borderColor: "#2d6a30",
                  color: "#2d6a30",
                }}
              >
                publish
              </button>
              <button
                onClick={() => handleStatus(entry.slug, "draft")}
                style={{
                  ...styles.smallBtn,
                  borderColor: "#C03A1E",
                  color: "#C03A1E",
                }}
              >
                draft
              </button>
              <button
                onClick={() => handleStatus(entry.slug, "pending-review")}
                style={styles.smallBtn}
              >
                reset
              </button>
            </div>
          )}
        </div>

        {/* Fields */}
        <div style={styles.fieldGrid}>
          <Field label="Slug" value={entry.slug} />
          <Field
            label="Quote"
            value={isEditing ? editing!.text : entry.text}
            multiline
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, text: v })}
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
              value={isEditing ? String(editing!.yearWritten) : String(entry.yearWritten)}
              editable={isEditing}
              onChange={(v) =>
                setEditing((e) => e && { ...e, yearWritten: parseInt(v) || 0 })
              }
            />
            <Field
              label="Predicted Date"
              value={
                isEditing ? editing!.yearImagined : entry.yearImagined
              }
              editable={isEditing}
              onChange={(v) =>
                setEditing((e) => e && { ...e, yearImagined: v })
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
                value={editing!.categories[0] || ""}
                onChange={(e) =>
                  setEditing(
                    (prev) => prev && { ...prev, categories: [e.target.value] }
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
            <Field label="Category" value={entry.categories.join(", ")} />
          )}
          <Field
            label="Annotation"
            value={isEditing ? editing!.annotation || "" : entry.annotation || ""}
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
                ? editing!.didItHoldUp?.analysis || ""
                : entry.didItHoldUp?.analysis || ""
            }
            multiline
            editable={isEditing}
            onChange={(v) =>
              setEditing((e) => e && {
                ...e,
                didItHoldUp: { verdict: e.didItHoldUp?.verdict || "pending", analysis: v },
              })
            }
          />
          <Field
            label="Tags (comma-separated)"
            value={
              isEditing
                ? (editing!.tags || []).join(", ")
                : (entry.tags || []).join(", ")
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
                value={editing!.verificationStatus || "unverified"}
                onChange={(e) =>
                  setEditing(
                    (prev) => prev && { ...prev, verificationStatus: e.target.value as Entry["verificationStatus"] }
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
            <Field label="Verification Status" value={entry.verificationStatus || "unverified"} />
          )}
          <Field
            label="Source URL"
            value={isEditing ? editing!.sourceUrl || "" : entry.sourceUrl || ""}
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, sourceUrl: v })}
          />
          <Field
            label="Verification Note"
            value={isEditing ? editing!.verificationNote || "" : entry.verificationNote || ""}
            multiline
            editable={isEditing}
            onChange={(v) => setEditing((e) => e && { ...e, verificationNote: v })}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>
      <p style={styles.subtitle}>{entries.length} entries in corpus</p>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="search author or quote…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filterGroup}>
          {(["all", "pending-review", "published", "draft"] as const).map(
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
            key={entry.slug}
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
                {entry.text.length > 100
                  ? entry.text.slice(0, 100) + "…"
                  : entry.text}
              </span>
            </div>
            <div style={styles.rowRight}>
              <span style={styles.rowAuthor}>{entry.author}</span>
              <span style={styles.rowMeta}>
                {entry.quoteSource || "ai"} ·{" "}
                {entry.status || "pending-review"} ·{" "}
                <span style={{ color: verificationColor(entry.verificationStatus) }}>
                  {entry.verificationStatus || "unverified"}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
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
