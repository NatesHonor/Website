import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import Terminal from './functions/Terminal';
import Box from './functions/Box';
import ResumeContent from './functions/ResumeContent';
import ReactGithubList from './ReactGithubList/react-github-widget';
import Header from './functions/Header';
import { videoUrls, shuffleArray } from './functions/VideoHandler';
import GifComponent from './functions/GifHandler';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Secret from './pages/Secret';
import TempPhoto from './pages/tempphoto';
import AboutMeText from './aboutMeText';
import SchedulePage from './pages/SchedulePage';

const MainApp = () => {
  const [activeApp, setActiveApp] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [visibleVideos, setVisibleVideos] = useState([]);

  const terminalRef = useRef(null);
  const videoRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    setVisibleVideos(shuffleArray([...videoUrls]));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % visibleVideos.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [visibleVideos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          entry.target.style.opacity = ratio;
        });
      },
      { threshold: Array.from(Array(101).keys(), (x) => x / 100) }
    );

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleBoxClick = (boxName) => {
    setActiveApp(activeApp === boxName ? null : boxName);
  };

  const box1Text = activeApp === 'box1' ? 'Scroll Down!' : 'About Me';
  const box2Text = activeApp === 'box2' ? 'Scroll Down!' : 'Projects';
  const box3Text = activeApp === 'box3' ? 'Scroll Down!' : 'Resume';
  let content = null;

  if (activeApp === 'box3') {
    content = <ResumeContent />;
  } else if (activeApp === 'box2') {
    content = (
      <div>
        <h2 style={{ display: 'inline', marginRight: '10px' }}>Mission Chief Bot</h2>
        <span style={{ color: 'gold', fontSize: '50px' }}>★</span>
        <p style={{ fontSize: '12px', marginTop: '0' }}>
          Most popular project with 300+ downloads
        </p>
        <GifComponent />
        <ReactGithubList username="NatesHonor" />
      </div>
    );
  } else if (activeApp === 'box1') {
    content = <AboutMeText />;
  }

  return (
    <div className="App scrollable">
      <header className="App-header">
        <Header />
        <Terminal activeApp={activeApp} id="terminal" ref={terminalRef} className="fade-element" />
        <div className="video-section fade-element" id="video" ref={videoRef}>
          <div className="video-overlay">
            <h2>Check out my Clips!</h2>
          </div>
          <video
            width="560"
            height="315"
            autoPlay
            loop
            muted
            src={visibleVideos[currentVideoIndex]}
            type="video/mp4"
          ></video>
        </div>
        <div className="box-container fade-element" id="box" ref={boxRef}>
          <Box
            active={activeApp === 'box1'}
            boxText={box1Text}
            onClick={() => handleBoxClick('box1')}
          >
            {activeApp !== 'box1' && 'Get To Know Me!'}
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
            {activeApp !== 'box3' && 'Viewable & Downloadable PDF'}
          </Box>
        </div>
        {activeApp && <div className="text-container">{content}</div>}
        <a className="contact-link" href="https://links.natemarcellus.com/" target="_blank" rel="noopener noreferrer">
          Contact Me
        </a>
      </header>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/secret" element={<Secret />} />
        <Route path="/tempphoto" element={<TempPhoto />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
};

export default App;
