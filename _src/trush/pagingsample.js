import { Suspense, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { getLists,getItemList, SWROpt, getCategoryList, getArchiveList } from "/lib/microcms";
import Link from "next/link";


const Pages = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(1);   //Current PageIndex
  const [total, setTotal] = useState(0); //Current PageNumber

  const HandleNation = (e, page) => {
    setPageIndex(page - 1);
    setPage(page);
  };

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
