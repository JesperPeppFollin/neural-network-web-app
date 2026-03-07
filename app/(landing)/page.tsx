"use client";
import { useState } from "react";
import { Loader } from "../../components/loader/loader";
import { Tooltip } from "../../components/tooltip/tooltip";
import { Button } from "../../components/button/button";
import explanations from "./tooltip_explanations.json";
import styles from "./page.module.css";

type ApiResponse = {
  status: string;
  accuracy: number;
  timeElapsed: number;
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
      const res = await fetch("http://localhost:8080/api/run");

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
          <a href="https://www.tensorflow.org/datasets/catalog/mnist">MNIST</a>{" "}
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
          <h3 className={styles.responseTitle}>Model finished</h3>
          <div className={styles.responseItem}>
            <p>Accuracy: {(response.accuracy * 100).toFixed(2)}%</p>
          </div>
          <div className={styles.responseItem}>
            <p>Time elapsed: {response.timeElapsed.toFixed(1)} seconds</p>
          </div>
        </div>
      )}
    </main>
  );
}
