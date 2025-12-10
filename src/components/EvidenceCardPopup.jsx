// EvidenceCardPopup.jsx
import React, { useState, useEffect } from 'react';

const EvidenceCardPopup = ({ cardData, onClose }) => {
  const [revealed, setRevealed] = useState(false);
  
  // 自动触发入场动画
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 处理关闭：先播放退场动画，再触发父组件回调
  const handleClose = () => {
    setRevealed(false);
    // 300ms 对应下方 opacity transition 的时间
    setTimeout(onClose, 300);
  };

  if (!cardData) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 10, 20, 0.92)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000, // 确保在最上层
      opacity: revealed ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      {/* 确保字体加载 (如果父级没加载) */}
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      
      {/* Card Wrapper for Scale Animation */}
      <div style={{
        width: '340px',
        transform: revealed ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        
        {/* Card Container */}
        <div style={{
          background: 'linear-gradient(180deg, #1a2a3a 0%, #0d1a2d 100%)',
          border: '2px solid #4ecdc4',
          boxShadow: '0 0 40px rgba(78, 205, 196, 0.3), 0 0 80px rgba(78, 205, 196, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Press Start 2P", monospace'
        }}>
          {/* Scanlines Effect */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            pointerEvents: 'none', zIndex: 10
          }} />

          {/* Header */}
          <div style={{
            background: 'linear-gradient(180deg, #4ecdc4 0%, #3ab8b0 100%)',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#0a1428', fontSize: '9px', letterSpacing: '3px' }}>
              ◆ {cardData.type || 'EVIDENCE'} ◆
            </span>
            <span style={{
              color: '#0a1428', fontSize: '7px',
              background: 'rgba(10, 20, 40, 0.2)', padding: '3px 8px'
            }}>NEW</span>
          </div>

          {/* Body */}
          <div style={{ padding: '20px' }}>
            {/* Title Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                width: '60px', height: '60px',
                background: '#0a1428', border: '2px solid #2a3a4a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
              }}>
                {cardData.icon || '📄'}
              </div>
              <div style={{
                color: '#e8c468', fontSize: '12px',
                textShadow: '0 0 15px rgba(232, 196, 104, 0.5)', lineHeight: 1.4,
                flex: 1
              }}>
                {cardData.title}
              </div>
            </div>

            {/* Description */}
            <div style={{ color: '#8a9aa8', fontSize: '9px', lineHeight: 2.2, marginBottom: '20px' }}>
              {cardData.description}
            </div>

            {/* Details List */}
            {cardData.details && (
              <div style={{ background: '#0a1218', border: '1px solid #1a2a3a', padding: '15px' }}>
                {cardData.details.map((detail, i) => (
                  <div key={i} style={{
                    color: '#6a7a8a', fontSize: '8px',
                    marginBottom: i < cardData.details.length - 1 ? '10px' : 0,
                    display: 'flex', alignItems: 'center', gap: '10px', lineHeight: 1.8
                  }}>
                    <span style={{ color: '#4ecdc4' }}>▸</span>
                    {detail}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #1a2a3a', padding: '15px 20px', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleClose} 
              style={{
                background: 'transparent', border: '2px solid #4ecdc4',
                padding: '12px 50px', color: '#4ecdc4',
                fontFamily: '"Press Start 2P", monospace', fontSize: '9px', cursor: 'pointer',
                boxShadow: '0 0 15px rgba(78, 205, 196, 0.2)', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { 
                e.target.style.background = '#4ecdc4'; 
                e.target.style.color = '#0a1428'; 
                e.target.style.boxShadow = '0 0 25px rgba(78, 205, 196, 0.5)';
              }}
              onMouseLeave={e => { 
                e.target.style.background = 'transparent'; 
                e.target.style.color = '#4ecdc4'; 
                e.target.style.boxShadow = '0 0 15px rgba(78, 205, 196, 0.2)';
              }}
            >
              CLOSE
            </button>
          </div>

          {/* Decorative Corner */}
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#4ecdc4', fontSize: '10px', opacity: 0.4 }}>└</div>
        </div>

        {/* Bottom Text Animation */}
        <div style={{
          textAlign: 'center', marginTop: '25px', color: '#4ecdc4', fontSize: '9px',
          textShadow: '0 0 20px rgba(78, 205, 196, 0.8)', letterSpacing: '2px', animation: 'pulse 2s infinite'
        }}>
          ★ ADDED TO EVIDENCE ★
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default EvidenceCardPopup;