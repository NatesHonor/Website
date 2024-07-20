import React from 'react';
import '../styles/ResumeContent.css';
import ResumePDF from './Resume.pdf';

const ResumeContent = () => (
    <object
      data={ResumePDF}
      type="application/pdf"
      width="100%"
      height="800px"
    >
      <p>
        It appears you don't have a PDF plugin for this browser. No biggie...
        you can <a href={ResumePDF}>click here to
        download the PDF file.</a>
      </p>
    </object>
);

export default ResumeContent;
