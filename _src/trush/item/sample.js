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

const replacer = (dom) => {
  if (dom.name === 'img') {
    const attr = dom.attribs;
    return (
      <Image className="HOGE" fill imgsrc={attr.src} alt={attr.alt} />
    );
  }
}

export default function Page({params}) {
  return (
    <div>
      <Suspense>
        <Content/>
      </Suspense>
    </div>
  )
}
