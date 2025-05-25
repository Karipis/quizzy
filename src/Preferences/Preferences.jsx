import React, { useState, useContext } from 'react';
import './Preferences.css';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../App';

function Preferences() {
  const navigate = useNavigate();
  const [numberQuestions, setNumberQuestions] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState(1); // default = Easy
  const { setPreferences } = useContext(PreferencesContext);

  const handleNumberChange = (event) => {
    setNumberQuestions(event.target.value);
    console.log('Number of Questions:', event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    console.log('Category:', event.target.value);
  };

  const handleDifficultyChange = (event, newValue) => {
    setDifficulty(newValue);
    console.log('Difficulty:', newValue);
  };

  function beginTest(){
  const categoryMap = {
    'movies': 11,
    'video-games': 15,
    'sports': 21,
    'geography': 22,
    'science': 17,
    'history': 23,
  };

  const mappedCategory = categoryMap[category];

  setPreferences({
    numberQuestions,
    category: mappedCategory,
    difficulty,
  });

  navigate('/quiz');
};

  return (
    <div id="container">
      <h1 style={{ color: '#9C27B0' }}>Quizzy</h1>

      <div id="title">
        <SettingsIcon sx={{ width: 35, height: 35, borderRadius: 50 }} color="secondary" />
        <h2 style={{ color: '#9C27B0' }}>Quiz Preferences</h2>
      </div>

      <FormControl fullWidth margin="normal" sx={{ width: '70%' }} color="secondary">
        <InputLabel id="num-questions-label">Number of Questions</InputLabel>
        <Select
          labelId="num-questions-label"
          id="questions-number"
          value={numberQuestions}
          label="Number of Questions"
          onChange={handleNumberChange}
        >
          <MenuItem disabled value="">
            <em>Select number of questions</em>
          </MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" sx={{ width: '70%' }} color="secondary">
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="questions-category"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem disabled value="">
            <em>Select question category</em>
          </MenuItem>
          <MenuItem value="movies">Movies</MenuItem>
          <MenuItem value="video-games">Video Games</MenuItem>
          <MenuItem value="sports">Sports</MenuItem>
          <MenuItem value="geography">Geography</MenuItem>
          <MenuItem value="history">History</MenuItem>
          <MenuItem value="science">Science</MenuItem>
        </Select>
      </FormControl>

      <div style={{ width: '70%', marginTop: '2rem' }}>
        <Slider
          value={difficulty}
          step={1}
          marks={[
            { value: 1, label: 'Easy' },
            { value: 2, label: 'Medium' },
            { value: 3, label: 'Hard' },
          ]}
          min={1}
          max={3}
          color="secondary"
          onChange={handleDifficultyChange}
        />
      </div>

      <Button
        variant="contained"
        color="secondary"
        onClick={beginTest}
        sx={{ marginTop: '2rem' }}
      >
        Play
      </Button>
    </div>
  );
}

export default Preferences;
