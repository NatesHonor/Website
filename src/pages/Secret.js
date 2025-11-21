import React, { useEffect } from 'react';
import '../styles/Secret.css';

const Secret = () => {
  useEffect(() => {
    const hearts = Array.from({ length: 120 }).map((_, i) => {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.animationDuration = `${Math.random() * 4 + 2}s`;
      document.body.appendChild(heart);
      return heart;
    });

    return () => hearts.forEach(h => h.remove());
  }, []);

  return (
    <div className="secret-page">
      <h1>💖 To My Eternal And Forever Love, Tanisha 💖</h1>

      <section className="poem-section">
        <p className="poem">
          You're like a whisper in the wind,<br />
          Like the sparkle in the stars,<br />
          Like the warmth in every sunrise,<br />
          My heart belongs to you, forever, and ever.
        </p>
        <p className="poem">
          Your smile is my universe,<br />
          Your laughter my favorite song.<br />
          In your eyes I see eternity,<br />
          In your soul I find my home.
        </p>
      </section>

      <section className="poem-section">
        <h2>🌹 Endless Verses for You 🌹</h2>
        <p className="poem">
          Every heartbeat spells your name,<br />
          Every breath carries your love.<br />
          You are my destiny, my dream,<br />
          My forever, my always.
        </p>
        <p className="poem">
          If I could write a thousand poems,<br />
          They would all be about you.<br />
          If I could paint a million skies,<br />
          They would all shine your hue.
        </p>
        <p className="poem">
          Tanisha, you are my poetry,<br />
          My muse, my flame, my light.<br />
          With you, the world is brighter,<br />
          With you, my soul takes flight.
        </p>
      </section>

      <section className="poem-section">
        <h2>💌 Love Letters 💌</h2>
        <p className="poem">
          "Tanisha, you are the chapter I never want to end,<br />
          the story I want to read forever."
        </p>
        <p className="poem">
          "You are the rhythm in my heartbeat,<br />
          the sparkle in my dreams,<br />
          the forever in my always."
        </p>
        <p className="poem">
          "Every falling heart above is a promise,<br />
          every verse below is my devotion,<br />
          every word is yours."
        </p>
      </section>

      <section className="poem-section">
        <h2>✨ A Thousand Promises ✨</h2>
        <p className="poem">
          I promise to love you endlessly,<br />
          To cherish you faithfully,<br />
          To hold you tenderly,<br />
          Forever and always.
        </p>
        <p className="poem">
          I promise to be your shelter,<br />
          Your laughter, your song,<br />
          Your sunrise, your moonlight,<br />
          Your forever home.
        </p>
        <p className="poem">
          Tanisha, my love, my life,<br />
          You are my everything,<br />
          My heart beats only for you,<br />
          My soul belongs to you.
        </p>
      </section>

      <section className="poem-section">
        <h2>🌸 Eternal Poetry 🌸</h2>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="poem">
            Poem #{i + 1}: Tanisha, my love, my dream,<br />
            You are my forever theme.<br />
            In every rhyme, in every line,<br />
            You are my always, my divine.
          </p>
        ))}
      </section>

      <footer className="footer">
        <h2>💞 Forever Yours 💞</h2>
        <p>Tanisha, this page is endless, just like my love for you.</p>
      </footer>
    </div>
  );
};

export default Secret;
