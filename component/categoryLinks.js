import Link from "next/link";
import { getCategoryList } from "/lib/listfnc";

const BLOG = process.env.BLOG;

export async function CategoryLinks() {
  try {
    const data  = await getCategoryList(BLOG);
    if(!data) return <p>No Data(CagoryLinks)</p>
    return (
      <div className="comp-category">
        <ul>
        {Object.keys(content).map((category) => (
          <li key={category}>
            <Link href={`/categorys/${content[category].category}/1}`}>
              {content[category].category}（{content[category].contents.length}）
            </Link>
          </li>
        ))}
        </ul>
      </div>
    )
  } catch (e) {
    console.log("|ERR categoryList|" + e);
  }
}
