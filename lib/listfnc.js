import { getLists, getDetail,getAllContentList } from "/lib/microcms"; //ES6(Node.18.0以上)
import parse from "html-react-parser";
import { TXTLEN } from "/setting/const";
import { formatDate } from "/lib/datelib";
import { setThumbnail } from "/lib/commonfnc";

const BLOG = process.env.BLOG;

export async function getSingle(endpoint, contentid) {
  const post = await getDetail({ contentid: contentid, endpoint: BLOG });
  post.thumbnail = setThumbnail(post);

  let options = {
    endpoint: endpoint,
    TargetDate: post.publishedAt,
    contentTypeId: post.contenttype.id,
    categories:post.category
  };

  //Prev.Next
  const nextPost = await getSiblingPost(options, false);
  const prevPost = await getSiblingPost(options, true);
  //Related
  options.selfid = post.id;
  options.contentType = post.contenttype.id;
  const relatePost = await getRelatePost(options);

  post.nextPost = nextPost;
  post.prevPost = prevPost;
  post.relatePost = relatePost;

  return post;
}


async function getSiblingPost({ endpoint, TargetDate, categories,contentTypeId },prev = true) {
  let rangefilter = prev ? "[less_than]" : "[greater_than]";
  let datefilter = prev ? "-publishdAt" : "publishedAt";
  let filterparm = "";
  categories.forEach((cat) => {
    if (filterparm === "") {
      filterparm = `category[contains]${cat.id}`;
    } else [(filterparm = filterparm + `[or]category[contains]${cat.id}`)];
  });
 
  const query = {
      filters: `${filterparm}[and]publishedAt${rangefilter}${TargetDate}[and]contenttype[equals]${contentTypeId}`,
      orders: datefilter,
      limit: 1,
      fields: "id,publishedAt,title,content,contenttype,category,thumbnail",
    }
  const res = await getLists(endpoint, query);
  if (res.contents.length == 0) return;

   // //console.log((("Retrun,Sibling----------" + JSON.stringify(res));
  const post = {
    id: res.contents[0].id,
    title: res.contents[0].title,
    thumbnail: setThumbnail(res.contents[0]),
    publishedAt: res.contents[0].content.publishedAt,
  };
  // //console.log((("Result"+JSON.stringify(posts))
  return post;
}

//同カテゴリ内の最新記事3件
async function getRelatePost({ endpoint, categories, selfid }) {
  let filterparm = "";
  categories.forEach((cat) => {
    if (filterparm === "") {
      filterparm = `category[contains]${cat.id}`;
    } else [(filterparm = filterparm + `[or]category[contains]${cat.id}`)];
  });

  filterparm = filterparm + `[and]id[not_equals]${selfid}`;
  let queries= {
      filters: filterparm,
      orders: "-publishedAt",
      limit: 3,
      fields: "id,publishedAt,title,content,contenttype,category,thumbnail",
    }
  const res = await getLists(endpoint,queries)
  if (!res) return;

  //SelectThumbnail
  res.contents.forEach(
    (content) => (content.thumbnail = setThumbnail(content))
  );
  return res;
}

export async function getArchiveList(endpoint) {
  try {
    //すべてのコンテンツの取得
    const contents = await getAllContentList('mori-blogs', {orders:'publishedAt'})
    //月ごとにまとめる
    const monthlyIndex = groupByMonth(contents);
    return monthlyIndex;
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

export function groupByMonth(contents) {
  //console.log((("----START groupByMonth---");

  return contents.reduce(function (group, content) {
    const yearMonthString = formatDate(
      new Date(content["publishedAt"]),
      "YYYY_MM"
    );
    (group[yearMonthString] = group[yearMonthString] || []).push(content);
    return group;
  }, {});
}

export async function getCategoryList(endpoint) {
  //console.log((("--------------"+endpoint+"-----------------")
  try {
    const categorys = await getAllContentList('mori-categories',{ fields: "id,category,contenttype,thumbnail" })
                .then((data)=>(data.filter((content) => content.contenttype != null)))
    const contents = await getAllContentList(endpoint, { fields: "id,title,publishedAt,content,category,contenttype,thumbnail" });
    
    if(!contents) return <p>No Data</p>

    let categoryList = {};
    categorys.forEach((category) => {
      let matchContent;
      matchContent = contents.filter((content) => {
        if (content.category.length) {
          return content.category.find((cat) => cat.id === category.id);
        }
      });
      //console.log(((category.category + ":" + category.id + ":" + matchContent.length);

      categoryList[category.id] = {
        category: category.category,
        contenttype: category.contenttype,
        contents: matchContent,
      };
    });
    //console.log((("-----------RESULT CategoryList Check-------");
    //console.log(((categoryList.length);
    return categoryList;
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}
