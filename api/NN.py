# imports
import numpy as np
import pathlib
import urllib.request
import time

def load_mnist_from_npz(cache_dir=None):
    """Load MNIST from the public .npz file without requiring keras/tensorflow."""
    if cache_dir is None:
        cache_dir = pathlib.Path("/tmp/mnist")
    else:
        cache_dir = pathlib.Path(cache_dir)

    cache_dir.mkdir(parents=True, exist_ok=True)
    dataset_path = cache_dir / "mnist.npz"

    if not dataset_path.exists():
        url = "https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz"
        urllib.request.urlretrieve(url, dataset_path)

    with np.load(dataset_path) as data:
        X_train = data["x_train"]
        y_train = data["y_train"]
        X_test = data["x_test"]
        y_test = data["y_test"]

    return (X_train, y_train), (X_test, y_test)

# Math class
class Math:

    # -----------------------------
    # Activations
    # -----------------------------
    @staticmethod
    def sigmoid(Z):
        return 1 / (1 + np.exp(-Z))

    @staticmethod
    def deriv_sigmoid(Z):
        s = Math.sigmoid(Z)
        return s * (1 - s)

    @staticmethod
    def reLU(Z):
        return np.maximum(0, Z)

    @staticmethod
    def deriv_reLU(Z):
        return (Z > 0).astype(float)

    @staticmethod
    def tanh(Z):
        return np.tanh(Z)

    @staticmethod
    def deriv_tanh(Z):
        return 1 - np.tanh(Z)**2

    @staticmethod
    def softmax(Z):
        expZ = np.exp(Z - np.max(Z, axis=0, keepdims=True))
        return expZ / np.sum(expZ, axis=0, keepdims=True)

    @staticmethod
    def linear(Z):
        return Z


    # -----------------------------
    # Loss functions
    # -----------------------------
    @staticmethod
    def cross_entropy(Y_pred, Y_true):
        m = Y_true.size
        Y_one_hot = Math.one_hot(Y_true, Y_pred.shape[0])
        return -np.sum(Y_one_hot * np.log(Y_pred + 1e-15)) / m

    @staticmethod
    def cross_entropy_grad(Y_pred, Y_true):
        m = Y_true.size
        Y_one_hot = Math.one_hot(Y_true, Y_pred.shape[0])
        return (Y_pred - Y_one_hot) / m

    @staticmethod
    def mse(Y_pred, Y_true):
        m = Y_true.size
        Y_one_hot = Math.one_hot(Y_true, Y_pred.shape[0])
        return np.sum((Y_pred - Y_one_hot)**2) / m

    @staticmethod
    def mse_grad(Y_pred, Y_true):
        m = Y_true.size
        Y_one_hot = Math.one_hot(Y_true, Y_pred.shape[0])
        return 2 * (Y_pred - Y_one_hot) / m


    # -----------------------------
    # One-hot encoding
    # -----------------------------
    @staticmethod
    def one_hot(Y, num_classes):
        one_hot_Y = np.zeros((num_classes, Y.size))
        one_hot_Y[Y, np.arange(Y.size)] = 1
        return one_hot_Y


# Classification NN class

