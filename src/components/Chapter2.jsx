// Chapter2.jsx - Mirror Life: Chapter 2 - Return Home
// FIXED VERSION with proper interactive scene handling

import React, { useState, useEffect, useRef } from 'react';
import PhoneSystem from "./PhoneSystem";
import EvidenceCardPopup from "./EvidenceCardPopup";

// ========== Audio System (Same as Chapter1) ==========
let audioContext = null;

const playTypeSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 350 + Math.random() * 50;
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
    
  } catch (e) {}
};

const Chapter2 = ({ onBack, onComplete, onSave, saveData, setSaveData }) => {
  // ========== Game State ==========
  const [gamePhase, setGamePhase] = useState('loading');
  const [currentScene, setCurrentScene] = useState('journey_1');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [completedLines, setCompletedLines] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // ========== Evidence State ==========
  const [collectedEvidence, setCollectedEvidence] = useState([]);
  const [evidenceCount, setEvidenceCount] = useState(0);
  
  // ========== Popup State ==========
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [pendingScene, setPendingScene] = useState(null);
  
  // ========== Phone State ==========
  const [showPhone, setShowPhone] = useState(false);
  
  // ========== Notification State ==========
  const [showNotification, setShowNotification] = useState(false);
  
  // ========== Interactive Scene Phase States ==========
  const [coffeePhase, setCoffeePhase] = useState('idle'); // idle, collected
  const [bedsidePhase, setBedsidePhase] = useState('idle'); // idle, opening, opened
  const [jewelryPhase, setJewelryPhase] = useState('idle'); // idle, lid_open, lining_lifted

  // ========== Evidence Cards Database ==========
  const cardDatabase = {
    photo: {
      type: 'EVIDENCE',
      title: "Unsettling Photo",
      icon: '🖼️',
      description: "A photo from a company event. Your smile seems forced, and there's a strange red shadow behind you that doesn't belong to anyone.",
      details: [
        'Location: Company Year-End Party',
        'Date: October 2024',
        'Anomaly: Unexplained shadow figure'
      ]
    },
    pills: {
      type: 'EVIDENCE',
      title: "Sleeping Pills & Note",
      icon: '💊',
      description: "Prescription sleeping pills and a disturbing personal note revealing thoughts about dissociation and losing grip on reality.",
      details: [
        'Prescribed: 2 weeks before accident',
        'Note: \"Can\'t sleep again. The dreams are getting worse.\"',
        'Note: \"I keep seeing myself from outside my body.\"'
      ]
    },
    usb: {
      type: 'EVIDENCE',
      title: "USB Drive - Urban Aphasia",
      icon: '📀',
      description: "Hidden USB drive containing original recordings for your investigation into \"Urban Aphasia\" - the story that started everything.",
      details: [
        'Label: \"Urban Aphasia - Original Recording\"',
        'Label: \"DO NOT DELETE\"',
        'Hidden Location: Jewelry box secret compartment'
      ]
    }
  };

  // ========== Scene Data ==========
  const scenes = {
    // Journey scenes
    journey_1: {
      title: 'THE JOURNEY HOME',
      location: 'Taxi - Late Afternoon',
      narrative: [
        'The taxi winds through the crowded streets of Shenzhen.',
        'You watch the city pass by through rain-streaked windows.',
        'Everything looks familiar, yet somehow... distant.',
        'Like watching someone else\'s memories play on a screen.'
      ],
      choices: [
        { text: '[ Continue ]', action: 'journey_2' }
      ]
    },
    
    journey_2: {
      title: 'THE JOURNEY HOME',
      location: 'Taxi - Luohu District',
      narrative: [
        'Neon signs blur into streaks of color.',
        'The driver says something, but you barely hear him.',
        'Your mind keeps drifting back to those hospital records.',
        '"Sample 099"... What does it mean?'
      ],
      choices: [
        { text: '[ Continue ]', action: 'arrival' }
      ]
    },
    
    arrival: {
      title: 'ARRIVAL',
      location: 'Apartment Building - Evening',
      narrative: [
        'The taxi stops in front of a familiar building.',
        'You pay the driver and step out into the humid evening air.',
        'This is your apartment building.',
        'At least, that\'s what your ID says.'
      ],
      choices: [
        { text: '[ Enter building ]', action: 'trigger_notification' }
      ]
    },
    
    apartment_entry_1: {
      title: 'ENTERING',
      location: 'Apartment Hallway',
      narrative: [
        'The elevator rises to the 12th floor.',
        'Your footsteps echo in the empty hallway.',
        'Unit 1207. Your hand trembles as you reach for the door.',
        'The key fits. Of course it does.'
      ],
      choices: [
        { text: '[ Open the door ]', action: 'apartment_entry_2' }
      ]
    },
    
    apartment_entry_2: {
      title: 'HOME',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'The door swings open.',
        'A faint smell of jasmine and dust.',
        'Everything is exactly where it should be.',
        'And yet nothing feels like yours.'
      ],
      choices: [
        { text: '[ Step inside ]', action: 'explore_intro' }
      ]
    },
    
    explore_intro: {
      title: 'EXPLORATION',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'You stand in the center of the living room.',
        'Somewhere in this apartment are answers.',
        'You need to search. Carefully.',
        'Where should you look first?'
      ],
      choices: [
        { text: '[ Living Room ]', action: 'livingroom_approach', disabled: false },
        { text: '[ Bedroom ]', action: 'bedroom_approach', disabled: false }
      ]
    },
    
    // Living Room path
    livingroom_approach: {
      title: 'LIVING ROOM',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'The living room is small but tidy.',
        'A worn sofa faces a modest TV.',
        'Books are scattered on the coffee table.',
        'A photo frame catches your eye.'
      ],
      choices: [
        { text: '[ Examine the photo ]', action: 'coffee_table_scene' }
      ]
    },
    
    // Interactive scene: Coffee Table
    coffee_table_scene: {
      title: 'LIVING ROOM',
      location: 'Coffee Table',
      isInteractive: true,
      interactiveType: 'coffee_table'
    },
    
    livingroom_collected: {
      title: 'LIVING ROOM',
      location: 'Coffee Table',
      narrative: [
        'You carefully pocket the photo.',
        'Something about that shadow... it feels important.',
        'You need to keep searching.',
        'What else is hidden in this apartment?'
      ],
      choices: [
        { text: '[ Continue searching ]', action: 'explore_intro' }
      ]
    },
    
    // Bedroom path
    bedroom_approach: {
      title: 'BEDROOM',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'The bedroom is small and neat.',
        'A single bed, a wardrobe, a bedside table.',
        'The sheets are still made from days ago.',
        'Before the accident.'
      ],
      choices: [
        { text: '[ Check bedside table ]', action: 'bedside_scene' }
      ]
    },
    
    // Interactive scene: Bedside Table
    bedside_scene: {
      title: 'BEDROOM',
      location: 'Bedside Table',
      isInteractive: true,
      interactiveType: 'bedside'
    },
    
    bedside_collected: {
      title: 'BEDROOM',
      location: 'Bedside Table',
      narrative: [
        'You read the note again:',
        '"Can\'t sleep again. The dreams are getting worse."',
        '"I keep seeing myself from outside my body."',
        'A chill runs down your spine.',
        'What was happening to you before the accident?'
      ],
      choices: [
        { text: '[ Continue ]', action: 'bedroom_wardrobe' }
      ]
    },
    
    bedroom_wardrobe: {
      title: 'BEDROOM',
      location: 'Wardrobe',
      narrative: [
        'You notice a jewelry box in the wardrobe.',
        'It feels familiar. Heavy with meaning.',
        'This was a gift from your mother.',
        'Or at least, that\'s what you remember.'
      ],
      choices: [
        { text: '[ Open jewelry box ]', action: 'jewelry_approach' }
      ]
    },
    
    jewelry_approach: {
      title: 'BEDROOM',
      location: 'Jewelry Box',
      narrative: [
        'Inside the box, a folded piece of paper.',
        'Your mother\'s handwriting:',
        '"Jing\'er, rely on yourself. -Mom"',
        'A memory surfaces unbidden.',
        'Your fingers move on their own.'
      ],
      choices: [
        { text: '[ Lift the lining ]', action: 'jewelry_scene' }
      ]
    },
    
    // Interactive scene: Jewelry Box
    jewelry_scene: {
      title: 'BEDROOM',
      location: 'Jewelry Box',
      isInteractive: true,
      interactiveType: 'jewelry'
    },
    
    usb_collected: {
      title: 'DISCOVERY',
      location: 'Hidden Compartment',
      narrative: [
        'A USB drive.',
        'The label reads:',
        '"Urban Aphasia - Original Recording - DO NOT DELETE"',
        'This was the story you were investigating.',
        'Before everything changed.'
      ],
      choices: [
        { text: '[ Continue ]', action: 'check_exploration_complete' }
      ]
    },
    
    // Mysterious message
    mysterious_message_1: {
      title: 'INTRUSION',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'Your phone buzzes.',
        'An unknown number.',
        'Your heart stops.',
        'You open the message...'
      ],
      choices: [
        { text: '[ Read message ]', action: 'open_phone' }
      ]
    },
    
    // After closing phone
    phone_closed: {
      title: 'THREAT',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'Your blood runs cold.',
        'The photo attachment showed your bedroom.',
        'Taken from above. While you were sleeping.',
        'They know where you live.',
        'They\'ve been watching.'
      ],
      choices: [
        { text: '[ Continue ]', action: 'chapter_end_decision' }
      ]
    },
    
    chapter_end_decision: {
      title: 'FLIGHT',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'You grab your bag.',
        'The USB drive. Your phone. Your wallet.',
        'You can\'t stay here.',
        'You need to find somewhere safe.',
        'You need to find the truth.'
      ],
      choices: [
        { text: '[ Leave ]', action: 'chapter_end_final' }
      ]
    },
    
    chapter_end_final: {
      title: 'DEPARTURE',
      location: 'Lin Jing\'s Apartment',
      narrative: [
        'You take one last look at the apartment.',
        'This place was supposed to be home.',
        'Now it feels like a trap.',
        'The door clicks shut behind you.',
        'There\'s no going back now.'
      ],
      choices: [
        { text: '[ End of Chapter 2 ]', action: 'chapter_complete' }
      ]
    },
    
    // Chapter end screen
    chapter_complete: {
      title: 'CHAPTER 2 COMPLETE',
      location: 'Mirror Life',
      narrative: [
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        'MIRROR LIFE',
        'Chapter 2: Return Home',
        ' ',
        '[ COMPLETE ]',
        ' ',
        `Evidence Collected: ${evidenceCount}/3`,
        ' ',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        'The story continues...'
      ],
      choices: [
        { text: '[ Return to Main Menu ]', action: 'return_menu' },
        { text: '[ Continue to Chapter 3 ]', action: 'chapter_3' }
      ]
    }
  };

  // ========== Loading Phase ==========
  useEffect(() => {
    if (gamePhase === 'loading') {
      const timer = setTimeout(() => {
        setGamePhase('scene');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  // ========== Typewriter Effect (Same as Chapter1) ==========
  useEffect(() => {
    if (gamePhase !== 'scene') return;
    
    const scene = scenes[currentScene];
    if (!scene) return;
    if (scene.isInteractive) return; // Skip typewriter for interactive scenes
    if (showChoices) return;

    const currentLine = scene.narrative[textIndex];

    if (!currentLine && textIndex >= scene.narrative.length) {
      setShowChoices(true);
      setIsTyping(false);
      return;
    }

    if (!currentLine) return;

    if (charIndex < currentLine.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        playTypeSound();
        setDisplayedText(prev => prev + currentLine[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 12);
      return () => clearTimeout(timer);
    } else if (charIndex === currentLine.length && displayedText === currentLine) {
      setIsTyping(false);
      const timer = setTimeout(() => {
        setCompletedLines(prev => {
          if (prev.length === textIndex) {
            return [...prev, currentLine];
          }
          return prev;
        });
        setDisplayedText('');
        setCharIndex(0);
        
        if (textIndex < scene.narrative.length - 1) {
          setTextIndex(prev => prev + 1);
        } else {
          setShowChoices(true);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, currentScene, textIndex, charIndex, displayedText, showChoices]);

  // ========== Scene Change Handler ==========
  const handleSceneChange = (newScene) => {
    const targetScene = scenes[newScene];
    
    // Reset interactive phases when entering interactive scenes
    if (targetScene?.isInteractive) {
      if (targetScene.interactiveType === 'coffee_table') {
        setCoffeePhase('idle');
      } else if (targetScene.interactiveType === 'bedside') {
        setBedsidePhase('idle');
      } else if (targetScene.interactiveType === 'jewelry') {
        setJewelryPhase('idle');
      }
    }
    
    setCurrentScene(newScene);
    setTextIndex(0);
    setCharIndex(0);
    setDisplayedText('');
    setCompletedLines([]);
    setShowChoices(false);
    setIsTyping(true);
  };

  // ========== Choice Handler ==========
  const handleChoice = (action, choiceData) => {
    if (typeof action === 'function') {
      action();
    } else {
      switch(action) {
        case 'trigger_notification':
          setShowNotification(true);
          break;
        case 'open_phone':
          setShowPhone(true);
          break;
        case 'check_exploration_complete':
          // Check if both areas explored
          if (collectedEvidence.includes('photo') && collectedEvidence.includes('usb')) {
            handleSceneChange('mysterious_message_1');
          } else {
            handleSceneChange('explore_intro');
          }
          break;
        case 'chapter_3':
          if (onComplete) onComplete();
          break;
        case 'return_menu':
          if (onBack) onBack();
          break;
        default:
          if (scenes[action]) {
            handleSceneChange(action);
          } else {
            console.log('Unknown action:', action);
          }
      }
    }
  };

  // ========== Interactive Scene Handlers ==========
  
  // Coffee Table Scene
  const handleCoffeeClick = () => {
    if (coffeePhase === 'idle') {
      setCoffeePhase('collected');
      // Collect evidence
      const card = cardDatabase.photo;
      setCurrentCard(card);
      setShowCardPopup(true);
      setEvidenceCount(prev => prev + 1);
      setCollectedEvidence(prev => [...prev, 'photo']);
      setPendingScene('livingroom_collected');
    }
  };

  const renderCoffeeTableScene = () => {
    return (
      <div style={interactiveStyles.container}>
        <div style={interactiveStyles.sceneBox}>
          <div style={interactiveStyles.coffeeTable}>
            <div style={interactiveStyles.tableTop}></div>
            <div 
              style={{
                ...interactiveStyles.photoFrame,
                opacity: coffeePhase === 'collected' ? 0.3 : 1,
                cursor: coffeePhase === 'collected' ? 'not-allowed' : 'pointer'
              }}
              onClick={handleCoffeeClick}
            >
              <div style={interactiveStyles.photoContent}>
                <div style={interactiveStyles.photoGrain}></div>
                <div style={interactiveStyles.photoVignette}></div>
                <div style={interactiveStyles.photoScratches}></div>
                <div style={interactiveStyles.photoShadow}></div>
                <div style={interactiveStyles.photoPerson}>
                  <div style={interactiveStyles.photoHead}></div>
                  <div style={interactiveStyles.photoBody}></div>
                </div>
              </div>
            </div>
          </div>
          <div style={interactiveStyles.hint}>
            {coffeePhase === 'idle' && '▶ CLICK PHOTO TO EXAMINE'}
            {coffeePhase === 'collected' && '✓ COLLECTED'}
          </div>
        </div>
      </div>
    );
  };

  // Bedside Scene
  const handleDrawerClick = () => {
    if (bedsidePhase === 'idle') {
      setBedsidePhase('opening');
      // Animation sequence
      setTimeout(() => {
        setBedsidePhase('opened');
        // Collect after animation
        setTimeout(() => {
          const card = cardDatabase.pills;
          setCurrentCard(card);
          setShowCardPopup(true);
          setEvidenceCount(prev => prev + 1);
          setCollectedEvidence(prev => [...prev, 'pills']);
          setPendingScene('bedside_collected');
        }, 1000);
      }, 400);
    }
  };

  const renderBedsideScene = () => {
    return (
      <div style={interactiveStyles.container}>
        <div style={interactiveStyles.sceneBox}>
          <div style={interactiveStyles.bedsideTable}>
            <div 
              style={{
                ...interactiveStyles.drawer,
                transform: bedsidePhase !== 'idle' ? 'translateY(-15px)' : 'translateY(0)',
                transition: 'transform 0.4s ease',
                cursor: bedsidePhase === 'idle' ? 'pointer' : 'default'
              }}
              onClick={handleDrawerClick}
            >
              <div style={interactiveStyles.drawerHandle}></div>
            </div>
            
            {/* Pills rising from drawer */}
            {(bedsidePhase === 'opening' || bedsidePhase === 'opened') && (
              <div style={{
                position: 'absolute',
                bottom: bedsidePhase === 'opened' ? '120px' : '50px',
                fontSize: '40px',
                transition: 'bottom 1s ease, opacity 0.5s ease',
                opacity: bedsidePhase === 'opened' ? 1 : 0.5,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
              }}>
                💊
              </div>
            )}
          </div>
          <div style={interactiveStyles.hint}>
            {bedsidePhase === 'idle' && '▶ CLICK DRAWER TO OPEN'}
            {bedsidePhase === 'opening' && 'OPENING...'}
            {bedsidePhase === 'opened' && '✓ FOUND'}
          </div>
        </div>
      </div>
    );
  };

  // Jewelry Scene
  const handleJewelryClick = (target) => {
    if (target === 'box' && jewelryPhase === 'idle') {
      setJewelryPhase('lid_open');
    } else if (target === 'lining' && jewelryPhase === 'lid_open') {
      setJewelryPhase('lining_lifted');
      // Collect USB after animation
      setTimeout(() => {
        const card = cardDatabase.usb;
        setCurrentCard(card);
        setShowCardPopup(true);
        setEvidenceCount(prev => prev + 1);
        setCollectedEvidence(prev => [...prev, 'usb']);
        setPendingScene('usb_collected');
      }, 600);
    }
  };

  const renderJewelryScene = () => {
    return (
      <div style={interactiveStyles.container}>
        <div style={interactiveStyles.sceneBox}>
          <div 
            style={{
              ...interactiveStyles.jewelryBox,
              borderColor: jewelryPhase !== 'idle' ? '#e8c468' : '#8a5a5a',
              boxShadow: jewelryPhase !== 'idle' ? '0 0 30px rgba(232, 196, 104, 0.5)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
              cursor: jewelryPhase === 'idle' ? 'pointer' : 'default'
            }}
            onClick={() => jewelryPhase === 'idle' && handleJewelryClick('box')}
          >
            <div style={{
              ...interactiveStyles.boxLid,
              transform: jewelryPhase !== 'idle' ? 'rotateX(-120deg)' : 'rotateX(0deg)',
              transition: 'transform 0.6s ease'
            }}>
              <div style={interactiveStyles.goldLock}></div>
            </div>
            
            {jewelryPhase === 'lid_open' && (
              <div 
                style={{
                  ...interactiveStyles.boxLining,
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJewelryClick('lining');
                }}
              >
                <div style={{
                  fontSize: '8px',
                  color: '#4ecdc4',
                  textAlign: 'center',
                  marginTop: '12px'
                }}>
                  CLICK TO LIFT
                </div>
              </div>
            )}
            
            {jewelryPhase === 'lining_lifted' && (
              <div style={{
                ...interactiveStyles.hiddenUSB,
                animation: 'usbGlow 1.5s ease-in-out infinite'
              }}>
                📀
              </div>
            )}
          </div>
          <div style={interactiveStyles.hint}>
            {jewelryPhase === 'idle' && '▶ CLICK BOX TO OPEN'}
            {jewelryPhase === 'lid_open' && '▶ CLICK LINING TO LIFT'}
            {jewelryPhase === 'lining_lifted' && '✓ USB FOUND'}
          </div>
        </div>
      </div>
    );
  };

  // ========== Handlers ==========
  const handleCardClose = () => {
    setShowCardPopup(false);
    if (pendingScene) {
      handleSceneChange(pendingScene);
      setPendingScene(null);
    }
  };

  const handleNotificationDismiss = () => {
    setShowNotification(false);
    handleSceneChange('apartment_entry_1');
  };

  const handleClosePhone = () => {
    setShowPhone(false);
    handleSceneChange('phone_closed');
  };

  const handleSkip = () => {
    const scene = scenes[currentScene];
    if (!scene || scene.isInteractive) return;
    
    setCompletedLines(scene.narrative);
    setDisplayedText('');
    setTextIndex(scene.narrative.length - 1);
    setCharIndex(scene.narrative[scene.narrative.length - 1]?.length || 0);
    setShowChoices(true);
    setIsTyping(false);
  };

  const handleTextAreaClick = () => {
    if (!isTyping) return;
    const scene = scenes[currentScene];
    if (!scene) return;
    const currentLine = scene.narrative[textIndex];
    if (currentLine && charIndex < currentLine.length) {
      setDisplayedText(currentLine);
      setCharIndex(currentLine.length);
    }
  };

  // ========== Get Current Scene ==========
  const getCurrentScene = () => scenes[currentScene] || {};

  // ========== Main Render ==========
  if (gamePhase === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingTitle}>MIRROR LIFE</p>
          <p style={styles.loadingSubtitle}>Chapter 2: Return Home</p>
          <div style={styles.loadingBarContainer}>
            <div style={styles.loadingBar} />
          </div>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  const scene = getCurrentScene();

  return (
    <div style={styles.container}>
      <div style={styles.gameFrame}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.chapterTitle}>{scene.title || 'MIRROR LIFE'}</span>
          <span style={styles.location}>{scene.location || ''}</span>
          <span style={styles.fragmentCounter}>📂 {evidenceCount}/3</span>
        </div>

        {/* Check if interactive scene */}
        {scene.isInteractive ? (
          // Render interactive scene
          <>
            {scene.interactiveType === 'coffee_table' && renderCoffeeTableScene()}
            {scene.interactiveType === 'bedside' && renderBedsideScene()}
            {scene.interactiveType === 'jewelry' && renderJewelryScene()}
          </>
        ) : (
          // Normal narrative scene
          <>
            {/* Narrative Area */}
            <div style={styles.narrativeArea} onClick={handleTextAreaClick}>
              {completedLines.map((text, i) => (
                <p key={i} style={styles.narrativeText}>{text}</p>
              ))}
              {displayedText && (
                <p style={styles.narrativeText}>
                  {displayedText}
                  <span style={styles.cursor}>▌</span>
                </p>
              )}
              {isTyping && (
                <div style={styles.clickHint}>[ Click to speed up ]</div>
              )}
            </div>

            {/* Choices */}
            {showChoices && scene.choices && (
              <div style={styles.choiceArea}>
                {scene.choices.map((choice, index) => {

                  const hasPhoto = collectedEvidence.includes('photo'); // 客厅完成标志
                  const hasUsb = collectedEvidence.includes('usb');     // 卧室完成标志

                  let isCompleted = false; // 是否已完成（显示打勾）
                  let isLocked = false;    // 是否被锁定（显示锁）

                  if (choice.action === 'livingroom_approach') {
                    // 如果拿到照片，视为客厅探索完毕
                    if (hasPhoto) isCompleted = true;
                  } 
                  else if (choice.action === 'bedroom_approach') {
                    // 如果拿到USB，视为卧室探索完毕
                    if (hasUsb) isCompleted = true;
                    // 如果还没拿到照片(客厅没做完)，则卧室锁定
                    else if (!hasPhoto) isLocked = true;
                  }

                  let displayText = choice.text;
                  if (isCompleted) {
                    displayText = `✓ ${choice.text.replace(/[\[\]]/g, '')}`;
                  } else if (isLocked) {
                    displayText = `🔒 ${choice.text}`; // 或者显示 "🔒 Bedroom (Locked)"
                  }

                  const isDisabled = isCompleted || isLocked;
                  
                  return (
                    <button
                      key={index}
                      style={{
                        ...styles.choiceButton,
                        // 如果是锁定状态，给一个更明显的灰色样式，区别于已完成
                        opacity: isLocked ? 0.5 : (isDisabled ? 0.8 : 1),
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        borderColor: isLocked ? '#5d6f7f' : (isDisabled ? '#4ecdc4' : '#4ecdc4'),
                        color: isLocked ? '#5d6f7f' : (isDisabled ? '#4ecdc4' : '#4ecdc4')
                      }}
                      onClick={() => !isDisabled && handleChoice(choice.action, choice)}
                      disabled={isDisabled}
                    >
                      {displayText}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Bottom Controls */}
        <div style={styles.bottomControls}>
          <button style={styles.controlBtn} onClick={onBack}>ESC - Menu</button>
          <button style={styles.controlBtn} onClick={handleSkip}>SKIP ⏭</button>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotification && (
        <div style={styles.overlay}>
          <div style={styles.notificationPopup}>
            <div style={styles.notificationTitle}>⚠️ SYSTEM ALERT</div>
            <p style={styles.notificationText}>
              Location change detected<br/>
              Nanshan Hospital → Luohu District Apartment<br/>
              Security check in progress...
            </p>
            <button style={styles.notificationButton} onClick={handleNotificationDismiss}>
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* Evidence Card Popup */}
      {showCardPopup && currentCard && (
        <EvidenceCardPopup cardData={currentCard} onClose={handleCardClose} />
      )}

      {/* Phone Interface */}
      {showPhone && (
        <div style={styles.phoneModal}>
          <PhoneSystem onClose={handleClosePhone} showMysteriousMessage={true} />
        </div>
      )}
    </div>
  );
};

// ========== Interactive Scene Styles ==========
const interactiveStyles = {
  container: {
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25px'
  },
  sceneBox: {
    width: '100%',
    height: '300px',
    background: 'linear-gradient(180deg, #1a2a3a 0%, #0a1a2a 100%)',
    border: '2px solid #2a4a6a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  hint: {
    position: 'absolute',
    bottom: '20px',
    fontSize: '8px',
    color: '#4ecdc4',
    animation: 'blink 1.5s infinite'
  },
  
  // Coffee Table
  coffeeTable: {
    width: '180px',
    height: '100px',
    background: 'linear-gradient(135deg, #4a3a2a 0%, #3a2a1a 50%, #2a1a0a 100%)',
    border: '3px solid #5a4a3a',
    borderRadius: '8px',
    position: 'relative',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableTop: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent 0%, rgba(90, 74, 58, 0.1) 50%, transparent 100%)',
    borderRadius: '4px',
    position: 'absolute',
    pointerEvents: 'none'
  },
  photoFrame: {
    width: '60px',
    height: '75px',
    background: '#0a0a0a',
    border: '3px solid #4ecdc4',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(78, 205, 196, 0.4)',
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden'
  },
  photoContent: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(75, 80, 85, 0.9) 0%, rgba(65, 70, 75, 0.95) 50%, rgba(55, 60, 65, 0.9) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px)',
    pointerEvents: 'none'
  },
  photoGrain: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.2,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'3.5\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
    pointerEvents: 'none',
    mixBlendMode: 'overlay'
  },
  photoVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.4) 100%)',
    pointerEvents: 'none',
    zIndex: 10
  },
  photoScratches: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent 0%, transparent 35%, rgba(255,255,255,0.05) 35.3%, transparent 35.6%)',
    pointerEvents: 'none',
    zIndex: 11
  },
  photoShadow: {
    position: 'absolute',
    top: '22%',
    right: '15%',
    width: '13px',
    height: '28px',
    background: 'radial-gradient(ellipse, rgba(220, 70, 70, 0.7) 0%, rgba(190, 50, 50, 0.5) 35%, transparent 100%)',
    filter: 'blur(2.5px)',
    zIndex: 1,
    animation: 'shadowCreep 3s ease-in-out infinite',
    pointerEvents: 'none'
  },
  photoPerson: {
    position: 'relative',
    zIndex: 2,
    width: '16px',
    height: '32px',
    filter: 'blur(0.8px)',
    opacity: 0.9,
    pointerEvents: 'none'
  },
  photoHead: {
    width: '10px',
    height: '10px',
    background: 'radial-gradient(circle at 40% 30%, rgba(110, 115, 120, 0.95) 0%, rgba(85, 90, 95, 0.9) 60%, rgba(70, 75, 80, 0.85) 100%)',
    borderRadius: '50%',
    margin: '0 auto 2px',
    opacity: 0.85
  },
  photoBody: {
    width: '14px',
    height: '20px',
    background: 'linear-gradient(180deg, rgba(95, 100, 105, 0.9) 0%, rgba(80, 85, 90, 0.85) 50%, rgba(70, 75, 80, 0.8) 100%)',
    borderRadius: '1px 1px 2px 2px',
    margin: '0 auto',
    opacity: 0.85
  },
  
  // Bedside Table
  bedsideTable: {
    width: '150px',
    height: '180px',
    background: 'linear-gradient(180deg, #4a3a2a 0%, #3a2a1a 100%)',
    border: '3px solid #5a4a3a',
    borderRadius: '4px',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '40px'
  },
  drawer: {
    width: '120px',
    height: '60px',
    background: 'linear-gradient(180deg, #2a1a0a 0%, #1a0a00 100%)',
    border: '2px solid #4a3a2a',
    borderRadius: '2px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  drawerHandle: {
    width: '30px',
    height: '8px',
    background: '#4ecdc4',
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(78, 205, 196, 0.5)',
    pointerEvents: 'none'
  },
  
  // Jewelry Box
  jewelryBox: {
    width: '200px',
    height: '80px',
    background: 'linear-gradient(180deg, #6a3a3a 0%, #4a2a2a 100%)',
    border: '3px solid #8a5a5a',
    borderRadius: '4px',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxLid: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #8a5a5a 0%, #6a3a3a 100%)',
    borderRadius: '4px 4px 0 0',
    transformOrigin: 'top',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  goldLock: {
    width: '20px',
    height: '15px',
    border: '3px solid #e8c468',
    borderRadius: '3px',
    background: '#8a6a2a',
    boxShadow: '0 0 10px rgba(232, 196, 104, 0.5)'
  },
  boxLining: {
    width: '150px',
    height: '40px',
    background: '#2a1a2a',
    border: '2px solid #4ecdc4',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(78, 205, 196, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  hiddenUSB: {
    width: '150px',
    height: '40px',
    background: '#0a0a0a',
    border: '2px solid #4ecdc4',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 0 30px rgba(78, 205, 196, 0.5)'
  }
};

// ========== Main Styles (Chapter1 Style) ==========
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(180deg, #0a1428 0%, #1a2332 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Press Start 2P", monospace',
    position: 'relative',
    overflow: 'hidden'
  },

  loadingContainer: {
    textAlign: 'center'
  },

  loadingTitle: {
    fontSize: '24px',
    color: '#4ecdc4',
    marginBottom: '10px',
    textShadow: '0 0 20px rgba(78, 205, 196, 0.8)',
    animation: 'neonPulse 2s ease-in-out infinite'
  },

  loadingSubtitle: {
    fontSize: '12px',
    color: '#c8d5e0',
    marginBottom: '30px'
  },

  loadingBarContainer: {
    width: '300px',
    height: '8px',
    background: '#1a2332',
    border: '2px solid #4ecdc4',
    margin: '0 auto 20px'
  },

  loadingBar: {
    height: '100%',
    background: '#4ecdc4',
    animation: 'loadingSlide 2.5s ease-out forwards'
  },

  loadingText: {
    fontSize: '10px',
    color: '#5d6f7f'
  },

  gameFrame: {
    width: '800px',
    maxWidth: '95vw',
    background: 'rgba(26, 35, 50, 0.95)',
    border: '3px solid #4ecdc4',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 0 40px rgba(78, 205, 196, 0.2), inset 0 0 60px rgba(0,0,0,0.5)',
    position: 'relative'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #374a5f',
    paddingBottom: '15px',
    marginBottom: '25px'
  },

  chapterTitle: {
    fontSize: '14px',
    color: '#4ecdc4',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.6)'
  },

  location: {
    fontSize: '10px',
    color: '#e8c468'
  },

  fragmentCounter: {
    fontSize: '10px',
    color: '#c8d5e0'
  },

  narrativeArea: {
    minHeight: '250px',
    marginBottom: '25px',
    cursor: 'pointer'
  },

  narrativeText: {
    fontSize: '12px',
    lineHeight: 2.2,
    color: '#c8d5e0',
    marginBottom: '8px'
  },

  cursor: {
    color: '#4ecdc4',
    animation: 'blink 0.5s infinite'
  },

  clickHint: {
    fontSize: '8px',
    color: '#5d6f7f',
    textAlign: 'center',
    marginTop: '20px'
  },

  choiceArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '25px'
  },

  choiceButton: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '11px',
    padding: '15px 20px',
    background: 'rgba(37, 52, 71, 0.8)',
    border: '2px solid #4ecdc4',
    color: '#4ecdc4',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease'
  },

  bottomControls: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '20px',
    borderTop: '1px solid #374a5f',
    gap: '10px'
  },

  controlBtn: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '8px',
    padding: '10px 15px',
    background: 'transparent',
    border: '1px solid #5d6f7f',
    color: '#5d6f7f',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },

  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },

  notificationPopup: {
    background: 'linear-gradient(180deg, rgba(20, 30, 50, 0.98) 0%, rgba(15, 25, 40, 0.98) 100%)',
    border: '2px solid #ff6600',
    padding: '30px',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 0 30px rgba(255, 102, 0, 0.5)'
  },

  notificationTitle: {
    color: '#ff6600',
    fontSize: '12px',
    marginBottom: '15px'
  },

  notificationText: {
    fontSize: '10px',
    lineHeight: '1.8',
    color: '#c8d5e0',
    marginBottom: '20px'
  },

  notificationButton: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '10px',
    padding: '12px 25px',
    background: '#ff6600',
    border: 'none',
    color: '#000',
    cursor: 'pointer'
  },

  phoneModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }
};

