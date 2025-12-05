import { LIBRE_QUIZ } from "../data/quiz";

export const evaluateQuiz = (answers: Record<string, string>) => {
  const total = LIBRE_QUIZ.length;
  const details = LIBRE_QUIZ.map((question) => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.answer;
    return { ...question, userAnswer, isCorrect };
  });
  const score = details.filter((item) => item.isCorrect).length;
  return { score, total, details };
};

export const MIN_BADGE_SCORE = 4;
