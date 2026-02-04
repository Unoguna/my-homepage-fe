import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export default function PostWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `작성 실패 (HTTP ${res.status})`);
      }

      navigate("/posts");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "작성 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const titlePreview = title.trim() ? title.trim() : "제목이 여기에 표시됩니다";
  const contentPreview = content.trim()
    ? content.trim()
    : "내용을 입력하면 여기에 미리보기가 표시됩니다.";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="group">
            <div className="text-xl font-black tracking-tight group-hover:opacity-90">
              MyHome
            </div>
            <div className="text-sm text-neutral-500">글쓰기</div>
          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link className="text-neutral-600 hover:text-black" to="/posts">
              목록
            </Link>
            <Link className="text-neutral-600 hover:text-black" to="/login">
              로그인
            </Link>
            <Link
              to="/posts/write"
              className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800"
            >
              새 글
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              새 글 작성
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              제목과 내용을 입력한 뒤 등록을 눌러주세요.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/posts"
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100"
            >
              목록으로
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Editor Card */}
          <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* title */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  제목
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none
                             focus:border-black focus:ring-2 focus:ring-black/10"
                />
                <div className="mt-2 text-xs text-neutral-500">
                  블로그 느낌을 위해 제목은 짧고 명확하게 추천해요.
                </div>
              </div>

              {/* content */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={12}
                  className="mt-2 w-full resize-y rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none
                             focus:border-black focus:ring-2 focus:ring-black/10"
                />
                <div className="mt-2 text-xs text-neutral-500">
                  세션 기반이라 요청에{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 border">
                    credentials: &quot;include&quot;
                  </code>{" "}
                  가 포함돼야 합니다.
                </div>
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white
                           hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "등록 중..." : "등록"}
              </button>

              {/* error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>
          </section>

          {/* Preview Card */}
          <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-800">미리보기</h3>
              <span className="text-xs text-neutral-500">Preview</span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-neutral-500">제목</div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight">
                {titlePreview}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold text-neutral-500">내용</div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {contentPreview}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600 leading-relaxed">
              Tip. 나중에 마크다운을 지원하면 더 “블로그” 느낌이 확 살아나요.
              (예: 제목/굵게/코드블록)
            </div>
          </section>
        </div>

        <p className="mt-10 text-center text-xs text-neutral-500">
          © MyHome — blog style editor
        </p>
      </main>
    </div>
  );
}