// ========== CSS Animations ==========
if (typeof document !== 'undefined') {
  const styleSheet = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    @keyframes loadingSlide {
      0% { width: 0; }
      100% { width: 100%; }
    }

    @keyframes neonPulse {
      0%, 100% { text-shadow: 0 0 20px rgba(78, 205, 196, 0.8); }
      50% { text-shadow: 0 0 30px rgba(78, 205, 196, 1), 0 0 50px rgba(78, 205, 196, 0.5); }
    }

    @keyframes shadowCreep {
      0%, 100% { 
        opacity: 0.6;
        transform: scale(1, 1) translateX(0) skewX(0deg);
      }
      25% { 
        opacity: 0.9;
        transform: scale(1.08, 1.04) translateX(1px) skewX(2deg);
      }
      50% { 
        opacity: 0.75;
        transform: scale(1.04, 1.06) translateX(-0.5px) skewX(-1deg);
      }
      75% { 
        opacity: 0.85;
        transform: scale(1.06, 1.03) translateX(0.5px) skewX(1deg);
      }
    }

    @keyframes usbGlow {
      0%, 100% {
        box-shadow: 0 0 30px rgba(78, 205, 196, 0.5);
      }
      50% {
        box-shadow: 0 0 50px rgba(78, 205, 196, 0.8), 0 0 80px rgba(78, 205, 196, 0.4);
      }
    }

    button:hover:not(:disabled) {
      background: #4ecdc4 !important;
      color: #0a1428 !important;
      border-color: #4ecdc4 !important;
      box-shadow: 0 0 20px rgba(78, 205, 196, 0.4) !important;
    }
  `;

  const existingStyle = document.getElementById('chapter2-styles');
  if (existingStyle) existingStyle.remove();
  
  const style = document.createElement('style');
  style.id = 'chapter2-styles';
  style.textContent = styleSheet;
  document.head.appendChild(style);
}

export default Chapter2;