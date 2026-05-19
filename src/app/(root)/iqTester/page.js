"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_QUESTIONS = 30;
const TEST_TIME = 60 * 15; // 15 minutes
const LOADING_MS = 2500;

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const makeNumericOptions = (answer) => {
  const correct = String(answer);
  const base = Number(answer);

  if (Number.isNaN(base)) {
    return shuffleArray([correct, "12", "18", "24"]);
  }

  const options = new Set([correct]);
  const bumps = [1, 2, 3, 4, 5, 6, 8, 10, 12];

  while (options.size < 4) {
    const bump = bumps[Math.floor(Math.random() * bumps.length)];
    const direction = Math.random() > 0.5 ? 1 : -1;
    options.add(String(base + direction * bump));
  }

  return shuffleArray([...options]);
};

const buildQuestionBank = () => {
  const questions = [];
  let id = 1;

  const add = (category, question, options, answer, explanation) => {
    questions.push({
      id: id++,
      category,
      question,
      options,
      answer: String(answer),
      explanation,
    });
  };

  [
    {
      sequence: [1, 4, 9, 16, 25],
      explanation: "These are square numbers: 1², 2², 3², 4², 5².",
    },
    {
      sequence: [2, 6, 12, 20, 30],
      explanation: "The differences increase by 2 each time: +4, +6, +8, +10.",
    },
    {
      sequence: [3, 8, 15, 24, 35],
      explanation: "The differences go +5, +7, +9, +11.",
    },
    {
      sequence: [5, 11, 19, 29, 41],
      explanation: "The jumps are +6, +8, +10, +12.",
    },
    {
      sequence: [2, 5, 10, 17, 26],
      explanation: "The jumps are +3, +5, +7, +9.",
    },
    {
      sequence: [1, 2, 4, 7, 11],
      explanation: "The differences grow by 1 each time: +1, +2, +3, +4.",
    },
    {
      sequence: [4, 7, 13, 22, 34],
      explanation: "The increases are +3, +6, +9, +12.",
    },
    {
      sequence: [10, 20, 35, 55, 80],
      explanation: "The differences are +10, +15, +20, +25.",
    },
    {
      sequence: [6, 12, 24, 48, 96],
      explanation: "Each number is doubled.",
    },
    {
      sequence: [11, 22, 44, 88, 176],
      explanation: "Each number is doubled.",
    },
    {
      sequence: [2, 3, 5, 8, 13],
      explanation:
        "This is the Fibonacci pattern: each term is the sum of the previous two.",
    },
    {
      sequence: [9, 16, 25, 36, 49],
      explanation: "These are square numbers: 3², 4², 5², 6², 7².",
    },
  ].forEach(({ sequence, explanation }) => {
    add(
      "Pattern Recognition",
      `${sequence.slice(0, 4).join(", ")}, ?`,
      makeNumericOptions(sequence[4]),
      sequence[4],
      explanation,
    );
  });

  [
    {
      question:
        "If all cats are animals, and some animals are black, can we say all cats are black?",
      options: ["Yes", "No", "Maybe", "Always"],
      answer: "No",
      explanation:
        "The statement only says some animals are black, not all cats. So we cannot conclude that all cats are black.",
    },
    {
      question:
        "A clock shows 6:20. What is the approximate angle between the hands?",
      options: ["50°", "60°", "70°", "90°"],
      answer: "70°",
      explanation:
        "At 6:20, the hour hand is a bit past 6 and the minute hand is on 4, which puts the angle around 70 degrees.",
    },
    {
      question:
        "If 2 workers build 2 walls in 2 hours, how many walls can 4 workers build in 2 hours?",
      options: ["2", "4", "6", "8"],
      answer: "4",
      explanation:
        "If 2 workers make 2 walls in 2 hours, then each worker makes 1 wall in 2 hours. So 4 workers make 4 walls.",
    },
    {
      question: "Which one does not belong?",
      options: ["Triangle", "Square", "Circle", "Cube"],
      answer: "Cube",
      explanation:
        "Triangle, square, and circle are 2D shapes. A cube is 3D, so it is different.",
    },
    {
      question: "If today is Wednesday, what day will it be 10 days later?",
      options: ["Friday", "Saturday", "Sunday", "Monday"],
      answer: "Saturday",
      explanation:
        "10 days later means 3 days after Wednesday, because 10 mod 7 = 3. Wednesday + 3 = Saturday.",
    },
    {
      question:
        "A shirt costs 40 and is discounted by 25%. What is the sale price?",
      options: ["20", "25", "30", "35"],
      answer: "30",
      explanation:
        "25% of 40 is 10. Subtract 10 from 40 and the sale price is 30.",
    },
    {
      question: "If x = 3 and y = 2, what is 2x + 3y?",
      options: ["10", "11", "12", "13"],
      answer: "12",
      explanation: "Substitute the values: 2(3) + 3(2) = 6 + 6 = 12.",
    },
    {
      question: "A rectangle has length 8 and width 3. What is its area?",
      options: ["11", "18", "21", "24"],
      answer: "24",
      explanation: "Area of a rectangle = length × width, so 8 × 3 = 24.",
    },
    {
      question:
        "If a train covers 150 km in 2.5 hours, what is its average speed?",
      options: ["50 km/h", "55 km/h", "60 km/h", "75 km/h"],
      answer: "60 km/h",
      explanation: "Speed = distance ÷ time. 150 ÷ 2.5 = 60 km/h.",
    },
    {
      question: "Which statement is true?",
      options: [
        "2 kg of cotton is lighter than 2 kg of steel",
        "2 kg of cotton is heavier than 2 kg of steel",
        "They weigh the same",
        "Cannot tell",
      ],
      answer: "They weigh the same",
      explanation:
        "A kilogram is a kilogram no matter what the material is. The mass is the same.",
    },
  ].forEach((item) =>
    add("Logic", item.question, item.options, item.answer, item.explanation),
  );

  [
    ["17 × 6 = ?", 102, "17 × 6 = 102."],
    ["48 ÷ 6 + 7 = ?", 15, "48 ÷ 6 = 8, and 8 + 7 = 15."],
    ["25 × 4 - 7 = ?", 93, "25 × 4 = 100, and 100 - 7 = 93."],
    ["9 × 9 - 8 = ?", 73, "9 × 9 = 81, and 81 - 8 = 73."],
    ["144 ÷ 12 + 5 = ?", 17, "144 ÷ 12 = 12, and 12 + 5 = 17."],
    ["18 + 24 ÷ 3 = ?", 26, "24 ÷ 3 = 8, and 18 + 8 = 26."],
    ["7 × 8 + 6 = ?", 62, "7 × 8 = 56, and 56 + 6 = 62."],
    ["63 - 17 = ?", 46, "63 - 17 = 46."],
    ["11 × 7 = ?", 77, "11 × 7 = 77."],
    ["96 ÷ 8 = ?", 12, "96 ÷ 8 = 12."],
    ["14 + 5 × 3 = ?", 29, "5 × 3 = 15, and 14 + 15 = 29."],
    ["50 - 18 + 4 = ?", 36, "50 - 18 = 32, and 32 + 4 = 36."],
  ].forEach(([question, answer, explanation]) =>
    add("Math", question, makeNumericOptions(answer), answer, explanation),
  );

  [
    {
      question: "Which word is closest to quick?",
      options: ["Slow", "Rapid", "Heavy", "Calm"],
      answer: "Rapid",
      explanation: "Rapid means very fast, which is closest to quick.",
    },
    {
      question: "Which word is closest to brave?",
      options: ["Fearful", "Bold", "Tired", "Plain"],
      answer: "Bold",
      explanation: "Bold describes someone who is brave or fearless.",
    },
    {
      question: "Which word is the opposite of visible?",
      options: ["Clear", "Hidden", "Bright", "Loud"],
      answer: "Hidden",
      explanation: "Visible means able to be seen. Hidden is the opposite.",
    },
    {
      question: "Which one is the odd one out?",
      options: ["Novel", "Poem", "Essay", "Banana"],
      answer: "Banana",
      explanation:
        "Novel, poem, and essay are written forms. Banana is a fruit.",
    },
    {
      question: "Which word is closest to tiny?",
      options: ["Small", "Huge", "Wide", "Tall"],
      answer: "Small",
      explanation: "Tiny means very small.",
    },
    {
      question: "Which word is the opposite of careful?",
      options: ["Slow", "Cautious", "Careless", "Quiet"],
      answer: "Careless",
      explanation: "Careless means not careful.",
    },
  ].forEach((item) =>
    add("Verbal", item.question, item.options, item.answer, item.explanation),
  );

  return questions;
};

