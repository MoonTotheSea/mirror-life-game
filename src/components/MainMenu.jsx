import React, { useState, useEffect } from 'react';

const MainMenu = ({ onNewGame, onContinue, onSettings, hasSaveData, onChapter3 }) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [showCredits, setShowCredits] = useState(false);
  const [time, setTime] = useState({ hour: 23, minute: 47 });

  // 时间更新
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { hour, minute } = prev;
        minute++;
        if (minute >= 60) {
          minute = 0;
          hour = (hour + 1) % 24;
        }
        return { hour, minute };
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;

  const menuOptions = [
    { label: 'NEW GAME', action: 'new' },
    { label: 'CONTINUE', action: 'continue', disabled: !hasSaveData },
   // { label: 'CHAPTER2', action: 'chapter2' },
    //{ label: 'CHAPTER3', action: 'chapter3' },
    { label: 'SETTINGS', action: 'settings' },
    { label: 'CREDITS', action: 'credits' }
  ];

  const handleKeyPress = (e) => {
    if (showCredits) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        setShowCredits(false);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      setSelectedOption(prev => (prev - 1 + menuOptions.length) % menuOptions.length);
    } else if (e.key === 'ArrowDown') {
      setSelectedOption(prev => (prev + 1) % menuOptions.length);
    } else if (e.key === 'Enter') {
      handleSelect(menuOptions[selectedOption].action);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption, showCredits]);

  const handleSelect = (action) => {
    if (action === 'new') {
      if (onNewGame) onNewGame();
    } else if (action === 'continue') {
      if (onContinue) onContinue();
    } else if (action === 'settings') {
      if (onSettings) onSettings();
    } else if (action === 'credits') {
      setShowCredits(true);
    } 
    //test
    else if (action === 'chapter3' ) {
      if (onChapter3) onChapter3();
    }
  };

  if (showCredits) {
    return (
      <div style={styles.body}>
        <div style={styles.filmGrain} />
        <div style={styles.creditsContainer}>
          <div style={styles.creditsContent}>
            <h2 style={styles.creditsTitle}>CREDITS</h2>
            
            <div style={styles.creditsSection}>
              <div style={styles.creditsLabel}>GAME DESIGN & NARRATIVE</div>
              <div style={styles.creditsText}>Xinrui Lyu</div>
            </div>

            <div style={styles.creditsSection}>
              <div style={styles.creditsLabel}>VISUAL DESIGN</div>
              <div style={styles.creditsText}>Xinrui Lyu</div>
            </div>

            <div style={styles.creditsSection}>
              <div style={styles.creditsLabel}>PROGRAMMING</div>
              <div style={styles.creditsText}>Xinrui Lyu</div>
            </div>

            <div style={styles.creditsSection}>
              <div style={styles.creditsLabel}>INSPIRED BY</div>
              <div style={styles.creditsText}>
                Wong Kar-wai Films<br/>
                Disco Elysium
              </div>
            </div>

            <div style={styles.creditsSection}>
              <div style={styles.creditsLabel}>MUSIC & SOUND</div>
              <div style={styles.creditsText}>TBD</div>
            </div>

            <div style={{...styles.creditsText, marginTop: '40px', textAlign: 'center', color: '#4ecdc4'}}>
              Press ESC or ENTER to return
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      {/* Film grain effect */}
      <div style={styles.filmGrain} />
      
      {/* Blue mist */}
      <div style={styles.blueMist} />

      {/* Time display */}
      <div style={styles.timeDisplay}>
        November 16, 2024<br />
        Saturday<br />
        <span style={styles.timeNeon}>{timeStr}</span><br />
        ShenZhen
      </div>

      {/* Main container */}
      <div style={styles.menuContainer}>
        {/* Title */}
        <div style={styles.titleSection}>
          <h1 style={styles.mainTitle}>
            MIRROR LIFE
          </h1>
          <div style={styles.tagline}>
            WHO ARE YOU WHEN YOUR MEMORIES LIE?
          </div>
        </div>

        {/* Menu options */}
        <div style={styles.menuOptions}>
          {menuOptions.map((option, index) => (
            <div
              key={index}
              style={{
                ...styles.menuItem,
                ...(selectedOption === index && styles.menuItemSelected),
                ...(option.disabled && styles.menuItemDisabled)
              }}
              onClick={() => !option.disabled && handleSelect(option.action)}
              onMouseEnter={() => !option.disabled && setSelectedOption(index)}
            >
              <span style={styles.menuArrow}>
                {selectedOption === index ? '▶' : ' '}
              </span>
              <span style={styles.menuText}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Controls hint */}
        <div style={styles.controlsHint}>
          <div style={styles.hintText}>
            ↑↓ Navigate  |  ENTER Select  |  ESC Back
          </div>
        </div>

        {/* Atmospheric elements */}
        <div style={styles.neonLine1}></div>
        <div style={styles.neonLine2}></div>
        
        {/* Version */}
        <div style={styles.version}>
          v0.1.0 Alpha
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
    position: 'relative',
    overflow: 'hidden'
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
    animation: 'grainMove 0.5s steps(2) infinite',
    zIndex: 9999
  },

  blueMist: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(ellipse at 50% 50%, rgba(78, 205, 196, 0.15) 0%, transparent 70%)',
    animation: 'mistMove 10s ease-in-out infinite',
    zIndex: 1
  },

  timeDisplay: {
    position: 'fixed',
    top: '30px',
    right: '30px',
    fontSize: '10px',
    color: '#5d6f7f',
    textAlign: 'right',
    lineHeight: 1.8,
    zIndex: 100
  },

  timeNeon: {
    color: '#4ecdc4',
    fontSize: '12px',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.5), 0 0 20px rgba(78, 205, 196, 0.3)'
  },

  menuContainer: {
    maxWidth: '700px',
    width: '90%',
    padding: '60px 40px',
    background: 'rgba(26, 35, 50, 0.8)',
    border: '3px solid #3a7d7c',
    boxShadow: `
      0 0 0 1px #253447,
      0 0 40px rgba(78, 205, 196, 0.4),
      inset 0 0 60px rgba(10, 20, 40, 0.5)
    `,
    position: 'relative',
    zIndex: 10,
    backdropFilter: 'blur(10px)',
    animation: 'borderFlicker 4s ease-in-out infinite'
  },

  titleSection: {
    textAlign: 'center',
    marginBottom: '60px',
    position: 'relative'
  },

  mainTitle: {
    fontSize: '32px',
    color: '#4ecdc4',
    textShadow: `
      0 0 20px rgba(78, 205, 196, 0.8),
      0 0 40px rgba(78, 205, 196, 0.4),
      2px 2px 0 #3a7d7c
    `,
    letterSpacing: '0.1em',
    marginBottom: '20px',
    animation: 'neonTitleFlicker 3s ease-in-out infinite'
  },

  subtitle: {
    fontSize: '14px',
    color: '#8a9fb0',
    marginBottom: '30px',
    letterSpacing: '0.2em'
  },

  tagline: {
    fontSize: '8px',
    color: '#5d6f7f',
    letterSpacing: '0.15em',
    lineHeight: 1.8,
    maxWidth: '400px',
    margin: '0 auto'
  },

  menuOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '50px'
  },

  menuItem: {
    fontSize: '14px',
    padding: '15px 20px',
    background: 'rgba(37, 52, 71, 0.6)',
    border: '2px solid #374a5f',
    color: '#8a9fb0',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '4px 4px 0 rgba(10, 20, 40, 0.8)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },

  menuItemSelected: {
    background: '#4ecdc4',
    border: '2px solid #4ecdc4',
    color: '#0a1428',
    transform: 'translate(-2px, -2px)',
    boxShadow: `
      6px 6px 0 rgba(10, 20, 40, 0.9),
      0 0 30px rgba(78, 205, 196, 0.6),
      0 0 60px rgba(78, 205, 196, 0.3),
      inset 0 0 30px rgba(255, 255, 255, 0.2)
    `,
    animation: 'neonPulse 1.5s ease-in-out infinite'
  },

  menuItemDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed'
  },

  menuArrow: {
    width: '30px',
    color: 'inherit',
    textShadow: '0 0 10px currentColor',
    fontWeight: 'bold'
  },

  menuText: {
    flex: 1,
    letterSpacing: '0.1em'
  },

  controlsHint: {
    textAlign: 'center',
    marginTop: '30px'
  },

  hintText: {
    fontSize: '8px',
    color: '#5d6f7f',
    letterSpacing: '0.1em',
    lineHeight: 2
  },

  neonLine1: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '80px',
    height: '2px',
    background: '#4ecdc4',
    boxShadow: '0 0 10px rgba(78, 205, 196, 0.5)',
    animation: 'signFlicker 3s infinite'
  },

  neonLine2: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '120px',
    height: '2px',
    background: '#4ecdc4',
    boxShadow: '0 0 10px rgba(78, 205, 196, 0.5)',
    animation: 'signFlicker 2.5s infinite'
  },

  version: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    fontSize: '7px',
    color: '#5d6f7f',
    letterSpacing: '0.1em'
  },

  // Credits styles
  creditsContainer: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    zIndex: 10
  },

  creditsContent: {
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
    background: 'rgba(26, 35, 50, 0.9)',
    boxShadow: `
      0 0 0 2px #253447,
      0 0 0 4px #3a7d7c,
      0 0 30px rgba(78, 205, 196, 0.3)
    `,
    backdropFilter: 'blur(10px)'
  },

  creditsTitle: {
    fontSize: '24px',
    color: '#4ecdc4',
    textAlign: 'center',
    marginBottom: '40px',
    textShadow: '0 0 20px rgba(78, 205, 196, 0.5)',
    letterSpacing: '0.2em'
  },

  creditsSection: {
    marginBottom: '30px'
  },

  creditsLabel: {
    fontSize: '8px',
    color: '#5d6f7f',
    marginBottom: '10px',
    letterSpacing: '0.15em'
  },

  creditsText: {
    fontSize: '10px',
    color: '#c8d5e0',
    lineHeight: 2,
    letterSpacing: '0.05em'
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const styleSheet = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    @keyframes grainMove {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-2px, -2px); }
    }

    @keyframes neonTitleFlicker {
      0%, 100% { 
        opacity: 1;
        text-shadow: 
          0 0 20px rgba(78, 205, 196, 0.8),
          0 0 40px rgba(78, 205, 196, 0.4),
          2px 2px 0 #3a7d7c;
      }
      5% { 
        opacity: 0.8;
        text-shadow: 
          0 0 10px rgba(78, 205, 196, 0.6),
          0 0 20px rgba(78, 205, 196, 0.3),
          2px 2px 0 #3a7d7c;
      }
      10% { 
        opacity: 1;
        text-shadow: 
          0 0 25px rgba(78, 205, 196, 0.9),
          0 0 50px rgba(78, 205, 196, 0.5),
          2px 2px 0 #3a7d7c;
      }
      15% {
        opacity: 0.9;
      }
      20%, 80% { 
        opacity: 1;
        text-shadow: 
          0 0 20px rgba(78, 205, 196, 0.8),
          0 0 40px rgba(78, 205, 196, 0.4),
          2px 2px 0 #3a7d7c;
      }
      85% {
        opacity: 0.85;
        text-shadow: 
          0 0 15px rgba(78, 205, 196, 0.7),
          0 0 30px rgba(78, 205, 196, 0.3),
          2px 2px 0 #3a7d7c;
      }
      90% {
        opacity: 1;
      }
    }

    @keyframes borderFlicker {
      0%, 100% { 
        border-color: #3a7d7c;
        box-shadow: 
          0 0 0 1px #253447,
          0 0 40px rgba(78, 205, 196, 0.4),
          inset 0 0 60px rgba(10, 20, 40, 0.5);
      }
      8% { 
        border-color: #4ecdc4;
        box-shadow: 
          0 0 0 1px #253447,
          0 0 50px rgba(78, 205, 196, 0.6),
          inset 0 0 60px rgba(10, 20, 40, 0.5);
      }
      12%, 88% { 
        border-color: #3a7d7c;
        box-shadow: 
          0 0 0 1px #253447,
          0 0 40px rgba(78, 205, 196, 0.4),
          inset 0 0 60px rgba(10, 20, 40, 0.5);
      }
      92% {
        border-color: #4ecdc4;
        box-shadow: 
          0 0 0 1px #253447,
          0 0 45px rgba(78, 205, 196, 0.5),
          inset 0 0 60px rgba(10, 20, 40, 0.5);
      }
    }

    @keyframes neonPulse {
      0%, 100% { 
        box-shadow: 
          6px 6px 0 rgba(10, 20, 40, 0.9),
          0 0 30px rgba(78, 205, 196, 0.6),
          0 0 60px rgba(78, 205, 196, 0.3),
          inset 0 0 30px rgba(255, 255, 255, 0.2);
      }
      50% { 
        box-shadow: 
          6px 6px 0 rgba(10, 20, 40, 0.9),
          0 0 40px rgba(78, 205, 196, 0.8),
          0 0 80px rgba(78, 205, 196, 0.4),
          inset 0 0 40px rgba(255, 255, 255, 0.3);
      }
    }

    @keyframes mistMove {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @keyframes signFlicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
      75% { opacity: 0.9; }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  `;

  const style = document.createElement('style');
  style.textContent = styleSheet;
  document.head.appendChild(style);
}

export default MainMenu;