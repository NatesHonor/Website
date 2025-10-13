import React from "react";

const SchedulePage = () => {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a1a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Book Time With Me</h1>
      <p style={{ maxWidth: "600px", textAlign: "center", marginBottom: "2rem" }}>
        Schedule a time to talk, play, or just hang out. Pick whatever works best for you!
      </p>

      {/* Example: Embed Calendly inline */}
      <div style={{ width: "100%", maxWidth: "800px", height: "700px" }}>
        <iframe
          src="https://calendly.com/YOUR-USERNAME"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Schedule with Nate"
        ></iframe>
      </div>

      {/* Or you can link instead of embedding */}
      {/* <a href="https://calendly.com/YOUR-USERNAME" target="_blank" rel="noopener noreferrer">Open Scheduler</a> */}
    </div>
  );
};

export default SchedulePage;
