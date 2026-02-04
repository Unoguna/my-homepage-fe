import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);

    if (!username.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }
    if (password.length < 4) {
      setError("비밀번호는 4자 이상으로 해주세요.");
      return;
    }
    if (password !== password2) {
      setError("비밀번호가 서로 달라요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `회원가입 실패 (HTTP ${res.status})`);
      }

      setDone(true);

      // 회원가입 후 바로 로그인 페이지로 이동
      setTimeout(() => navigate("/login"), 400);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const passwordMismatch =
    password.length > 0 && password2.length > 0 && password !== password2;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="group">
            <div className="text-xl font-black tracking-tight group-hover:opacity-90">
              MyHome
            </div>
            <div className="text-sm text-neutral-500">회원가입</div>
          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link className="text-neutral-600 hover:text-black" to="/posts">
              게시판
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
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="mx-auto max-w-md">
          <div className="mb-7">
            <h2 className="text-3xl font-extrabold tracking-tight">회원가입</h2>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              아이디와 비밀번호를 설정해서 계정을 만들어요.
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
                <div className="mt-2 text-xs text-neutral-500">
                  영문/숫자 조합으로 간단하게 추천해요.
                </div>
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
                  autoComplete="new-password"
                  placeholder="password"
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none
                             focus:border-black focus:ring-2 focus:ring-black/10"
                />
                <div className="mt-2 text-xs text-neutral-500">
                  최소 4자 이상으로 설정해주세요.
                </div>
              </div>

              {/* password confirm */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  autoComplete="new-password"
                  placeholder="password again"
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none
                             focus:border-black focus:ring-2 focus:ring-black/10"
                />
                {passwordMismatch && (
                  <div className="mt-2 text-xs font-semibold text-red-600">
                    비밀번호가 서로 달라요.
                  </div>
                )}
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white
                           hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "가입 중..." : "회원가입"}
              </button>

              {/* messages */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {done && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  회원가입 완료! 로그인 페이지로 이동합니다.
                </div>
              )}

              {/* hint */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600 leading-relaxed">
                회원가입 요청에도{" "}
                <code className="rounded bg-white px-1.5 py-0.5 border">
                  credentials: &quot;include&quot;
                </code>{" "}
                가 포함되어 있어요. (세션/쿠키 정책에 따라 필요)
              </div>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
              <Link to="/login" className="text-neutral-600 hover:text-black">
                로그인
              </Link>
              <Link to="/" className="font-semibold text-black hover:underline">
                홈으로 →
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            © MyHome — blog style signup
          </p>
        </div>
      </main>
    </div>
  );
}
