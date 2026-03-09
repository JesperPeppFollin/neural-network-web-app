import styles from "./page.module.css";
import { PythonCode } from "@/components/code-highlighter/code-highlighter";
import { Sidebar } from "@/components/sidebar/sidebar";
import {
  imports_code,
  math_class_code,
  classification_NN_code,
  train_model_code,
  run_model_code,
} from "@/app/code/code-content";

function CodeBox({
  id,
  title,
  description,
  code,
}: {
  id: string;
  title: string;
  description: string;
  code: string;
}) {
  return (
    <div id={id} className={styles.codeBoxContainer}>
      <h2 className={styles.codeBoxTitle}>{title}</h2>
      <p className={styles.codeBoxDescription}>{description}</p>
      <div className={styles.codeBox}>
        <PythonCode code={code} />
      </div>
    </div>
  );
}

const sections = [
  { id: "imports", title: "Imports" },
  { id: "math-class", title: "Math Class" },
  { id: "classification-nn", title: "Classification NN" },
  { id: "train-model", title: "Train Model" },
  { id: "run-model", title: "Run Model" },
];

export default function Page() {
  return (
    <div className={styles.pageLayout}>
      <Sidebar sections={sections} />
      <main className={styles.mainContainer}>
        <h1 className={styles.title}>Code</h1>
        <CodeBox
          id={sections[0].id}
          title="Imports"
          description="Load NumPy for linear algebra, Keras for the MNIST dataset, and time for benchmarking."
          code={imports_code}
        />
        <CodeBox
          id={sections[1].id}
          title="Math Class"
          description="Static helper methods for activation functions and their derivatives used during forward and backward passes."
          code={math_class_code}
        />
        <CodeBox
          id={sections[2].id}
          title="Classification NN"
          description="The neural network class handling layer initialization, forward propagation, backpropagation, and parameter updates."
          code={classification_NN_code}
        />
        <CodeBox
          id={sections[3].id}
          title="Train Model"
          description="Loads the MNIST data, initializes the network, and runs mini-batch gradient descent for a set number of epochs."
          code={train_model_code}
        />
        <CodeBox
          id={sections[4].id}
          title="Run Model"
          description="Evaluates the trained model on the test set and returns the accuracy along with the total training time."
          code={run_model_code}
        />
        <p className={styles.disclaimer}>
          <span className={styles.disclaimerTitle}>Note:</span> The code shown
          above is the original Python implementation, kept intact to maintain
          clarity and explainability. The version running behind the API has
          been slightly modified to work as a web service.
        </p>
      </main>
    </div>
  );
}
