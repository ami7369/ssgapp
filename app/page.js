import { dateToJST, dateToUTC } from "/lib/datelib";
import { getIndexList } from "/lib/microcms";
import { ArticleCard } from "/component/bloglist";
import { Paging } from "/component/paging";

//[page]ページネーションごとの一覧ページ
const BLOG = process.env.BLOG;
const PER_PAGE = process.env.PAGING;

//トップページ
export default async function Home() {
  const posts = await getIndexList(BLOG, 0);
  const count = posts.totalCount;
  console.log("||GetData PostTotal----||" + posts.totalCount);
  const d = dateToJST(new Date());
  const totalPage = Math.ceil(posts.totalCount / PER_PAGE);

  if (!posts) {
    return (
      <div className="top-content">
        <h1>No Content</h1>
        <p>printtime:{d}</p>
      </div>
    );  
  } else {
    return (
      <div>
        {posts.contents.map((post) => {
          return (
            <div key={post.div} className="article-list">
              <ArticleCard post={post} path="/blog"></ArticleCard>
            </div>
          );
        })}
        <div style={{ textAlign: "center" }}>
          <Paging totalPage={totalPage} index={1} path={"/pages"} />
        </div>
      </div>
    );
  }

}
