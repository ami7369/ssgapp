"use client";
import { Suspense,useState } from "react";
import { useSearchParams } from "next/navigation";
import { getLists, microCMSLoader, Thumbnail,SWROpt } from "/lib/microcms";
import useSWR from "swr";
import parse, { domToReact } from "html-react-parser";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import Link from "next/link";
import { dateToJST, dateToUTC } from "/lib/datelib";


function Items({ index, year_M, handler }) {
  console.log("||MSG-Items||" + year_M);
    //PagingData
    const yyyy = year_M.split("_")[0];
    const mm = year_M.split("_")[1];

  const startM = dateToUTC({ yyyy: yyyy, mm: mm, dd: "01" });
  const endM = dateToUTC({ yyyy: mm==="12"?Number(yyyy)+1:yyyy, mm: mm === "12" ? "01":Number(mm)+1, dd: "01" }); //microCMSはlessthanのため翌月1日をEndにする
  console.log("Start:" + startM + " ,End:" + endM);

  const query = {
    filters:`publishedAt[greater_than]${startM}[and]publishedAt[less_than]${endM}[or]publishedAt[equals]${startM}`,
    offset: index * process.env.NEXT_PUBLIC_PAGING,
  };
    const fetcher = (index,query) => getLists(index,query);
  const { data, error } = useSWR({i:index}, () => getLists("news", query));

    if (error) return <div>An error has occurred.</div>;
    if (!data) return <div>Loading…</div>;

  handler(data.totalCount);
  console.log("Result DataCount:" + data.totalCount);
  console.log("Result Data:" + data.contents.length);
  return (
    <div>
      <h3>Archive:{yyyy}/{mm}</h3>
          <p>Total:{data.totalCount} </p>
      <ul>
        {data.contents.map((item) => (
          <li key={item.id}>
            <p>ID:{item.id}</p>
            <p>
                <Link href={{pathname: "/sample/item", query: { id: item.id }}}>
                Title:{item.title}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Page(){
  const queryStr = useSearchParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(1); //Current PageIndex
  const [total, setTotal] = useState(0);

  const HandleNation = (e, page) => {
    setPageIndex(page - 1);
    setPage(page);
  };

  return (
    <div>
      <h2>Monthly Archive</h2>
      <Suspense fallback={<p>Loading feed...</p>}>
        <Items index={pageIndex} year_M={queryStr.get("id")} handler={setTotal} />
      </Suspense>
      <Pagination
        count={Math.ceil(total / process.env.NEXT_PUBLIC_PAGING)} //総ページング数
        onChange={HandleNation}
        page={page}
        showFirstButton
        showLastButton
        siblingCount={3}
      />
    </div>
  );
}
