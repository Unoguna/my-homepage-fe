import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

type MeRes = {
  id: number;
  username: string;
  role: string;
};

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeRes | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `로그인 실패 (HTTP ${res.status})`);
      }

      const json = await res.json().catch(() => null);
      const data = json?.data ?? json;
      setMe(data);

      navigate("/posts");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top mini header (blog style) */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="group">
            <div className="text-xl font-black tracking-tight group-hover:opacity-90">
              MyHome
            </div>
            <div className="text-sm text-neutral-500">
              세션 기반 로그인 + 자유게시판
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link className="text-neutral-600 hover:text-black" to="/posts">
              게시판
            </Link>
            <Link className="text-neutral-600 hover:text-black" to="/signup">
              회원가입
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
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="mx-auto max-w-md">
          <div className="mb-7">
            <h2 className="text-3xl font-extrabold tracking-tight">로그인</h2>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              계정으로 로그인해서 글 작성/수정/삭제를 이용할 수 있어요.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* username */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  아이디
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="username"
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none
                             focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* password */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="password"
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none
                             focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white
                           hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>

              {/* messages */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {me && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  로그인 성공:{" "}
                  <span className="font-semibold">{me.username}</span>{" "}
                  <span className="text-emerald-700/80">({me.role})</span>
                </div>
              )}

              {/* hint */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600 leading-relaxed">
                세션 기반 인증이므로 요청에{" "}
                <code className="rounded bg-white px-1.5 py-0.5 border">
                  credentials: &quot;include&quot;
                </code>{" "}
                가 포함되어야 해요.
              </div>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-neutral-600">계정이 없나요?</span>
              <Link
                to="/signup"
                className="font-semibold text-black hover:underline"
              >
                회원가입 →
              </Link>
            </div>
          </div>

          {/* footer */}
          <p className="mt-6 text-center text-xs text-neutral-500">
            © MyHome — blog style board
          </p>
        </div>
      </main>
    </div>
  );
}
