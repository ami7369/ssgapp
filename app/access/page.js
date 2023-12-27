import { Static} from "/component/staticPage";
import { Suspense } from "react";

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

