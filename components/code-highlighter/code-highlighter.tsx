import { codeToHtml } from "shiki";
// import { dedent } from "ts-dedent";
import styles from "./code-highlighter.module.css";

async function highlightPython(code: string) {
  return await codeToHtml(code, {
    lang: "python",
    theme: "light-plus",
  });
}

export async function PythonCode({code}: { code: string }) {

  const html = await highlightPython(code);

  return <div className={styles.codeWrapper} dangerouslySetInnerHTML={{ __html: html }} />;
}
