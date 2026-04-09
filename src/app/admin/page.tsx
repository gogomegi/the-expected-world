"use client";

import { useState, useEffect, useCallback } from "react";
import type { Quote, QuoteStatus, QuoteSource } from "@/types/quote";
import type { Submission } from "@/types/quote";

type Tab = "quotes" | "submissions";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Quotes state
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [tab, setTab] = useState<Tab>("quotes");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Quote | null>(null);

  const fetchQuotes = useCallback(async () => {
    const res = await fetch("/api/admin/quotes");
    if (res.ok) {
      setQuotes(await res.json());
      setAuthed(true);
    } else if (res.status === 401) {
      setAuthed(false);
    }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    const res = await fetch("/api/admin/submissions");
    if (res.ok) setSubmissions(await res.json());
  }, []);

  useEffect(() => {
    fetchQuotes();
    fetchSubmissions();
  }, [fetchQuotes, fetchSubmissions]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setLoginError("");
      fetchQuotes();
      fetchSubmissions();
    } else {
      setLoginError("Invalid password");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
  }

  // ── Filters ──

  const categories = Array.from(
    new Set(quotes.flatMap((q) => q.categories))
  ).sort();

  const filtered = quotes.filter((q) => {
    if (filterStatus !== "all" && q.status !== filterStatus) return false;
    if (filterSource !== "all" && q.quoteSource !== filterSource) return false;
    if (
      filterCategory !== "all" &&
      !q.categories.some((c) => c === filterCategory)
    )
      return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        q.text.toLowerCase().includes(s) ||
        q.author.toLowerCase().includes(s) ||
        q.source.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // ── Bulk actions ──

  function toggleSelect(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((q) => q.slug)));
    }
  }

  async function bulkAction(action: string, value?: string) {
    await fetch("/api/admin/quotes/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, slugs: Array.from(selected), value }),
    });
    setSelected(new Set());
    fetchQuotes();
  }

  // ── Save quote ──

  async function saveQuote(quote: Quote) {
    await fetch("/api/admin/quotes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    setEditing(null);
    fetchQuotes();
  }

  // ── Submission actions ──

  async function handleSubmission(id: string, action: "approve" | "reject") {
    await fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    fetchSubmissions();
    fetchQuotes();
  }

  // ── Login screen ──

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-surface border border-divider rounded-lg p-8 w-full max-w-sm"
        >
          <h1 className="font-display font-semibold text-2xl mb-6">
            Admin Login
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-11 bg-elevated border border-divider rounded px-4 text-sm text-parchment placeholder:text-graphite mb-4 focus:outline-none focus:border-brass"
          />
          {loginError && (
            <p className="text-crimson text-sm mb-4">{loginError}</p>
          )}
          <button className="w-full h-11 bg-brass text-ink rounded font-medium text-sm uppercase tracking-wider hover:bg-brass-bright transition-colors">
            Sign In
          </button>
        </form>
      </div>
    );
  }

  // ── Editor modal ──

  if (editing) {
    return (
      <QuoteEditor
        quote={editing}
        onSave={saveQuote}
        onCancel={() => setEditing(null)}
        categories={categories}
      />
    );
  }

  // ── Main dashboard ──

  return (
    <div className="min-h-screen bg-ink text-parchment">
      {/* Header */}
      <header className="border-b border-divider px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-xl tracking-wide">
            TEW Admin
          </h1>
          <p className="text-dusk text-xs mt-1">
            {quotes.length} quotes · {submissions.filter((s) => s.status === "pending").length} pending submissions
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-dusk text-sm hover:text-parchment transition-colors"
        >
          Sign Out
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-divider px-6 flex gap-1">
        <button
          onClick={() => setTab("quotes")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "quotes" ? "border-brass text-brass" : "border-transparent text-dusk hover:text-parchment"}`}
        >
          Quotes ({quotes.length})
        </button>
        <button
          onClick={() => setTab("submissions")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "submissions" ? "border-brass text-brass" : "border-transparent text-dusk hover:text-parchment"}`}
        >
          Submissions ({submissions.filter((s) => s.status === "pending").length})
        </button>
      </div>

      {tab === "quotes" ? (
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search quotes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 bg-elevated border border-divider rounded px-3 text-sm text-parchment placeholder:text-graphite focus:outline-none focus:border-brass w-64"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending-review">Pending Review</option>
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="h-9 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="all">All sources</option>
              <option value="original">Original</option>
              <option value="ai-generated">AI Generated</option>
              <option value="user-submission">User Submission</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-9 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-elevated rounded border border-divider">
              <span className="text-sm text-brass font-medium">
                {selected.size} selected
              </span>
              <button
                onClick={() => bulkAction("publish")}
                className="text-sm px-3 py-1 bg-sage/20 text-sage rounded hover:bg-sage/30"
              >
                Publish
              </button>
              <button
                onClick={() => bulkAction("change-status", "draft")}
                className="text-sm px-3 py-1 bg-steel/20 text-steel rounded hover:bg-steel/30"
              >
                Set Draft
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${selected.size} quotes?`))
                    bulkAction("delete");
                }}
                className="text-sm px-3 py-1 bg-crimson/20 text-crimson rounded hover:bg-crimson/30"
              >
                Delete
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-sm text-dusk hover:text-parchment ml-auto"
              >
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div className="border border-divider rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-elevated text-dusk text-left">
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="accent-brass"
                    />
                  </th>
                  <th className="p-3">Quote</th>
                  <th className="p-3 w-32">Author</th>
                  <th className="p-3 w-20">Year</th>
                  <th className="p-3 w-28">Status</th>
                  <th className="p-3 w-28">Source</th>
                  <th className="p-3 w-28">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr
                    key={q.slug}
                    className="border-t border-divider hover:bg-elevated/50 cursor-pointer"
                    onClick={() => setEditing({ ...q })}
                  >
                    <td
                      className="p-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(q.slug);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(q.slug)}
                        onChange={() => toggleSelect(q.slug)}
                        className="accent-brass"
                      />
                    </td>
                    <td className="p-3 max-w-xs truncate">{q.text.slice(0, 80)}...</td>
                    <td className="p-3 text-brass">{q.author}</td>
                    <td className="p-3 font-mono text-xs">{q.yearWritten}</td>
                    <td className="p-3">
                      <StatusBadge status={q.status || "published"} />
                    </td>
                    <td className="p-3">
                      <SourceBadge source={q.quoteSource || "ai-generated"} />
                    </td>
                    <td className="p-3">
                      {q.didItHoldUp && (
                        <VerdictBadgeSmall verdict={q.didItHoldUp.verdict} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-dusk text-xs mt-3">
            Showing {filtered.length} of {quotes.length} quotes
          </p>
        </div>
      ) : (
        /* Submissions tab */
        <div className="p-6">
          {submissions.length === 0 ? (
            <p className="text-dusk italic">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-surface border border-divider rounded-lg p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-quote text-lg mb-2">
                        &ldquo;{sub.text}&rdquo;
                      </p>
                      <p className="text-brass text-sm">— {sub.author}</p>
                      <p className="text-dusk text-xs mt-1">
                        {sub.source} · {sub.yearWritten}
                        {sub.yearImagined && ` → ${sub.yearImagined}`}
                        {sub.topic && ` · ${sub.topic}`}
                      </p>
                      <p className="text-graphite text-xs mt-2">
                        Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                        {sub.email && ` by ${sub.email}`}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {sub.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleSubmission(sub.id, "approve")}
                            className="px-3 py-1.5 bg-sage/20 text-sage text-sm rounded hover:bg-sage/30"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleSubmission(sub.id, "reject")}
                            className="px-3 py-1.5 bg-crimson/20 text-crimson text-sm rounded hover:bg-crimson/30"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs px-2 py-1 rounded ${sub.status === "approved" ? "bg-sage/20 text-sage" : "bg-crimson/20 text-crimson"}`}
                        >
                          {sub.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Small components ──

function StatusBadge({ status }: { status: QuoteStatus }) {
  const styles: Record<string, string> = {
    published: "bg-sage/15 text-sage",
    draft: "bg-steel/15 text-steel",
    "pending-review": "bg-ochre/15 text-ochre",
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${styles[status] || ""}`}>
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: QuoteSource }) {
  const styles: Record<string, string> = {
    original: "bg-brass/15 text-brass",
    "ai-generated": "bg-steel/15 text-steel",
    "user-submission": "bg-sage/15 text-sage",
  };
  const labels: Record<string, string> = {
    original: "Original",
    "ai-generated": "AI",
    "user-submission": "User",
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${styles[source] || ""}`}>
      {labels[source] || source}
    </span>
  );
}

function VerdictBadgeSmall({ verdict }: { verdict: string }) {
  const styles: Record<string, string> = {
    "came-true": "text-sage",
    "partially-true": "text-ochre",
    "did-not-come-true": "text-crimson",
    pending: "text-steel",
  };
  const labels: Record<string, string> = {
    "came-true": "✓",
    "partially-true": "~",
    "did-not-come-true": "✗",
    pending: "?",
  };
  return <span className={`text-lg ${styles[verdict] || ""}`}>{labels[verdict]}</span>;
}

// ── Quote Editor ──

function QuoteEditor({
  quote,
  onSave,
  onCancel,
  categories,
}: {
  quote: Quote;
  onSave: (q: Quote) => void;
  onCancel: () => void;
  categories: string[];
}) {
  const [q, setQ] = useState<Quote>({ ...quote });

  function set<K extends keyof Quote>(key: K, value: Quote[K]) {
    setQ((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-ink text-parchment">
      <header className="border-b border-divider px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-xl">Edit Quote</h1>
          <p className="text-dusk text-xs mt-1">{q.slug}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="text-dusk text-sm hover:text-parchment"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(q)}
            className="px-4 py-2 bg-brass text-ink rounded text-sm font-medium hover:bg-brass-bright transition-colors"
          >
            Save
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Status & Source */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={q.status || "published"}
              onChange={(e) => set("status", e.target.value as QuoteStatus)}
              className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="draft">Draft</option>
              <option value="pending-review">Pending Review</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
              Source Type
            </label>
            <select
              value={q.quoteSource || "ai-generated"}
              onChange={(e) => set("quoteSource", e.target.value as QuoteSource)}
              className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="original">Original</option>
              <option value="ai-generated">AI Generated</option>
              <option value="user-submission">User Submission</option>
            </select>
          </div>
        </div>

        {/* Quote text */}
        <div>
          <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
            Quote Text
          </label>
          <textarea
            value={q.text}
            onChange={(e) => set("text", e.target.value)}
            rows={4}
            className="w-full bg-elevated border border-divider rounded px-4 py-3 text-sm text-parchment font-quote resize-y focus:outline-none focus:border-brass"
          />
        </div>

        {/* Author & Source */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
              Author
            </label>
            <input
              value={q.author}
              onChange={(e) => set("author", e.target.value)}
              className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment focus:outline-none focus:border-brass"
            />
          </div>
          <div>
            <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
              Source
            </label>
            <input
              value={q.source}
              onChange={(e) => set("source", e.target.value)}
              className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment focus:outline-none focus:border-brass"
            />
          </div>
        </div>

        {/* Years */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
              Year Written
            </label>
            <input
              type="number"
              value={q.yearWritten}
              onChange={(e) => set("yearWritten", Number(e.target.value))}
              className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment focus:outline-none focus:border-brass"
            />
          </div>
          <div>
            <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
              Year Imagined
            </label>
            <input
              value={q.yearImagined}
              onChange={(e) => set("yearImagined", e.target.value)}
              className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment focus:outline-none focus:border-brass"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
            Categories (comma-separated)
          </label>
          <input
            value={q.categories.join(", ")}
            onChange={(e) =>
              set(
                "categories",
                e.target.value.split(",").map((c) => c.trim()).filter(Boolean)
              )
            }
            className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment focus:outline-none focus:border-brass"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
            Image URL
          </label>
          <input
            value={q.imageUrl || ""}
            onChange={(e) => set("imageUrl", e.target.value || undefined)}
            className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment focus:outline-none focus:border-brass"
          />
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
            Source URL
          </label>
          <input
            value={q.sourceUrl || ""}
            onChange={(e) => set("sourceUrl", e.target.value || undefined)}
            className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment focus:outline-none focus:border-brass"
          />
        </div>

        {/* Verdict */}
        <div className="border border-divider rounded-lg p-6 bg-surface">
          <h3 className="font-display font-semibold text-lg mb-4">
            Did It Hold Up?
          </h3>
          <div className="mb-4">
            <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
              Verdict
            </label>
            <select
              value={q.didItHoldUp?.verdict || ""}
              onChange={(e) => {
                const verdict = e.target.value;
                if (!verdict) {
                  const { didItHoldUp: _, ...rest } = q;
                  setQ(rest as Quote);
                } else {
                  set("didItHoldUp", {
                    verdict: verdict as Quote["didItHoldUp"] extends { verdict: infer V } ? V : never,
                    analysis: q.didItHoldUp?.analysis || "",
                  });
                }
              }}
              className="w-full h-10 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="">No verdict</option>
              <option value="came-true">Came True</option>
              <option value="partially-true">Partially True</option>
              <option value="did-not-come-true">Did Not Come True</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          {q.didItHoldUp && (
            <div>
              <label className="block text-dusk text-xs uppercase tracking-wider mb-1">
                Analysis
              </label>
              <textarea
                value={q.didItHoldUp.analysis}
                onChange={(e) =>
                  set("didItHoldUp", {
                    ...q.didItHoldUp!,
                    analysis: e.target.value,
                  })
                }
                rows={4}
                className="w-full bg-elevated border border-divider rounded px-4 py-3 text-sm text-parchment resize-y focus:outline-none focus:border-brass"
              />
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="border border-divider rounded-lg p-6 bg-surface">
          <h3 className="font-display font-semibold text-lg mb-4">Preview</h3>
          <div className="font-mono text-[10px] tracking-wider uppercase text-dusk mb-3">
            Written <span className="text-parchment">{q.yearWritten}</span>
            <span className="text-brass-muted mx-2">→</span>
            Imagined <span className="text-parchment">{q.yearImagined}</span>
          </div>
          <blockquote className="font-quote text-xl leading-relaxed mb-3">
            &ldquo;{q.text}&rdquo;
          </blockquote>
          <p className="text-brass text-sm">— {q.author}</p>
          <p className="text-dusk text-xs italic">{q.source}</p>
        </div>
      </div>
    </div>
  );
}
