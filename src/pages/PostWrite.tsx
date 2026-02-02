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
        credentials: "include", // ✅ 세션 쿠키 필수
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
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>글쓰기</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/posts">목록</Link>
          <Link to="/login">로그인</Link>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>내용</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            rows={10}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "등록 중..." : "등록"}
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>

      <p style={{ marginTop: 12, color: "#666" }}>
        세션 기반이라 요청에 <code>credentials: "include"</code>가 반드시
        포함돼야 합니다.
      </p>
    </div>
  );
}
