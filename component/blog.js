
import { dateToJST } from "/lib/datelib";
import { htmlToText } from "html-to-text";
import Link from "next/link";
import Image from "next/image";
import parse, { domToReact } from "html-react-parser";
import { microCMSLoader, getLists, getDetail } from "/lib/microcms"
import { getSingle } from "/lib/listfnc"

const BLOG = process.env.BLOG;

export const Blog = async function ({id}) {
  
  const post = await getSingle(BLOG, id);
  const publishdate = dateToJST(post.publishedAt, "YYYY.MM.DD HH:mm");

    return (
      <div className="blog-column">
        <div className="blog-content">
          <div className="blog-header">
            <p>{publishdate}</p>
            <h1>{post.title}</h1>
          </div>
          <div className="blog-body">
            {parse(post.content, { replacerBlog })}
          </div>
        </div>
        {post.category && (
          <CategoryTip categorys={post.category} endpoint={BLOG} />
        )}
        <div className="post-fotter clearfix">
          <RelatePosts posts={post.relatePost} />
          <SiblingPosts prevPost={post.prevPost} nextPost={post.nextPost} />
        </div>
      </div>
    );
}

const SiblingPosts = async function ({ prevPost, nextPost }) {
    console.log("|||MSG SiblingNextPost -------------------------|");
    console.log(JSON.stringify(nextPost))

    return (
      <ul className="sibil-posts">
          <li className="next-post">
            {nextPost && <SiblingPost post={nextPost} />}
          </li>
          <li className="prev-post">
            {prevPost && <SiblingPost post={prevPost}/>}
          </li>
        </ul>

    );
}

const SiblingPost = function ({ post }) {
    const pubdate = dateToJST(post.publishedAt, "YYYY.MM.DD HH:mm");
    return (
        <Link class="blog-sibling-inner" href={`/blogs/${post.id}`}>
            <Image className="blog-sibling-img img-cover" src={post.thumbnail.url} alt={post.thumbnail.alt} fill />
            <span className="blog-sibiling-date blog-sibling-info">{pubdate}</span>   
            <span className="blog-sibiling-title blog-sibling-info">{post.title}</span> 
        </Link>
    )
}

const RelatePosts = async function ({ posts }) {
    //console.log((("||MSG relates-----------------");
    //console.log(((JSON.stringify(posts));
    return (
      <ul className="relate-posts">
        {posts.contents.map((post) =>
          <div class="relate-post-outer" key={post.id}>
            <li className="relate-posts-item"><RelatePost post={post} /></li>
          </div>)}
      </ul>
    ); 
}

const RelatePost = function ({ post }) {  
  return (
      
      <Link class="relate-post-inner" href={`/blogs/${post.id}`}>
        <Image
          className="relate-post-img img-cover"
          src={post.thumbnail.url}
          alt={post.thumbnail.alt}
          fill
        />
        <p className="relate-post-title">{post.title}</p>
      </Link>
    ); 
}

//ImageWrap
function replacerBlog(dom){
  const attr = dom.attribs;
  if (dom.name === 'img') {
    return (
      <div class="wrap-img" width="50%">
        <Image className="image-fit" src={attr.src} alt={attr.alt} fill loader={microCMSLoader} />
      </div>
    );
  }
};

async function CategoryTip({ categorys, endpoint }) {
    //console.log((("||MSG CategoryTip||" + JSON.stringify(categorys))
    let query = {
        fields: 'id',
        filters: '',
        fields: 'id,category',
    }
  const itemCount = await Promise.all(categorys.map(async (category) => {
    query.filters = `category[contains]${category.id}`;
    let data = await getLists(endpoint, query);
    category.totalCount = data.totalCount;
    return category;
  })
  );

    return (
        <div className="blog-info">
            <ul className="blog-category-list">
          {itemCount.map((cat) => {
            return(
              <li className="categorytip-item" key={cat.id}>
                <Link href={`/categorys/${cat.id}/1`} className="blog-category-item">
                  <span className="categorytip-txt">{`${cat.category}(${cat.totalCount})`}</span>
                </Link>
              </li>
            )  
            })}
            </ul>
        </div>
    )
}

export const BlogFotter = async function () {
  const footcontent = await getLists('mori-static', { filters: 'title[equals]BlogFooter' });
  if (!footcontent) return;
  return (
    <div className="blog-static-fotter">
      {parse(footcontent.contents[0].content)}
    </div>
  );
}