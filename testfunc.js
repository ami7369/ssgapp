import { getLists, getAllContentList } from "./lib/microcms.js"; //ES6(Node.18.0以上)

async function getCategoryList(endpoint) {
  try {
    let categorys = await client
      .getAllContents({
        endpoint: "mori-categories",
        queries: { fields: "id,category,contenttype,thumbnail" },
      })
      .then((res) => res.filter((content) => content.contenttype != null));

    const contents = await client.getAllContents({
      endpoint: endpoint,
      queries: {
        fields: "id,title,publishedAt,content,category,contenttype,thumbnail",
      },
    });
    contents.forEach((content) => {
      let str = content.content;
      content.content = ((str) =>
        str.length > TXTLEN ? str.substring(0, TXTLEN) + "..." : str)(
        txt.replace(/<[^>]+>|\n/g, "")
      );
    });

    let categoryList = {};
    categorys.forEach((category) => {
      let matchContent;
      matchContent = contents.filter((content) => {
        if (content.category.length) {
          return content.category.find((cat) => cat.id === category.id);
        }
      });
      console.log(
        category.category + ":" + category.id + ":" + matchContent.length
      );

      categoryList[category.id] = {
        category: category.category,
        contenttype: category.contenttype,
        contents: matchContent,
      };
    });
    console.log("----RESULT CategoryList---");
    //console.log(JSON.stringify(categoryList));
    return categoryList;
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

getCategoryList("mori-blogs");
