import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">MyHome</h1>
            <p className="text-sm text-neutral-500">
              세션 기반 로그인 + 자유게시판
            </p>
          </div>

          <nav className="flex gap-3 text-sm font-medium">
            <Link className="hover:text-black text-neutral-600" to="/posts">
              게시판
            </Link>
            <Link className="hover:text-black text-neutral-600" to="/login">
              로그인
            </Link>
            <Link className="hover:text-black text-neutral-600" to="/signup">
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

      {/* hero */}
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              기록을 남기고
              <br />
              생각을 정리하는 공간
            </h2>

            <p className="mt-6 text-neutral-600 leading-relaxed">
              로그인 없이 글을 읽고, 로그인하면 글을 작성할 수 있어요.
              <br />
              가볍게 쓰는 개인 블로그 스타일 게시판입니다.
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                to="/posts"
                className="px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800"
              >
                글 보러가기
              </Link>

              <Link
                to="/posts/write"
                className="px-5 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 font-semibold"
              >
                새 글 쓰기
              </Link>
            </div>
          </div>

          {/* side card */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">이 블로그 특징</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>✓ 게시글 조회는 누구나 가능</li>
              <li>✓ 작성/수정/삭제는 로그인 필요</li>
              <li>✓ 세션 기반 인증</li>
              <li>✓ 심플 & 미니멀 UI</li>
            </ul>
          </div>
        </div>

        {/* cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h4 className="font-bold">간단한 인증 구조</h4>
            <p className="mt-2 text-sm text-neutral-600">
              JWT 없이 세션 기반으로 빠르게 구현했습니다.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h4 className="font-bold">블로그 스타일</h4>
            <p className="mt-2 text-sm text-neutral-600">
              카드형 레이아웃으로 가독성을 높였습니다.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h4 className="font-bold">확장 가능</h4>
            <p className="mt-2 text-sm text-neutral-600">
              댓글, 태그, 좋아요 기능도 쉽게 붙일 수 있어요.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-neutral-500">
          © MyHome — blog style board
        </div>
      </footer>
    </div>
  );
}
