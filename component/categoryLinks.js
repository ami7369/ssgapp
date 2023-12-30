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
        {Object.keys(data).map((category) => (
          <li key={category}>
            <Link href={`/categorys/${category}/1`}>
              {data[category].category}（{data[category].contents.length}）
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
