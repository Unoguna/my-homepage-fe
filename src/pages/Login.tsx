import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        credentials: "include", // ✅ 세션 쿠키 필수
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `로그인 실패 (HTTP ${res.status})`);
      }

      // 백엔드가 CommonResponse 형태라면 여기서 파싱해서 data만 쓰면 됨.
      // 일단 최대한 유연하게 처리:
      const json = await res.json().catch(() => null);
      const data = json?.data ?? json; // CommonResponse면 data, 아니면 json 자체
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
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>로그인</h2>

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
            autoComplete="current-password"
            placeholder="password"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {me && (
          <p style={{ color: "green" }}>
            로그인 성공: {me.username} ({me.role})
          </p>
        )}
      </form>

      <p style={{ marginTop: 12, color: "#666" }}>
        백엔드 세션 기반이므로 fetch에 <code>credentials: "include"</code>가 꼭
        들어가야 해요.
      </p>
    </div>
  );
}
