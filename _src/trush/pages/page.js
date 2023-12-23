"use client";
import useSWR from "swr";
//import useSWRInfinite from "swr";
import useSWRInfinite from "swr/infinite";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { getCMSDataFilter, getTeams, ImagePathReplace } from "/lib/microcms";
import Image from "next/image";
import getConfig from "/next.config.js";

const getKey = (pageIndex, previousPageData) => {
  // if (previousPageData && !previousPageData.length) return null; // reached the end
  // //return "https://jsonplaceholder.typicode.com/users";
  // if (pageIndex) {
  //   return `https://dummyjson.com/products?limit=5&skip=${pageIndex * 5}`;
  // } else {
  //   return `https://dummyjson.com/products?limit=5`;
  // }
};

//const fetcher = (index)=>getCMSDataFilter("news", { limit: 5, offset:`${index}` })
const fetcher = (url) => fetch(url).then((r) => r.json());

function Items({ index, handler }) {
  console.log("index is "+index)
  const { data } = useSWR(
    `https://dummyjson.com/products?limit=5&skip=${index * 5}`,
    fetcher,
    {
      initialSize: 5,
    }
  );
  
  // ... ローディングとエラー状態を処理します
  //if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  handler(data.total);
  console.log("Result DataCount:"+ data.total);
  console.log("Result Data:" + data.products);

  let isProd = process.env.NEXT_PUBLIC_NODE_ENV === 'production';
  //const basePath = isProd ? process.env.NEXT_PUBLIC_BUILDTYPE + process.env.NEXT_PUBLIC_TARGET : ""; 
  const basePath =process.env.NEXT_PUBLIC_BUILDTYPE + process.env.NEXT_PUBLIC_TARGET; 
  console.log("||MSG basePath||" + basePath);
  return (
    <div>
      <p><a href="/CSR">TOPLink(a)</a></p>
      <p>{data.total}</p>
      <ul>
        {data.products.map((item) => (
          <li key={item.id}>
            <p>{item.id}</p>
            <p>{item.title}</p>
            <p>${item.price}</p>
          </li>
        ))}
      </ul>
      <p>ImageCheck</p>
      <div class="wrap-img">
        <Image className="image-fit" src={`${basePath}/img/sugar.jpg`} alt="TOP" fill />
        <Image className="image-fit" src={`${basePath}/img/pages/nikuman.jpg`} alt="TOP" fill />
      </div>
    </div>
  );
}


const Home = () => {

  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const HandleNation = (e,page) => {
    setPageIndex(page-1);
    setPage(page)
  }

  return (
    <div>
      <h3>DummyData PageNation</h3>
      <p>{process.env.NODE_ENV}</p>
      <Items index={pageIndex} handler={setTotal} />
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
      <button onClick={() => setPageIndex(pageIndex - 1)}>Prev</button>
      <Pagination
        count={Math.ceil(total / 5)} //総ページ数
        onChange={HandleNation} //変更されたときに走る関数。第2引数にページ番号が入る
        page={page} //現在のページ番号
        showFirstButton
        showLastButton
        siblingCount={3}
      />
      <div className="wrap-img">
        <Image className="image-fit" src="/img/nikuman.jpg" alt="TOP" fill />
      </div>
    </div>
  );
};

export default Home;
