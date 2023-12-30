import parse from "html-react-parser";
import { getLists } from "/lib/microcms";
import { MonthlyLinks } from "/component/monthlyLinks";
import { CategoryLinks } from "/component/categoryLinks";
import { TopicList } from "/component/topicList";

const replacer = (dom) => {
  if (dom.name === "img") {
    const attr = dom.attribs;
    return <Image className="HOGE" fill imgsrc={attr.src} alt={attr.alt} />;
  }
};

export const Sidebar = async()=> {
  const { contents } = await getLists("mori-static", {
    filters: "component[equals]true[and]displayorder[greater_than]-1",
    orders: "displayorder",
  });
  return (
    <div>
      {contents.map((item) => (
        <div
          key={item.id}
          className={`static-component order${item.displayorder}`}
        >
          {item.id == "comp_categorylink" && <CategoryLinks />}
          {item.id == "comp_monthlylink" && <MonthlyLinks />}
          {item.id == "comp_topiclist" && <TopicList />}
          {item.id != "comp_categorylink" &&
            item.id != "comp_monthlylink" &&
            item.id != "comp_topiclist" &&
            parse(item.content, replacer)}
        </div>
      ))}
    </div>
  );
};
