"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_QUESTIONS = 30;
const TEST_TIME = 60 * 15; // 15 minutes
const LOADING_MS = 2500;
const AUTO_REDIRECT_MS = 6000;

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const makeNumericOptions = (answer) => {
  const correct = String(answer);
  const base = Number(answer);

  if (Number.isNaN(base)) {
    return shuffleArray([correct, "12", "18", "24"]);
  }

  const options = new Set([correct]);
  const bumps = [2, 4, 6, 8, 10, 12];

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

  const add = (category, question, options, answer) => {
    questions.push({
      id: id++,
      category,
      question,
      options,
      answer: String(answer),
    });
  };

  [
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [2, 4],
    [3, 4],
    [6, 2],
    [7, 2],
  ].forEach(([start, mult]) => {
    const a = start;
    const b = a * mult;
    const c = b * mult;
    const d = c * mult;
    const answer = d * mult;
    add(
      "Pattern Recognition",
      `${a}, ${b}, ${c}, ${d}, ?`,
      makeNumericOptions(answer),
      answer,
    );
  });

  [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
  ].forEach(([start, step]) => {
    const a = start;
    const b = a + step;
    const c = b + step;
    const d = c + step;
    const answer = d + step;
    add(
      "Pattern Recognition",
      `${a}, ${b}, ${c}, ${d}, ?`,
      makeNumericOptions(answer),
      answer,
    );
  });

  [
    {
      question: "Which one does not belong?",
      options: ["Apple", "Banana", "Carrot", "Mango"],
      answer: "Carrot",
    },
    {
      question: "If all roses are flowers, are all flowers roses?",
      options: ["Yes", "No", "Maybe", "Impossible"],
      answer: "No",
    },
    {
      question: "If some cats are black, can we say all cats are black?",
      options: ["Yes", "No", "Maybe", "Always"],
      answer: "No",
    },
    {
      question: "Which word is the odd one out?",
      options: ["Chair", "Table", "Spoon", "Bed"],
      answer: "Spoon",
    },
    {
      question: "If today is Monday, what is tomorrow?",
      options: ["Sunday", "Tuesday", "Friday", "Saturday"],
      answer: "Tuesday",
    },
    {
      question: "What comes after a question mark in a sentence?",
      options: ["Period", "Comma", "New sentence", "Nothing"],
      answer: "New sentence",
    },
    {
      question:
        "If A is taller than B and B is taller than C, who is shortest?",
      options: ["A", "B", "C", "All same"],
      answer: "C",
    },
    {
      question: "Which is the smallest unit here?",
      options: ["Minute", "Hour", "Day", "Week"],
      answer: "Minute",
    },
    {
      question: "What is the opposite of hot?",
      options: ["Warm", "Cold", "Dry", "Bright"],
      answer: "Cold",
    },
    {
      question: "Which of these is a fruit?",
      options: ["Potato", "Apple", "Onion", "Carrot"],
      answer: "Apple",
    },
  ].forEach((item) => add("Logic", item.question, item.options, item.answer));

  [
    ["5 × 6 = ?", 30],
    ["12 × 8 = ?", 96],
    ["9 + 7 × 2 = ?", 23],
    ["15 ÷ 3 = ?", 5],
    ["7 × 7 = ?", 49],
    ["100 - 37 = ?", 63],
    ["8 + 8 + 8 + 8 = ?", 32],
    ["6 × 9 = ?", 54],
    ["11 + 14 = ?", 25],
    ["18 ÷ 2 = ?", 9],
    ["4 × 12 = ?", 48],
    ["40 - 19 = ?", 21],
  ].forEach(([question, answer]) =>
    add("Math", question, makeNumericOptions(answer), answer),
  );

  [
    {
      question:
        "A bat and ball cost $1.10 total. The bat costs $1 more. Ball price?",
      options: ["0.10", "0.05", "0.20", "1.00"],
      answer: "0.05",
    },
    {
      question:
        "You see a clock showing 3:15. What is the angle between the hands?",
      options: ["30°", "7.5°", "45°", "60°"],
      answer: "7.5°",
    },
    {
      question: "A train moves 60 km in 1 hour. How far in 3 hours?",
      options: ["120 km", "150 km", "180 km", "200 km"],
      answer: "180 km",
    },
    {
      question:
        "If one notebook costs 20 and two cost 40, what is the price of 3?",
      options: ["50", "55", "60", "65"],
      answer: "60",
    },
    {
      question: "Which is heavier: 1 kg of feathers or 1 kg of iron?",
      options: ["Feathers", "Iron", "Same", "Cannot tell"],
      answer: "Same",
    },
    {
      question:
        "If it takes 5 minutes to boil one egg, how long to boil two eggs together?",
      options: ["5 minutes", "10 minutes", "15 minutes", "2 minutes"],
      answer: "5 minutes",
    },
    {
      question: "A room has 4 corners. How many corners do 3 rooms have?",
      options: ["4", "8", "12", "16"],
      answer: "12",
    },
    {
      question:
        "If a shirt and a hat cost 40 total and the shirt costs 30, how much is the hat?",
      options: ["5", "10", "15", "20"],
      answer: "10",
    },
    {
      question: "A pencil and eraser together cost 12. Pencil costs 9. Eraser?",
      options: ["2", "3", "4", "5"],
      answer: "3",
    },
    {
      question: "If you have 2 apples and get 3 more, how many do you have?",
      options: ["4", "5", "6", "7"],
      answer: "5",
    },
  ].forEach((item) =>
    add("Reasoning", item.question, item.options, item.answer),
  );

  [
    {
      question: "Which word means the same as quick?",
      options: ["Slow", "Fast", "Late", "Heavy"],
      answer: "Fast",
    },
    {
      question: "Which word is closest to brave?",
      options: ["Cowardly", "Strong", "Bold", "Tired"],
      answer: "Bold",
    },
    {
      question: "Which word is the opposite of begin?",
      options: ["Start", "End", "Open", "Move"],
      answer: "End",
    },
    {
      question: "Which one is a color?",
      options: ["Chair", "Blue", "Apple", "River"],
      answer: "Blue",
    },
    {
      question: "Which one is a shape?",
      options: ["Circle", "Orange", "Bread", "Cloud"],
      answer: "Circle",
    },
    {
      question: "Which word is closest to tiny?",
      options: ["Small", "Huge", "Tall", "Wide"],
      answer: "Small",
    },
  ].forEach((item) => add("Verbal", item.question, item.options, item.answer));

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

const getTimeBonus = (spentSeconds) => {
  if (spentSeconds <= 480) return 18;
  if (spentSeconds <= 540) return 14;
  if (spentSeconds <= 600) return 11;
  if (spentSeconds <= 720) return 6;
  if (spentSeconds <= 840) return 2;
  return -8;
};

const calculateFinalResult = ({ responses, questions, timeLeft }) => {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  responses.forEach((response, index) => {
    const answer = questions[index]?.answer;

    if (response === null) {
      skipped += 1;
      return;
    }

    if (response === undefined) {
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
  const accuracy = correct / questions.length;
  const speedBonus = getTimeBonus(timeSpent);

  const smallWrongPenalty = wrong <= 5 ? wrong * 1.2 : 6 + (wrong - 5) * 2.2;
  const hugeWrongPenalty = wrong > 20 ? (wrong - 20) * 4.5 : 0;
  const skipPenalty = skipped * 1.5;

  const rawIq =
    35 +
    accuracy * 95 +
    speedBonus -
    smallWrongPenalty -
    hugeWrongPenalty -
    skipPenalty;

  const iq = clamp(Math.round(rawIq), 0, 200);

  return {
    correct,
    wrong,
    skipped,
    timeSpent,
    iq,
    label: getIqLabel(iq),
  };
};

const page = () => {
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
        if (prev <= 1) {
          return 0;
        }
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

  useEffect(() => {
    if (phase !== "results") return;

    const timeout = setTimeout(() => {
      router.push("/");
    }, AUTO_REDIRECT_MS);

    return () => clearTimeout(timeout);
  }, [phase, router]);

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
      <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
        <section className="w-full max-w-2xl rounded-[30px] border border-white/10 bg-white/5 p-10 text-center">
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

          <button
            onClick={() => router.push("/")}
            className="mt-10 rounded-2xl bg-white text-black px-8 py-4 font-medium hover:scale-105 transition"
          >
            Go Home Now
          </button>
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
      </section>
    </main>
  );
};

export default page;
