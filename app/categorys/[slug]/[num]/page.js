import { notFound } from "next/navigation";
import { Articles } from "/component/bloglist";
import { Paging } from "/component/paging";
import { PERPAGE } from "/setting/const";
import { getCategoryList } from "/lib/listfnc";

//[num]ページネーションごとの一覧ページ カテゴリ
const BLOG = process.env.BLOG;
const CATEGORY = process.env.CATEGORY;

export async function generateStaticParams() {
  const categoryList = await getCategoryList(BLOG);
  let range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);
 
  //CategoryList Objectパターン List = { 'slug':{object},'slug':{object}}
  const paths = Object.keys(categoryList).map((category) => {
    return range(1, Math.ceil(categoryList[category].contents.length / PERPAGE)).map((num) => ({
      slug: `${category}`,
      num: `${num}`,
    }));
  });
 
  return paths.flat();
}


export default async function IndexPage({ params: {slug,num } }) {

  const itemCount = Number((num- 1) * PERPAGE); //現ページまでのアイテム数
  const categorys = await getCategoryList(BLOG);
  if (!categorys) notFound();

  const contents = categorys[slug].contents;
  const totalPage = Math.ceil(contents.length / PERPAGE);
  let end = itemCount + PERPAGE;
  end = end > contents.length ? contents.length : end;
  const pagedata = contents.slice(itemCount, end);

  return (
    <div>
      <div className="posts-page-head">
            <h2>{categorys[slug].category}</h2>
          </div>
      <Articles posts={pagedata} />
      <Paging totalPage={totalPage} path={`/categorys/${slug}`} index={num} />
    </div>
  );
}
