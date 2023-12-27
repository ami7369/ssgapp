
import { getDetail} from "/lib/microcms";
import parse from "html-react-parser";

const STATIC = process.env.STATIC;

export async function Static({ id }) {

  try {
    const data = await getDetail({ contentid: id, endpoint: STATIC });
    return (
      <div>
        <h1>{data.title}</h1>
        <div className="contents">
          {parse(data.content)}
        </div>
      </div>
    );
  } catch (e) {
    console.log("|STATIC ERROR|---" + e);
  }
}
