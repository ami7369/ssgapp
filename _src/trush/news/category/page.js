"use client";
import { Suspense,useState } from "react";
import { useSearchParams } from "next/navigation";
import { getList, microCMSLoader, Thumbnail,SWROpt } from "/lib/microcms";
import useSWR from "swr";
import parse, { domToReact } from "html-react-parser";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import Link from "next/link";


function Items({ index,catId,name, handler }) {
    //PagingData
    console.log("|MSG CategoryId|:" + catId);
    const query = {
        filters: catId ? `category[contains]${catId}` : '',
        offset: index * process.env.NEXT_PUBLIC_PAGING,
    };
    const fetcher = () => getList("news",query);
    const { data, error } = useSWR(catId, fetcher, SWROpt);

    if (error) return <div>An error has occurred.</div>;
    if (!data) return <div>Loading…</div>;

  handler(data.totalCount);
  console.log("Result DataCount:" + data.totalCount);
  console.log("Result Data:" + data.contents.length);
  return (
    <div>
          <h3>Category:{name}</h3>
          <p>Total:{data.totalCount} </p>
      <ul>
        {data.contents.map((item) => (
          <li key={item.id}>
            <p>ID:{item.id}</p>
            <p>
                <Link href={{pathname: "/sample/item", query: { id: item.id, draft_key: "hogehoge" }}}>
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
      <h2>Category Archive</h2>
      <Suspense fallback={<p>Loading feed...</p>}>
              <Items index={pageIndex} catId={queryStr.get("id")} name={ queryStr.get("name")} handler={setTotal} />
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
