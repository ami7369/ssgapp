"use client";
import useSWR from "swr";
import { Suspense, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { getLists,getItemList, SWROpt, getCategoryList, getArchiveList } from "/lib/microcms";
import Link from "next/link";


//const fetcher = (url) => fetch(url).then((r) => r.json());
function Items({ index, handler }) {
  console.log("||MSG updateIndex || " + index)
  //PagingData
  //const { data, error } = useSWR({ endpoint: "news" }, ({ endpoint }) => getLists(endpoint, { offset: index * process.env.NEXT_PUBLIC_PAGING }));
  const { data, error } = useSWR({offset:index}, (offset) => getItemList(offset));
  console.log("||MSG Item start||");

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading…</div>;
  //  console.log("||MSG|Item fetched."+JSON.stringify(data));

  handler(data.totalCount);
  return (
    <div>
      <p>Total:{data.totalCount}</p>
      <ul>
        {data.contents.map((item) => (
          <li key={item.id}>
            <p>ID:{item.id}</p>
            <p>
              <Link href={{ pathname: '/sample/item', query: { id:item.id,draft_key:"hogehoge" } }}>Title:{item.title}</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const YearsList = ({ endpoint }) => {
  console.log("||MSG yearList start||"+endpoint);
  const { data, error } = useSWR("a", (aa) => getArchiveList(), SWROpt); //月別リスト
  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>data Loading…</div>;

  const yearIndex = data.props.yearList;
  return (
    <div>
      <h3>年別アーカイブ</h3>
      <ul>
        {Object.keys(yearIndex).map((yearMonth) => (
          <li>
            <Link href={{ pathname: "/sample/archive", query: { id:yearMonth } }}
            >{yearMonth}（{yearIndex[yearMonth].length}）
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CategoryList = ({ filterAPI, filterAttr, api }) => {
  console.log("||MSG CategoryList start||");
  const { data, error } = useSWR(filterAPI, (filterAPI) => getCategoryList(filterAPI,filterAttr,api)); //カテゴリ―リスト
  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Categorys Loading…</div>;

  return (
    <div className="comp-category">
      <p>CategoryList</p>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            ID:{item.id} |  
            <Link href={{ pathname: "/sample/category", query: { id: item.id,name:item.name } }}>
              {item.name}({item.totalCount});
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}



const Home = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(1);   //Current PageIndex
  const [total, setTotal] = useState(0); //Current PageNumber

  const HandleNation = (e, page) => {
    setPageIndex(page - 1);
    setPage(page);
  };

  //CSRComponent must be wrapped by Suspense.Only Suspense and its children will be csr.
  //Suspense set fallback will show fallback UI instead of children while it's loading.
  //https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#example
  return (
    <div>
      <h2>CMS fetch with PageNation</h2>
      <Suspense fallback={<p>Loading feed...</p>}>
        <CategoryList filterAPI="categories" filterAttr="category" api="news" />
        <Items index={pageIndex} handler={setTotal} />
      </Suspense>
      <Suspense>
        <YearsList endpoint="news"/>
      </Suspense>
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
      <button onClick={() => setPageIndex(pageIndex - 1)}>Prev</button>
      <Pagination
        count={Math.ceil(total / process.env.NEXT_PUBLIC_PAGING)} //総ページ数
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
