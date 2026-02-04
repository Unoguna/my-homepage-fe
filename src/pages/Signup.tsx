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

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>회원가입</h2>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 16 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>아이디</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="username"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="password"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>비밀번호 확인</span>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
            placeholder="password again"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {done && (
          <p style={{ color: "green" }}>
            회원가입 완료! 로그인 페이지로 이동합니다.
          </p>
        )}
      </form>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link to="/login">로그인</Link>
        <Link to="/">홈</Link>
      </div>
    </div>
  );
}
