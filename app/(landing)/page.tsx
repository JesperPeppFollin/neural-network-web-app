"use client";
import { useState } from "react";
import { Loader } from "../../components/loader/loader";
import { Tooltip } from "../../components/tooltip/tooltip";
import { Button } from "../../components/button/button";
import explanations from "./explanations.json";
import styles from "./page.module.css";

type ApiResponse = {
  status: string;
  testAccuracy: number;
  trainAccuracy: number;
  epochs: number;
  timeElapsed: number;
  architecture: number[];
};

export default function Home() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function testAPI() {
    setLoading(true);
    setError("");

    try {
      // change back to "/api/run" when running in production
      const res = await fetch("api/run");

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch {
      setError("API request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.title}>Neural Network Demo</h1>

      <div className={styles.descriptionContainer}>
        <p className={styles.description}>
          This demo demonstrates a small feed-forward neural network trained to
          classify handwritten digits from the{" "}
          <a href="https://www.tensorflow.org/datasets/catalog/mnist" target="_blank" rel="noopener noreferrer">MNIST</a>{" "}
          dataset. Each 28x28 image is flattened into a vector and passed
          through several fully connected layers with{" "}
          <Tooltip title="ReLU" explanation={explanations.relu} /> activations,
          followed by a{" "}
          <Tooltip title="Softmax" explanation={explanations.softmax} /> output
          layer that produces probabilities for the digits 0-9.
        </p>

        <p className={styles.description}>
          The network is trained using{" "}
          <Tooltip
            title="cross-entropy"
            explanation={explanations.cross_entropy}
          />{" "}
          loss and mini-batch{" "}
          <Tooltip
            title="gradient
        descent"
            explanation={explanations.gradient_descent}
          />
          . During training,{" "}
          <Tooltip
            title="backpropagation"
            explanation={explanations.backpropagation}
          />{" "}
          computes how each <Tooltip title="weight" explanation={explanations.weights} /> contributed to the error, allowing the model
          to update its parameters and gradually improve its predictions.
        </p>

        <p className={styles.description}>
          The entire implementation is written from scratch with NumPy to
          illustrate the fundamental mechanics behind neural networks and to
          show that it is possible to implement such models without relying on
          machine learning frameworks.
        </p>
      </div>

      <Button
        onClick={testAPI}
        disabled={loading}
        className={styles.trainButton}
      >
        Train model
      </Button>

      {loading && <Loader />}

      {error && <p>{error}</p>}

      {response && (
        <div className={styles.responseContainer}>
          <h4 className={styles.responseTitle}>Model Result</h4>
          <table className={styles.responseTable}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Test Accuracy</td>
                <td>{(response.testAccuracy * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td>Train Accuracy</td>
                <td>{(response.trainAccuracy * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td>Epochs</td>
                <td>{response.epochs}</td>
              </tr>
              <tr>
                <td>Time Elapsed</td>
                <td>{response.timeElapsed.toFixed(1)} seconds</td>
              </tr>
              <tr>
                <td>Architecture</td>
                <td>{response.architecture.join(" → ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
