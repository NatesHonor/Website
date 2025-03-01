import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Iloveyou = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const correctPassword = 'valentine';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      navigate('/secret');
    } else {
      setError('Incorrect password! Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💖 Welcome to Your Special Page 💖</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Enter Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#ffccd5',
    color: '#d6336c',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: '1.2rem',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #d6336c',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#d6336c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Iloveyou;
