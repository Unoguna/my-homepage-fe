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
        credentials: "include", // 비로그인이라도 붙여두면 편함 (세션 있으면 자동 포함)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `목록 조회 실패 (HTTP ${res.status})`);
      }

      const json = await res.json().catch(() => null);
      const data = json?.data ?? json; // CommonResponse면 data
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
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>게시판</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/posts/write">글쓰기</Link>
          <Link to="/login">로그인</Link>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <ul style={{ display: "grid", gap: 10, paddingLeft: 16 }}>
          {items.map((p) => (
            <li key={p.id}>
              {/* 추후 상세 페이지 만들면 /posts/:id 로 바꾸면 됨 */}
              <span style={{ marginRight: 8, color: "#888" }}>#{p.id}</span>
              <span>{p.title}</span>
            </li>
          ))}
          {items.length === 0 && (
            <p style={{ color: "#666" }}>아직 글이 없어요.</p>
          )}
        </ul>
      )}

      <button onClick={fetchPosts} style={{ marginTop: 16 }}>
        새로고침
      </button>
    </div>
  );
}
