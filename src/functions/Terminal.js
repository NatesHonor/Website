import React, { useState, useEffect, useRef, forwardRef } from 'react';
import '../styles/Terminal.css';

const Terminal = forwardRef((props, ref) => {
  const [displayText, setDisplayText] = useState('');
  const terminalRef = useRef(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [underlineVisible, setUnderlineVisible] = useState(false);

  useEffect(() => {
    const terminalOutputs = [
      'Windows PowerShell',
      'Copyright (C) Microsoft Corporation. All rights reserved.',
      '',
      'PS C:\\users\\Admin> ',
    ];

    const textToType = 'My name is Nathaniel';
    let currentTextIndex = 0;

    const typeText = () => {
      if (currentTextIndex < textToType.length) {
        const currentTypedText = textToType.substring(0, currentTextIndex + 1);
        const textWithCursor = terminalOutputs[3] + currentTypedText;
        setDisplayText(terminalOutputs.slice(0, 3).join('\n') + '\n' + textWithCursor);
        currentTextIndex++;
        setTimeout(typeText, 100);
      } else {
        setCursorVisible(true);
        setTimeout(() => {
          let newText = '';
          let deleteTextIndex = textToType.length;
          const deleteTextInterval = setInterval(() => {
            newText = textToType.substring(0, deleteTextIndex);
            const textWithCursor = terminalOutputs[3] + newText;
            setDisplayText(terminalOutputs.slice(0, 3).join('\n') + '\n' + textWithCursor);
            deleteTextIndex--;
            if (deleteTextIndex < 0) {
              clearInterval(deleteTextInterval);
              setTimeout(() => {
                const newTypedText = 'But people call me Nate.';
                let newTypedTextIndex = 0;
                const typeNewTextInterval = setInterval(() => {
                  newText += newTypedText[newTypedTextIndex];
                  const textWithCursor = terminalOutputs[3] + newText;
                  setDisplayText(terminalOutputs.slice(0, 3).join('\n') + '\n' + textWithCursor);
                  newTypedTextIndex++;
                  if (newTypedTextIndex === newTypedText.length) {
                    clearInterval(typeNewTextInterval);
                    setUnderlineVisible(true);
                  }
                }, 100);
              }, 1000);
            }
          }, 100);
        }, 1000);
      }
    };

    setDisplayText(terminalOutputs.join('\n'));

    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    setTimeout(typeText, 2000);

  }, []);

  useEffect(() => {
    let cursorInterval;
    if (cursorVisible) {
      cursorInterval = setInterval(() => {
        setDisplayText((prevText) => {
          if (prevText.endsWith('|')) {
            return prevText.slice(0, -1);
          } else {
            return prevText + '|';
          }
        });
      }, 500);
    }

    return () => {
      clearInterval(cursorInterval);
    };
  }, [cursorVisible]);

  return (
    <div className="terminal" ref={ref}>
      <pre>
        {displayText}
        {underlineVisible && <span className="underline"></span>}
      </pre>
    </div>
  );
});

export default Terminal;
