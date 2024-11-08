import * as ort from "onnxruntime-web";

export async function loadModelSession() {
  // Create session and set options. See the docs here for more options:
  //https://onnxruntime.ai/docs/api/js/interfaces/InferenceSession.SessionOptions.html#graphOptimizationLevel
  const session = await ort.InferenceSession.create(
    "/three_class_models/quant-model.onnx",
    { executionProviders: ["wasm"], graphOptimizationLevel: "all" }
  );
  return session;
}

export async function runInference(
  session: ort.InferenceSession,
  input_ids: any,
  attention_mask: any
): Promise<[any, number]> {
  const start = performance.now();
  const feeds: Record<string, ort.Tensor> = {
    input_ids: input_ids,
    attention_mask: attention_mask,
  };
  const outputData = await session.run(feeds);
  const end = performance.now();
  const inferenceTime = (end - start) / 1000;

  const output = outputData["logits"];
  var outputSoftmax = softmax(Array.prototype.slice.call(output.data));

  return [outputSoftmax, inferenceTime];
}

// The softmax transforms values to be between 0 and 1
function softmax(resultArray: number[]): any {
  const largestNumber = Math.max(...resultArray);
  const sumOfExp = resultArray
    .map((resultItem) => Math.exp(resultItem - largestNumber))
    .reduce((prevNumber, currentNumber) => prevNumber + currentNumber);
  return resultArray.map((resultValue, index) => {
    return Math.exp(resultValue - largestNumber) / sumOfExp;
  });
}
