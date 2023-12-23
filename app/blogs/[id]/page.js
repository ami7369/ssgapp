import { getAllContentList, getDetail } from "/lib/microcms";
import { notFound } from "next/navigation";
import { Blog,BlogFotter } from "/component/blog";

//[id]詳細ページの作成 ビルド時に動的にページごとのファイルで作成（ダイナミックルーティング）
//ダイナミックルーティングとgenerateStaticParamsはセット
const BLOG = process.env.BLOG;
export async function generateStaticParams() {
  const contents = await getAllContentList(BLOG);

  return contents.map((post) => ({
    id: post.id,   //このプロパティ名=[フォルダ名]
  }));
}

export default async function StaticDetailPage({params: { id }}) {
    const post = await getDetail({ contentid: id, endpoint: BLOG });
    if (!post) notFound();

 return (
   <div>
     <Blog post={post} endpoint={BLOG} />
     <BlogFotter />
    </div>
 );
}