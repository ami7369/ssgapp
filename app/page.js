import { PERPAGE } from "/setting/const";
import { Head2 } from "/component/typho";
import { getLists } from "/lib/microcms";
import { Articles } from "/component/bloglist";
import { Paging } from "/component/paging";
import { Link } from "@mui/material";
const BLOG = process.env.BLOG;
const infoTypeId = "0kodg05un"; //お知らせコンテンツ
const infoCategory = "e6pov-egvxv";

//トップページ
export default async function TopPage() {
  // try {
    
    const posts = await getLists(BLOG, {
      fields: "id,title,content,thumbnail,contenttype",
      queries:{orders:"publishedAt"},
      limit:PERPAGE,
    });

    const totalPosts = posts.totalCount;

    return (
      <div className="posts-top">
         <InfoIndex />
        <div className="top-block">
          <Head2 txt="新着記事"></Head2>
          <div className="top-block-content">
            <Articles posts={posts.contents} />
            <Paging totalPage={totalPosts} path={`/list`} index={1} />
          </div>
        </div>
      </div>
    );
  // } catch (e) {
  //   console.log("|Error TopList|"+e);
  // }
}

async function InfoIndex() {
      const infoTOP = await getLists(BLOG,{
        filters: `contenttype[equals]${infoTypeId}`,
        fields: "id,title,content,thumbnail,contenttype",
        limit: 1,
        orders: "-publishedAt",
      })

  return (
    <div className="top-block">
      <div className="top-block-head">
        <Head2 txt="お知らせ"></Head2>
      </div>
      <div className="top-block-content">
        {infoTOP && <Articles posts={infoTOP.contents} />}
        <Link href={`/SSG/categorys/${infoCategory}/1`}>
          <button type="button" class="btn btn-dark">
            もっと見る
          </button>
        </Link>
      </div>
    </div>
  );
}