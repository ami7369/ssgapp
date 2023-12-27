import { getLists, getAllContentList } from "/lib/microcms"; //ES6(Node.18.0以上)
import parse from "html-react-parser";
import { load } from "cheerio";
import { TXTLEN } from "/setting/const";
import { formatDate } from "/lib/datelib";
import { setThumbnail } from "/lib/commonfnc";

async function getSingle(endpoint, contentid) {
  const res = await client
    .get({ endpoint: endpoint, contentId: contentid })
    .catch((err) => console.error(err));
  res.thumbnail = setThumbnail(res);

  if (res.content.length == 0) {
    return null;
  }

  let options = {
    endpoint: endpoint,
    TargetDate: res.PublishedAt,
    contentTypeId: res.contenttype.id,
  };

  //Prev.Next
  const nextPost = await getSiblingPost(options, false);
  const prevPost = await getSiblingPost(options, true);
  //Related
  options.categories = res.category;
  options.selfid = res.id;
  options.contentType = res.contenttype.id;
  const relatePost = await getRelatePost(options);

  if (nextPost) res.nextPost = nextPost;
  if (prevPost) res.prevPost = prevPost;
  if (relatePost) res.relatePost = relatePost;

  return res;
}


export async function getSiblingPost({ endpoint, TargetDate, contentTypeId },prev = true) {
  let rangefilter = prev ? "[less_than]" : "[greater_than]";

  const query = {
      filters: `publishedAt${rangefilter}${TargetDate}[and]contenttype[equals]${contentTypeId}`,
      orders: "-publishedAt",
      limit: 1,
      fields: "id,publishedAt,title,content,contenttype,category,thumbnail",
    }
    const res = await getLists(endpoint, query);
   // //console.log((("Retrun,Sibling----------" + JSON.stringify(res));
    const posts = res.contents.map((content) => {
      return {
        id: content.id,
        title: content.title,
        thumbnail: setThumbnail(content),
        publishedAt: content.publishedAt,
    };
  });
  // //console.log((("Result"+JSON.stringify(posts))
  return posts[0];
}

//同カテゴリ内の最新記事3件
export async function getRelatePost({ endpoint, categories, selfid }) {
  let filterparm = "";
  categories.forEach((cat) => {
    if (filterparm === "") {
      filterparm = `category[contains]${cat.id}`;
    } else [(filterparm = filterparm + `[or]category[contains]${cat.id}`)];
  });

    filterparm = filterparm + `[and]id[not_equals]${selfid}`;
    let query = {
      filters: filterparm,
      orders: "-publishedAt",
      limit: 3,
      fields: "id,publishedAt,title,content,contenttype,category,thumbnail",
    };

    const data = await getLists(endpoint, query);

  //SelectThumbnail
  data.contents.forEach(
    (content) => (content.thumbnail = setThumbnail(content))
  );
  //console.log((("GetRelatePost-----");
  return data
}

export async function getArchiveList(endpoint) {
  try {
    //すべてのコンテンツの取得
    const contents = await getAllContentList('mori-blogs')
    contents.forEach((content) => {
      let txt = content.content;
      content.content = ((str) => str.length > TXTLEN ? str.substring(0, TXTLEN) + "..." : str)(txt.replace(/<[^>]+>|\n/g, ""));
    });
    //月ごとにまとめる
    const monthlyIndex = groupByMonth(contents);
    //console.log((("----RESULT Monthly---");
    //console.log((JSON.stringify(monthlyIndex));
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
    
    if(!contents) //console.log((("---categoryList---NoData--")
    contents.forEach((content) => {
      // //console.log((("|MSG|-------------getContents");
      let txt = content.content;
      content.content = ((str) => str.length > TXTLEN ? str.substring(0, TXTLEN) + "..." : str)(txt.replace(/<[^>]+>|\n/g, ""));
    });

    //オブジェクト配列にするパターン
    // let categoryList = categorys.map((category) => {
    //   let matchContent;
    //   matchContent = contents.filter((content) => {
    //     if (content.category.length) {
    //       return content.category.find((cat) => cat.id === category.id);
    //     }
    //   });
    //   // //console.log(((category.category + ":" + category.id + ":" + matchContent.length);
    //   return {
    //     id: category.id,
    //     category: category.category,
    //     contenttype: category.contenttype,
    //     contents: matchContent,
    //   };
    // });
    
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
