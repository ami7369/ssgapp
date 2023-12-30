import { Inter } from 'next/font/google'
import Link from "next/link";
import './common.css'
import { Sidebar } from '/component/globals';

//全体に適応されるレイアウト
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: "トヨタの森 公式ブログ",
    template: "%s | トヨタの森 公式ブログ", //各ページのtitle適応テンプレート
  },
  description:
    "「トヨタの森」は、トヨタ自動車（株）が社会貢献活動の一環として運営している環境学習施設です。  当ブログでは、自然体験イベントの参加者募集やレポートなど、最新情報をお伝えします。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <Menu />
        <div className="container">
          <div class="row">
            <div className="col-8  maincol">{children}</div>
            <div className="col-4 sidecol">
              <Sidebar />
            </div>
          </div>
          <hr />
        </div>
      </body>
    </html>
  );
}

//共通レイアウトコンポーネント
function Menu() {
  return (
    <div className="navbar menu">
      <nav>
      <ul className="menu-list">
        <li className="menu-item"><Link href="/">HOME</Link></li>
        <li className="menu-item"><Link href="#">ご利用案内</Link></li>
        <li className="menu-item"><Link href="#">お知らせ</Link></li>
        <li className="menu-item"><Link href="/list/1">イベント案内</Link></li>
        <li className="menu-item"><Link href="#">年間の見どころ</Link></li>
        <li className="menu-item"><Link href="/access">アクセス</Link></li>
        <li className="menu-item"><Link href="#">お問い合わせ</Link></li>
      </ul>
      </nav>
    </div>
  );
}

