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

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  if (modelSessionLoaded === false || tokenizerLoaded === false) {
    self.postMessage({ status: "initiate" });

    cachedTokenizer = await AutoTokenizer.from_pretrained("tokenizer");
    tokenizerLoaded = true;

    cachedModelSession = await loadModelSession();
    modelSessionLoaded = true;

    self.postMessage({ status: "ready" });
  }

  // Model inference
  let { input_ids, attention_mask } = await cachedTokenizer(event.data.text);
  let [outputProbs, time] = await runInference(
    cachedModelSession,
    input_ids,
    attention_mask
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
});
