import { AutoTokenizer, env } from "@xenova/transformers";
import { loadModelSession, runInference } from "./utils/model";

// Skip local model check
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = "/three_class_models/";

let modelSessionLoaded = false;
let cachedModelSession = null;
let tokenizerLoaded = false;
let cachedTokenizer = null;

function getDecision(predIndex) {
  if (predIndex === 0) {
    return "Insufficient Information";
  } else if (predIndex === 1) {
    return "Upheld";
  } else if (predIndex === 2) {
    return "Overturned";
  }
}

// Load model with progress tracking
async function loadModelSessionWithProgress() {
  try {
    const modelUrl = "/three_class_models/quant-model.onnx";

    // Fetch with progress tracking
    const response = await fetch(modelUrl);

    // Get content length if available from headers
    const contentLength = response.headers.get("content-length");

    if (contentLength) {
      const totalBytes = parseInt(contentLength);

      // Create a reader from the response body
      const reader = response.body.getReader();

      // Create an array to store chunks
      const chunks = [];
      let receivedBytes = 0;

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        receivedBytes += value.length;

        // Report progress
        const currentProgress = Math.min(
          Math.round((receivedBytes / totalBytes) * 100),
          100
        );
        self.postMessage({ status: "loading", progress: currentProgress });
      }

      // Combine all chunks into a single Uint8Array
      const allChunks = new Uint8Array(receivedBytes);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }

      // Use the original loadModelSession but pass the downloaded bytes
      // instead of fetching again
      const session = await loadModelSession(allChunks);
      return session;
    } else {
      // If content-length is not available, signal indeterminate progress
      self.postMessage({ status: "loading", progress: -1 });

      // Fall back to the original implementation
      const session = await loadModelSession();
      return session;
    }
  } catch (e) {
    console.error("Failed to load model:", e);
    throw e;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  if (modelSessionLoaded === false || tokenizerLoaded === false) {
    self.postMessage({ status: "initiate" });

    try {
      // Load tokenizer first
      cachedTokenizer = await AutoTokenizer.from_pretrained("tokenizer");
      tokenizerLoaded = true;
      self.postMessage({ status: "tokenizer_loaded" });

      // Load model with progress tracking
      cachedModelSession = await loadModelSessionWithProgress();

      modelSessionLoaded = true;
      self.postMessage({ status: "ready" });
    } catch (error) {
      self.postMessage({ status: "error", message: error.message });
      return;
    }
  }

  // Model inference
  try {
    let { input_ids, attention_mask } = await cachedTokenizer(event.data.text, {
      padding: true,
      truncation: true,
    });

    const jurisdiction_id =
      event.data.jurisdiction_id !== undefined ? event.data.jurisdiction_id : 2;
    const insurance_type_id =
      event.data.insurance_type_id !== undefined
        ? event.data.insurance_type_id
        : 2;

    let [outputProbs, time] = await runInference(
      cachedModelSession,
      input_ids,
      attention_mask,
      jurisdiction_id,
      insurance_type_id
    );

    // Get prediction
    const inferenceTime = time;
    const overturnLikelihood = outputProbs[2];
    const maxProb = Math.max(outputProbs[0], outputProbs[1], outputProbs[2]);
    const argmax = outputProbs.indexOf(maxProb);
    const decision = getDecision(argmax);

    // Send the output back to the main thread
    self.postMessage({
      status: "complete",
      output: {
        decision: decision,
        overturn_likelihood: overturnLikelihood,
        max_prob: maxProb,
        output_probs: outputProbs,
        inference_time: inferenceTime,
      },
    });
  } catch (error) {
    self.postMessage({ status: "error", message: error.message });
  }
});
