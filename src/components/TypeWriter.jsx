import React, { useState, useEffect } from 'react';

const TypeWriter = ({ texts, delay = 100, eraseDelay = 50, pauseDuration = 2000 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    const currentFullText = texts[currentTextIndex];
    
    if (!isDeleting && currentText === currentFullText) {
      // Pause before starting to delete
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && currentText === '') {
      // Move to next text
      setIsDeleting(false);
      setCurrentTextIndex((current) => (current + 1) % texts.length);
    } else {
      const delta = isDeleting ? eraseDelay : delay;
      timeout = setTimeout(() => {
        setCurrentText(current => {
          if (isDeleting) {
            return current.slice(0, -1);
          } else {
            return currentFullText.slice(0, current.length + 1);
          }
        });
      }, delta);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, delay, eraseDelay, pauseDuration]);

  return (
    <div className="typewriter-container">
      <span className="typewriter-text">{currentText}</span>
      <span className="typewriter-cursor">|</span>
    </div>
  );
};

export default TypeWriter;