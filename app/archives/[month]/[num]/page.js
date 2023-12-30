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
  //console.log((("|MSG|-----CheckParams---------");
  const end = (itemCount + PERPAGE - 1) <= monthdata.length ? (itemCount + PERPAGE - 1) : monthdata.length - 1;
  //console.log(((`Count=${itemCount}:month=${month}:page=${page}:end=${end}:monthData=${monthdata.length}`);
  //console.log((("TOTALPAGE IS --------" + totalPage);
  const pagedata = monthdata.slice(itemCount == 0 ? itemCount:itemCount - 1,end);
  return (
    <div>
      <Articles posts={pagedata} />
      <Paging totalPage={totalPage} path={`/archives/${month}`} index={num} />
    </div>

  );
}
