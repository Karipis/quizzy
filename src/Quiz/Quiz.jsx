import './Quiz.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { Button } from '@mui/material';
import { PreferencesContext } from '../App';

function Quiz() {
  const [progress, setProgress] = useState(0);
  const [qNumber, setNumberQuestion] = useState(1);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [classAnswers, setClassAnswers] = useState(['', '', '', '']);
  const [question, setQuestion] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const { preferences } = useContext(PreferencesContext);
  const { numberQuestions, category: mappedCategory, difficulty } = preferences ?? {};
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const difficultyMap = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
  };

  const difficultyStr = difficultyMap[difficulty] || 'easy';

  const url = `https://opentdb.com/api.php?amount=${numberQuestions}&category=${mappedCategory}&difficulty=${difficultyStr}&type=multiple`;

useEffect(() => {
  if (data.results && data.results.length === 0) {
    alert("Preferences were not set. Taking you to home screen...");
    navigate('/');
  }
}, [data, navigate]);

  // Progress bar
useEffect(() => {
  if (answered || !questionData) return; // 💡 skip until loaded

  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        showResults();
        clearInterval(interval);
        setFinished(true);
        return 100;
      }
      return prev + 2;
    });
  }, 150);

  return () => clearInterval(interval);
}, [answered, qNumber, questionData]); // add questionData


  // Fetch των ερωτήσεων
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [url]);

  // Φόρτωση τρέχουσας ερώτησης & απαντήσεων
  useEffect(() => {
    console.log(data);
    if (data.results) {
      const currentQuestion = data.results[qNumber - 1];
      setQuestionData(currentQuestion);

      let allAnswers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];

      allAnswers.sort(() => Math.random() - 0.5);

      // Decode HTML entities
      const decode = (text) => {
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html').body.textContent || text;
      };

      setAnswers(allAnswers.map((a) => decode(a)));
      setQuestion(decode(currentQuestion.question));
      setClassAnswers(['', '', '', '']); // reset classes κάθε νέα ερώτηση
      setAnswered(false); // reset απάντηση
      setProgress(0); // reset progress bar
      setFinished(false);
    }
  }, [qNumber, data]);

  function showResults() {
    console.log(questionData)
    if (!questionData) return;

    const newClassAnswers = answers.map((answer) =>
      answer === questionData.correct_answer ? 'correct' : 'wrong'
    );

    console.log(answers + newClassAnswers)
    setClassAnswers(newClassAnswers);


  }

  function clickAnswer() {
    if (answered) return; // Αποφυγή πολλαπλών κλικ
    showResults();
    setAnswered(true);
  }

  // Προχωράει στην επόμενη ερώτηση
  function nextQuestion() {
    if (qNumber < numberQuestions) {
      setNumberQuestion(qNumber + 1);
    } else {
      // Τέλος quiz, μπορείς να κάνεις redirect ή να δείξεις αποτελέσματα
      // πχ navigate('/results');
      alert('Quiz finished!');
    }
  }

  return (
    <>
      <div id="question-container">
        <p style={{ color: 'white', marginBottom: -30 }}>
          Question {qNumber} out of {numberQuestions}.
        </p>
        <h1 id="question-title">{question}</h1>

        <LinearProgress
          variant="determinate"
          value={progress}
          valueBuffer={100 - progress}
          sx={{
            width: '100%',
            height: 20,
            borderRadius: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#63C5C5',
            },
          }}
        />

        <div id="answers">
       
  {answers.map((a, index) => {
    let ClassisDisabled = '';
    if (answered || finished) {
      ClassisDisabled = 'disabled';
    }

    return (
      <div
        key={index}
        className={`answer ${classAnswers[index] || ''} ${ClassisDisabled}`}
        onClick={clickAnswer}
      >
        {`${index+1}) ${a}`}
      </div>
    );
  })}
</div>


        <Button
          variant="contained"
          color="secondary"
          sx={{ width: '100%', height: 45, marginTop: 2 }}
          onClick={nextQuestion}
          disabled={!answered && !finished} // Next ενεργό μόνο αν έχει απαντηθεί
        >
          Next
        </Button>
      </div>
    </>
  );
}

export default Quiz;
