// Chapter1.jsx - Mirror Life: Chapter 1 - Awakening
// COMPLETE VERSION with Elevator Scene Effects
import React, { useState, useEffect, useRef } from 'react';
import PhoneSystem from "./PhoneSystem";
import EvidenceCardPopup from "./EvidenceCardPopup"; 

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
    
    // 复古打字机效果
    oscillator.frequency.value = 350 + Math.random() * 50;
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
    
  } catch (e) {}
};

// 乱码/干扰音效
const playGlitchSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const duration = 2; // 持续2秒
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    // 生成随机噪音 + 电子干扰效果
    for (let i = 0; i < data.length; i++) {
      // 基础白噪音
      let noise = Math.random() * 2 - 1;
      
      // 添加脉冲效果（每隔一段时间有尖锐的声音）
      if (Math.random() < 0.01) {
        noise *= 3;
      }
      
      // 添加低频调制（让声音有"说话"的感觉）
      const modulation = Math.sin(i / sampleRate * Math.PI * 8) * 0.5 + 0.5;
      
      data[i] = noise * 0.15 * modulation;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    
    // 添加滤波器让声音更像无线电干扰
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 1;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.3;
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start();
    
  } catch (e) {
    console.log('Audio error:', e);
  }
};

const Chapter1 = ({ onBack, onComplete, onSave, saveData, setSaveData }) => {
  const [gamePhase, setGamePhase] = useState('loading'); 
  const [currentScene, setCurrentScene] = useState('awakening');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [memoryFragments, setMemoryFragments] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [phoneUnlocked, setPhoneUnlocked] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [completedLines, setCompletedLines] = useState([]);
  const [isRinging, setIsRinging] = useState(false);
  const ringIntervalRef = useRef(null);
  const audioContextRef = useRef(null);

  const playRingTone = () => {
  if (!audioContextRef.current) {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = audioContextRef.current;
  
  // 创建一个简单的双音铃声 (类似老式电话)
  const playTone = (freq1, freq2, duration) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.frequency.value = freq1;
    osc2.frequency.value = freq2;
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    gainNode.gain.value = 0.1; // 音量
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    
    setTimeout(() => {
      osc1.stop();
      osc2.stop();
    }, duration);
  };
  
  // 播放 "ring ring" 模式
  playTone(800, 1000, 200);
  setTimeout(() => playTone(800, 1000, 200), 300);
};

// 开始循环铃声
const startRinging = () => {
  setIsRinging(true);
  playRingTone(); // 立即播放一次
  ringIntervalRef.current = setInterval(() => {
    playRingTone();
  }, 2000); // 每2秒响一次
};

// 停止铃声
const stopRinging = () => {
  setIsRinging(false);
  if (ringIntervalRef.current) {
    clearInterval(ringIntervalRef.current);
    ringIntervalRef.current = null;
  }
};

// 清理
useEffect(() => {
  return () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
    }
  };
}, []);

  // === 卡片系统状态 ===
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [collectedEvidence, setCollectedEvidence] = useState([]);
  const [pendingScene, setPendingScene] = useState(null);

  // === 电梯场景状态 ===
  const [elevatorPhase, setElevatorPhase] = useState('idle'); 
  const [currentFloor, setCurrentFloor] = useState(7);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceCharIndex, setVoiceCharIndex] = useState(0);
  const [showRedText, setShowRedText] = useState(false);
  const [elevatorChoice, setElevatorChoice] = useState(null);

  // === 卡片数据库 ===
  const cardDatabase = {
    doctor_card: {
      type: 'EVIDENCE',
      title: "Doctor's Card",
      icon: '📇',
      description: "A pristine business card. The paper is thick and expensive. On the back: \"If you want to know more about the Mirror Project, contact me. -W\"",
      details: [
        'Name: Wang Chen, M.D.',
        'Title: Chief Physician',
        'Hospital: Shenzhen Third People\'s'
      ]
    }
  };

  // Loading phase
  useEffect(() => {
    if (gamePhase === 'loading') {
      const timer = setTimeout(() => {
        setGamePhase('scene');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  // === 电梯场景动画序列 ===
useEffect(() => {
  if (currentScene !== 'elevator') return;

  if (elevatorPhase === 'idle') {
    setElevatorPhase('entering');
    setTimeout(() => setElevatorPhase('descending'), 1500);
  }

  if (elevatorPhase === 'descending') {
    const floorInterval = setInterval(() => {
      setCurrentFloor(prev => {
        if (prev <= 4) {
          clearInterval(floorInterval);
          setTimeout(() => setElevatorPhase('glitch'), 500);
          return prev;
        }
        return prev - 1;
      });
    }, 800);
    return () => clearInterval(floorInterval);
  }

  if (elevatorPhase === 'glitch') {
    setShowGlitch(true);
    setTimeout(() => {
      setShowGlitch(false);
      setElevatorPhase('blackout');
    }, 400);
  }
//blackout effect
  if (elevatorPhase === 'blackout') {
  setShowBlackout(true);
  // 2秒后显示神秘声音
  setTimeout(() => {
    setVoiceText('Sample_099...');
    playGlitchSound(); // 播放乱码声音
  }, 2000);
  // 5秒后结束黑屏
  setTimeout(() => {
    setShowBlackout(false);
    setVoiceText('');
    setCurrentFloor(1);
    setElevatorPhase('exit');
  }, 5000);
}
}, [currentScene, elevatorPhase]);

  // Scene change handler
  const handleSceneChange = (newScene) => {
    if (newScene === 'elevator') {
      setElevatorPhase('idle');
      setCurrentFloor(7);
      setShowGlitch(false);
      setShowBlackout(false);
      setVoiceText('');
      setVoiceCharIndex(0);
      setShowRedText(false);
      setElevatorChoice(null);
    }
    
    setCurrentScene(newScene);
    setTextIndex(0);
    setCharIndex(0);
    setDisplayedText('');
    setCompletedLines([]);
    setShowChoices(false);
    setIsTyping(true);
  };

  const handleElevatorChoice = (choice) => {
    setElevatorChoice(choice);
    setElevatorPhase('post_choice');
  };

  // Choice handler
  const handleChoice = (action, choiceData) => {
    if (action === 'take_card' && choiceData?.cardId) {
       const card = cardDatabase[choiceData.cardId];
       if (card) {
         setCurrentCard(card);
         setShowCardPopup(true);
         setMemoryFragments(prev => prev + 1);
         if (!collectedEvidence.includes(choiceData.cardId)) {
            setCollectedEvidence(prev => [...prev, choiceData.cardId]);
         }
         if (choiceData.nextScene) {
            setPendingScene(choiceData.nextScene);
         }
       }
       return;
    }

    if (typeof action === 'function') {
      action();
    } else {
      switch(action) {
        case 'unlock_phone':
          setPhoneUnlocked(true);
          setShowPhone(true);
          break;
        case 'go_to_doctor':
          setShowPhone(false);
          handleSceneChange('doctor_consultation');
          break;
        case 'doctor_honest':
          handleSceneChange('doctor_honest');
          break;
        case 'doctor_hide':
          handleSceneChange('doctor_hide');
          break;
        case 'doctor_project':
          handleSceneChange('doctor_project');
          break;
        case 'doctor_probe':
          handleSceneChange('doctor_probe');
          break;
        case 'doctor_discharge_request': 
          handleSceneChange('doctor_discharge_request');
          break;
        case 'doctor_card': 
          handleSceneChange('doctor_card');
          break;
        case 'hospital_corridor':
          handleSceneChange('hospital_corridor');
          break;
        case 'corridor_message':
          handleSceneChange('corridor_message');
          break;
        case 'corridor_reply_vague':
          handleSceneChange('corridor_reply_vague');
          break;
        case 'corridor_reply_honest':
          handleSceneChange('corridor_reply_honest');
          break;
        case 'elevator':
          handleSceneChange('elevator');
          break;
        case 'hospital_exit':
          handleSceneChange('hospital_exit');
          break;
        case 'chapter_end':
          handleSceneChange('chapter_end');
          break;
        case 'return_menu':
          if (onBack) onBack();
          break;
        case 'chapter_2':
          if (onComplete) onComplete();
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

  const handleClosePhone = () => {
    setShowPhone(false);
    if (currentScene === 'phone_interface') {
      handleSceneChange('phone_complete');
    }
  };

  const handleCardClose = () => {
    setShowCardPopup(false);
    if (pendingScene) {
      handleSceneChange(pendingScene);
      setPendingScene(null);
    }
  };

  // Typewriter effect
useEffect(() => {
  if (gamePhase !== 'scene') return;
  if (currentScene === 'elevator') return;
  
  const scene = scenes[currentScene];
  if (!scene) return;
  if (showChoices) return;

  const currentLine = scene.narrative[textIndex];

  // === 铃声逻辑 ===
  // 当进入 phone_call 场景就开始响铃
  if (currentScene === 'phone_call' && !isRinging) {
    startRinging();
  }
  // === 铃声逻辑结束 ===

  if (!currentLine && textIndex >= scene.narrative.length) {
    setShowChoices(true);
    setIsTyping(false);
    return;
  }

    if (!currentLine) return;
    ////type sound
    if (charIndex < currentLine.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        playTypeSound(); 
        setDisplayedText(prev => prev + currentLine[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 12);
      return () => clearTimeout(timer);
      //
      
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

  const handleSkip = () => {
    const scene = scenes[currentScene];
    if (!scene) return;
    
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

  // ========== 完整场景数据 ==========
  const scenes = {
    // ========== OPENING SCENES ==========
    awakening: {
      title: 'AWAKENING',
      location: 'Hospital Room - Morning',
      narrative: [
        'The sound of shattering glass rang in my ears.',
        'The fall made my stomach drop—and then, everything stopped',
        'You open your eyes.',
        'White ceiling. Sterile smell. Beeping machines.',
        'This is... a hospital?'
      ],
      choices: [
        { text: '[ Sit up ]', action: () => handleSceneChange('phone_call') }
      ]
    },

    phone_call: {
      title: 'THE CALL',
      location: 'Hospital Room',
      narrative: [
        'Suddenly, a phone rings.',
        'Sharp. Jarring. Breaking the silence.',
        'You reach for your phone on the bedside table.',
        'The screen shows: [ Mother ]',
        'Like a stone hitting a pond,', 
        'the name sent ripples of anxiety through you.'
      ],
      choices: [
        { 
          text: '▶ Decline', 
          action: () => {
            stopRinging(); 
            setMemoryFragments(prev => prev + 1);
            handleSceneChange('phone_interface');
          }
        }
      ]
    },

    phone_interface: {
      title: 'THE INTERFACE',
      location: 'Hospital Room',
      narrative: [
        'Instinct took over, you declined the call.',
        '"I don\'t... I don\'t want to hear her voice right now."',
        'A nameless pressure gripped your throat,',
        'while cold sweat slicked your palms.',
        'The phone screen went dark, reflecting your own pale face.',
      ],
      choices: [
        { 
          text: '📱 Check messages', 
          action: 'unlock_phone'
        }
      ]
    },

    phone_complete: {
      title: 'UNSETTLING DISCOVERY',
      location: 'Hospital Room',
      narrative: [
        'You put down the phone, hands trembling slightly.',
        'Those messages... that calendar event...',
        'Something is deeply wrong.',
        'A knock at the door interrupts your thoughts.',
        '"Miss Lin? Dr. Wang is ready to see you now."',
        'A nurse stands in the doorway, clipboard in hand.'
      ],
      choices: [
        { text: '[ Follow the nurse ]', action: 'go_to_doctor' }
      ]
    },

    // ========== DOCTOR CONSULTATION ==========
    doctor_consultation: {
      title: 'THE CONSULTATION',
      location: 'Consultation Room',
      narrative: [
        'The consultation room is sterile. White walls, cold lighting.',
        'Dr. Wang sits behind a desk, late 40s, wire-rimmed glasses.',
        'His eyes are kind, but something in them makes you uneasy.',
        '"Miss Lin, how are you feeling today? Any dizziness?"'
      ],
      choices: [
        { 
          text: '"Still dizzy. And my memory is... foggy."', 
          action: 'doctor_honest' 
        },
        { 
          text: '"Much better. I\'d like to be discharged."', 
          action: 'doctor_hide' 
        }
      ]
    },

    doctor_honest: {
      title: 'THE CONSULTATION',
      location: 'Consultation Room',
      narrative: [
        'Dr. Wang nods, making notes.',
        '"That\'s completely normal. Your CT scan showed mild concussion."',
        '"Short-term memory confusion is a common side effect."',
        'He pauses, studying your face.',
        '"Miss Lin... do you remember why you were admitted?"',
        'You shake your head slowly.',
        '"You were in a car accident on November 13th."',
        '"The impact caused you to lose consciousness."',
        'A car accident? You don\'t remember any of it.'
      ],
      choices: [
        { text: '[ Continue ]', action: 'doctor_project' }
      ]
    },

    doctor_hide: {
      title: 'THE CONSULTATION',
      location: 'Consultation Room',
      narrative: [
        'Dr. Wang raises an eyebrow, studying you carefully.',
        '"Is that so? Do you remember why you were admitted?"',
        'You hesitate. "I..."',
        'His expression softens.',
        '"Take your time. You were in a car accident on November 13th."',
        '"Fortunately, the injuries weren\'t severe."',
        '"Mainly head trauma that caused temporary unconsciousness."',
        'A car accident? Why can\'t you remember?'
      ],
      choices: [
        { text: '[ Continue ]', action: 'doctor_project' }
      ]
    },

    doctor_project: {
      title: 'THE CONSULTATION',
      location: 'Consultation Room',
      narrative: [
        'Dr. Wang flips through your medical file.',
        '"One more thing... do you recall participating in any medical programs?"',
        'Medical programs?',
        '"Your records show you previously underwent treatment at..."',
        'He pauses, glancing at his computer screen.',
        '"...the Neural Rehabilitation Center."',
        '"Something called \'Mirror Cognitive Restructuring Therapy.\'"',
        '"Mirror..." you repeat, the word feeling strange on your tongue.',
        '"A new treatment for anxiety and PTSD."',
        '"Uses cognitive behavioral therapy with... assistive technologies."',
        'His voice trails off. He seems to be choosing his words carefully.'
      ],
      choices: [
        { 
          text: '"I don\'t remember any of this."', 
          action: 'doctor_discharge_request' 
        },
        { 
          text: '"What kind of assistive technologies?"', 
          action: 'doctor_probe' 
        }
      ]
    },

    doctor_probe: {
      title: 'THE CONSULTATION',
      location: 'Consultation Room',
      narrative: [
        'Dr. Wang\'s expression flickers. Just for a moment.',
        'Just a simple recovery therapy. Nothing invasive.',
        '"The details should be in your treatment records."',
        'He closes the file abruptly.',
        '"The important thing now is your recovery."',
        'Something in his tone has changed. More guarded.',
        'At the mention of "recovery"',
        'you don\' know why, but felt a sudden coldness.',
      ],
      choices: [
        { text: '"I want to be discharged."', action: 'doctor_discharge_request' }
      ]
    },

    doctor_discharge_request: {
      title: 'THE CONSULTATION',
      location: 'Consultation Room',
      narrative: [
        '"Dr. Wang, I\'d like to leave the hospital."',
        'He frowns slightly. "Are you sure? Your memory is still..."',
        '"I have an important deadline. A feature article."',
        '"I\'ll rest better at home. In familiar surroundings."',
        'A long pause. He sighs.',
        '"Very well. But you\'ll need to sign discharge papers."',
        'He hands you a form, then reaches into his drawer.',
        'A business card slides across the desk.',
        '"If anything feels... wrong. Headaches, flashbacks, anything unusual."',
        '"Contact me immediately."'
      ],
      choices: [
        { 
          text: '[ Take the card ]', 
          action: 'take_card',
          cardId: 'doctor_card',
          nextScene: 'after_card' 
        }
      ]
    },
    
    after_card: {
      title: 'THE BUSINESS CARD',
      location: 'Consultation Room',
      narrative: [
        'You pocket the card carefully.',
        '"If you want to know more about the Mirror Project, contact me. -W"',
        'Your heart skips a beat.',
        'He knows something. More than he\'s saying.',
        '[Memory Fragment Collected: Doctor\'s Card]'
      ],
      choices: [
        { text: '[ Sign the discharge papers ]', action: 'hospital_corridor' }
      ]
    },

    // ========== HOSPITAL CORRIDOR ==========
    hospital_corridor: {
      title: 'THE CORRIDOR',
      location: 'Hospital Corridor',
      narrative: [
        'You walk out of the consultation room.',
        'The corridor stretches before you.',
        'Cold white fluorescent lights humming overhead.',
        'The smell of disinfectant hangs in the air.',
        'Zhang Wei\'s text landed with crushing weight.',
        'A topic you knew nothing about.',
        'Three audio files sent by your own hand.',
        'It seemed as though a stranger\'s soul had been living your life perfectly.',
        'Right under your nose.',
        'The elevator waits at the end of the hall.'
      ],
      choices: [
        { text: '[ Take the elevator ]', action: 'elevator' }
      ]
    },

    // ========== ELEVATOR SCENE (Special Rendering) ==========
    elevator: {
      title: 'THE DESCENT',
      location: 'Hospital Elevator',
      narrative: [],
      choices: []
    },

    // ========== AFTER ELEVATOR ==========
    elevator_aftermath: {
      title: 'THE DESCENT',
      location: 'Hospital Lobby',
      narrative: [
        'You stumble out of the elevator, gasping.',
        'People in the lobby glance at you, then look away.',
        'Your heart pounds in your chest.',
        '"Sample_099..."',
        'What does that mean? Was that voice... in my head?',
        'The concussion. It must be the concussion.',
        'It has to be.'
      ],
      choices: [
        { text: '[ Exit the hospital ]', action: 'hospital_exit' }
      ]
    },

    // ========== HOSPITAL EXIT ==========
    hospital_exit: {
      title: 'DEPARTURE',
      location: 'Hospital Entrance',
      narrative: [
        'You step out into the Shenzhen afternoon.',
        'November air. Cool, with a hint of humidity.',
        'The city sprawls before you.',
        'Glass towers, construction cranes, endless motion.',
        'Everything feels both familiar and strange.',
        'Like coming home to a house where someone moved all the furniture.',
        'Just slightly. Just enough to notice.',
        'Your apartment is a 20-minute taxi ride away.',
        'Time to find some answers.'
      ],
      choices: [
        { text: '[ End of Chapter 1 ]', action: 'chapter_end' }
      ]
    },

    // ========== CHAPTER END ==========
    chapter_end: {
      title: 'CHAPTER 1 COMPLETE',
      location: 'Mirror Life',
      narrative: [
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  ' ',
  'MIRROR LIFE',
  'Chapter 1: Awakening',
  ' ',
  '[ COMPLETE ]',
  ' ',
  'Memory Fragments: ' + memoryFragments,
  ' ',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  ' ',
  'The story continues...'
],
      choices: [
        { text: '[ Return to Main Menu ]', action: 'return_menu' },
        { text: '[ Continue to Chapter 2 ]', action: 'chapter_2' }
      ]
    }
  };

  // ========== 电梯场景专用渲染 ==========
  const renderElevatorScene = () => {
    return (
      <div style={elevatorStyles.container}>
        {/* 停电黑幕 */}
<div style={{
  ...elevatorStyles.blackoutOverlay,
  opacity: showBlackout ? 1 : 0,
  pointerEvents: showBlackout ? 'auto' : 'none'
}} />

        {/* Glitch效果层 */}
        {showGlitch && (
          <div style={elevatorStyles.glitchOverlay}>
            <div style={elevatorStyles.glitchBar1} />
            <div style={elevatorStyles.glitchBar2} />
            <div style={elevatorStyles.glitchBar3} />
          </div>
        )}

        {/* 电梯门框 */}
        <div style={elevatorStyles.elevatorFrame}>
          {/* 楼层显示 */}
          <div style={elevatorStyles.floorDisplay}>
            <span style={elevatorStyles.floorNumber}>{currentFloor}F</span>
            <span style={elevatorStyles.floorArrow}>▼</span>
          </div>

          {/* 镜面电梯门 */}
          <div style={{
            ...elevatorStyles.elevatorDoor,
            filter: showGlitch ? 'hue-rotate(180deg) contrast(1.5)' : 'none'
          }}>
{/* 反射效果 - 只在glitch时出现 */}
<div style={elevatorStyles.reflection}>
  {showGlitch && (
    <div style={{
      ...elevatorStyles.silhouette,
      transform: 'scaleX(-1) translateX(8px)',
    }}>
    </div>
  )}
</div>


            <div style={elevatorStyles.doorGap} />
          </div>
        </div>

        {/* 文字区域 */}
<div style={elevatorStyles.textBox}>
  {elevatorPhase === 'entering' && (
    <p style={elevatorStyles.narration}>You step into the elevator...</p>
  )}
  
  {elevatorPhase === 'descending' && (
    <p style={elevatorStyles.narration}>
      The doors slide shut.
    </p>
  )}

{/* 黑屏时的神秘声音 */}
{elevatorPhase === 'blackout' && voiceText && (
  <p style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'monospace',
    fontSize: '16px',
    color: '#00ff00',
    textShadow: '0 0 10px rgba(0,255,0,0.8)',
    letterSpacing: '2px',
    zIndex: 150
  }}>
    {voiceText}
  </p>
)}


  {elevatorPhase === 'exit' && (
    <div style={elevatorStyles.choiceContainer}>
      <p style={elevatorStyles.narration}>
        The doors open to the hospital lobby.
      </p>
      <div style={elevatorStyles.choiceButtons}>
        <button 
          style={elevatorStyles.choiceBtn}
          onClick={() => handleSceneChange('elevator_aftermath')}
        >
          [ Step out ]
        </button>
      </div>
    </div>
  )}
</div>

        {/* CRT扫描线效果 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
          pointerEvents: 'none',
          zIndex: 200
        }} />
      </div>
    );
  };

  // ========== 主渲染 ==========
  if (gamePhase === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingTitle}>MIRROR LIFE</p>
          <p style={styles.loadingSubtitle}>Chapter 1: Awakening</p>
          <div style={styles.loadingBarContainer}>
            <div style={styles.loadingBar} />
          </div>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  const scene = scenes[currentScene];

  // 电梯场景使用特殊渲染
  if (currentScene === 'elevator') {
    return renderElevatorScene();
  }

  return (
    <div style={styles.container}>
      <div style={styles.gameFrame}>
        {/* 顶部信息栏 */}
        <div style={styles.header}>
          <span style={styles.chapterTitle}>{scene?.title || 'MIRROR LIFE'}</span>
          <span style={styles.location}>{scene?.location || ''}</span>
          <span style={styles.fragmentCounter}>🧩 {memoryFragments}</span>
        </div>

        {/* 文字区域 */}
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

        {/* 选项区域 */}
        {showChoices && scene?.choices && (
          <div style={styles.choiceArea}>
            {scene.choices.map((choice, index) => (
              <button
                key={index}
                style={styles.choiceButton}
                onClick={() => handleChoice(choice.action, choice)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

{/* 手机按钮 */}
<button 
  style={{
    ...styles.phoneButton,
    ...(isRinging && styles.phoneButtonRinging),
    ...(!phoneUnlocked && !isRinging && styles.phoneButtonDisabled)
  }}
  onClick={() => phoneUnlocked && setShowPhone(!showPhone)}
>
  📱
</button>

        {/* 底部控制栏 */}
        <div style={styles.bottomControls}>
          <button style={styles.controlBtn} onClick={onBack}>ESC - Menu</button>
          <button style={styles.controlBtn} onClick={onSave}>💾 Save</button>
          <button style={styles.controlBtn} onClick={handleSkip}>SKIP ⏭</button>
        </div>
      </div>

      {/* 手机弹窗 */}
      {showPhone && (
        <div style={styles.phoneModal}>
          <PhoneSystem onClose={handleClosePhone} />
        </div>
      )}

      {/* 证据卡片弹窗 */}
      {showCardPopup && currentCard && (
        <EvidenceCardPopup cardData={currentCard} onClose={handleCardClose} />
      )}
    </div>
  );
};

// ========== 电梯场景专用样式 ==========
const elevatorStyles = {
  container: {
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(180deg, #0a1428 0%, #1a2332 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },

  blackoutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#000',
    transition: 'opacity 0.3s ease',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  emergencyLight: {
    width: '20px',
    height: '20px',
    background: '#ff3333',
    borderRadius: '50%',
    boxShadow: '0 0 60px 30px rgba(255, 50, 50, 0.4)',
    animation: 'emergencyPulse 1s ease-in-out infinite'
  },

  glitchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 90,
    pointerEvents: 'none',
    mixBlendMode: 'difference'
  },

  glitchBar1: {
    position: 'absolute',
    top: '20%',
    left: 0,
    width: '100%',
    height: '3px',
    background: '#ff0080',
    transform: 'translateX(-10%)',
    animation: 'glitchSlide 0.1s linear infinite'
  },

  glitchBar2: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    height: '5px',
    background: '#00ffff',
    transform: 'translateX(5%)'
  },

  glitchBar3: {
    position: 'absolute',
    top: '75%',
    left: 0,
    width: '100%',
    height: '2px',
    background: '#ff0080',
    transform: 'translateX(-3%)'
  },

  elevatorFrame: {
    width: '300px',
    height: '400px',
    background: '#2a3a4a',
    border: '4px solid #4a5a6a',
    borderRadius: '4px',
    position: 'relative',
    boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)'
  },

  floorDisplay: {
    position: 'absolute',
    top: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#0a1428',
    border: '2px solid #4ecdc4',
    padding: '8px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  floorNumber: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '24px',
    color: '#4ecdc4',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.8)'
  },

  floorArrow: {
    color: '#4ecdc4',
    fontSize: '16px',
    animation: 'arrowBlink 0.5s infinite'
  },

  elevatorDoor: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #3a4a5a 0%, #2a3a4a 50%, #3a4a5a 100%)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'filter 0.1s ease'
  },

  reflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(78,205,196,0.05) 0%, rgba(78,205,196,0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  silhouette: {
    position: 'relative',
    transition: 'transform 0.1s ease'
  },

  head: {
    width: '30px',
    height: '30px',
    background: 'rgba(0,0,0,0.6)',
    borderRadius: '50%',
    marginBottom: '5px'
  },

  body: {
    width: '50px',
    height: '80px',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '10px 10px 0 0'
  },

  creepySmile: {
    position: 'absolute',
    top: '18px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '15px',
    height: '8px',
    borderBottom: '2px solid rgba(255,100,100,0.8)',
    borderRadius: '0 0 50% 50%'
  },

  doorGap: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '2px',
    height: '100%',
    background: '#1a2a3a'
  },

  textBox: {
    marginTop: '40px',
    padding: '20px',
    maxWidth: '500px',
    textAlign: 'center'
  },

  narration: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '11px',
    lineHeight: 2,
    color: '#c8d5e0',
    margin: 0
  },

  choiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  choiceButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  choiceBtn: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '10px',
    padding: '15px 20px',
    background: 'rgba(37, 52, 71, 0.8)',
    border: '2px solid #4ecdc4',
    color: '#4ecdc4',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  voiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  voiceText: {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#00ff00',
    textShadow: '0 0 10px rgba(0,255,0,0.8)',
    letterSpacing: '2px',
    margin: 0
  },

  voiceCursor: {
    animation: 'blink 0.5s infinite'
  },

  redText: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '11px',
    color: '#ff6b6b',
    animation: 'shake 0.3s infinite',
    margin: 0
  }
};

// ========== 主界面样式 ==========
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
    animation: 'loadingSlide 3s ease-out forwards'
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

  phoneButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(78, 205, 196, 0.2)',
    border: '2px solid #4ecdc4',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  phoneButtonRinging: {
    background: 'rgba(255, 107, 107, 0.3)',
    border: '2px solid #ff6b6b',
    boxShadow: '0 0 20px rgba(255, 107, 107, 0.6)',
    animation: 'phoneRing 0.5s ease-in-out infinite',
    opacity: 1,
    cursor: 'default'
  },

  phoneButtonDisabled: {
    background: 'rgba(50, 50, 50, 0.5)',
    border: '2px solid #374a5f',
    boxShadow: 'none',
    cursor: 'not-allowed',
    opacity: 0.5
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

// ========== CSS动画 ==========
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

    @keyframes emergencyPulse {
      0%, 100% { 
        opacity: 0.3;
        box-shadow: 0 0 30px 15px rgba(255, 50, 50, 0.2);
      }
      50% { 
        opacity: 1;
        box-shadow: 0 0 80px 40px rgba(255, 50, 50, 0.5);
      }
    }

    @keyframes glitchSlide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @keyframes arrowBlink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      75% { transform: translateX(3px); }
    }

    @keyframes neonPulse {
      0%, 100% { text-shadow: 0 0 20px rgba(78, 205, 196, 0.8); }
      50% { text-shadow: 0 0 30px rgba(78, 205, 196, 1), 0 0 50px rgba(78, 205, 196, 0.5); }
    }

    @keyframes phoneRing {
  0%, 100% { 
    transform: rotate(0deg) scale(1);
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
  }
  25% { 
    transform: rotate(-10deg) scale(1.1);
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
  }
  75% { 
    transform: rotate(10deg) scale(1.1);
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
  }
}

    button:hover {
      background: #4ecdc4 !important;
      color: #0a1428 !important;
      border-color: #4ecdc4 !important;
      box-shadow: 0 0 20px rgba(78, 205, 196, 0.4) !important;
    }
  `;

  const existingStyle = document.getElementById('chapter1-styles');
  if (existingStyle) existingStyle.remove();
  
  const style = document.createElement('style');
  style.id = 'chapter1-styles';
  style.textContent = styleSheet;
  document.head.appendChild(style);
}

export default Chapter1;