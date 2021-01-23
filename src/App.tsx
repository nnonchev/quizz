import React, { useState } from "react";
import { Difficulty, fetchQuizzQuestions, QuestionState } from "./API";
import QuestionCard from "./components/QuestionCard";
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correctAnswer: string;
  correct: boolean;
};

const TOTAL_QUESTIONS: number = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [answers, setAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startQuizz = async () => {
    setLoading(true);
    setGameOver(false);

    const questions = await fetchQuizzQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(questions);
    setScore(0);
    setAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;

      if (correct) {
        setScore((prev) => prev + 1);
      }

      const answerObj: AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };

      setAnswers((prev) => [...prev, answerObj]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  const startBtn = (
    <button className="start" onClick={startQuizz}>
      Start Quizz
    </button>
  );

  const scoreSpan = <p className="score">Score: {score}</p>;

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>Quizz</h1>
        {gameOver || answers.length === TOTAL_QUESTIONS ? startBtn : null}
        {!gameOver ? scoreSpan : null}
        {loading && <p>Loading questions...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={number + 1}
            questionsLength={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={answers ? answers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        answers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
