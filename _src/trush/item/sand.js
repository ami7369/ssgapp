"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getDetail } from "/lib/microcms";
import parse, { domToReact } from "html-react-parser";
import Image from "next/image";
import useSWR from "swr";

function Content() {
 const html = `<section><h2>Replace img to Component</h2><p>Todays Letter.<img alt="daihuku" src="h/s400/sweets_daifuku.png"></p><p>Second Image<img src="https://blogger.googleusercontent.com/img/sand.jpg"></p></section>`;
  return (
    <div>
      {parse(html, { replacer })}
    </div>
  );
}

const replacer = (domNode) => {
  console.log("||Replace start|| " + domNode.name);
  const attr = domNode.attribs;

  // img要素の場合
  if (domNode.name === 'img') {
    domNode.attribs.alt = "sample"; // alt属性に"sample"を設定
    return (
        <img {...domNode.attribs} />
    );
  }
};

export default function Page({params}) {
  return (
    <div>
      <Suspense>
        <Content/>
      </Suspense>
    </div>
  )
}
