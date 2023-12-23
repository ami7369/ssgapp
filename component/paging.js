
"use client";
import { Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import Stack from "@mui/material/Stack";

export const Paging = ({ totalPage, index, path }) => {
  let page = useParams().page;
  // console.log("NowPage is ---------" + page);
  // console.log("NowPath ---------" + useParams().page);
  
  return (
    <div className="paging-box" style={{ display: "block" }}>
      <Stack alignItems="center">
        <Suspense style={{ display: "block" }}>
            <Pagination
              count={totalPage} //総ページ数
              page={page} //現在のページ番号
              showFirstButton
              showLastButton
              siblingCount={5}
              renderItem={(item) => (
                <Link href={`${path}/${item.page}`}>
                  <PaginationItem {...item} />
                </Link>
              )}
            />
        </Suspense>
      </Stack>
    </div>
  );
};

