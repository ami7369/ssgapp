import { Inter } from 'next/font/google'
import Script from "next/script";
import Link from "next/link";
import './common.css'
import { getDetail, microCMSLoader, ImagePathReplace,getLists } from "/lib/microcms";
import { Sidebar,Menu } from "/component/globals"
import parse from "html-react-parser";


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
        <div className="container">
          <div class="row">
            <div className="col-8  maincol">{children}</div>
            <div className="col-4 sidecol">
              {/* <Sidebar /> */}
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

//共通レイアウトコンポーネント
const Footer = () => {
  return (
    <footer>
      <p>
        <Link href="/">TOP</Link>
      </p>
    </footer>
  );
};