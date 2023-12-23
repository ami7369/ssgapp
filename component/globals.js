import parse from "html-react-parser";
import { getLists } from "/lib/microcms";
import Link from "next/link";
import { Path } from "/setting/const.js";

export const Menu =() => {
  return (
    <div className="navbar">
      <nav>
      <ul>
        <li><Link href={Path.TOP}>HOME</Link></li>
        <li><Link href="#">ご利用案内</Link></li>
        <li><Link href="#">お知らせ</Link></li>
        <li><Link href={Path.BLOG}>イベント案内</Link></li>
        <li><Link href="#">年間の見どころ</Link></li>
        <li><Link href={Path.ACCESS}>アクセス</Link></li>
        <li><Link href="#">お問い合わせ</Link></li>
      </ul>
      </nav>
    </div>
  );
}
const replacer = (dom) => {
  if (dom.name === "img") {
    const attr = dom.attribs;
    return <Image className="HOGE" fill imgsrc={attr.src} alt={attr.alt} />;
  }
};

export const Sidebar = async()=> {
  const { contents } = await getLists("mori-static", { filters: 'component[equals]true',orders:'displayorder' });
  return (
    <div>
      {contents.map((data) => {
        return parse(data.content,replacer);      
      })
      }
    </div>
  )
};

const SideBanner = (data)=>{
  return (
    <Image></Image>
  )
}

export function ArchiveList() {
  //月別アーカイブリスト
}

export function CategoryList() {
  //カテゴリリスト
}
