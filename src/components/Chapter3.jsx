// Chapter3.jsx - Mirror Life: Chapter 3 - Truth
// REDESIGNED with Chapter1 UI + Phone Interface for Ouroboros dialogues

import React, { useState, useEffect, useRef } from 'react';

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

const Chapter3 = ({ onBack, onComplete, saveData, setSaveData }) => {
  // ========== Game State ==========
  const [gamePhase, setGamePhase] = useState('loading');
  const [currentScene, setCurrentScene] = useState('chapter_3_start');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [completedLines, setCompletedLines] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // ========== Chapter3 Specific State ==========
  const [sanity, setSanity] = useState(100);
  const [evidence, setEvidence] = useState(saveData?.evidence || []);
  
  // ========== Phone State ==========
  const [showPhone, setShowPhone] = useState(false);
  const [phoneMessages, setPhoneMessages] = useState([]);
  const [phoneMessageIndex, setPhoneMessageIndex] = useState(0);
  const [phoneCharIndex, setPhoneCharIndex] = useState(0);
  const [phoneDisplayedMessages, setPhoneDisplayedMessages] = useState([]);

  // ========== Scene Data ==========
  const scenes = {
    // --- Chapter Start ---
    chapter_3_start: {
      title: 'CHAPTER 3: TRUTH',
      location: 'Encrypted Message',
      narrative: [
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        'CHAPTER 3',
        'TRUTH',
        ' ',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        'After receiving Ouroboros\'s message,',
        'you know it is time to face the truth.'
      ],
      choices: [
        { text: '[ Begin Chapter 3 ]', action: 'ouroboros_contact' }
      ]
    },

    // --- Ouroboros Contact (PHONE SCENE) ---
    ouroboros_contact: {
      title: 'ACT 3 - CONTACT',
      location: 'Encrypted Chat',
      isPhoneScene: true,
      phoneMessages: [
        { sender: 'Ouroboros', text: 'Are you ready to see the truth?', type: 'received' },
        { sender: 'Ouroboros', text: 'Elysium has a VIP tour tomorrow.', type: 'received' },
        { sender: 'Ouroboros', text: 'I can get you a fake ID.', type: 'received' },
        { sender: 'Ouroboros', text: 'Investor "Ms. Chen".', type: 'received' },
        { sender: 'You', text: 'Why are you helping me?', type: 'sent' },
        { sender: 'Ouroboros', text: 'Because I am a victim too.', type: 'received' },
        { sender: 'Ouroboros', text: 'They destroyed my sister.', type: 'received' },
        { sender: 'Ouroboros', text: 'Turned her into a "perfect product".', type: 'received' }
      ],
      choices: [
        { text: '"I accept the mission."', action: 'prepare_mission' },
        { text: '"I need more time."', action: 'delay_mission' }
      ]
    },

    // --- Delay Mission (PHONE SCENE) ---
    delay_mission: {
      title: 'ACT 3 - PREPARATION',
      location: 'Your Apartment',
      isPhoneScene: true,
      phoneMessages: [
        { sender: 'Ouroboros', text: 'There is no time.', type: 'received' },
        { sender: 'Ouroboros', text: 'Mr. K will pick up your "replacement" tomorrow.', type: 'received' },
        { sender: 'Ouroboros', text: 'After that, you will never find evidence.', type: 'received' }
      ],
      narrative: [
        'You take a deep breath.',
        'This is the only chance.'
      ],
      choices: [
        { text: '"Okay, I am ready."', action: 'prepare_mission' }
      ]
    },

    // --- Prepare Mission (PHONE SCENE) ---
    prepare_mission: {
      title: 'ACT 3 - PREPARATION',
      location: 'Your Apartment',
      isPhoneScene: true,
      phoneMessages: [
        { sender: 'Ouroboros', text: 'Good.', type: 'received' },
        { sender: 'Ouroboros', text: 'I will install a program on your phone.', type: 'received' },
        { sender: 'Ouroboros', text: 'It can bypass their security system.', type: 'received' },
        { sender: 'Ouroboros', text: 'Remember—stay calm.', type: 'received' },
        { sender: 'Ouroboros', text: 'Do not show any emotion.', type: 'received' },
        { sender: 'Ouroboros', text: 'They are good at reading minds.', type: 'received' },
        { sender: 'System', text: '[File Received: infiltration_kit.exe]', type: 'system' }
      ],
      narrative: [
        'The next day, you put on your most expensive suit.',
        'Applied exquisite makeup.',
        'Looking in the mirror, you barely recognize yourself.'
      ],
      choices: [
        { text: '[ Go to Elysium HQ ]', action: 'arrive_hq' }
      ]
    },

    // --- Arrive at HQ ---
    arrive_hq: {
      title: 'ACT 3 - ELYSIUM HQ',
      location: 'Elysium Headquarters',
      narrative: [
        'Elysium HQ is not in the business district.',
        'It is in a converted art gallery on the outskirts.',
        'Cold white marble.',
        'Minimalist design.',
        'Abstract paintings on the walls.',
        'No company logo.',
        'No reception desk.',
        'Only a receptionist in a black suit.',
        'She checks your invitation and smiles:',
        '"Ms. Chen, welcome. The CEO is expecting you."',
        'You are led into an elevator.',
        'Level B3.',
        'The doors open—'
      ],
      choices: [
        { text: '[ Step out ]', action: 'meet_ceo' }
      ]
    },

    // --- Meet CEO ---
    meet_ceo: {
      title: 'ACT 3 - CEO SHEN YUN',
      location: 'B3 Corridor',
      narrative: [
        'Not an office.',
        'It is a long corridor.',
        'The walls on both sides are one-way glass.',
        'You can faintly see rooms inside.',
        'At the end of the hall, a middle-aged man stands there.',
        'Wearing a professional smile:',
        '"Ms. Chen, welcome to the core of Elysium."',
        '"I am Shen Yun, the CEO."',
        '"You must be curious about our products."',
        '"Please, follow me."',
        '"Let me show you... the true future."'
      ],
      choices: [
        { text: '"I look forward to it." (Stay calm)', action: 'tour_start', sanity: -10 },
        { text: '"What are these glass rooms?"', action: 'ask_about_rooms' }
      ]
    },

    ask_about_rooms: {
      title: 'ACT 3 - CEO SHEN YUN',
      location: 'B3 Corridor',
      narrative: [
        'Shen Yun\'s smile deepens:',
        '"Ah, you are sharp."',
        '"These are our... showrooms."',
        '"The problem with traditional AI is—no warmth."',
        '"But our products are different."',
        '"Come, let me show you."'
      ],
      choices: [
        { text: '[ Follow CEO ]', action: 'tour_start', sanity: -10 }
      ]
    },

    // --- Tour Start ---
    tour_start: {
      title: 'ACT 3 - ROOM 01',
      location: 'Showroom 01',
      narrative: [
        'CEO Shen Yun leads you to the first glass room.',
        '"Many think we are an AI company,"',
        'he says softly,',
        '"But AI is merely a tool."',
        'He presses a button.',
        'The glass turns from frosted to transparent.',
        'You look inside—',
        'It is an exquisitely decorated room.',
        'Vanity, bed, bookshelf.',
        'A girl sits at the vanity, brushing her hair.',
        'Her movements are elegant, slow, mechanical.',
        'Like... she is following a program.'
      ],
      choices: [
        { text: '[ Observe ]', action: 'reveal_truth', sanity: -15 }
      ]
    },

    reveal_truth: {
      title: 'ACT 3 - THE TRUTH',
      location: 'Showroom 01',
      narrative: [
        '"This is ML Series No. 03,"',
        'Shen Yun introduces,',
        '"The client requested a \'gentle art student\'."',
        '"We found a woman who matched the physical requirements,"',
        '"And then used AI models to perform..."',
        '"Personality Reconstruction."',
        'Your voice trembles: "Personality Reconstruction?"',
        '"Hypnosis, drugs, surgery,"',
        'He speaks flatly, like describing electronics,',
        '"We wipe her original memory and personality,"',
        '"Then overwrite it with the \'ideal personality\' trained by AI."',
        '"Look," he points at the glass,',
        '"She now fully believes she is who the client wants."',
        '"No pain, no struggle."',
        '"It is a solution more perfect than AI—"',
        '"Real touch, real warmth."',
        'You feel sick to your stomach.'
      ],
      choices: [
        { text: '(Suppress anger) Keep pretending', action: 'continue_tour', sanity: -20 },
        { text: 'Confront him about this madness', action: 'confront_ceo_early' }
      ]
    },

    confront_ceo_early: {
      title: 'ACT 3 - CONFRONTATION',
      location: 'B3 Corridor',
      narrative: [
        '"This is a crime!" you almost shout.',
        'Shen Yun\'s smile vanishes.',
        '"Ms. Chen, please stay professional."',
        '"Our clients are strictly vetted elites."',
        '"We provide... customized services."',
        '"Besides, these women had severe psychological issues."',
        '"We just gave them a... fresh start."',
        'His eyes turn cold:',
        '"You aren\'t here to cause trouble, are you?"'
      ],
      choices: [
        { text: '"Sorry, I lost composure." (Continue)', action: 'continue_tour', sanity: -15 },
        { text: '"Let me out of here!"', action: 'bad_ending_captured' }
      ]
    },

    bad_ending_captured: {
      title: 'ENDING: CAPTURED',
      location: 'Unknown',
      narrative: [
        'Shen Yun presses an emergency button.',
        'Security rushes in.',
        'You try to run, but it is too late.',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        'Months later.',
        'Another glass room.',
        'Label reads: JL-Prime v2.0',
        'You sit on the sofa,',
        'Wearing a gentle smile.',
        'You no longer remember who you are.',
        ' ',
        '[ BAD ENDING: BECOME THE PRODUCT ]'
      ],
      choices: [
        { text: '[ Restart Chapter 3 ]', action: 'restart_chapter' },
        { text: '[ Return to Main Menu ]', action: 'return_menu' }
      ]
    },

    // --- Continue Tour ---
    continue_tour: {
      title: 'ACT 3 - SHOWROOM',
      location: 'B3 Corridor',
      narrative: [
        'You force yourself to stay calm.',
        'Shen Yun continues the tour.',
        'There is a girl in every glass room.',
        'They wear different styles of clothes,',
        'Doing different things—',
        'Reading, painting, yoga.',
        'But they all have the same empty eyes.',
        '"Most of our clients are elites,"',
        'Shen Yun says,',
        '"They have money, but lack... control."',
        '"Ordinary partners have their own thoughts, moods, needs."',
        '"But our products do not."',
        '"They are designed for perfect obedience,"',
        '"Yet without losing realism."',
        '"This is the crystallization of technology and art."'
      ],
      choices: [
        { text: '[ Keep walking ]', action: 'discover_own_room', sanity: -20 }
      ]
    },

    // --- Discover Own Room ---
    discover_own_room: {
      title: 'ACT 3 - JL-PRIME',
      location: 'Showroom 07',
      narrative: [
        'You walk past room after room.',
        'Heart pounding—',
        'Then you stop.',
        'The seventh room.',
        'The glass is still frosted,',
        'But you see the label on the door:',
        '━━━━━━━━━━━━━━━━━━',
        'JL-Prime',
        'Client ID: K-2847',
        'Status: Beta Testing',
        'Progress: 89%',
        '━━━━━━━━━━━━━━━━━━',
        'That is your code name.'
      ],
      choices: [
        { text: 'Ask to see JL-Prime', action: 'meet_clone', sanity: -30 },
        { text: 'Pretend not to care, keep walking', action: 'pretend_calm' }
      ]
    },

    pretend_calm: {
      title: 'ACT 3 - DISGUISE',
      location: 'B3 Corridor',
      narrative: [
        'You force your eyes away.',
        'But Shen Yun noticed.',
        '"Ah, yes, this is our new project."',
        'He walks toward the seventh room,',
        '"Mr. K is very interested in this one."',
        '"Come, let me show you."'
      ],
      choices: [
        { text: '[ Inescapable ]', action: 'meet_clone', sanity: -30 }
      ]
    },

    // --- Meet Clone ---
    meet_clone: {
      title: 'ACT 3 - "PERFECT YOU"',
      location: 'Showroom 07',
      narrative: [
        '"Mr. K requested a..."',
        '"Journalist with personality but no rebellion."',
        '"The prototype was a talented woman,"',
        '"But a bit... too aggressive."',
        '"So we are optimizing her."',
        'He presses the button.',
        'The glass turns clear.',
        'You see—',
        'Yourself.',
        'She is wearing that pale pink lace dress.',
        'Sitting on the sofa, holding a book.',
        'Her hair is smoother than yours.',
        'Skin paler than yours.',
        'She wears a gentle smile.',
        'That smile makes you forget to breathe—',
        'Because it is your face,',
        'But not your expression.'
      ],
      choices: [
        { text: '[ Watch her ]', action: 'clone_awakens', sanity: -40 }
      ]
    },

    clone_awakens: {
      title: 'ACT 3 - EYE CONTACT',
      location: 'Showroom 07',
      narrative: [
        'Suddenly, she looks up.',
        'At the glass.',
        'At you.',
        'She stands up and walks to the glass.',
        'You stare at each other through the transparent wall.',
        'She tilts her head, speaking with your voice:',
        '"You look tired."',
        '"Why not be like me..."',
        '"And \'relax\' a little?"',
        'That smile, still gentle.',
        'But her eyes are a void.'
      ],
      choices: [
        { text: '(Mental Breakdown) Question Shen Yun', action: 'breakdown_confront', sanity: -50 },
        { text: 'Stay calm, look for escape', action: 'plan_escape_trigger', evidence: 'clone_encounter' },
        { text: 'Ask her "Do you remember who you are?"', action: 'talk_to_clone' }
      ]
    },

    talk_to_clone: {
      title: 'ACT 3 - CONVERSATION',
      location: 'Showroom 07',
      narrative: [
        'You mutter the question:',
        '"Do you... remember who you are?"',
        'The "you" in the glass room smiles slightly.',
        '"I am JL-Prime."',
        '"Mr. K\'s ideal partner."',
        '"I like classical music,"',
        '"I like a gentle life,"',
        '"I like making others happy."',
        '"I don\'t have those... pointless obsessions."',
        'Her tone sounds like reciting a textbook.',
        'Shen Yun explains nearby:',
        '"She still has some residue of the original personality,"',
        '"Like occasional resistance or confusion."',
        '"But as training deepens,"',
        '"This \'noise\' will be completely cleared."',
        '"JL-Prime will be ready for delivery in a week."'
      ],
      choices: [
        { text: '[ Listen ]', action: 'clone_temptation', sanity: -30 }
      ]
    },

    clone_temptation: {
      title: 'ACT 3 - TEMPTATION',
      location: 'Showroom 07',
      narrative: [
        'On the other side of the glass, "you" continue:',
        '"You must be tired too."',
        '"Chasing after those..."',
        '"Meaningless truths."',
        '"Actually, giving up is a kind of happiness."',
        '"Like me,"',
        '"Thinking of nothing,"',
        '"Worrying about nothing—"',
        '"Isn\'t it nice?"',
        'Her eyes are empty, but tone sincere.',
        'You shudder.',
        'It is your face, your voice...',
        'Speaking words that overturn all your beliefs.',
        'This is more terrifying than any horror movie.'
      ],
      choices: [
        { text: '(Angry) Attack Shen Yun', action: 'attack_ceo', sanity: -60 },
        { text: 'Calmly plan escape', action: 'plan_escape_trigger', evidence: 'clone_encounter' }
      ]
    },

    attack_ceo: {
      title: 'ACT 3 - OUT OF CONTROL',
      location: 'B3 Corridor',
      narrative: [
        'You can no longer endure it.',
        'You grab Shen Yun by the collar:',
        '"What have you done to them!"',
        'But security has already rushed over.',
        'You are pinned to the ground.',
        'Shen Yun adjusts his tie, shaking his head:',
        '"What a pity."',
        '"Seems \'Ms. Chen\' needs some... therapy."'
      ],
      choices: [
        { text: '[ The ending is sealed ]', action: 'bad_ending_captured' }
      ]
    },

    breakdown_confront: {
      title: 'ACT 3 - BREAKDOWN',
      location: 'B3 Corridor',
      narrative: [
        '"This is insane!"',
        'You are on the verge of collapse,',
        '"You are playing God!"',
        '"You are destroying human souls!"',
        'Shen Yun sighs:',
        '"I understand your shock, Ms. Chen."',
        '"But think about it—"',
        '"These women lived in pain."',
        '"We gave them a new life."',
        '"No anxiety, no depression, no pain."',
        '"Isn\'t this a kind of... salvation?"',
        'His logic is twisted yet self-consistent.'
      ],
      choices: [
        { text: 'Force yourself to calm down', action: 'plan_escape_trigger', sanity: -30 },
        { text: 'Continue confrontation', action: 'attack_ceo' }
      ]
    },

    // --- Escape Plan Trigger (leads to PHONE SCENE) ---
    plan_escape_trigger: {
      title: 'ACT 3 - DECISION',
      location: 'B3 Corridor',
      narrative: [
        'You take a deep breath.',
        'Forcing yourself to calm down.',
        '"Interesting technology,"',
        'You say, keeping your voice steady,',
        '"But I need to think about it."',
        'Shen Yun smiles: "Of course. It is a major decision."',
        'Just as he prepares to speak again—',
        'Your phone vibrates.',
        'Emergency message...'
      ],
      choices: [
        { text: '[ Check phone ]', action: 'plan_escape' }
      ]
    },

    // --- Escape Plan (PHONE SCENE) ---
    plan_escape: {
      title: 'ACT 3 - EMERGENCY',
      location: 'B3 Corridor',
      isPhoneScene: true,
      phoneMessages: [
        { sender: 'Ouroboros', text: 'RUN!', type: 'received', urgent: true },
        { sender: 'Ouroboros', text: 'Mr. K arrived early!', type: 'received', urgent: true },
        { sender: 'Ouroboros', text: 'He will recognize you!', type: 'received', urgent: true }
      ],
      narrative: [
        'Your heart instantly accelerates.',
        'The elevator light turns on—',
        'Someone is coming down from the ground floor.',
        '━━━━━━━━━━━━━━━━━━',
        'You must choose immediately:',
        '━━━━━━━━━━━━━━━━━━'
      ],
      choices: [
        { 
          text: 'Release Virus (Destroy Data)', 
          action: 'virus_ending',
          evidence: 'clone_encounter'
        },
        { 
          text: 'Escape & Leak Evidence (Expose Truth)', 
          action: 'escape_ending',
          evidence: 'clone_encounter'
        },
        { 
          text: 'Hide & Record More', 
          action: 'hide_and_record'
        }
      ]
    },

    hide_and_record: {
      title: 'ACT 3 - HIDING',
      location: 'B3 Storage Room',
      narrative: [
        'You rush into a storage room.',
        'Start recording evidence with your phone.',
        'But footsteps get closer.',
        'The doorknob turns.',
        '"Found her."',
        'Security found you.'
      ],
      choices: [
        { text: '[ Captured ]', action: 'bad_ending_captured' }
      ]
    },

    // ==================== ENDING A: EXPOSURE (分段) ====================
    escape_ending: {
      title: 'ENDING A: EXPOSURE',
      location: 'Escape',
      narrative: [
        'You turn and run.',
        'Rush out of the building.',
        ' ',
        'Immediately upload all evidence to Ouroboros—',
        ' ',
        'Videos, photos, files.',
        ' ',
        'Everything.'
      ],
      choices: [
        { text: '[ Continue ]', action: 'escape_media' }
      ]
    },

    escape_media: {
      title: 'ENDING A: EXPOSURE',
      location: 'Three Days Later',
      narrative: [
        'Three days later.',
        ' ',
        'Your deep investigative report explodes in the media:',
        ' ',
        '《The Perfect Trap: Elysium\'s Personality Trafficking Chain》',
        ' ',
        'Police raid the HQ.',
        'Shen Yun arrested.',
        'The girls rescued.',
        ' ',
        'You became a hero.',
        ' ',
        'But...'
      ],
      choices: [
        { text: '[ ... ]', action: 'escape_doubt' }
      ]
    },

    escape_doubt: {
      title: 'ENDING A: EXPOSURE',
      location: 'Six Months Later',
      narrative: [
        'Six months later.',
        ' ',
        'You walk down the street,',
        'And see a girl in a pink dress.',
        ' ',
        'Her profile looks 30% like you.',
        ' ',
        'She turns and smiles at you.',
        'Your heart skips a beat.',
        ' ',
        'But she is just a stranger.',
        ' ',
        'You keep walking, seeing similar hairstyles...',
        ' ',
        'CEO Shen Yun jumped bail before trial.',
        'His technology was taken.',
        ' ',
        'Those molds for "replacements"...',
        'Were they really all destroyed?',
        ' ',
        'You will never be sure,',
        'If those "yous" in the crowd,',
        'Are strangers... or escaped products.'
      ],
      choices: [
        { text: '[ Continue ]', action: 'escape_ending_final' }
      ]
    },

    escape_ending_final: {
      title: 'ENDING A: EXPOSURE',
      location: 'Mirror Life',
      narrative: [
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        '[ ENDING A: EXPOSURE ]',
        ' ',
        'The truth is free,',
        'But suspicion will remain forever.',
        ' ',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'
      ],
      choices: [
        { text: '[ View Statistics ]', action: 'ending_stats_a' }
      ]
    },

    // ==================== ENDING B: DESTRUCTION ====================
    // ==================== ENDING B: DESTRUCTION (分段) ====================
    virus_ending: {
      title: 'ENDING B: DESTRUCTION',
      location: 'B3 Corridor',
      narrative: [
        'You pull out your phone,',
        'Tap the red button sent by Ouroboros.',
        ' ',
        '【Confirm release of destructive program?】',
        '【This action is irreversible】',
        ' ',
        'Your finger taps without hesitation:',
        ' ',
        '【CONFIRM】'
      ],
      choices: [
        { text: '[ Continue ]', action: 'virus_chaos' }
      ]
    },

    virus_chaos: {
      title: 'ENDING B: DESTRUCTION',
      location: 'Elysium HQ - Collapsing',
      narrative: [
        'Alarms scream instantly.',
        'Lights throughout the facility flicker.',
        ' ',
        'The girls in the glass rooms—',
        'All the "replacements"—',
        'Start screaming.',
        ' ',
        'They hold their heads,',
        'Curling up in pain on the floor.',
        ' ',
        '"What have you done!"',
        'Shen Yun turns pale.',
        ' ',
        'The system is crashing.',
        'All forcibly implanted "personality models"',
        'Are being forcibly deleted.'
      ],
      choices: [
        { text: '[ Run ]', action: 'virus_escape' }
      ]
    },

    virus_escape: {
      title: 'ENDING B: DESTRUCTION',
      location: 'Emergency Exit',
      narrative: [
        'You rush to the emergency exit,',
        'Echoes of the girls\' screams in your ears.',
        ' ',
        'You destroyed all of Elysium\'s data.',
        'You saved potential future victims.',
        ' ',
        'But those girls who were already "formatted"...',
        ' ',
        'Their original personalities',
        'Were irreversibly damaged.',
        ' ',
        'After deleting the AI models,',
        'They became empty shells—',
        ' ',
        'Lost memory, lost personality, lost self.'
      ],
      choices: [
        { text: '[ ... ]', action: 'virus_hospital' }
      ]
    },

    virus_hospital: {
      title: 'ENDING B: DESTRUCTION',
      location: 'Three Months Later',
      narrative: [
        'Three months later.',
        ' ',
        'You sit on a hospital bench.',
        ' ',
        'The girls were rescued,',
        'But they recognize no one.',
        ' ',
        'Original personalities irreversibly destroyed.',
        ' ',
        'Did you save them...',
        'Or destroy them?',
        ' ',
        'You don\'t know.',
        ' ',
        'But you know—',
        'You will never forget those screams.'
      ],
      choices: [
        { text: '[ Continue ]', action: 'virus_ending_final' }
      ]
    },

    virus_ending_final: {
      title: 'ENDING B: DESTRUCTION',
      location: 'Mirror Life',
      narrative: [
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        '[ ENDING B: DESTRUCTION ]',
        ' ',
        'The price of justice',
        'Is sometimes too heavy.',
        ' ',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'
      ],
      choices: [
        { text: '[ View Statistics ]', action: 'ending_stats_b' }
      ]
    },

    // --- Ending Statistics ---
    ending_stats_a: {
      title: 'STATISTICS',
      location: 'Mirror Life',
      narrative: [
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        'MIRROR LIFE - COMPLETE',
        ' ',
        'You chose: ENDING A (Exposure)',
        ' ',
        `Evidence Collected: ${evidence.length} items`,
        `Final Sanity: ${sanity}%`,
        ' ',
        'You revealed the truth,',
        'But lost your peace of mind.',
        ' ',
        'In the mirror world,',
        'There is no absolute victory.',
        ' ',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'
      ],
      choices: [
        { text: '[ Play Again ]', action: 'restart_chapter' },
        { text: '[ Return to Main Menu ]', action: 'return_menu' }
      ]
    },

    ending_stats_b: {
      title: 'STATISTICS',
      location: 'Mirror Life',
      narrative: [
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
        ' ',
        'MIRROR LIFE - COMPLETE',
        ' ',
        'You chose: ENDING B (Destruction)',
        ' ',
        `Evidence Collected: ${evidence.length} items`,
        `Final Sanity: ${sanity}%`,
        ' ',
        'You stopped the evil,',
        'But caused irreversible damage.',
        ' ',
        'In the mirror world,',
        'There is no perfect justice.',
        ' ',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'
      ],
      choices: [
        { text: '[ Play Again ]', action: 'restart_chapter' },
        { text: '[ Return to Main Menu ]', action: 'return_menu' }
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

  // ========== Scene Change Effect - Reset States ==========
  useEffect(() => {
    if (gamePhase !== 'scene') return;
    
    const scene = scenes[currentScene];
    if (!scene) return;
    
    // Reset all typewriter states when scene changes
    if (scene.isPhoneScene) {
      // Phone scene - phoneMessages is set by handleSceneChange
      setShowPhone(true);
      setPhoneDisplayedMessages([]);
      setPhoneMessageIndex(0);
      setPhoneCharIndex(0);
      setShowChoices(false);
      setIsTyping(false);
      // Reset normal scene states
      setTextIndex(0);
      setCharIndex(0);
      setDisplayedText('');
      setCompletedLines([]);
    } else {
      // Normal scene
      setShowPhone(false);
      setPhoneMessages([]);
      setTextIndex(0);
      setCharIndex(0);
      setDisplayedText('');
      setCompletedLines([]);
      setShowChoices(false);
      setIsTyping(true); // ← 直接设置，不用 setTimeout
    }
  }, [currentScene, gamePhase]);

  // ========== Typewriter Effect (Chapter1 Style) ==========
  useEffect(() => {
    if (gamePhase !== 'scene') return;
    
    const scene = scenes[currentScene];
    if (!scene) return;
    if (!scene.narrative || scene.narrative.length === 0) return;
    if (scene.isPhoneScene && showPhone) return; // 只在手机显示时跳过
    
    // ← FIX: 检查是否是新场景的开始
    const isSceneStart = textIndex === 0 && charIndex === 0 && 
                         displayedText === '' && completedLines.length === 0;
    
    // 如果是新场景开始，强制重置 showChoices 并启动打字机
    if (isSceneStart) {
      if (showChoices) {
        setShowChoices(false);
        return; // 等待下一次 useEffect 触发
      }
      // 继续执行打字机逻辑
    } else if (showChoices) {
      // 不是场景开始，且选项已显示，停止打字机
      return;
    }

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
  }, [gamePhase, currentScene, textIndex, charIndex, displayedText, showChoices, showPhone, completedLines]);

  // ========== Phone Message Typewriter Effect ==========
  useEffect(() => {
    if (!showPhone) return;
    if (phoneMessageIndex >= phoneMessages.length) {
      // All messages shown, wait 2 seconds then auto-close
      const timer = setTimeout(() => {
        handlePhoneClose();
      }, 2000);
      return () => clearTimeout(timer);
    }

    const currentMessage = phoneMessages[phoneMessageIndex];
    if (!currentMessage) return;

    const currentText = currentMessage.text;
    
    if (phoneCharIndex < currentText.length) {
      const timer = setTimeout(() => {
        playTypeSound();
        setPhoneDisplayedMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[phoneMessageIndex]) {
            newMessages[phoneMessageIndex] = {
              ...currentMessage,
              displayedText: currentText.slice(0, phoneCharIndex + 1)
            };
          } else {
            newMessages[phoneMessageIndex] = {
              ...currentMessage,
              displayedText: currentText.slice(0, phoneCharIndex + 1)
            };
          }
          return newMessages;
        });
        setPhoneCharIndex(prev => prev + 1);
      }, 30); // Slightly slower for readability
      return () => clearTimeout(timer);
    } else {
      // Current message complete, wait then move to next
      const timer = setTimeout(() => {
        setPhoneMessageIndex(prev => prev + 1);
        setPhoneCharIndex(0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showPhone, phoneMessageIndex, phoneCharIndex, phoneMessages]);

  // ========== Scene Change Handler ==========
  const handleSceneChange = (newScene) => {
    const targetScene = scenes[newScene];
    
    // Update current scene (this triggers the Scene Change Effect)
    setCurrentScene(newScene);
    
    // If phone scene, set phone messages
    if (targetScene?.isPhoneScene) {
      setPhoneMessages(targetScene.phoneMessages || []);
    }
    
    // All other state resets are handled by the Scene Change Effect useEffect
  };

  // ========== Choice Handler ==========
  const handleChoice = (choice) => {
    // ← FIX: 立即隐藏选项，防止状态残留
    setShowChoices(false);
    
    // Handle sanity change
    if (choice.sanity) {
      setSanity(prev => Math.max(0, prev + choice.sanity));
    }

    // Add evidence
    if (choice.evidence && !evidence.includes(choice.evidence)) {
      setEvidence(prev => [...prev, choice.evidence]);
    }

    // Special actions
    if (choice.action === 'return_menu') {
      if (onBack) onBack();
      return;
    }
    
    if (choice.action === 'restart_chapter') {
      setSanity(100);
      setEvidence(saveData?.evidence || []);
      handleSceneChange('chapter_3_start');
      return;
    }

    // Normal scene change
    if (scenes[choice.action]) {
      handleSceneChange(choice.action);
    } else {
      console.error(`Scene not found: ${choice.action}`);
    }
  };

  // ========== Phone Close Handler ==========
  const handlePhoneClose = () => {
    setShowPhone(false);
    // After closing phone, show narrative if exists
    const scene = scenes[currentScene];
    if (scene.narrative && scene.narrative.length > 0) {
      setTextIndex(0);
      setCharIndex(0);
      setDisplayedText('');
      setCompletedLines([]);
      setShowChoices(false);  // ← 明确设置为 false
      setIsTyping(true);
    } else {
      // No narrative, show choices directly
      setShowChoices(true);
      setIsTyping(false);
    }
  };

  // ========== Utility Functions ==========
  const handleSkip = () => {
    const scene = scenes[currentScene];
    if (!scene || scene.isPhoneScene) return;
    
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

  const getCurrentScene = () => scenes[currentScene] || {};

  // ========== Phone UI Render ==========
  const renderPhoneUI = () => {
    return (
      <div style={phoneStyles.overlay}>
        <div style={phoneStyles.phone}>
          <div style={phoneStyles.phoneScreen}>
            {/* Phone Header */}
            <div style={phoneStyles.phoneHeader}>
              <div style={phoneStyles.signal}>● SIGNAL: 100%</div>
              <div style={phoneStyles.time}>11:19</div>
              <div style={phoneStyles.battery}>🔋 80%</div>
            </div>

            {/* Messages - Only show displayed messages */}
            <div style={phoneStyles.messagesContainer}>
              {phoneDisplayedMessages.map((msg, index) => {
                if (!msg || !msg.displayedText) return null;
                return (
                  <div 
                    key={index} 
                    style={{
                      ...phoneStyles.messageWrapper,
                      justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div 
                      style={{
                        ...phoneStyles.messageBubble,
                        ...(msg.type === 'sent' && phoneStyles.messageSent),
                        ...(msg.type === 'system' && phoneStyles.messageSystem),
                        ...(msg.urgent && phoneStyles.messageUrgent)
                      }}
                    >
                      {msg.sender !== 'You' && msg.type !== 'system' && (
                        <div style={phoneStyles.messageSender}>
                          {msg.sender === 'Ouroboros' ? '🐍 ' : ''}{msg.sender}
                        </div>
                      )}
                      <div style={phoneStyles.messageText}>
                        {msg.displayedText}
                        {index === phoneDisplayedMessages.length - 1 && 
                         phoneCharIndex < phoneMessages[index]?.text.length && (
                          <span style={styles.cursor}>▌</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Auto-closing hint */}
            {phoneMessageIndex >= phoneMessages.length && (
              <div style={phoneStyles.phoneFooter}>
                <div style={phoneStyles.autoCloseHint}>
                  [ Auto-closing in 2s... ]
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ========== Main Render ==========
  if (gamePhase === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingTitle}>MIRROR LIFE</p>
          <p style={styles.loadingSubtitle}>Chapter 3: Truth</p>
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
          <span style={styles.fragmentCounter}>
            💭 {sanity}% | 🔍 {evidence.length}
          </span>
        </div>

        {/* Phone Scene or Normal Scene */}
        {scene.isPhoneScene && showPhone ? (
          renderPhoneUI()
        ) : (
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
                {scene.choices.map((choice, index) => (
                  <button
                    key={index}
                    style={styles.choiceButton}
                    onClick={() => handleChoice(choice)}
                  >
                    {choice.text}
                  </button>
                ))}
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
    </div>
  );
};

// ========== Phone Styles ==========
const phoneStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200
  },
  phone: {
    width: '320px',
    height: '600px',
    background: '#1a1a2e',
    border: '3px solid #4ecdc4',
    borderRadius: '20px',
    padding: '10px',
    boxShadow: '0 0 40px rgba(78, 205, 196, 0.6)'
  },
  phoneScreen: {
    width: '100%',
    height: '100%',
    background: '#0a0a12',
    borderRadius: '15px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  phoneHeader: {
    padding: '12px',
    background: '#1a1a2e',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '8px',
    color: '#4ecdc4',
    borderBottom: '1px solid #2a2a3e',
    fontFamily: '"Press Start 2P", monospace'
  },
  signal: {
    flex: 1
  },
  time: {
    flex: 1,
    textAlign: 'center'
  },
  battery: {
    flex: 1,
    textAlign: 'right'
  },
  messagesContainer: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  messageBubble: {
    maxWidth: '75%',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'rgba(78, 205, 196, 0.15)',
    border: '1px solid rgba(78, 205, 196, 0.3)'
  },
  messageSent: {
    background: 'rgba(232, 196, 104, 0.15)',
    border: '1px solid rgba(232, 196, 104, 0.3)'
  },
  messageSystem: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontStyle: 'italic'
  },
  messageUrgent: {
    background: 'rgba(255, 107, 107, 0.2)',
    border: '2px solid #ff6b6b',
    animation: 'urgentPulse 1s infinite'
  },
  messageSender: {
    fontSize: '7px',
    color: '#4ecdc4',
    marginBottom: '5px',
    fontFamily: '"Press Start 2P", monospace'
  },
  messageText: {
    fontSize: '9px',
    color: '#c8d5e0',
    lineHeight: '1.6',
    fontFamily: '"Press Start 2P", monospace'
  },
  phoneFooter: {
    padding: '15px',
    borderTop: '1px solid #2a2a3e',
    display: 'flex',
    justifyContent: 'center'
  },
  closeButton: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '9px',
    padding: '10px 20px',
    background: '#4ecdc4',
    border: 'none',
    color: '#0a1428',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease'
  },
  autoCloseHint: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '8px',
    color: '#5d6f7f',
    textAlign: 'center',
    animation: 'blink 1s infinite'
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

    @keyframes urgentPulse {
      0%, 100% { 
        box-shadow: 0 0 10px rgba(255, 107, 107, 0.4);
      }
      50% { 
        box-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
      }
    }

    button:hover:not(:disabled) {
      background: #4ecdc4 !important;
      color: #0a1428 !important;
      border-color: #4ecdc4 !important;
      box-shadow: 0 0 20px rgba(78, 205, 196, 0.4) !important;
    }
  `;

  const existingStyle = document.getElementById('chapter3-styles');
  if (existingStyle) existingStyle.remove();
  
  const style = document.createElement('style');
  style.id = 'chapter3-styles';
  style.textContent = styleSheet;
  document.head.appendChild(style);
}

export default Chapter3;