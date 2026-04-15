import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Passage — The Expected World",
  description:
    "Know a historical prediction we should feature? Submit it here.",
};

export default function SubmitPage() {
  return (
    <main>
      {/* Dark header with grid */}
      <section className="grid-bg bg-black pt-24 pb-16 text-center">
        <p className="section-label mb-4">Contribute to the archive</p>
        <h1
          className="font-bold tracking-[-0.02em] leading-[0.95] text-cream"
          style={{
            fontFamily: "var(--fh)",
            fontSize: "clamp(48px, 8vw, 96px)",
          }}
        >
          SUBMIT A PASSAGE
        </h1>
        <p
          className="mt-4 text-lg italic"
          style={{ color: "var(--muted-d)", fontFamily: "var(--fq)" }}
        >
          Know a prediction we are missing? Help us build the archive.
        </p>
      </section>

      {/* Cream form body */}
      <section
        className="px-4 py-16"
        style={{ background: "var(--cream)" }}
      >
        <div
          className="max-w-[640px] mx-auto border rounded-lg p-8 sm:p-10"
          style={{
            background: "var(--white)",
            borderColor: "var(--rule-l)",
          }}
        >
          <form className="space-y-6">
            <div>
              <label
                htmlFor="quote"
                className="block font-semibold text-[13px] uppercase tracking-[0.06em] mb-1.5"
                style={{ color: "var(--text-l)" }}
              >
                The prediction <span style={{ color: "var(--orange)" }}>*</span>
              </label>
              <textarea
                id="quote"
                name="quote"
                rows={5}
                required
                className="w-full min-h-[140px] border rounded px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-y"
                style={{
                  background: "var(--white)",
                  borderColor: "var(--rule-l)",
                  color: "var(--text-l)",
                }}
                placeholder="Paste or type the prediction text..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="author"
                  className="block font-semibold text-[13px] uppercase tracking-[0.06em] mb-1.5"
                  style={{ color: "var(--text-l)" }}
                >
                  Who said it? <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  required
                  className="w-full h-11 border rounded px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  style={{
                    background: "var(--white)",
                    borderColor: "var(--rule-l)",
                    color: "var(--text-l)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="yearWritten"
                  className="block font-semibold text-[13px] uppercase tracking-[0.06em] mb-1.5"
                  style={{ color: "var(--text-l)" }}
                >
                  Year written <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <input
                  id="yearWritten"
                  name="yearWritten"
                  type="number"
                  required
                  className="w-full h-11 border rounded px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  style={{
                    background: "var(--white)",
                    borderColor: "var(--rule-l)",
                    color: "var(--text-l)",
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="yearImagined"
                  className="block font-semibold text-[13px] uppercase tracking-[0.06em] mb-1.5"
                  style={{ color: "var(--text-l)" }}
                >
                  Year they imagined
                </label>
                <input
                  id="yearImagined"
                  name="yearImagined"
                  type="text"
                  className="w-full h-11 border rounded px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  style={{
                    background: "var(--white)",
                    borderColor: "var(--rule-l)",
                    color: "var(--text-l)",
                  }}
                  placeholder="e.g. 2000, 2000s"
                />
              </div>
              <div>
                <label
                  htmlFor="topic"
                  className="block font-semibold text-[13px] uppercase tracking-[0.06em] mb-1.5"
                  style={{ color: "var(--text-l)" }}
                >
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  className="w-full h-11 border rounded px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all appearance-none"
                  style={{
                    background: "var(--white)",
                    borderColor: "var(--rule-l)",
                    color: "var(--text-l)",
                  }}
                >
                  <option value="">Select a topic...</option>
                  <option value="Technology">Technology</option>
                  <option value="AI & Robots">AI &amp; Robots</option>
                  <option value="Space">Space</option>
                  <option value="Society">Society</option>
                  <option value="Environment">Environment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Communication">Communication</option>
                  <option value="Health & Medicine">Health &amp; Medicine</option>
                  <option value="Economy">Economy</option>
                  <option value="Energy">Energy</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food & Agriculture">Food &amp; Agriculture</option>
                  <option value="War & Politics">War &amp; Politics</option>
                  <option value="Culture & Entertainment">
                    Culture &amp; Entertainment
                  </option>
                  <option value="Population">Population</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="source"
                className="block font-semibold text-[13px] uppercase tracking-[0.06em] mb-1.5"
                style={{ color: "var(--text-l)" }}
              >
                Source URL or reference
              </label>
              <input
                id="source"
                name="source"
                type="text"
                className="w-full h-11 border rounded px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                style={{
                  background: "var(--white)",
                  borderColor: "var(--rule-l)",
                  color: "var(--text-l)",
                }}
                placeholder="Book, article, URL..."
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-semibold text-[13px] uppercase tracking-[0.06em] mb-1.5"
                style={{ color: "var(--text-l)" }}
              >
                Your email (optional, for credit)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full h-11 border rounded px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                style={{
                  background: "var(--white)",
                  borderColor: "var(--rule-l)",
                  color: "var(--text-l)",
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 font-semibold text-sm uppercase tracking-[0.06em] rounded transition-colors hover:opacity-90"
              style={{
                background: "var(--text-l)",
                color: "var(--cream)",
              }}
            >
              Submit Prediction
            </button>
          </form>
        </div>

        <p
          className="text-[13px] text-center mt-6"
          style={{ color: "var(--muted-l)", fontFamily: "var(--fm)" }}
        >
          All submissions are reviewed before publishing.
        </p>
      </section>
    </main>
  );
}
