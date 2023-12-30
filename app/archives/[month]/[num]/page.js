import { notFound } from "next/navigation";
import { Articles} from "/component/bloglist";
import { getArchiveList } from "/lib/listfnc";;
import { PERPAGE } from "/setting/const";
import { Paging } from "/component/paging";

//[page]ページネーションごとの一覧ページ　月別アーカイブ
const BLOG = process.env.BLOG;

export async function generateStaticParams() {
  const archiveList = await getArchiveList(BLOG);
  let range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const paths = Object.keys(archiveList).map((month) => {

    return range(1, Math.ceil(archiveList[month].length / PERPAGE)).map((num) => ({
      month: `${month}`,
      num: `${num}`,
    }));
  });
  return paths.flat();
}

//月別一覧ページ
export default async function IndexPage({ params: { month, num } }) {
  const itemCount = Number((num-1) * PERPAGE); //現ページまでのアイテム数
  const posts = await getArchiveList(BLOG);
  if (!posts) notFound();

  const monthdata = posts[month];
  const totalPage = Math.ceil(monthdata.length / PERPAGE);
  const start = itemCount;
  let end = itemCount + PERPAGE;
  end = end > monthdata.length ? monthdata.length : end;
  const pagedata = monthdata.slice(start, end);
  const [yyyy, mm] = month.split("_");
  return (
    <div>
      <div className="posts-page-head">
        <h2>{yyyy}.{mm}</h2>
      </div>
      <Articles posts={pagedata} />
      <Paging totalPage={totalPage} path={`/archives/${month}`} index={num} />
    </div>
  );
}
