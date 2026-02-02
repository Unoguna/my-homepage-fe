import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>MyHome</h1>
      <p>세션 기반 로그인 + 자유게시판</p>

      <nav style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link to="/posts">게시판</Link>
        <Link to="/login">로그인</Link>
        <Link to="/posts/write">글쓰기</Link>
      </nav>

      <hr style={{ margin: "24px 0" }} />

      <p style={{ color: "#555" }}>
        로그인 없이 글 목록은 볼 수 있고, 로그인하면 글을 작성할 수 있어요.
      </p>
    </div>
  );
}
