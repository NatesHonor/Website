import React from 'react';
import '../styles/Box.css';

const Box = ({ active, boxText, additionalText, onClick, children }) => (
  <div className={`box ${active ? 'active' : ''}`} onClick={onClick}>
    <div className="box-content">
      <h3>{boxText}</h3>
      {!active && (
        <p>
          {children}
          {additionalText && <span className="additional-text"> ({additionalText})</span>}
        </p>
      )}
    </div>
  </div>
);

export default Box;
