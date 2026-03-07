import { codeToHtml } from "shiki";
// import { dedent } from "ts-dedent";

async function highlightPython(code: string) {
  return await codeToHtml(code, {
    lang: "python",
    theme: "light-plus",
  });
}

export async function PythonCode({code}: { code: string }) {

  const html = await highlightPython(code);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
