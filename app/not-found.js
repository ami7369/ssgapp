import Link from "next/link";

export default function notFound() {
  return (
    <div>
      <meta name="robots" content="noindex" />
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/">TOP</Link>
      </p>
    </div>
  );
}
