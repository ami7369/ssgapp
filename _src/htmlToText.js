import { htmlToText } from "html-to-text";

export default async function Home() {
  const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>My Title</title>
      </head>
      <body>
        <h1>Hello World!</h1>
        <p>This is a sample HTML content with a <a href="https://example.com">link</a> and a list:</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </body>
      </html>
    `;

  const textContent = htmlContent.replace(/<[^>]+>|\n/g, "");
  //const textContent = htmlToText(htmlContent, { wordwrap: 60 });

  return <p>{textContent}</p>;
}
