import { TopPage } from "/component/bloglist";
import { Suspense } from "react";
import { MonthlyLinks } from "/component/monthlyLinks";
const BLOG = process.env.BLOG;

//トップページ
export default function Home() {
    return (
      <div>
        <Suspense>
          <TopPage />
        </Suspense>
      </div>
    );
}
