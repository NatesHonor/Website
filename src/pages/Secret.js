import React, { useEffect } from 'react';
import '../styles/Secret.css';

const Secret = () => {
  useEffect(() => {
    const petals = Array.from({ length: 50 }).map((_, i) => {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${Math.random() * 3 + 2}s`;
      document.body.appendChild(petal);
      return petal;
    });

    return () => petals.forEach(p => p.remove());
  }, []);

  return (
    <div className="secret-page">
      <h1>🌸 You unlocked my heart! 🌸</h1>
      <p>You're the most beautiful flower in my garden.</p>
    </div>
  );
};

export default Secret;
