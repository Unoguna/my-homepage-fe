import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

type PostSummary = {
  id: number;
  title: string;
  // 필요하면 authorName, createdAt 등 추가
};

export default function PostList() {
  const [items, setItems] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `목록 조회 실패 (HTTP ${res.status})`);
      }

      const json = await res.json().catch(() => null);
      const data = json?.data ?? json;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.items)
            ? data.items
            : [];

      setItems(list);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "목록 조회 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="group">
            <div className="text-xl font-black tracking-tight group-hover:opacity-90">
              MyHome
            </div>
            <div className="text-sm text-neutral-500">자유게시판</div>
          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link className="text-neutral-600 hover:text-black" to="/posts">
              게시글
            </Link>
            <Link className="text-neutral-600 hover:text-black" to="/login">
              로그인
            </Link>
            <Link
              to="/posts/write"
              className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800"
            >
              글쓰기
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">게시글</h2>
            <p className="mt-1 text-sm text-neutral-600">
              최신 글을 둘러보고, 로그인하면 글을 작성할 수 있어요.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchPosts}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100"
            >
              새로고침
            </button>
            <Link
              to="/posts/write"
              className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              글쓰기
            </Link>
          </div>
        </div>

        {/* Status */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              <p className="text-sm text-neutral-700">불러오는 중...</p>
            </div>

            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-neutral-100 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* List */}
        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-neutral-600">아직 글이 없어요.</p>
                <div className="mt-4">
                  <Link
                    to="/posts/write"
                    className="inline-flex rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                  >
                    첫 글 작성하기 →
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="mt-8 grid gap-4">
                {items.map((p) => (
                  <li key={p.id}>
                    <Link
                      // 상세 페이지 생기면 `/posts/${p.id}`
                      to="#"
                      className="block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-neutral-500">
                            #{p.id}
                          </div>
                          <h3 className="mt-1 text-lg font-bold tracking-tight text-neutral-900 truncate">
                            {p.title}
                          </h3>
                          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                            내용을 미리보기로 보여주고 싶으면, API에서 summary나
                            content 일부를 같이 내려주면 더 예뻐져요.
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-semibold text-neutral-500">
                          읽기 →
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <p className="mt-10 text-center text-xs text-neutral-500">
          © MyHome — blog style board
        </p>
      </main>
    </div>
  );
}
