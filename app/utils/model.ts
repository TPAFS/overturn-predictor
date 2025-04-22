import * as ort from "onnxruntime-web";

export async function loadModelSession() {
  const sessionOptions: ort.InferenceSession.SessionOptions = {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: "sequential"
  };
  
  try {
    // console.log("Loading model with options:", sessionOptions);
    const modelUrl = "/three_class_models/quant-model.onnx"
    const response = await fetch(modelUrl);
    const arrayBuffer = await response.arrayBuffer();
    const modelBytes = new Uint8Array(arrayBuffer);
    const session = await ort.InferenceSession.create(
      modelBytes,
      sessionOptions
    );
    console.log("Model loaded successfully");
    return session;
  } catch (e) {
    console.error("Failed to load model:", e);
    throw e;
  }
}

export async function runInference(
  session: ort.InferenceSession,
  input_ids: any,
  attention_mask: any,
  jurisdiction_id: number = 2,
  insurance_type_id: number = 2
): Promise<[any, number]> {
  const start = performance.now();
  const feeds: Record<string, ort.Tensor> = {
    input_ids: input_ids,
    attention_mask: attention_mask,
    jurisdiction_id: new ort.Tensor(
      "int64", 
      new BigInt64Array([BigInt(jurisdiction_id)]), 
      [1]
    ),
    insurance_type_id: new ort.Tensor(
      "int64", 
      new BigInt64Array([BigInt(insurance_type_id)]), 
      [1]
    ),
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
