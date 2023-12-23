import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { ArticleCard } from "/component/bloglist";
import { Paging } from "/component/paging";
import { getArchiveList } from "/lib/listfnc";
import { setThumbnail } from "@/lib/commonfnc";

//[page]ページネーションごとの一覧ページ　月別アーカイブ
const BLOG = process.env.BLOG;
const PERPAGE = Number(process.env.PAGING);

export async function generateStaticParams() {
  const archiveList = await getArchiveList(BLOG);
  let range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const paths = Object.keys(archiveList).map((month) => {
    console.log(
      "|MSG|----archive.length------|" + month + ":" + archiveList[month].length
    );
    return range(1, Math.ceil(archiveList[month].length / 2)).map((num) => ({
      month: `${month}`,
      page: `${num}`,
    }));
  });
  console.log("|MSG----Result Flat-----");

  console.log(JSON.stringify(paths.flat()));
  return paths.flat();
}

//月別一覧ページ
export default async function IndexPage({ params: { month, page } }) {
  const itemCount = Number((page-1) * PERPAGE); //現ページまでのアイテム数
  const posts = await getArchiveList(BLOG);
  if (!posts) notFound();

  const monthdata = posts[month];
  const totalPage = Math.ceil(monthdata.length / PERPAGE);
  console.log("|MSG|-----CheckParams---------");
  const end = (itemCount + PERPAGE - 1) <= monthdata.length ? (itemCount + PERPAGE - 1) : monthdata.length - 1;
  console.log(`Count=${itemCount}:month=${month}:page=${page}:end=${end}:monthData=${monthdata.length}`);
  console.log("TOTALPAGE IS --------" + totalPage);
  const pagedata = monthdata.slice(itemCount == 0 ? itemCount:itemCount - 1,end);
  
  return (
    <div>
      {pagedata.map((post) => {
        post.thumbnail = setThumbnail(post);
        return (
          <div key={post.div} className="article-list">
            <ArticleCard post={post} path="/blogs"></ArticleCard>
          </div>
        );
      })}
        <Paging totalPage={totalPage} path={`/archives/${month}`} index={page} />
    </div>

  );
}
