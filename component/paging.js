
"use client";
import { Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";
import Stack from "@mui/material/Stack";

export const Paging = ({ totalPage, index, path }) => {
  return (
    <div className="paging-box" style={{ display: "block" }}>
      <Stack alignItems="center">
        <div style={{ display: "block" }}>
            <Pagination
              count={totalPage} //総ページ数
              page={index} //現在のページ番号
              showFirstButton
              showLastButton
              siblingCount={3}
              renderItem={(item) => (
                <Link href={`${path}/${item.page}`}>
                  <PaginationItem {...item} />
                </Link>
              )}
            />
        </div>
      </Stack>
    </div>
  );
};

