
import { getDetail }  from "/lib/microcms";
import Link from "next/link";
import { dateToJST } from "/lib/datelib";
import { setThumbnail } from "/lib/commonfnc"
import Image from "next/image";

const TOPIC = process.env.TOPIC;

const TopicItem = function ({ post, link }) {
  const publishdate = dateToJST(post.publishedAt, "YYYY.MM.DD HH:mm");
  const thumbnail = setThumbnail(post);

  return (
    <div className="bloglist list-item-topic">
      <div className="topic-thumbnail">
        <TopicThumbnail thumbnail={thumbnail} id={post.id} />
      </div>
      <div className="topic-body">
        <div className="topic-item-title">
          <div className="topic-title">
            <Link href={link}>{post.title}</Link>
          </div>
        </div>
        <p className="topic-item-date">
          <Link className="topic-item-date" href={link}>
            {publishdate}
          </Link>
        </p>
      </div>
    </div>
  );
}

export const TopicThumbnail = function ({ thumbnail, id }) {
  return (
    <div className="wrap-img topic-img-wrap">
      <Link className="topic-img-inner" href={`/blogs/${id}`}>
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

//人気記事
export async function TopicList() {
  const data = await getDetail({ contentid: "topicitem", endpoint: TOPIC }, {fields:id,topicpost})
  if (data&&data.topicpost) {
    return (
      <div>
        <h4>人気記事</h4>
        <ul>
          {data.topicpost.map((item) => (
            <li key={item.id}>
              <TopicItem link={`/blogs/${item.id}`} post={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
