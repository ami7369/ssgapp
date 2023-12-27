import Link from "next/link";
import { getArchiveList } from "/lib/listfnc";
const BLOG = process.env.BLOG;

export async function MonthlyLinks() {
  const monthlyIndex = await getArchiveList(BLOG);
  if (!monthlyIndex) return <p>No Data(MonthlyLinks)</p>;
  
  return (
    <div>
      <ul>
        {Object.keys(monthlyIndex).map((yearMonth) => (
          <li key={monthlyIndex}>
            <Link href={`/archives/monthlyIndex/1}`}>
              {yearMonth}（{monthlyIndex[yearMonth].length}）
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
