"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const sufficiencyThreshold = 0.005;
const maxProbThreshold = 0.65;

function getColorFromOverturnLiklihood(result) {
  if (result > 0.7) {
    return "border-x-teal-500";
  } else if (result < 0.3) {
    return "border-x-amber-500";
  } else {
    return "border-x-zinc-500";
  }
}

function getColorFromDecision(result) {
  if (result["max_prob"] < maxProbThreshold) {
    return "border-x-zinc-500";
  } else if (result["decision"] === "Overturned") {
    return "border-x-teal-500";
  } else if (result["decision"] === "Upheld") {
    return "border-x-amber-500";
  } else {
    return "border-x-zinc-500";
  }
}

function getColorFromProbs(outputProbs) {
  const maxProb = Math.max(outputProbs[0], outputProbs[1], outputProbs[2]);
  const argmax = outputProbs.indexOf(maxProb);
  if (outputProbs[0] > sufficiencyThreshold) {
    return "border-x-zinc-500";
  } else if (argmax == 2) {
    return "border-x-teal-500";
  } else if (argmax == 1) {
    return "border-x-amber-500";
  }
}

const sampleSummaries = [
  {
    title: "Stomach Cancer Chemotherapy",
    summary: `This patient has extensive and inoperable carcinoma of the stomach. He was started on chemotherapy with Xeloda and Oxaliplatin, because he has less nausea with Oxaliplatin than with the alternative, Cisplatin. Oxaliplatin was denied as experimental for treatment of his gastric cancer.`,
  },
  {
    title: "Non-small cell Lung Cancer Diagnostics",
    summary:
      "This is a male patient with a medical history of advanced metastatic non-small cell lung cancer (NSCLC) with metastatic disease. FoundationOne CDx Lab test was ordered by the patient's treating physician because the test results were needed to help determine the course of treatment for the patient's advanced cancer. ",
  },
  {
    title: "Breast Cancer Screening",
    summary:
      "This is a patient who was denied breast tomosynthesis to screen for breast cancer.",
  },
  {
    title: "Humira Level Testing",
    summary:
      "This is a patient with Crohn's Disease who is being treated with Humira. Their health plan has denied Anser ADA blood level testing for Humira, claiming it is investigational.",
  },
  {
    title: "ER Visit for Chest Pain",
    summary:
      "I have coronary artery disease, and was experiencing persistent chest pain for a week. I was sent to the ER by my cardiologist. While there I had a cardiac catheterization with coronary angiography showing severe left anterior descending coronary artery disease. I had a successful coronary intervention, and was admitted as an inpatient, then discharged later that day.",
  },
  {
    title: "Breast Cancer Proton Beam",
    summary:
      "The patient is a 44-year-old female who initially presented with an abnormal screening mammogram. The patient was seen by a radiation oncologist who recommended treatment of the right chest wall and comprehensive nodal regions using proton beam radiation therapy.",
  },
  {
    title: "Speech and Language Therapy",
    summary:
      "The patient is a 10-year-old female with a history of Pitt-Hopkins syndrome and associated motor planning difficulties, possible weakness in the oral area, and receptive and expressive language delays. The provider has recommended that the patient continue to receive individual speech and language therapy sessions twice a week for 60-minute sessions. The Health Insurer has denied the requested services as not medically necessary for treatment of the patient’s medical condition.",
  },
  {
    title: "ABA for Autism",
    summary:
      "The patient is a nine-year-old female with a history of autism spectrum disorder and a speech delay. The patient’s parent has requested reimbursement for the ABA services provided over the course of a year. The Health Insurer has denied the services at issue as not medically necessary for the treatment of the patient.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  const toggleFAQ = (index) => {
    setOpen(open === index ? null : index);
  };

  const faqData = [
    {
      question: `Wait, so what is this for exactly?
      `,
      answer: [
        `This tool can support patients and case workers who want to make an
        informed decision about appealing an inappropriate health insurance
        denial. Many patients forgo appeals assuming they have little to no
        chance of success. This is actually <a style="color: #FB7185; text-decoration: underline;" href=https://blog.persius.org/investigations/claims_denials>far from true</a>. `,
        `If you have a denial and are considering forgoing an appeal, you should
        know that seeking the advice of a professional is your best option. If
        that is not an option accessible to you, another good option is to just
        submit an appeal if you can afford the time. Appeals are extremely
        successful on average, and it usually doesn't hurt to try aside from the time
        committment. If you are concerned that the chance of success
        in your particular case is too low to be worth your time, consider using
        our tool to see if it will convince you otherwise!`,
        `Just enter a brief description of your situation, and you'll be given a prediction
        for the likelihood that your denial would get overturned if you sought all levels
        of appeal available to you.`,
      ],
    },
    {
      question: "What are you doing with the data I submit?",
      answer: [
        `Absolutely nothing! We take privacy and opt-out-by-default extremely seriously.
        In fact, this tool is almost purely local, and offline first.`,
        `This means
        that it primarily functions on your computer, without communicating externally. There are exactly two
        types of data transfer involved when you use this site.`,
        `First, when you load the page and enter a case  or
        select a pre-built one, one of our models is actually downloaded to your computer to use in your browser. You
        will see a loading widget while this download occurs.`,
        `Second, our site collects usage statistics telling us how many
        people view the site each day, and what countries their IPs originate from.`,
        `That is it. There is no more data transfer. 
        In particular, 0% of the text you enter into this tool ever leaves your device. You can test that the functionality
        does not rely on us collecting your data as follows. Select 'Manual Entry' from the dropdown, which will trigger the model download. Then
        leave the webpage up on your browser, but turn off your internet connection. You will see that the tool still works, because it
        relies on no extra data transfer to the internet.`,
      ],
    },
    {
      question: "How was this trained?",
      answer: [
        `The model we use to predict case overturn outcomes was trained on data we curated from
        historical case adjudications in numerous markets. These adjudications correspond to independent medical reviews.
        We intend to open source the curated dataset with the release of an associated research paper, in late fall 2024.`,
      ],
    },
    {
      question: "Is this tool biased?",
      answer: [
        `Yes, it most certainly is. You should be aware of this bias to inform your use.
        While we lack the information necessary to completely understand all bias baked into this tool, one important
        type of bias worth noting is that this tool was trained on historical outcomes, and has been trained to predict what
        will happen in reality, not what should happen in an ideal reality.`,
        `While we aim to predict the expected outcome well,
        this expected outcome in itself reflects bias! You should never use this tool in any way that assumes it
        is instead predicting whether an appeal should or ought to be overturned. This is not problem the model
        was designed to address, and using this model for that problem runs the grave risk of propagating
        harmful, existing bias.`,
      ],
    },
    {
      question: "How can I use this tool responsibly?",
      answer: [
        `We recommend using this tool with an informed view of its bias, limitations, and risks,
        and making assessments of its claims with an eye towards qualified trust. That means that you should
        qualify the level of trust you place in its outputs by the risk of harm of inaccurate outputs.`,
        `For example, if the worst
        case scenario for your use case is that you waste hours submitting an appeal because the model convinces you to appeal, 
        and you were planning on not appealing otherwise, that relatively inconsequential risk may mean you
        can trust the model to inform such use rather blindly.`,
        `On the other hand, if the worst case scenario for your use case is that you will advise a patient, in an automated way, to not appeal
        based on the model outputs, potentially
        jeopardizing their financial or physical wellbeing compared to if they did appeal, you ought to place very little trust in the
        model! Doing so poses too grave a risk to be done without extremely thorough model performance evaluations,
        which we have not yet developed.`,
      ],
    },
    {
      question: `This tool says there is a good chance I can get my denial overturned.
      How do I appeal my denial?
      `,
      answer: [
        `There are many resources that can help you understand how to appeal a denial. Typically the process involves access to
        an appeal process that your insurer administers, and a subsequent one that an independent review entity administers.
        As a starting point, you can take a look at <a style="color: #FB7185; text-decoration: underline;" href=https://drive.google.com/file/d/1cGPjPudmnFJUbunTAtg_b6OrDfgOMqWo/view>this primer</a>.`,
        `We also help people navigate these processes, for free. Feel free to reach out to <a href="mailto:info@persius.org" style="color: #FB7185; text-decoration: underline;">info@persius.org</a>.`,
      ],
    },
    {
      question: `Why was this created?
      `,
      answer: [
        `<a href="https://persius.org" style="color: #FB7185; text-decoration: underline;">Persius</a> is an organization that builds AI to help people resolve
        inappropriate health insurance coverage denials, and provides human
        support in such cases for free. In helping to resolve over $275,000 In
        inappropriate denials at zero cost since our formation, we've learned a thing or two about
        some of the most problematic insurance related barriers jeopardizing
        people's access to care.`,
        `One of those barriers is simply a lack of knowledge about the recourse
        one can seek when facing a denial. Many people either do not know that
        they have appeal rights, or believe that the chance of success is
        extremely low. This is a self-help tool that can empower patients, case
        workers, and advocates to get a rough sense for the likelihood that
        their denial could be overturned, if it were appealed to the level of an
        external review.`,
        `It can also help case workers managing large volumes of requests
        for help triage cases, and focus
        on denials which seem very likely to be inappropriate. This is a problem we have some experience with :)`,
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 mt-36">
      <h2 className="text-2xl font-bold mb-6 text-slate-400 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="w-full border border-slate-400 p-4 rounded-lg shadow"
          >
            <button
              className="w-full text-left flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <span className="w-full font-bold text-slate-400">
                {faq.question}
              </span>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  open === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div className={`mt-2 ${open === index ? "" : "hidden"}`}>
              <br />
              {faq.answer.map((answer, index) => (
                <div key={index} className="text-slate-400">
                  <p dangerouslySetInnerHTML={{ __html: answer }}></p>
                  <br />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(null);
  const [input, setInput] = useState("");

  const introFlow = [
    {
      id: "question1",
      text: "Have you had a pre-authorization request or claim for coverage denied?",
      responses: [
        { answer: "Yes", next: "question2" },
        { answer: "No", next: "message1" },
      ],
    },
    {
      id: "message1",
      message:
        "This tool is meant to support those facing coverage denials. Please see the FAQ for more info.",
      next: "questionsComplete",
    },
    {
      id: "question2",
      text: "Is attaining coverage critical to your physical or financial wellbeing?",
      responses: [
        {
          answer: "Yes",
          next: "message2",
        },
        { answer: "No", next: "statement3" },
      ],
    },
    {
      id: "message2",
      message: `You should seek the support of human experts, and consider filing an
          appeal of the decision. We suggest you do not use our automated tool to make any
          decisions, as it is an imperfect AI model and in your specific case the risk of harm from bad model outputs outweighs the potential benefits. If you need help navigating
          next steps, reach out to us at info@persius.org`,
      next: "questionsComplete",
    },
    {
      id: "statement3",
      text: `You can use our tool to help estimate the likelihood that your denial would be overturned, were you to appeal it. Our general
      advice is to appeal if you have the time and resources, as appeals are often overturned. If you are considering forgoing an appeal because you
      believe it is unlikely to be successful, use our model to update that belief.`,
      responses: [
        {
          answer: "Ok",
          next: "questionsComplete",
        },
      ],
    },
  ];

  // Create a reference to the worker object.
  const worker = useRef(null);

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "initiate":
          setReady(false);
          break;
        case "ready":
          setReady(true);
          break;
        case "complete":
          setResult(e.data.output);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  const classify = useCallback((text) => {
    if (worker.current) {
      worker.current.postMessage({ text });
    }
  }, []);

  const [introState, setIntroState] = useState("question1");

  const currentStep = introFlow.find((step) => step.id === introState);

  const handleResponse = (nextState) => {
    setIntroState(nextState);
  };

  const renderIntroFlow = () => {
    if (!currentStep) return null;

    if (currentStep.text) {
      return (
        <div className="max-w-lg mx-auto bg-slate-400 shadow-lg rounded-lg p-6 text-center">
          <p className="text-lg font-medium text-gray-700 mb-4">
            {currentStep.text}
          </p>
          {currentStep.responses.map((response, index) => (
            <button
              key={index}
              className={`mx-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition duration-200`}
              onClick={() => handleResponse(response.next)}
            >
              {response.answer}
            </button>
          ))}
        </div>
      );
    }

    if (currentStep.message) {
      return (
        <div className="max-w-lg mx-auto bg-slate-400 shadow-lg rounded-lg p-6 text-center">
          <p className="text-lg font-medium text-gray-700">
            {currentStep.message}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="flex flex-col items-center mt-24 mb-24 px-8">
      <h1 className="text-5xl font-bold mb-8 text-slate-600 text-center">
        Appeal Overturn Predictor
      </h1>
      <h3 className="text-lg mb-12 text-slate-400 text-center">
        {" "}
        A{" "}
        <a
          className="underline text-rose-400 hover:text-rose-500 transition duration-200"
          href="https://persius.org"
        >
          Persius
        </a>{" "}
        product.
      </h3>

      {/* <h2 className="flex-auto w-[85vw] text-2xl mb-8 font-bold text-slate-400 text-center">
        100% local. No text leaves your device.
      </h2> */}

      {introState !== "questionsComplete" && renderIntroFlow()}

      {introState === "questionsComplete" && (
        <>
          <h2 className="w-[85vw] text-2xl mt-2 mb-8 font-bold text-slate-500 text-center">
            Enter A Description Of Your Denial Situation
          </h2>

          <select
            className="m-4 input-xl w-[85vw] p-4 max-w-lg h-full bg-gray-800 border border-gray-1000 text-white-100 rounded mb-4"
            defaultValue="default"
            onChange={(e) => {
              setInput(e.target.value);
              classify(e.target.value);
            }}
          >
            <option disabled value="default">
              Example Case Summaries
            </option>
            <option key="none" value="">
              Manual Entry
            </option>
            {sampleSummaries.map((obj, index) => (
              <option key={index} value={obj.summary}>
                {obj.title}
              </option>
            ))}
          </select>
          {/* TOOD: limit input chars, ensure tokenizer truncates. */}
          <textarea
            rows="8"
            className="m-4 input-xl w-[85vw] p-4 max-w-lg h-full bg-gray-800 border border-gray-1000 text-white-100 rounded mb-4 resize-none"
            placeholder="Enter case description here"
            maxLength="2000"
            value={input}
            onInput={(e) => {
              setInput(e.target.value);
              classify(e.target.value);
            }}
          />
        </>
      )}

      {ready !== null && (
        <pre
          className={`mx-2 mt-8 bg-gray-800 text-white-100 p-2 border-gray-900 rounded border-8 ${
            result !== null
              ? // ? getColorFromOverturnLiklihood(result["overturn_likelihood"])
                // getColorFromProbs(result["output_probs"])
                getColorFromDecision(result)
              : ""
          }`}
        >
          {(() => {
            if (!ready || !result) {
              return (
                <div className="loading-container">
                  <p>Downloading model, please wait.</p>
                  <p>This should take at most 10 seconds.</p>
                  <center>
                    <div className="lds-hourglass"></div>
                  </center>
                </div>
              );
            } else if (input.length < 5) {
              return "Enter a case description.";
              // } else if (result["output_probs"][0] > sufficiencyThreshold) {
              //   return "Insufficient or Irrelevant Information";
            } else if (
              result["decision"] === "Insufficient" ||
              result["max_prob"] < maxProbThreshold
            ) {
              return "Insufficient Information For Model";
            } else {
              return JSON.stringify(
                {
                  decision: result["decision"],
                  // overturn_likelihood: `${Math.round(
                  //   result["overturn_likelihood"] * 100,
                  //   2
                  // )}%`,
                  // inference_time: `${
                  //   result["inference_time"].toFixed(3) * 1000
                  // } ms`,
                  confidence: `${Math.round(result["max_prob"] * 100, 2)}%`,
                },
                null,
                2
              );
            }
          })()}
        </pre>
      )}
      <FAQ />
      <p className="wrap mx-4 max-w-xl text-sm mt-16 mb-8 text-slate-400 text-center">
        <b>Disclaimer: </b>This is an informational self-help tool. Its outputs
        should not be interpreted as <i>advice</i> of any kind. You should only
        grant trust to its outputs as qualified by your own explicit risk
        assessment. In particular, if the implications of lack of coverage have
        serious implications for your wellbeing, you should not decide to forgo
        an appeal based on this tool.
      </p>
      <footer>
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <a
            href="https://github.com/TPAFS/overturn-predictor"
            style={{ color: "#FB7185", textDecoration: "underline" }}
          >
            View Source on Github
          </a>
        </div>
      </footer>
    </main>
  );
}
