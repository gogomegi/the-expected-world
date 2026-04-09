"use client";

import { useState, useEffect, useCallback } from "react";
import type { Quote, QuoteStatus, QuoteSource } from "@/types/quote";
import type { Submission } from "@/types/quote";

type Tab = "quotes" | "submissions" | "homepage" | "archive";

interface HeroSlideConfig {
  slug: string;
  imageUrl: string;
  highlightPhrase: string;
  layout: "full" | "split";
  duotoneColor?: string;
}

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

  // Ordering state
  const [homepageOrder, setHomepageOrder] = useState<HeroSlideConfig[]>([]);
  const [archiveOrder, setArchiveOrder] = useState<string[]>([]);
  const [newHeroSlug, setNewHeroSlug] = useState("");

  const fetchHomepageOrder = useCallback(async () => {
    const res = await fetch("/api/admin/homepage-order");
    if (res.ok) setHomepageOrder(await res.json());
  }, []);

  const fetchArchiveOrder = useCallback(async () => {
    const res = await fetch("/api/admin/archive-order");
    if (res.ok) setArchiveOrder(await res.json());
  }, []);

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
    fetchHomepageOrder();
    fetchArchiveOrder();
  }, [fetchQuotes, fetchSubmissions, fetchHomepageOrder, fetchArchiveOrder]);

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
        <button
          onClick={() => setTab("homepage")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "homepage" ? "border-brass text-brass" : "border-transparent text-dusk hover:text-parchment"}`}
        >
          Homepage Order
        </button>
        <button
          onClick={() => setTab("archive")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "archive" ? "border-brass text-brass" : "border-transparent text-dusk hover:text-parchment"}`}
        >
          Archive Order
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
      ) : tab === "submissions" ? (
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
      ) : tab === "homepage" ? (
        /* Homepage Order tab */
        <div className="p-6">
          <p className="text-dusk text-sm mb-6">
            Configure which quotes appear as hero slides on the homepage. Use arrows to reorder.
          </p>

          {/* Current hero slides */}
          <div className="space-y-3 mb-8">
            {homepageOrder.map((slide, idx) => {
              const quote = quotes.find((q) => q.slug === slide.slug);
              return (
                <div
                  key={slide.slug}
                  className="bg-surface border border-divider rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...homepageOrder];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        setHomepageOrder(next);
                      }}
                      className="text-dusk hover:text-parchment disabled:opacity-20 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === homepageOrder.length - 1}
                      onClick={() => {
                        const next = [...homepageOrder];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        setHomepageOrder(next);
                      }}
                      className="text-dusk hover:text-parchment disabled:opacity-20 text-xs"
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {quote?.text.slice(0, 60)}...
                    </p>
                    <p className="text-brass text-xs">{quote?.author} · {quote?.yearWritten}</p>
                    <div className="flex gap-3 mt-2">
                      <label className="text-[10px] text-dusk uppercase">
                        Layout:
                        <select
                          value={slide.layout}
                          onChange={(e) => {
                            const next = [...homepageOrder];
                            next[idx] = { ...next[idx], layout: e.target.value as "full" | "split" };
                            setHomepageOrder(next);
                          }}
                          className="ml-1 bg-elevated border border-divider rounded px-1 py-0.5 text-parchment text-[10px]"
                        >
                          <option value="full">Full</option>
                          <option value="split">Split</option>
                        </select>
                      </label>
                      <input
                        value={slide.highlightPhrase}
                        onChange={(e) => {
                          const next = [...homepageOrder];
                          next[idx] = { ...next[idx], highlightPhrase: e.target.value };
                          setHomepageOrder(next);
                        }}
                        placeholder="Highlight phrase"
                        className="bg-elevated border border-divider rounded px-2 py-0.5 text-[10px] text-parchment w-40"
                      />
                      <input
                        value={slide.imageUrl}
                        onChange={(e) => {
                          const next = [...homepageOrder];
                          next[idx] = { ...next[idx], imageUrl: e.target.value };
                          setHomepageOrder(next);
                        }}
                        placeholder="Image URL"
                        className="bg-elevated border border-divider rounded px-2 py-0.5 text-[10px] text-parchment flex-1"
                      />
                    </div>
                    {slide.layout === "split" && (
                      <input
                        value={slide.duotoneColor || ""}
                        onChange={(e) => {
                          const next = [...homepageOrder];
                          next[idx] = { ...next[idx], duotoneColor: e.target.value || undefined };
                          setHomepageOrder(next);
                        }}
                        placeholder="Duotone color (e.g. #B05454)"
                        className="mt-1 bg-elevated border border-divider rounded px-2 py-0.5 text-[10px] text-parchment w-48"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => setHomepageOrder(homepageOrder.filter((_, i) => i !== idx))}
                    className="text-crimson text-xs hover:text-crimson/80 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add new slide */}
          <div className="flex gap-3 mb-6">
            <select
              value={newHeroSlug}
              onChange={(e) => setNewHeroSlug(e.target.value)}
              className="flex-1 h-9 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="">Add a quote to homepage...</option>
              {quotes
                .filter((q) => !homepageOrder.some((h) => h.slug === q.slug))
                .map((q) => (
                  <option key={q.slug} value={q.slug}>
                    {q.author} — {q.text.slice(0, 50)}...
                  </option>
                ))}
            </select>
            <button
              disabled={!newHeroSlug}
              onClick={() => {
                if (!newHeroSlug) return;
                setHomepageOrder([
                  ...homepageOrder,
                  { slug: newHeroSlug, imageUrl: "", highlightPhrase: "", layout: "full" },
                ]);
                setNewHeroSlug("");
              }}
              className="px-4 h-9 bg-brass text-ink rounded text-sm font-medium hover:bg-brass-bright disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <button
            onClick={async () => {
              await fetch("/api/admin/homepage-order", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(homepageOrder),
              });
              fetchHomepageOrder();
            }}
            className="px-6 py-2 bg-brass text-ink rounded text-sm font-medium hover:bg-brass-bright"
          >
            Save Homepage Order
          </button>
        </div>
      ) : tab === "archive" ? (
        /* Archive Order tab */
        <div className="p-6">
          <p className="text-dusk text-sm mb-6">
            Set the display order for the archive page. Quotes not listed here appear at the end sorted by year.
          </p>

          <div className="space-y-2 mb-6 max-h-[60vh] overflow-y-auto">
            {archiveOrder.map((slug, idx) => {
              const quote = quotes.find((q) => q.slug === slug);
              if (!quote) return null;
              return (
                <div
                  key={slug}
                  className="bg-surface border border-divider rounded p-3 flex items-center gap-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...archiveOrder];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        setArchiveOrder(next);
                      }}
                      className="text-dusk hover:text-parchment disabled:opacity-20 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === archiveOrder.length - 1}
                      onClick={() => {
                        const next = [...archiveOrder];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        setArchiveOrder(next);
                      }}
                      className="text-dusk hover:text-parchment disabled:opacity-20 text-xs"
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{quote.text.slice(0, 60)}...</p>
                    <p className="text-brass text-xs">{quote.author}</p>
                  </div>
                  <button
                    onClick={() => setArchiveOrder(archiveOrder.filter((_, i) => i !== idx))}
                    className="text-crimson text-xs shrink-0"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mb-6">
            <select
              onChange={(e) => {
                if (e.target.value && !archiveOrder.includes(e.target.value)) {
                  setArchiveOrder([...archiveOrder, e.target.value]);
                }
                e.target.value = "";
              }}
              className="flex-1 h-9 bg-elevated border border-divider rounded px-3 text-sm text-parchment"
            >
              <option value="">Add quote to archive order...</option>
              {quotes
                .filter((q) => !archiveOrder.includes(q.slug))
                .map((q) => (
                  <option key={q.slug} value={q.slug}>
                    {q.author} — {q.text.slice(0, 50)}...
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                await fetch("/api/admin/archive-order", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(archiveOrder),
                });
                fetchArchiveOrder();
              }}
              className="px-6 py-2 bg-brass text-ink rounded text-sm font-medium hover:bg-brass-bright"
            >
              Save Archive Order
            </button>
            <button
              onClick={() => setArchiveOrder([])}
              className="px-4 py-2 text-dusk text-sm hover:text-parchment border border-divider rounded"
            >
              Clear (use default)
            </button>
          </div>
        </div>
      ) : null}
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
