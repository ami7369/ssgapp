import { getLists, getIndexList } from "/lib/microcms";
import { notFound } from "next/navigation";
import { ArticleCard } from "/component/bloglist";
import { Suspense } from "react";
import { Paging} from "/component/paging";

//[page]ページネーションごとの一覧ページ
const BLOG = process.env.BLOG;
const PERPAGE = process.env.PAGING;

export async function generateStaticParams() {
  const contents = await getLists(BLOG, { limit: 1, fields: "id,title" });
  const count = contents.totalCount;
  console.log("||MSG||GetData total:" + count);

  const range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  //stringにしなければいけない
  const paths = range(1, Math.ceil(count / PERPAGE)).map((num) => ({
    page: `${num}`,
  }));
  return paths;
}

export default async function IndexPage({ params: { month, page }}) {
  const itemCount = page * PERPAGE;

  const posts = await getIndexList(BLOG, itemCount);
  if (!posts) notFound();
  const totalPage = Math.ceil(posts.totalCount / PERPAGE);

  console.log("||CheckParams------------||");
  console.log(`Count:${itemCount}, Now:${page}`);

  return (
    <div>
      <div className="post-list">
      {posts.contents.map((post) => {
        return (
          <div key={post.div} className="article-list">
            <ArticleCard key={post.div} post={post} path="/blog"></ArticleCard>
          </div>
        );
      })}
      </div>
      <Paging totalPage={totalPage} index={page} path={"/pages"} />
    </div>
  );
}
