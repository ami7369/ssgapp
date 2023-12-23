import { getLists, getIndexList } from "/lib/microcms";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { ArticleCard } from "/component/bloglist";
import { Paging } from "/component/paging";
import { getAllContentList } from "@/lib/microcms";
import { getCategoryList } from "/lib/listfnc";
import { setThumbnail } from "@/lib/commonfnc";

//[page]ページネーションごとの一覧ページ カテゴリ
const BLOG = process.env.BLOG;
const CATEGORY = process.env.CATEGORY;
const PERPAGE = process.env.PAGING;

export async function generateStaticParams() {
  const categoryList = await getCategoryList(BLOG); 
  let range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);
  
  //CategoryList Objectパターン List = { 'slug':{object},'slug':{object}}
  const paths = Object.keys(categoryList).map((category) => {
    //console.log("|MSG routingCheck------| " + category.contents.length);
    return range(1, Math.ceil(categoryList[category].contents.length / PERPAGE)).map((num) => ({
      slug: `${category}`,
      page: `${num}`,
    }));
  });

  //CategoryList Object配列パターン
  // const paths = categoryList.map((category) => {
  //   //console.log("|MSG routingCheck------| " + category.contents.length);
  //   return range(1, Math.ceil(category.contents.length / PERPAGE)).map((num) => ({
  //     slug: `${category.id}`,
  //     page: `${num}`,
  //   }));
  // });

  console.log("|MSG----Result Flat-----");
  console.log(JSON.stringify(paths.flat()))
  return paths.flat();
}


export default async function IndexPage({ params: {slug,page } }) {

  const itemCount = Number((page - 1) * PERPAGE); //現ページまでのアイテム数
  const categorys = await getCategoryList(BLOG);
  if (!categorys) notFound();

  //List Object配列パターン
  // const categorys = posts.filter(function (item, index) {
  //   if (item.id == slug) return true;
  // });
  const contents = categorys[slug].contents;
  const totalPage = Math.ceil(contents.length / PERPAGE);
  console.log("|MSG|-----CheckParams---------");
  const end =
    itemCount + PERPAGE - 1 <= contents.length? itemCount + PERPAGE - 1: contents.length - 1;
  console.log(`Count=${itemCount}:slug=${slug}:page=${page}:end=${end}:Data=${contents.length}`);
  console.log("TOTALPAGE IS --------" + totalPage);
  const pagedata = contents.slice(itemCount == 0 ? itemCount:itemCount - 1, end);

  return (
    <div>
      {pagedata.map((post) => {
        post.thumbnail = setThumbnail(post);
        return (
          <div key={post.div} className="article-list">
            <ArticleCard key={post.id} post={post} path="/blog"></ArticleCard>
          </div>
        );
      })}
        <Paging totalPage={totalPage} path={`/categorys/${slug}`} index={page} />
    </div>
  );
}
