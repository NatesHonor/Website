import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Terminal from './functions/Terminal';
import Box from './functions/Box';
import ResumeContent from './functions/ResumeContent';
import ReactGithubList from './ReactGithubList/react-github-widget';

const App = () => {
  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {

  }, []);

  const handleBoxClick = (boxName) => {
    setActiveApp(boxName);
  };

  const box1Text = activeApp === 'box1' ? 'Scroll Down!' : 'About Me';
  const box2Text = activeApp === 'box2' ? 'Scroll Down!' : 'Projects';
  const box3Text = activeApp === 'box3' ? 'Scroll Down!' : 'Resume';
  let content = null;

  if (activeApp === 'box3') {
    content = <ResumeContent />;
  } else if (activeApp === 'box2') {
    content = <ReactGithubList username="qNateYT" />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Terminal activeApp={activeApp} />
        <div className="box-container">
          <Box
            active={activeApp === 'box1'}
            boxText={box1Text}
            onClick={() => handleBoxClick('box1')}
          >
            {activeApp !== 'box1' && 'My Backstory'}
          </Box>
          <Box
            active={activeApp === 'box2'}
            boxText={box2Text}
            onClick={() => handleBoxClick('box2')}
          >
            {activeApp !== 'box2' && 'Past, Current, and Future Projects'}
          </Box>
          <Box
            active={activeApp === 'box3'}
            boxText={box3Text}
            onClick={() => handleBoxClick('box3')}
          >
            {activeApp !== 'box3' && 'My Resume'}
          </Box>
        </div>
        {activeApp && (
          <div className="text-container">
            {content}
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
