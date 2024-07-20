  import React, { useState, useEffect, useRef } from 'react';
  import './styles/App.css';
  import Terminal from './functions/Terminal';
  import Box from './functions/Box';
  import ResumeContent from './functions/ResumeContent';
  import ReactGithubList from './ReactGithubList/react-github-widget';
  import Header from './functions/Header';

  import Clip1 from './Media/Videos/Main/Clip 1.mp4';
  import Clip2 from './Media/Videos/Main/Clip 2.mp4';
  import Clip3 from './Media/Videos/Main/Clip 3.mp4';
  import Clip4 from './Media/Videos/Main/Clip 4.mp4';
  import Clip5 from './Media/Videos/Main/Clip 5.mp4';
  import Clip6 from './Media/Videos/Main/Clip 6.mp4';
  import Clip7 from './Media/Videos/Main/Clip 7.mp4';
  import Clip8 from './Media/Videos/Main/Clip 8.mp4';
  import Clip9 from './Media/Videos/Main/Clip 9.mp4';
  import Clip10 from './Media/Videos/Main/Clip 10.mp4';

  const videoUrls = [
    Clip1,
    Clip2,
    Clip3,
    Clip4,
    Clip5,
    Clip6,
    Clip7,
    Clip8,
    Clip9,
    Clip10,
  ];

  const App = () => {
    const [activeApp, setActiveApp] = useState(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [fadeOpacity] = useState(0);

    const terminalRef = useRef(null);
    const videoRef = useRef(null);
    const boxRef = useRef(null);

    useEffect(() => {
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

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
            const id = entry.target.getAttribute('id');
            if (id === 'terminal' && entry.intersectionRatio < 0.1) {
              document.querySelector(`#${id}`).classList.add('fade-out');
            } else if (id === 'video' && entry.intersectionRatio > 0.1) {
              document.querySelector(`#${id}`).classList.add('fade-in');
            }
          });
        },
        { threshold: [0, 0.1, 1] }
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
      content = <ReactGithubList username="NatesHonor" />;
    }

    return (
      <div className="App scrollable">
        <header className="App-header">
          <Header />
          <Terminal activeApp={activeApp} id="terminal" ref={terminalRef} className="fade-out" />
          <div
            className="video-section"
            id="video"
            ref={videoRef}
            style={{ opacity: fadeOpacity }}
          >
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
          <div className="box-container" id="box" ref={boxRef}>
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

  export default App;
