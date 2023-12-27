import { Static} from "/component/staticPage";
import { Suspense } from "react";
import { OGP } from "/component/blog";

export const metadata = {
  title: "アクセス",
};

export default async function About() {
  return (
    <div>
      <Suspense>
        <Static id="static_access" />
      </Suspense>
    </div>
  );
};

