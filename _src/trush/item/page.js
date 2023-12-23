"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getDetail, microCMSLoader, Thumbnail,BodyReplacer } from "/lib/microcms";
import useSWR from "swr";
import parse, { domToReact } from "html-react-parser";
import Image from "next/image";

const fetcher = ({ id, draftkey }) => getDetail({ contentid: id, endpoint: "news" }, {draftKey:draftkey});

function Content() {
  const params = useSearchParams();
  const { data, error } = useSWR(
    //"https://jsonplaceholder.typicode.com/users",
    { id: params.get("id"), draftKey: params.get("draftkey") },
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading…</div>;

  const imageTagStr = data.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/gi)?.[0]; //g:all match, i:ignorecase
  const setImg = data.content.thumbnail;
  let thumbnail = imageTagStr ?? setImg;
  thumbnail = thumbnail ?? data.categoryimg;

  console.log("||MSG||Thumbnail:"+thumbnail);
  return (
    <div>
      <h2>This is Sample -Img,replcaer-</h2>
      <hr />
      <div class="content">
        <h3>{data.title}</h3>
        {parse(data.content, { replace:BodyReplacer("img-content") })}
      </div>
      <div class="thumbnail">
        <p>Thumnail:</p>
        {thumbnail ? parse(thumbnail, { replace: Thumbnail }) : <p>No Image</p>}
      </div>
    </div>
  );
}

export default function Page({params}) {
  const Params = useParams(); //for ClientHook can get params in routing /[id]/**** > {id:***}
  const Pathname = usePathname();
  const queryStr = useSearchParams(); //>queryStr.get("key") //forClientHook usual,can get query parameter.?id=***
  console.log(params); //Page({params}) for dynamicRouting with staticPathGenerate().
  return (
    <div>
      <Suspense>
        <Content id={queryStr.id} draft_key={queryStr.draftKey} />
      </Suspense>
    </div>
  )
}


/**Using Cheerio */
// function Content() {
//   const params = useSearchParams();
//   const { data, error } = useSWR(
//     { id: params.get("id"), draftKey: params.get("draftkey") },
//     fetcher
//   );

//   if (error) return <div>An error has occurred.</div>;
//   if (!data) return <div>Loading…</div>;
//   console.log("||MSG| Error|" + error);
//   console.log("||MSG| Title|" + data.title);

//   //Cheerio for server library
//   const $ = load(data.content); // 1
//   $("img").each((_, elm) => {// 2
//     const text = $(elm).text(); // 3
//     //$(elm).contents().wrap(`<a id="${text}" href="#${text}"></a>`); // 4
//     $(elm).addClass('img-set').html();
//   });
//   data.content = $.html(); // 5
//   const str = data.content.toString();
//   console.log(str);
//   return (
//     <div>
//       <h2>Title:{data.title}</h2>
//     </div>
//   );
// }