class ClassificationNN():
    
    # add more allowed activations and losses here if needed
    _hidden_activations = ['reLU', 'sigmoid', 'tanh']
    _output_activations = ['softmax', 'sigmoid', 'linear']
    _losses = ['cross_entropy', 'mse']
    
    def __init__(self, layers, hidden_activation='reLU', output_activation='softmax', loss='cross_entropy'):
        
        self.layers = layers # List defining the number of layers and number of neurons in each layer
        self.weights = [] # List to hold weights for each layer
        self.biases = [] # List to hold biases for each layer
        self.Zs = None # Linear combination per layer
        self.As = None # Activation per layer
        self.num_classes = layers[-1] # Number of output classes, used for one-hot encoding
        
        # Initialize weights and biases
        for i in range(len(layers) - 1):
            n_in = layers[i]
            n_out = layers[i + 1]

            W = np.random.randn(n_out, n_in) * np.sqrt(2 / n_in) # He initialization (good for ReLU, can be overridden in children classes)
            b = np.zeros((n_out, 1))
            self.weights.append(W)
            self.biases.append(b)
        
        # Hidden activation initialization
        if hidden_activation not in self._hidden_activations:
            raise ValueError(f"Hidden activation must be one of {self._hidden_activations}")
        self.hidden_activation = hidden_activation

        # Output activation initialization
        if output_activation not in self._output_activations:
            raise ValueError(f"Output activation must be one of {self._output_activations}")
        self.output_activation = output_activation

        # Loss initialization
        if loss not in self._losses:
            raise ValueError(f"Loss must be one of {self._losses}")
        self.loss_name = loss
        
        
    # Activation functions
    def activation(self, Z, layer_index):
        """Returns activation for the layer"""
        if layer_index == len(self.weights) - 1:
            return getattr(Math, self.output_activation)(Z)
        else:
            return getattr(Math, self.hidden_activation)(Z)
        
    def activation_derivative(self, Z, layer_index):
        """Returns derivative for backpropagation"""
        if layer_index == len(self.weights) - 1:
            return np.ones_like(Z)  # Output handled in loss gradient
        else:
            return getattr(Math, f'deriv_{self.hidden_activation}')(Z).astype(float)
        
    
    # Loss functions
    def compute_loss(self, Y_pred, Y_true):
        """Compute scalar loss"""
        return getattr(Math, self.loss_name)(Y_pred, Y_true)

    def compute_loss_grad(self, Y_pred, Y_true):
        """Compute gradient of loss w.r.t output"""
        return getattr(Math, f'{self.loss_name}_grad')(Y_pred, Y_true)
    
    
    def forward(self, X):
        self.Zs = []
        self.As = [X]
        A = X

        for i in range(len(self.weights)):
            W, b = self.weights[i], self.biases[i]
            Z = np.dot(W, A) + b
            self.Zs.append(Z)

            # Hidden layers use chosen hidden activation
            if i < len(self.weights) - 1:
                A = getattr(Math, self.hidden_activation)(Z)
            else:
                # Output layer uses chosen output activation
                A = getattr(Math, self.output_activation)(Z)
            self.As.append(A)

        return A


    def backward(self, Y):
        m = Y.size
        Y_pred = self.As[-1]
        one_hot_Y = Math.one_hot(Y, self.num_classes)

        # Compute output gradient
        dZ = Y_pred - one_hot_Y

        self.dWs = [None] * len(self.weights)
        self.dbs = [None] * len(self.biases)

        # Backpropagate through all layers
        for i in reversed(range(len(self.weights))):
            A_prev = self.As[i]
            self.dWs[i] = np.dot(dZ, A_prev.T) / m
            self.dbs[i] = np.sum(dZ, axis=1, keepdims=True) / m

            if i > 0:
                W = self.weights[i]
                Z_prev = self.Zs[i-1]
                dZ = np.dot(W.T, dZ) * getattr(Math, f'deriv_{self.hidden_activation}')(Z_prev).astype(float)


    def update_params(self, dWs, dbs, learning_rate):
        for i in range(len(self.weights)):
            self.weights[i] -= learning_rate * dWs[i]
            self.biases[i] -= learning_rate * dbs[i]
    

    def predict(self, X):
        Y_pred = self.forward(X)
        return np.argmax(Y_pred, axis=0)

    def accuracy(self, Y_pred, Y_true):
        return np.mean(Y_pred == Y_true)



# Implement custom train mehod

def train(model, X, Y, epochs, learning_rate, batch_size):
        """
        Training loop with mini-batches and SGD updates.
        """
        for epoch in range(epochs):
            permutation = np.random.permutation(X.shape[1])
            X_shuffled = X[:, permutation]
            Y_shuffled = Y[permutation]

            for j in range(0, X.shape[1], batch_size):
                X_batch = X_shuffled[:, j:j+batch_size]
                Y_batch = Y_shuffled[j:j+batch_size]

                model.forward(X_batch)
                model.backward(Y_batch)
                model.update_params(model.dWs, model.dbs, learning_rate)

            # Evaluate accuracy after each epoch
            Y_pred = model.predict(X)
            acc = model.accuracy(Y_pred, Y)
            print(f"Epoch {epoch+1}/{epochs} - Accuracy: {acc:.4f}")

        return acc


# init data and use NN
def run_model():

    start_time = time.time()

    # load MNIST dataset
    (X_train, y_train), (X_test, y_test) = load_mnist_from_npz()

    # Prepare training data
    m_train = X_train.shape[0]
    X_train_flat = X_train.reshape(m_train, -1).T / 255.0
    Y_train = y_train.astype(int)

    # Prepare test data
    m_test = X_test.shape[0]
    X_test_flat = X_test.reshape(m_test, -1).T / 255.0
    Y_test = y_test.astype(int)

    epochs = 10
    learning_rate = 0.01
    batch_size = 64

    model = ClassificationNN(
        layers=[784, 128, 64, 10],
        hidden_activation='reLU',
        output_activation='softmax',
        loss='cross_entropy'
    )

    train_accuracy = train(model, X_train_flat, Y_train, epochs=epochs, learning_rate=learning_rate, batch_size=batch_size)

    Y_pred_test = model.predict(X_test_flat)
    test_accuracy = model.accuracy(Y_pred_test, Y_test)

    end_time = time.time()
    time_elapsed = end_time - start_time

    return {
        "testAccuracy": float(test_accuracy),
        "trainAccuracy": float(train_accuracy),
        "epochs": epochs,
        "timeElapsed": float(time_elapsed),
        "architecture": model.layers,
    }
