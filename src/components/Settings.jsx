// Settings.jsx - 设置界面（简单版）

import React, { useState } from 'react';

const Settings = ({ onBack }) => {
  const [volume, setVolume] = useState(70);
  const [language, setLanguage] = useState('zh');

  return (
    <div style={styles.body}>
      <div style={styles.filmGrain} />
      
      <div style={styles.settingsContainer}>
        <h2 style={styles.title}>SETTINGS</h2>

        <div style={styles.settingSection}>
          <div style={styles.settingLabel}>VOLUME</div>
          <div style={styles.volumeControl}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              style={styles.slider}
            />
            <span style={styles.volumeValue}>{volume}%</span>
          </div>
        </div>

        <div style={styles.settingSection}>
          <div style={styles.settingLabel}>LANGUAGE</div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option value="en">English</option>
          </select>
        </div>

        <button style={styles.backButton} onClick={onBack}>
          ▶ BACK TO MENU
        </button>

        <div style={styles.note}>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: '"Press Start 2P", monospace',
    background: 'linear-gradient(180deg, #0a1428 0%, #1a2332 100%)',
    color: '#c8d5e0',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },

  filmGrain: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    opacity: 0.03,
    backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="4"/></filter><rect width="300" height="300" filter="url(%23n)" opacity="0.3"/></svg>\')',
    zIndex: 9999
  },

  settingsContainer: {
    maxWidth: '600px',
    width: '90%',
    padding: '40px',
    background: 'rgba(26, 35, 50, 0.9)',
    border: '3px solid #3a7d7c',
    boxShadow: '0 0 40px rgba(78, 205, 196, 0.4)',
    backdropFilter: 'blur(10px)',
    zIndex: 10
  },

  title: {
    fontSize: '24px',
    color: '#4ecdc4',
    textAlign: 'center',
    marginBottom: '40px',
    textShadow: '0 0 20px rgba(78, 205, 196, 0.6)',
    letterSpacing: '0.2em'
  },

  settingSection: {
    marginBottom: '30px',
    padding: '20px',
    background: 'rgba(37, 52, 71, 0.4)',
    border: '1px solid #374a5f'
  },

  settingLabel: {
    fontSize: '10px',
    color: '#5d6f7f',
    marginBottom: '15px',
    letterSpacing: '0.15em'
  },

  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },

  slider: {
    flex: 1,
    height: '4px',
    background: '#374a5f',
    outline: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer'
  },

  volumeValue: {
    fontSize: '12px',
    color: '#4ecdc4',
    minWidth: '50px'
  },

  select: {
    width: '100%',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '10px',
    padding: '10px',
    background: '#253447',
    border: '2px solid #374a5f',
    color: '#c8d5e0',
    cursor: 'pointer'
  },

  toggleButton: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '10px',
    padding: '10px 20px',
    background: '#4ecdc4',
    border: 'none',
    color: '#0a1428',
    cursor: 'pointer',
    letterSpacing: '0.05em'
  },

  backButton: {
    width: '100%',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '12px',
    padding: '15px',
    background: 'rgba(37, 52, 71, 0.6)',
    border: '2px solid #374a5f',
    color: '#8a9fb0',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.15s ease'
  },

  note: {
    fontSize: '7px',
    color: '#5d6f7f',
    textAlign: 'center',
    marginTop: '20px',
    letterSpacing: '0.1em'
  }
};

export default Settings;