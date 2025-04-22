"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { GradientText } from "./components/GradientText";
import { Title } from "./components/Title";

function getColorFromDecision(result) {
  if (result["decision"] === "Overturned") {
    return "border-x-teal-500";
  } else if (result["decision"] === "Upheld") {
    return "border-x-amber-500";
  } else {
    return "border-x-zinc-500";
  }
}

const sampleSummaries = [
  {
    title: "Stomach Cancer Chemotherapy",
    summary: `This patient has extensive and inoperable carcinoma of the stomach. He was started on chemotherapy with Xeloda and Oxaliplatin, because he has less nausea with Oxaliplatin than with the alternative, Cisplatin. Oxaliplatin was denied as experimental for treatment of his gastric cancer.`,
  },
  // {
  //   title: "Non-small cell Lung Cancer Diagnostics",
  //   summary:
  //     "This is a male patient with a medical history of advanced metastatic non-small cell lung cancer (NSCLC) with metastatic disease. FoundationOne CDx Lab test was ordered by the patient's treating physician because the test results were needed to help determine the course of treatment for the patient's advanced cancer. ",
  // },
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
  // {
  //   title: "ER Visit for Chest Pain",
  //   summary:
  //     "I have coronary artery disease, and was experiencing persistent chest pain for a week. I was sent to the ER by my cardiologist. While there I had a cardiac catheterization with coronary angiography showing severe left anterior descending coronary artery disease. I had a successful coronary intervention, and was admitted as an inpatient, then discharged later that day.",
  // },
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
        chance of success. This is actually <a style="color: #6F495C; text-decoration: underline;" href=https://blog.persius.org/investigations/claims_denials>far from true</a>. `,
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
      question: `Why was this created?
      `,
      answer: [
        `<a href="https://persius.org" style="color: #6F495C; text-decoration: underline;">Persius</a> is an organization that builds AI to help people resolve
        inappropriate health insurance coverage denials, and provides human
        support in such cases for free. In helping to resolve over $580,000 in
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
        `A cornerstone of our organizational thesis is that insurers administer inappropriate denials
        because they have a strong, robust financial incentive to do so. We have studied the data <a href="https://blog.persius.org/investigations/claims_denials" style="color: #6F495C; text-decoration: underline;">extensively</a>,
        and know that scaling appeal utilization from it's historical level of between .1 to 1% to higher
        levels, say 10 to 50%, would completely alter the calculus that makes it financially viable to inappropriately deny
        at scale.
        Our mission is to use AI to help achieve this appeal utilization outcome, and thereby eradicate systematic inappropriate denials through
        collective action. Our hope is that this tool encourages many who thought their denials were lost causes to pursue appeals.`,
        `This tool can also help case workers managing large volumes of requests
        for help triage cases, and focus
        on denials which seem very likely to be inappropriate.`,
      ],
    },
    {
      question: `This tool says there is a good chance I can get my denial overturned.
      How do I appeal my denial?
      `,
      answer: [
        `There are many resources that can help you understand how to appeal a denial.`,
        `Typically one has access to
        an appeal process that their insurer administers, and a subsequent one that an independent review entity administers. The details vary
        by insurance type and jurisdiction.
        If you don't know what an appeal is and are confused about what the process looked like, as a high level starting point, we recommend taking a look at this friendly <a style="color: #6F495C; text-decoration: underline;" href=https://drive.google.com/file/d/1cGPjPudmnFJUbunTAtg_b6OrDfgOMqWo/view>primer</a> to get
        a sense for what's involved. Healthcare.gov also some <a style="color: #6F495C; text-decoration: underline;" href="https://www.healthcare.gov/marketplace-appeals/appeal-forms/">introductory material</a> for federal marketplace plans.`,
        `We also help people navigate these processes, for free. Feel free to reach out to <a href="mailto:info@persius.org" style="color: #6F495C; text-decoration: underline;">info@persius.org</a>.`,
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
        `The model we use to predict appeal overturn likelihood was trained on data we constructed from
        historical case adjudications in numerous insurance markets. The adjudications are from independent medical reviews.
        We permissively released an <a style="color: #6F495C; text-decoration: underline;" href="https://github.com/TPAFS/hicric">unlabeled corpus</a>, and the training data we constructed, in late 2024.`,
        `Our hope is that by open sourcing our work we will empower other community AI efforts aiming to support patients, which we believe can help drive collective action and systemic change. You can read more about the 
        technical aspects of the data pipelines and models in our <a style="color: #6F495C; text-decoration: underline;" href="https://drive.google.com/file/d/1vsu0Ns6R6AeTX4-Hf2OdYqRvHD4yNm4y/view">preprint</a>.`,
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
        is instead predicting whether an appeal should or ought to be overturned. This is not the problem the model
        was designed to address, and using this model for that problem runs the grave risk of propagating
        harmful, existing bias. As a simple example, try swapping 'male' with 'female' in some of the preloaded examples.`,
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
      id: "initial",
      text: [
        "This tool helps predict the likelihood of success when appealing an insurance denial. Get data-driven insights based on historical appeal outcomes.",
      ],
      responses: [{ answer: "Start Assessment", next: "pre_auth_question" }],
    },
    {
      id: "pre_auth_question",
      title: "Coverage Denial",
      stepNumber: 1,
      text: [
        "Have you had a pre-authorization request or claim for coverage denied?",
      ],
      options: ["Yes", "No"],
      responses: [
        { answer: "Back", next: "initial", secondary: true },
        { answer: "Continue", next: "urgent_question", primary: true },
      ],
      optionActions: {
        Yes: "urgent_question",
        No: "message1",
      },
    },
    {
      id: "message1",
      message: [
        "This tool is meant to support those facing coverage denials. Please see the FAQ for more info.",
      ],
      responses: [
        { answer: "Return to Start", next: "initial", secondary: true },
      ],
    },
    {
      id: "urgent_question",
      title: "Urgency Assessment",
      stepNumber: 2,
      text: [
        "Is attaining coverage critical to your physical or financial well being?",
      ],
      options: ["Yes", "No"],
      responses: [
        { answer: "Back", next: "pre_auth_question", secondary: true },
        { answer: "Continue", next: "question1", primary: true },
      ],
      optionActions: {
        Yes: "message2",
        No: "statement3",
      },
    },
    {
      id: "message2",
      message: [
        "You should seek human support, and consider filing an appeal.",
        "We suggest you do <b>not</b> use our automated tool to make any decisions, as it is an imperfect AI model and in your situation the risk of harm from bad model outputs outweighs the potential benefits.",
        'If you need help with next steps, reach out to us at <a href="mailto:info@persius.org" style="color: #6F495C; text-decoration: underline;">info@persius.org</a>. We help people with coverage denials for free.',
      ],
      responses: [
        { answer: "Return to Start", next: "initial", secondary: true },
        { answer: "Continue Anyway", next: "question1", primary: true },
      ],
    },
    {
      id: "statement3",
      title: "Information",
      text: [
        "You can use our tool to help estimate the likelihood that your denial would be overturned, were you to appeal it. Our general advice is to appeal if you have the time and resources, as appeals are often overturned.",
        "If you are considering forgoing an appeal because you believe it is unlikely to be successful, use our model to update that belief.",
      ],
      responses: [{ answer: "Ok, Proceed", next: "question1", primary: true }],
    },
    {
      id: "question1",
      title: "Insurance Type",
      stepNumber: 3,
      text: ["What type of insurance plan are you appealing against?"],
      options: ["Employer", "Marketplace", "Medicare", "Medicaid"],
      responses: [
        { answer: "Back", next: "urgent_question", secondary: true },
        { answer: "Skip", next: "question2", primary: true },
      ],
    },
    {
      id: "question2",
      title: "Denial Reason",
      stepNumber: 4,
      text: ["What was the primary reason for the coverage denial?"],
      options: [
        "Medical Necessity",
        "Experimental/Investigational",
        "Out of Network",
        "Prior Authorization",
        "Other",
      ],
      responses: [
        { answer: "Back", next: "question1", secondary: true },
        { answer: "Skip", next: "question3", primary: true },
      ],
    },
    {
      id: "question3",
      title: "Case Details",
      stepNumber: 5,
      text: ["Do you have any of the following supporting elements?"],
      checkboxes: [
        "Doctor's letter of medical necessity",
        "Peer-reviewed studies supporting the treatment",
        "Second opinion from specialist",
        "Similar cases that were approved",
      ],
      responses: [
        { answer: "Back", next: "question2", secondary: true },
        {
          answer: "Continue to Case Summary",
          next: "questionsComplete",
          primary: true,
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

  const [introState, setIntroState] = useState("initial");

  const currentStep = introFlow.find((step) => step.id === introState);

  const handleResponse = (nextState) => {
    setIntroState(nextState);
  };

  const renderIntroFlowContent = () => {
    if (!currentStep) return null;

    return (
      <div className="w-[85vw] max-w-lg mx-auto bg-gray-900 p-8 border border-gray-800 rounded">
        {/* Initial step (welcome screen) */}
        {currentStep.id === "initial" && (
          <>
            <p className="text-slate-400 mb-8 text-center">
              {currentStep.text}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setIntroState(currentStep.responses[0].next)}
                className="px-6 py-3 bg-gray-800 text-white-100 font-medium rounded border border-gray-1000 hover:bg-gray-700 transition duration-200"
              >
                {currentStep.responses[0].answer}
              </button>
            </div>
          </>
        )}

        {/* Message or info screens */}
        {(currentStep.id === "message1" || currentStep.id === "message2") && (
          <>
            <div className="mb-6">
              {currentStep.message.map((message, idx) => (
                <p
                  key={idx}
                  className="text-slate-400 mb-4 text-center"
                  dangerouslySetInnerHTML={{ __html: message }}
                ></p>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              {currentStep.responses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setIntroState(response.next)}
                  className={`px-4 py-2 mx-2 ${
                    response.primary
                      ? "bg-primary-500 text-white-100 border border-primary-600 hover:bg-primary-400"
                      : "bg-gray-800 text-slate-400 border border-gray-1000 hover:bg-gray-700"
                  } rounded transition duration-200`}
                >
                  {response.answer}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Statement screen */}
        {currentStep.id === "statement3" && (
          <>
            <div className="mb-6">
              {currentStep.text.map((statement, idx) => (
                <p key={idx} className="text-slate-400 mb-4 text-center">
                  {statement}
                </p>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              {currentStep.responses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setIntroState(response.next)}
                  className={`px-4 py-2 ${
                    response.primary
                      ? "bg-primary-500 text-white-100 border border-primary-600 hover:bg-primary-400"
                      : "bg-gray-800 text-slate-400 border border-gray-1000 hover:bg-gray-700"
                  } rounded transition duration-200`}
                >
                  {response.answer}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Numbered question steps with options */}
        {(currentStep.id === "question1" ||
          currentStep.id === "question2" ||
          currentStep.id === "pre_auth_question" ||
          currentStep.id === "urgent_question") && (
          <>
            <div className="flex items-center mb-6">
              <div className="bg-primary-500 text-white-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                {currentStep.stepNumber}
              </div>
              <h3 className="text-xl font-bold text-slate-400">
                {currentStep.title}
              </h3>
            </div>
            <p className="text-slate-400 mb-6">{currentStep.text}</p>
            <div
              className={`grid grid-cols-1 ${
                currentStep.id === "question1" ||
                currentStep.id === "pre_auth_question" ||
                currentStep.id === "urgent_question"
                  ? "md:grid-cols-2"
                  : ""
              } gap-4 mb-8`}
            >
              {currentStep.options.map((option) => (
                <button
                  key={option}
                  className="p-4 bg-gray-800 hover:bg-gray-700 text-white-100 rounded border border-gray-1000 transition duration-200 text-left"
                  onClick={() => {
                    // Use optionActions if available, otherwise use the primary response
                    const nextState =
                      currentStep.optionActions?.[option] ||
                      currentStep.responses.find((r) => r.primary).next;
                    setIntroState(nextState);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              {currentStep.responses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setIntroState(response.next)}
                  className={`px-4 py-2 ${
                    response.primary
                      ? "bg-primary-500 text-white-100 border border-primary-600 hover:bg-primary-400"
                      : "bg-gray-800 text-slate-400 border border-gray-1000 hover:bg-gray-700"
                  } rounded transition duration-200`}
                >
                  {response.answer}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Question with checkboxes */}
        {currentStep.id === "question3" && (
          <>
            <div className="flex items-center mb-6">
              <div className="bg-primary-500 text-white-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                {currentStep.stepNumber}
              </div>
              <h3 className="text-xl font-bold text-slate-400">
                {currentStep.title}
              </h3>
            </div>
            <p className="text-slate-400 mb-6">{currentStep.text}</p>
            <div className="space-y-3 mb-8">
              {currentStep.checkboxes.map((option) => (
                <div
                  key={option}
                  className="flex items-center p-4 bg-gray-800 rounded border border-gray-1000"
                >
                  <input
                    type="checkbox"
                    id={option}
                    className="mr-3 h-5 w-5 accent-primary-500"
                  />
                  <label htmlFor={option} className="text-white-100">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              {currentStep.responses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setIntroState(response.next)}
                  className={`px-4 py-2 ${
                    response.primary
                      ? "bg-primary-500 text-white-100 border border-primary-600 hover:bg-primary-400"
                      : "bg-gray-800 text-slate-400 border border-gray-1000 hover:bg-gray-700"
                  } rounded transition duration-200`}
                >
                  {response.answer}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <header>
        <div className="flex justify-between items-center w-full px-8 py-4 shadow-md">
          {/* Demo banner  */}
          <div className="flex items-center bg-amber-600 text-gray-100 text-sm font-semibold px-4 py-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.29 3.86l-9 16A1 1 0 002 21h18a1 1 0 00.85-1.54l-9-16a1 1 0 00-1.71 0z"
              />
            </svg>
            Demo
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center mt-24 mb-24 px-8">
        <div className="flex flex-col justify-between items-center">
          <Title size="md" className="mb-10">
            <GradientText className="from-slate-400 to-slate-600">
              Appeal Overturn Predictor
            </GradientText>
          </Title>
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="hidden md:block h-auto w-1/3 mx-4" // Adjusts height, keeps aspect ratio
          />
        </div>
        <h3 className="text-lg mt-4 mb-8 text-light text-center">
          {" "}
          Built by{" "}
          <a
            className="underline text-primary-500 hover:text-primary-400 transition duration-200"
            href="https://persius.org"
          >
            Persius.
          </a>{" "}
        </h3>

        {introState !== "questionsComplete" && renderIntroFlowContent()}

        {introState === "questionsComplete" && (
          <div className="text-center flex flex-col items-center">
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
            <textarea
              rows="8"
              className="m-4 input-xl w-[85vw] p-4 max-w-lg h-full bg-gray-800 border border-gray-1000 text-white-100 rounded mb-4 resize-none"
              placeholder="Enter a description of your coverage denial here..."
              maxLength="2000"
              value={input}
              onInput={(e) => {
                setInput(e.target.value);
                classify(e.target.value);
              }}
            />
          </div>
        )}

        {ready !== null && (
          <pre
            className={`mx-2 mt-8 bg-gray-800 text-white-100 p-2 border-gray-900 rounded border-8 ${
              result !== null ? getColorFromDecision(result) : ""
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
              } else if (result["decision"] === "Insufficient Information") {
                return "Insufficient Information For Model";
              } else {
                return JSON.stringify(
                  {
                    decision: result["decision"],
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
          <b>Disclaimer: </b>This is an informational self-help tool. Its
          outputs should not be interpreted as <i>advice</i> of any kind. You
          should only grant trust to its outputs as qualified by your own
          explicit risk assessment. In particular, if the implications of lack
          of coverage have serious implications for your wellbeing, you should
          not decide to forgo an appeal based on this tool.
        </p>
        <footer>
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row text-primary-500">
            <a
              href="https://github.com/TPAFS/overturn-predictor"
              style={{ textDecoration: "underline" }}
            >
              View Source on Github
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
