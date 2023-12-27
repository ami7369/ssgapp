import { microCMSLoader } from '/lib/microcms';
import { dateToJST } from "/lib/datelib";
import Link from "next/link";
import Image from "next/image";
import { TXTLEN } from '/setting/const';
import { setThumbnail } from '/lib/commonfnc';

export const ArticleList = ({ posts }) =>{
    return (
      <div className="articles-list">
        <ul>
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </ul>
      </div>
    );
}

export const ArticleCard = ({ post,path }) => {
  const publishdate = dateToJST(post.publishedAt, "YYYY.MM.DD HH:mm");
  const thumbnail = setThumbnail(post);
    const link = `${path}/${post.id}`;
    const txt = ((str) => str.length > TXTLEN ? str.substring(0, TXTLEN) + '...' : str)(post.content.replace(/<[^>]+>|\n/g, ""));
  return (
    <div className="list-item">
      <ListThumbnail thumbnail={thumbnail} id={post.id} />
      <div className="list-body">
        <Link className="list-item-date" href={link}>
          {publishdate}
        </Link>
        <div className="list-item-title">
          <div className="list-title">
            <Link href={link}>{post.title}</Link>
          </div>
        </div>
        <div className="list-item-body">
          <Link href={link}>{txt}</Link>
        </div>
      </div>
    </div>
  );
}

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

