import { notFound } from "next/navigation";
import { Articles } from "/component/bloglist";
import { Paging } from "/component/paging";
import { PERPAGE } from "/setting/const";
import { getAllContentList, getLists } from "/lib/microcms";
import { getCategoryList } from "/lib/listfnc";

//[num]ページネーションごとの一覧ページ カテゴリ
const BLOG = process.env.BLOG;
const CATEGORY = process.env.CATEGORY;

export async function generateStaticParams() {
  const categorys = await getAllContentList(CATEGORY, {
    fields: "id",
    limit:1,
  }).then((data) => data.contents.filter((content) => content.contenttype != null));

  let range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const categoryPath = await Promise.all(
    categorys.map(async (category) => {
      query.filters = `category[contains]${category.id}`;
      let data = await getLists(endpoint, query);

      return range(1, Math.ceil(data.totalCount / PERPAGE)).map((num) => ({
        slug: category.id,
        num: `${num}`,
      }));
    })
  );

  return categoryPath.flat();
}


export default async function IndexPage({ params: {slug,num } }) {

  const itemCount = Number((num- 1) * PERPAGE); //現ページまでのアイテム数
  const categorys = await getCategoryList(BLOG);
  if (!categorys) notFound();

  const contents = categorys[slug].contents;
  const totalPage = Math.ceil(contents.length / PERPAGE);
  //console.log((("|MSG|-----CheckParams---------");
  const end =
    itemCount + PERPAGE - 1 <= contents.length? itemCount + PERPAGE - 1: contents.length - 1;
  //console.log(((`Count=${itemCount}:slug=${slug}:page=${page}:end=${end}:Data=${contents.length}`);
  //console.log((("TOTALPAGE IS --------" + totalPage);
  const pagedata = contents.slice(itemCount == 0 ? itemCount:itemCount - 1, end);

  return (
    <div>
      {/* {pagedata.map((post) => {
        post.thumbnail = setThumbnail(post);
        return (
          <div key={post.id} className="article-list">
            <ArticleCard key={post.id} post={post} path="/blogs"></ArticleCard>
          </div>
        );
      })} */}
      <Articles posts={pagedata} />
      <Paging totalPage={totalPage} path={`/categorys/${slug}`} index={num} />
    </div>
  );
}
