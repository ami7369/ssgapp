"use client";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { getList } from "../../lib/microcms";


const fetcher = (offset) => { return getList(offset) };

//const fetcher = (index)=>getCMSDataFilter("news", { limit: 5, offset:`${index}` })
//const fetcher = (url) => fetch(url).then((r) => r.json());
function Items({ index, handler }) {
  console.log("C:Loading")
  const { data } = useSWR(
    //"https://jsonplaceholder.typicode.com/users",
    `${index*2}`,
    fetcher
  );
  console.log("C:"+data);

  // ... ローディングとエラー状態を処理します
  //if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  handler(data.totalCount);
  console.log("Result DataCount:"+ data.totalCount);
  console.log("Result Data:" + data.contents.length);
  return (
    <div>      
      <p>Total:{data.totalCount}</p>
      <ul>
        {data.contents.map((item) => (
          <li key={item.id}>
            <p>ID:{item.id}</p>
            <p>Title:{item.title}</p>
          </li>
        ))}
      </ul>
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
      <h2>CMS fetch with PageNation</h2>
      <Items index={pageIndex} handler={setTotal} />
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
      <button onClick={() => setPageIndex(pageIndex - 1)}>Prev</button>
      <Pagination
        count={Math.ceil(total / 2)} //総ページ数
        onChange={HandleNation} //変更されたときに走る関数。第2引数にページ番号が入る
        page={page} //現在のページ番号
        showFirstButton
        showLastButton
        siblingCount={3}
      />
    </div>
  );
};

export default Home;
