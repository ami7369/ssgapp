import Link from "next/link";
import { getLists, SWROpt, getArchiveList } from "/lib/microcms";
import parse from "html-react-parser";
import Image from "next/image";

export const metadata = {
  title: "アクセス",
};

console.log("ENV:" + process.env.SITE)
console.log("ENV2:" + process.env.APIKEY);

export default async function About() {
  const { contents } = await getLists("mori-static", { filters: 'title[equals]アクセス' });
  return (
    <div>
      <h1>{contents[0].title}</h1>
      <div className="contents">
        {parse(contents[0].content)}
      </div>
    </div>
  );
};

const replacer = (dom) => {
  if (dom.name === "img") {
    const attr = dom.attribs;
    return <Image className="HOGE" fill imgsrc={attr.src} alt={attr.alt} />;
  }
};
