/**
 * Commit a file to the GitHub repo via the GitHub API.
 * This triggers a Vercel rebuild automatically.
 *
 * Requires GITHUB_TOKEN env var with repo write access.
 */

const REPO_OWNER = "gogomegi";
const REPO_NAME = "the-expected-world";

interface GitHubFileResult {
  content: string;
  sha: string;
}

export async function readFileFromGitHub(path: string, branch = "main"): Promise<GitHubFileResult | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${branch}`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

interface CommitFileOptions {
  path: string;
  content: string;
  message: string;
  branch?: string;
}

export async function commitFileToGitHub({
  path,
  content,
  message,
  branch = "main",
}: CommitFileOptions): Promise<{ ok: boolean; url?: string; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { ok: false, error: "GITHUB_TOKEN not configured" };
  }

  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

  // Check if file already exists (to get its SHA for updates)
  let sha: string | undefined;
  try {
    const existing = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch {
    // File doesn't exist yet, that's fine
  }

  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch,
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.message || `GitHub API error (${res.status})` };
  }

  const data = await res.json();
  return { ok: true, url: data.content?.html_url };
}
