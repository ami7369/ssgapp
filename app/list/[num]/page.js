import { getLists, getIndexList } from "/lib/microcms";
import { notFound } from "next/navigation";
import { ArticleCard, Articles } from "/component/bloglist";
import { Suspense } from "react";
import { Paging } from "/component/paging";
import { PERPAGE } from "/setting/const";

const BLOG = process.env.BLOG;

export async function generateStaticParams() {
  const contents = await getLists(BLOG, { limit: 1, fields: "id,title" });
  const count = contents.totalCount;
  //console.log((("||MSG||GetData total:" + count);

  const range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  //value must be string
  const paths = range(1, Math.ceil(count / PERPAGE)).map((num) => ({
    num: `${num}`,
  }));
  return paths;
}

export default async function IndexPage({ params: { num } }) {
  const posts = await getIndexList(BLOG, num);
  if (!posts) notFound();
  const totalPage = Math.ceil(posts.totalCount / PERPAGE);

  //console.log((("||CheckParams------------||");
  //console.log(((`Count:${itemCount}, Now:${page}`);

  return (
    <>
      <Articles posts={posts.contents} />
      <Paging totalPage={totalPage} path={`/list`} index={num} />
    </>
  );
}
