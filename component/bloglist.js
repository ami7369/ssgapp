import { microCMSLoader } from '/lib/microcms';
import { dateToJST } from "/lib/datelib";
import Link from "next/link";
import Image from "next/image";
import { TXTLEN } from '/setting/const';
import { setThumbnail } from '/lib/commonfnc';

export function Articles({ posts }) {
  
  if (posts.length != 0) {
    return (
      <>
        <div className="articles-list">
          <ul>
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} path={"/blogs"} />
            ))}
          </ul>
        </div>
      </>
    );
  } else {
    return <p>No Data.</p>;
  }
}

export const ArticleCard = ({ post, path }) => {
  const publishdate = dateToJST(post.publishedAt, "YYYY.MM.DD HH:mm");
  const thumbnail = setThumbnail(post);
  const link = `${path}/${post.id}`;
  const txt = ((str) =>
    str.length > TXTLEN ? str.substring(0, TXTLEN) + "..." : str)(
    post.content.replace(/<[^>]+>|\n/g, "")
  );
  return (
    <div className="bloglist list-item list-item-blog">
      <ListThumbnail thumbnail={thumbnail} id={post.id} />
      <div className="list-body">
        <div className="list-item-date u-txt-clr--lv2">
          <Link href={link}>{publishdate}</Link>
        </div>
        <div className="list-item-title">
          <div className="list-title u-txt-clr">
            <Link href={link}>{post.title}</Link>
          </div>
        </div>
        <div className="list-item-body u-txt-clr--lv1">
          <Link href={link}>{txt}</Link>
        </div>
      </div>
    </div>
  );
};

export const ListThumbnail = function ({ thumbnail, id }) {
  return (
    <div className="wrap-img list-img-wrap">
      <Link class="list-img-inner" href={`/blogs/${id}`}>
        <Image
            className="list-img-item"
            src={thumbnail.url}
            alt={thumbnail.alt}
            fill
          />
      </Link>
    </div>
  );
};