const questionBank = buildQuestionBank();

const getIqLabel = (iq) => {
  if (iq <= 30) return "Dumb Rabbit";
  if (iq <= 70) return "Learning Mode";
  if (iq <= 110) return "Smart Spark";
  if (iq <= 170) return "Incredible Smart";
  return "Brilliant Beast";
};

const getRawScore = ({
  correct,
  wrong,
  skipped,
  timeSpent,
  totalQuestions,
}) => {
  const accuracy = correct / totalQuestions;
  const attemptRate = (correct + wrong) / totalQuestions;

  // More balanced than the old version:
  // - rewards correctness strongly
  // - lightly rewards finishing faster
  // - punishes wrong/skipped answers, but not too brutally
  const accuracyScore = accuracy * 120;
  const attemptScore = attemptRate * 15;
  const speedScore = clamp((900 - timeSpent) / 45, 0, 15);
  const wrongPenalty = wrong * 2.25;
  const skipPenalty = skipped * 1.6;

  return (
    40 + accuracyScore + attemptScore + speedScore - wrongPenalty - skipPenalty
  );
};

const calculateFinalResult = ({ responses, questions, timeLeft }) => {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  responses.forEach((response, index) => {
    const answer = questions[index]?.answer;

    if (response === null || response === undefined) {
      skipped += 1;
      return;
    }

    if (String(response) === String(answer)) {
      correct += 1;
    } else {
      wrong += 1;
    }
  });

  const timeSpent = clamp(TEST_TIME - timeLeft, 0, TEST_TIME);
  const rawScore = getRawScore({
    correct,
    wrong,
    skipped,
    timeSpent,
    totalQuestions: questions.length,
  });

  const iq = clamp(Math.round(rawScore), 0, 200);

  return {
    correct,
    wrong,
    skipped,
    timeSpent,
    iq,
    label: getIqLabel(iq),
  };
};

