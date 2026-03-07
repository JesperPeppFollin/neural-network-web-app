"use client";
import { useState } from "react";
import { Loader } from "../../components/loader/loader";
import { Tooltip } from "../../components/tooltip/tooltip";
import explanations from "./tooltip_explanations.json";

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
    <main>
      <h1>Neural Network Demo</h1>

      <p>
        This demo demonstrates a small feed-forward neural network trained to
        classify handwritten digits from the{" "}
        <a href="https://www.tensorflow.org/datasets/catalog/mnist">MNIST</a>{" "}
        dataset. Each 28x28 image is flattened into a vector and passed through
        several fully connected layers with <Tooltip title="ReLU" explanation={explanations.relu} /> activations, followed by a 
        <Tooltip title="Softmax" explanation={explanations.softmax} /> output layer that produces probabilities for the digits 0-9.
      </p>

      <p>
        The network is trained using <Tooltip title="cross-entropy" explanation={explanations.cross_entropy} /> loss and mini-batch <Tooltip title="gradient
        descent" explanation={explanations.gradient_descent} />. During training, <Tooltip title="backpropagation" explanation={explanations.backpropagation} /> computes how each weight
        contributed to the error, allowing the model to update its parameters
        and gradually improve its predictions.
      </p>

      <p>
        The entire implementation is written from scratch with NumPy to illustrate
        the fundamental mechanics behind neural networks and to show that it is
        possible to implement such models without relying on machine learning
        frameworks.
      </p>

      <button onClick={testAPI} disabled={loading}>
        Train model
      </button>

      {loading && <Loader />}

      {error && <p>{error}</p>}

      {response && (
        <div>
          <h5>Model finished training</h5>
          <p>Accuracy: {(response.accuracy * 100).toFixed(2)}%</p>
          <p>Time elapsed: {response.timeElapsed.toFixed(1)} seconds</p>
        </div>
      )}
    </main>
  );
}
