import styles from "./page.module.css";
import { PythonCode } from "@/components/code-highlighter/code-highlighter";
import {
  imports_code,
  math_class_code,
  classification_NN_code,
  train_model_code,
  run_model_code,
} from "@/app/code/code-content";

function CodeBox({ title, code }: { title: string; code: string }) {
  return (
    <div className={styles.codeBoxContainer}>
      <h2>{title}</h2>
      <div className={styles.codeBox}>
        <PythonCode code={code} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.title}>code</h1>
      <CodeBox title="Imports" code={imports_code} />
      <CodeBox title="Math Class" code={math_class_code} />
      <CodeBox title="Classification NN" code={classification_NN_code} />
      <CodeBox title="Train Model" code={train_model_code} />
      <CodeBox title="Run Model" code={run_model_code} />
    </main>
  );
}
