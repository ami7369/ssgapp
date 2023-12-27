import { createClient } from "microcms-js-sdk";
import Image from "next/image";
import parse, { domToReact } from "html-react-parser";
import { groupByDate } from "/lib/datelib";
import { PERPAGE } from "/setting/const";


// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: process.env.SITE,
  apiKey: process.env.APIKEY,
});

export const getAllContentList = async function (endpoint, query = null) {
  //console.log(("||MSG-AllContent query:" + JSON.stringify(query));
  const allData = await (async (endpoint, query) => {
    if ( query && (query.limit || query.filters)) {
      const res = await client
        .getList({ endpoint: endpoint, queries: query })
        .catch((err) => console.error(err));
      return res;
    } else {
      const res = await client
        .getAllContents({ endpoint: endpoint, queries: query })
        .catch((err) => console.error(err));
      return res;
    }
  })(endpoint, query);

  //console.log(("||SERVE- getAll|" + allData);
  return allData;
};

export const getIndexList = async (endpoint, pageIndex,filterParms="") => {
  let offset = (pageIndex - 1) * PERPAGE;
  const data = await client.getList({
    endpoint: endpoint,
    queries: {
      offset: offset,
      limit: PERPAGE,
      fields: "id,title,publishedAt,thumbnail,content,contenttype",
      orders: "-publishedAt",
      filters:filterParms
    },
  });
  //console.log(("||MSG-getIndexList||" + data.contents.length);
  return data;
};

export const getLists = async (endpoint, query) => {
  //console.log(("||MSG-getLists|| " + endpoint +" | "+ JSON.stringify(query));
  const data = await client.getList({
    endpoint: endpoint,
    queries: query
  });

  if (!data) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }
 // //console.log(("||MSG-getLists||result: " + data);
  ////console.log(("||MSG-getLists||result: " + JSON.stringify(data));

  return data;
};

export const getDetail = async function({ contentid, endpoint }, queries = null){
  //console.log(("||MSG(SR)||"+contentid+","+endpoint)
  const detailData = await client.getListDetail({
    endpoint: endpoint,
    contentId: contentid,
  });
  //await new Promise((resolve) => setTimeout(resolve, 3000)); //debug delay
  ////console.log(("||MSG-DETAIL||"+JSON.stringify(detailData));
  return detailData;
};


///**Component ***///
export const YearList = (data, { format, attribute }) => {
  const yearIndex = groupByDate(data, format, attribute);
  return { props: { yearList: yearIndex } };
};


//ImageLoader
export const microCMSLoader = function (src, width, quality){
  //console.log(("MSG-S||"+src)
  return `${src}?auto=format&fit=max&w=${width}`;
};

//引数を与えて呼び出すためにReplacerをラップ
// export const BodyReplacer = (imgclass) => (domNode) => { //EsLintで警告
// }
export const BodyReplacer = function (imgclass) {
  (function (domNode) {
    //console.log(("||Replace start|| " + domNode.name);
    const attr = domNode.attribs;
    // id属性が存在する場合
    if (domNode.attribs && domNode.attribs.id) {
      //return <CustomComponent>{domNode.children[0].data}</CustomComponent>;
    }
    // img要素の場合
    if (domNode.name === "img") {
      return (
        <div className={`wrap-img ${imgclass ?? ""}`}>
          <Image className="image-fit" src={attr.src} alt={attr.alt} fill loader={microCMSLoader} />
        </div>
      );
    }
  });
};


//ThumbnailPath設定
export const ImagePathReplace = function (src){
  //return <Image {...props} src={`${publicRuntimeConfig.basePath || ''}${props.src}`} />
  let srcP = process.env.NODE_ENV == "production" ? process.env.BUILDTYPE + process.env.TARGET + src : src;
  //console.log(("||MSG|| imgPath: "+srcP)
  return process.env.NODE_ENV == "production" ? process.env.BUILDTYPE + process.env.TARGET + src : src;
}

export const ParseImage =function (data) {
  const imageTagStr = data.content.match(/(?<=<img src=).*(?=>)/gi)?.[0]; //g:all match, i:ignorecase
  const setImg = data.content.thumbnail;
  let thumbnail = imageTagStr ?? setImg;
  thumbnail = thumbnail ?? data.categoryimg;
  return thumbnail;
}

// export const getArchiveList = async function() {
//   //console.log(("||getArchiveList|| ArchiveFetch - " );

//   const alldata = await client.getAllContents({ endpoint: "news" });
//   //console.log(("||getArchiveList|| Alldata - " + alldata);

//   //const yearIndex = YearList(result, { format: "YYYY_MM", attribute: "publishedAt" }).props.yearList;
//   const yearIndex = groupByDate(alldata, { format: "YYYY_MM", attribute: "publishedAt" });
//   //console.log(("||getArchiveList|| Result - " + JSON.stringify(yearIndex));
//   //return yearIndex;
//   return { props: { yearList: yearIndex } };  //Static用
// };

//GetCategoryList,MonthlyList
// export const getCategoryList = async function(filterEndpoint,filterAttr,endpoint){

//   const filterItems = await client.getAllContents({ endpoint: filterEndpoint });
//   //console.log(("||getCategoryList|| All - " + filterItems);

//   const result = await Promise.all(filterItems.map(async (item)=>{
//     const res = await client.getList({
//       endpoint: endpoint,
//       queries:{
//         filters: `${filterAttr}[contains]${item.id}`,
//       }
//       })
//       return { id: item.id, name: item.name, totalCount: res.totalCount };
//   })
//   )

//   return result;
// }