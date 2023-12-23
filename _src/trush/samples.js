import parse, { domToReact } from "html-react-parser";
import { htmlToText } from "html-to-text";

  const html = `<section><h2>Replace img to Component</h2><p>Todays Letter.<img alt="daihuku" src="h/s400/sweets_daifuku.png"></p><p>Second Image<img src="https://blogger.googleusercontent.com/img/sand.jpg"></p></section>`;

  const textContent = htmlToText(htmlContent, { wordwrap: 60 });
 
//Replacer
function Content() {
  return <div>{parse(html, { replacer })}</div>;
}

const replacer = (dom) => {
  if (dom.name === "img") {
    const attr = dom.attribs;
    return <Image className="HOGE" fill imgsrc={attr.src} alt={attr.alt} />;
  }
};