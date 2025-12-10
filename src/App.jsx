import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import Chapter1 from './components/Chapter1';
import Chapter2 from './components/Chapter2';
import Chapter3 from './components/Chapter3';
import Settings from './components/Settings';

function App() {
  const [gameState, setGameState] = useState('menu');
  
  const [saveData, setSaveData] = useState({
    currentChapter: null,
    hasCompletedChapter1: false,
    evidence: [],
    choices: {}
  });

  // 把这些移到顶层
  const [showPhone, setShowPhone] = useState(false);
  const [storyStep, setStoryStep] = useState(0);

  // 检查是否有存档
  const [hasSaveData, setHasSaveData] = useState(false);

  // 启动时检查 localStorage 是否有存档
  useEffect(() => {
    const saved = localStorage.getItem('mirrorLifeSave');
    if (saved) {
      setHasSaveData(true);
    }
  }, []);

  const handleNewGame = () => {
    console.log('Starting new game...');
    setStoryStep(0);
    setGameState('chapter1');
    setSaveData({
      currentChapter: 1,
      hasCompletedChapter1: false,
      evidence: [],
      choices: {}
    });
  };

  const handleContinue = () => {
    console.log('Continue game...');
    const saved = localStorage.getItem('mirrorLifeSave');
    if (saved) {
      const data = JSON.parse(saved);
      setSaveData(data);
      setGameState(`chapter${data.currentChapter}`);
    }
  };

  // ✅ FIX: 添加缺失的 handleChapter2 函数
  const handleChapter2 = () => {
    setGameState("chapter2");
  };

  const handleChapter3 = () => {
    setGameState("chapter3");
  };

  const handleSettings = () => {
    setGameState('settings');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  const handleChapter1Complete = () => {
    console.log('Chapter 1 complete!');
    setSaveData({
      ...saveData,
      currentChapter: 2,
      hasCompletedChapter1: true
    });
    setGameState("chapter2");
  };

  const handleChapter2Complete = () => {
    console.log('Chapter 2 complete!');
    setSaveData({
      ...saveData,
      currentChapter: 3,
      hasCompletedChapter2: true
    });
    setGameState("chapter3");
  };

  const handleSaveGame = () => {
    localStorage.setItem('mirrorLifeSave', JSON.stringify(saveData));
    setHasSaveData(true);  // 保存后更新状态
    console.log('Game saved!');
  };

  return (
    <div className="App">
      {gameState === 'menu' && (
        <MainMenu 
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onSettings={handleSettings}
          hasSaveData={hasSaveData}
          onChapter2={handleChapter2}
          onChapter3={handleChapter3}
        />
      )}

      {gameState === 'chapter1' && (
        <Chapter1 
          onBack={handleBackToMenu}
          onComplete={handleChapter1Complete}
          onSave={handleSaveGame}
          saveData={saveData}
          setSaveData={setSaveData}
        />
      )}

      {gameState === 'chapter2' && (
        <Chapter2 
          onBack={handleBackToMenu}
          onComplete={handleChapter2Complete}
          onSave={handleSaveGame}
          saveData={saveData}
          setSaveData={setSaveData}
        />
      )}

      {gameState === 'chapter3' && (
        <Chapter3 
          onBack={handleBackToMenu}
          onSave={handleSaveGame}
          saveData={saveData}
          setSaveData={setSaveData}
        />
      )}

      {gameState === 'settings' && (
        <Settings onBack={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;