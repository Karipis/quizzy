import './App.css';
import Preferences from './Components/Preferences/Preferences';
import Quiz from './Components/Quiz/Quiz'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext,useState } from 'react';
export const PreferencesContext = createContext();

function App() {

  
 const [preferences, setPreferences] = useState({
    numberQuestions: '',
    category: '',
    difficulty: '',
  });


return (
<div className="App">
  <Router>
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      <Routes>
        <Route path="/" element={<Preferences />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </PreferencesContext.Provider>
  </Router>
</div>
);
}

export default App;