const Page = () => {
  const router = useRouter();

  const shuffledQuestions = useMemo(
    () => shuffleArray(questionBank).slice(0, TOTAL_QUESTIONS),
    [],
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [responses, setResponses] = useState(
    Array(TOTAL_QUESTIONS).fill(undefined),
  );
  const [timeLeft, setTimeLeft] = useState(TEST_TIME);
  const [phase, setPhase] = useState("quiz");
  const [nextError, setNextError] = useState(false);
  const [result, setResult] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  const question = shuffledQuestions[currentQuestion];

  const finishQuiz = () => {
    if (phase !== "quiz") return;
    const finalResult = calculateFinalResult({
      responses,
      questions: shuffledQuestions,
      timeLeft,
    });
    setResult(finalResult);
    setPhase("calculating");
  };

  useEffect(() => {
    if (phase !== "quiz") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (timeLeft > 0) return;
    finishQuiz();
  }, [timeLeft, phase]);

  useEffect(() => {
    if (phase !== "calculating") return;

    const timeout = setTimeout(() => {
      setPhase("results");
    }, LOADING_MS);

    return () => clearTimeout(timeout);
  }, [phase]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  const saveAndAdvance = (valueToStore) => {
    if (phase !== "quiz") return;

    const updated = [...responses];
    updated[currentQuestion] = valueToStore;
    setResponses(updated);
    setSelected(null);
    setNextError(false);

    if (currentQuestion + 1 >= shuffledQuestions.length) {
      const finalResult = calculateFinalResult({
        responses: updated,
        questions: shuffledQuestions,
        timeLeft,
      });
      setResult(finalResult);
      setPhase("calculating");
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
  };

  const handleNext = () => {
    if (phase !== "quiz") return;

    if (!selected) {
      setNextError(true);
      return;
    }

    saveAndAdvance(selected);
  };

  const handleSkip = () => {
    if (phase !== "quiz") return;
    saveAndAdvance(null);
  };

  const closeResults = () => {
    router.push("/");
  };

  const openReview = () => {
    setReviewIndex(0);
    setPhase("review");
  };

  const currentReviewQuestion = shuffledQuestions[reviewIndex];
  const currentReviewAnswer = responses[reviewIndex];
  const isCorrectReview =
    currentReviewAnswer !== null &&
    currentReviewAnswer !== undefined &&
    String(currentReviewAnswer) === String(currentReviewQuestion?.answer);

  if (phase === "calculating") {
    return (
      <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
        <section className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <h1 className="mt-8 text-4xl font-bold">Calculating IQ...</h1>
          <p className="mt-3 text-white/50">
            Measuring answers, skips, mistakes, and speed.
          </p>
        </section>
      </main>
    );
  }

  if (phase === "results") {
    const r = result ?? {
      correct: 0,
      wrong: 0,
      skipped: TOTAL_QUESTIONS,
      timeSpent: TEST_TIME,
      iq: 0,
      label: "Dumb Rabbit",
    };

    return (
      <main className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm text-white flex items-center justify-center px-6">
        <section className="relative w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#0f172a] p-10 text-center shadow-2xl">
          <button
            onClick={closeResults}
            aria-label="Close results"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-2xl leading-none text-white/80 hover:bg-white/10 hover:text-white"
          >
            ×
          </button>

          <p className="text-white/50 uppercase tracking-[0.2em] text-sm">
            Test Finished
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">{r.label}</h1>

          <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-4xl font-bold">Approximate IQ: {r.iq}</h2>
            <p className="mt-3 text-white/50">
              This is an estimate, not a real IQ test.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-white/50 text-sm">Correct</p>
              <p className="mt-1 text-2xl font-bold">{r.correct}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-white/50 text-sm">Wrong</p>
              <p className="mt-1 text-2xl font-bold">{r.wrong}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-white/50 text-sm">Skipped</p>
              <p className="mt-1 text-2xl font-bold">{r.skipped}</p>
            </div>
          </div>

          <p className="mt-6 text-sm text-white/40">
            Finished in {Math.floor(r.timeSpent / 60)}:
            {String(r.timeSpent % 60).padStart(2, "0")}.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openReview}
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-medium hover:bg-white/10 transition"
            >
              Review Answers
            </button>
            <button
              onClick={closeResults}
              className="rounded-2xl bg-white text-black px-8 py-4 font-medium hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "review") {
    const q = currentReviewQuestion;
    const userAnswer = currentReviewAnswer;
    const answerIsCorrect =
      userAnswer !== null &&
      userAnswer !== undefined &&
      String(userAnswer) === String(q?.answer);

    return (
      <main className="min-h-screen bg-[#0f172a] text-white px-6 py-10 flex items-center justify-center">
        <section className="w-full max-w-4xl rounded-[30px] border border-white/10 bg-white/5 p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-white/50 text-sm">
                Review {reviewIndex + 1} of {shuffledQuestions.length}
              </p>
              <h1 className="text-3xl font-bold">Answer Review</h1>
            </div>
            <button
              onClick={closeResults}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10 transition"
            >
              Done
            </button>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#0b1220] p-6 md:p-8">
            <p className="text-white/40 uppercase tracking-[0.2em] text-sm mb-3">
              {q.category}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              {q.question}
            </h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((option, index) => {
                const isCorrect = String(option) === String(q.answer);
                const isSelected = String(option) === String(userAnswer);
                const baseClass =
                  "rounded-2xl border px-5 py-4 text-left text-base md:text-lg transition";

                const styleClass = isCorrect
                  ? "border-green-400 bg-green-500/15 text-green-200"
                  : isSelected
                    ? "border-red-400 bg-red-500/15 text-red-200"
                    : "border-white/10 bg-white/5 text-white/80";

                return (
                  <div key={index} className={`${baseClass} ${styleClass}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span>{option}</span>
                      {isCorrect ? (
                        <span className="text-green-300 text-sm font-semibold">
                          Correct
                        </span>
                      ) : isSelected ? (
                        <span className="text-red-300 text-sm font-semibold">
                          Your pick
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-white/50 text-sm">Your Answer</p>
                <p className="mt-1 text-lg font-semibold">
                  {userAnswer === null || userAnswer === undefined
                    ? "Skipped"
                    : String(userAnswer)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-white/50 text-sm">Correct Answer</p>
                <p className="mt-1 text-lg font-semibold text-green-300">
                  {String(q.answer)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-white/50 text-sm">Why this is correct</p>
              <p className="mt-2 text-white/90 leading-relaxed">
                {q.explanation}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                onClick={() => setReviewIndex((prev) => Math.max(prev - 1, 0))}
                disabled={reviewIndex === 0}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
              >
                Previous
              </button>

              <div className="text-sm text-white/50 text-center">
                {answerIsCorrect
                  ? "You got this one right."
                  : "This one was missed or skipped."}
              </div>

              <button
                onClick={() =>
                  setReviewIndex((prev) =>
                    Math.min(prev + 1, shuffledQuestions.length - 1),
                  )
                }
                disabled={reviewIndex === shuffledQuestions.length - 1}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!question) return null;

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-10 flex items-center justify-center">
      <section className="w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-white/50 text-sm">
              Question {currentQuestion + 1} of {shuffledQuestions.length}
            </p>
            <h1 className="text-2xl font-bold">IQ Challenge</h1>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 px-6 py-3 text-right">
            <p className="text-sm text-white/50">Time Left</p>
            <h2 className="text-xl font-semibold">
              {minutes}:{String(seconds).padStart(2, "0")}
            </h2>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mb-10">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-white rounded-full transition-all duration-500"
          />
        </div>

        <div
          className={`rounded-[30px] border p-8 ${nextError ? "border-red-400 bg-red-500/10" : "border-white/10 bg-white/5"}`}
        >
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm mb-4">
            {question.category}
          </p>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            {question.question}
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelected(option);
                  setNextError(false);
                }}
                className={`rounded-2xl border px-6 py-5 text-left text-lg transition-all duration-200 ${
                  selected === option
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {nextError ? (
            <p className="mt-4 text-sm text-red-300">
              Pick an answer or press Skip.
            </p>
          ) : (
            <p className="mt-4 text-sm text-white/40">
              You must choose an answer before Next.
            </p>
          )}

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              onClick={handleSkip}
              className="text-white/50 hover:text-white transition"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className={`rounded-2xl px-7 py-3 font-medium transition hover:scale-105 ${nextError ? "bg-red-500 text-white" : "bg-white text-black"}`}
            >
              Next Question
            </button>
          </div>
        </div>

        <div className="mt-8">
          <a className="px-16 py-3 border rounded-md" href="/">
            Return Home
          </a>
        </div>
      </section>
    </main>
  );
};

export default Page;
