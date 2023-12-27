import { getAllContentList } from "/lib/microcms";
import { Blog,BlogFotter } from "/component/blog";

export const metadata = {
  title: "イベント案内",
};

const BLOG = process.env.BLOG;

//[id]詳細ページの作成 ビルド時に動的にページごとのファイルで作成（DynamicRouting）
//ダイナミックルーティングとgenerateStaticParamsはセット
export async function generateStaticParams() {
  const contents = await getAllContentList(BLOG);

  return contents.map((post) => ({
    id: post.id
  }));
}

export default async function StaticDetailPage({params: { id }}) {
 return (
   <div>
     <Blog id={id} />
     <BlogFotter />
    </div>
 );
}