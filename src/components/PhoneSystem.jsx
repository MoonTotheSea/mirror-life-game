import React, { useState, useEffect, useRef } from 'react';

// 1. 接收 showMysteriousMessage 参数
const PhoneSystem = ({ onClose, showMysteriousMessage }) => {
  const [appState, setAppState] = useState('HOME');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentTime, setCurrentTime] = useState('11:19');
  const [currentChat, setCurrentChat] = useState(null);
  const chatEndRef = useRef(null);
  
  // 初始消息状态
  const [allMessages, setAllMessages] = useState({
    1: [
      { id: 'hist-date', type: 'system', text: '--- Nov 10 ---' },
      { id: 1, text: "It's getting cold, remember to dress warmly.", type: 'received' },
      { id: 2, text: 'I know, Mom. You take care of yourself too.', type: 'sent' },
      { id: 3, text: "I'll come back to visit you this weekend.", type: 'sent' },
      { id: 4, text: ';)', type: 'sent' },
      { id: 'today-date', type: 'system', text: '--- Today ---' },
      { id: 5, text: "Jing, you haven't been home a while. How have you been? I made your favorite sweet and sour pork ribs.", type: 'received', unread: true }
    ],
    2: [
      { id: 'nov10-date', type: 'system', text: '--- Nov 10 ---' },
      { id: 1, text: "Lin Jing, the draft framework looks good.", type: 'received' },
      { id: 2, text: "But we need more firsthand interviews. The migrant worker angle is too surface-level.", type: 'received' },
      { id: 3, text: "Got it. I've scheduled three interviews this week. Will send recordings after.", type: 'sent' },
      { id: 4, text: "Perfect. This could be your breakthrough piece.", type: 'received' },
      { id: 'nov12-date', type: 'system', text: '--- Nov 12 ---' },
      { id: 5, text: "How did the interviews go?", type: 'received' },
      { id: 6, text: "Really well. Powerful stuff. Sending files now.", type: 'sent' },
      { id: 7, text: "[File] Interview_01.mp3", type: 'sent' },
      { id: 8, text: "[File] Interview_02.mp3", type: 'sent' },
      { id: 9, text: "[File] Interview_03.mp3", type: 'sent' },
      { id: 10, text: "These are incredible, Lin Jing. Raw and real.", type: 'received' },
      { id: 11, text: "Thank you, Editor Zhang. I'll have the full draft ready by deadline.", type: 'sent' },
      { id: 'yesterday-date', type: 'system', text: '--- Yesterday ---' },
      { id: 12, text: "Lin Jing? You okay? Heard you were in an accident.", type: 'received', unread: true },
    ],
    3: [
      { id: 'hist-date', type: 'system', text: '--- Nov 8 ---' },
      { id: 1, text: "Ms. Lin, your water bill for October is ¥127.50.", type: 'received' },
      { id: 2, text: 'Received, I will transfer it today.', type: 'sent' },
      { id: 'wed-date', type: 'system', text: '--- Wed ---' },
      { id: 3, text: "Please prepare next quarter's rent. Due by Dec 1st.", type: 'received', unread: true },
      { id: 4, text: "Also, there will be maintenance on the water heater this Friday. Please be home between 2-5pm.", type: 'received', unread: true }
    ]
  });

  // 2. 新增：监听神秘短信触发
  useEffect(() => {
    if (showMysteriousMessage) {
      // 这里的 ID 99 对应未知发件人
      const unknownId = 99;
      
      // 注入恐怖短信内容
      setAllMessages(prev => ({
        ...prev,
        [unknownId]: [
          { id: 'unknown-date', type: 'system', text: '--- Unknown Number ---' },
          { id: 1, text: "I see you...", type: 'received', isCreepy: true },
          { id: 2, text: "[Image] Bedroom_View.jpg", type: 'received', isCreepy: true },
          { id: 3, text: "I know what you found in the jewelry box.\nDon't look back.", type: 'received', isCreepy: true }
        ]
      }));

      // 强制设置当前聊天对象
      setCurrentChat({ 
        id: unknownId, 
        name: 'UNKNOWN', 
        lastMsg: "Don't look back.", 
        time: 'Now', 
        avatar: '#000000' 
      });

      // 强制跳转到聊天界面
      setAppState('WECHAT_CHAT');
    }
  }, [showMysteriousMessage]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (appState === 'WECHAT_CHAT' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [appState]);

  const getUnreadCountForContact = (contactId) => {
    return allMessages[contactId]?.filter(msg => msg.unread).length || 0;
  };

  const totalUnreadCount = Object.keys(allMessages).reduce((total, contactId) => {
    return total + getUnreadCountForContact(parseInt(contactId));
  }, 0);

  const markMessagesAsRead = (contactId) => {
    setAllMessages(prev => ({
      ...prev,
      [contactId]: prev[contactId]?.map(msg => ({ ...msg, unread: false })) || []
    }));
  };

  // 3. 修改：动态生成联系人列表，包含 UNKNOWN
  const baseContacts = [
    { id: 1, name: 'Mom', lastMsg: "Jing, you haven't been ho...", time: '23:45', avatar: '#d9534f' },
    { id: 2, name: 'Editor Zhang', lastMsg: 'Lin Jing? You okay? Heard...', time: 'Yesterday', avatar: '#e8c468' },
    { id: 3, name: 'Landlord', lastMsg: 'Also, there will be mainte...', time: 'Wed', avatar: '#3a7d7c' },
  ];

  const contactList = showMysteriousMessage 
    ? [{ id: 99, name: 'UNKNOWN', lastMsg: "Don't look back.", time: 'Now', avatar: '#000000' }, ...baseContacts]
    : baseContacts;

  const handleContactClick = (contact) => {
    markMessagesAsRead(contact.id);
    setCurrentChat(contact);
    setAppState('WECHAT_CHAT');
  };

  // ... StatusBar, HomeScreen, CalendarScreen 保持不变 ...
  const StatusBar = () => (
    <div style={styles.statusBar}>
      <div style={styles.statusLeft}>
        <span style={styles.signalDot}>●</span>
        <span style={styles.signalText}>SIGNAL: {showMysteriousMessage ? 'ERR' : '100%'}</span>
      </div>
      <div style={styles.statusTime}>{currentTime}</div>
      <div style={styles.statusRight}>
        <span>□</span>
        <span>80%</span>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div style={styles.homeScreen}>
      <div style={styles.homeTitle}></div>
      <div style={styles.appGrid}>
        <div style={styles.appContainer} onClick={() => setAppState('CALENDAR')}>
          <div style={styles.appIcon}>
            <div style={styles.calendarTop}></div>
            <span style={styles.calendarDate}>16</span>
          </div>
          <span style={styles.appLabel}>Calendar</span>
        </div>
        <div style={styles.appContainer} onClick={() => setAppState('WECHAT_LIST')}>
          <div style={styles.appIcon}>
            <span style={styles.wechatIcon}>💬</span>
            {totalUnreadCount > 0 && <div style={styles.badge}>{totalUnreadCount}</div>}
          </div>
          <span style={styles.appLabel}>WeChat</span>
        </div>
      </div>
    </div>
  );

  const CalendarScreen = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);
    return (
      <div style={styles.screenContainer}>
        <div style={styles.navBar}>
          <button style={styles.backBtn} onClick={() => setAppState('HOME')}>{'<'} BACK</button>
          <span style={styles.navTitle}>NOV 2025</span>
          <div style={{ width: '80px' }}></div>
        </div>
        <div style={styles.calendarContent}>
          <div style={styles.scheduleTitle}>SCHEDULE</div>
          <div style={styles.daysRow}>
            {days.map((d, i) => <div key={i} style={styles.dayLabel}>{d}</div>)}
          </div>
          <div style={styles.datesGrid}>
            {[...Array(6)].map((_, i) => <div key={`empty-${i}`} style={styles.dateCell}></div>)}
            {dates.map(date => {
              const isToday = date === 16;
              const isDeadline = date === 19;
              return (
                <div key={date} style={{...styles.dateCell, ...(isToday && styles.todayCell), ...(isDeadline && styles.deadlineCell)}}
                  onClick={() => { if (isDeadline) setSelectedDate(selectedDate === 19 ? null : 19); else setSelectedDate(null); }}>
                  {date}
                </div>
              );
            })}
          </div>
          {selectedDate === 19 && (
            <div style={styles.deadlineCard}>
              <div style={styles.deadlineHeader}>★ DEADLINE ★</div>
              <div style={styles.deadlineContent}>
                <div>TASK: Urban Aphasia' feature</div>
                <div>STATUS: <span style={styles.urgentText}>URGENT</span></div>
                <div>NOTE: Don't procrastinate!</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const WeChatListScreen = () => (
    <div style={styles.screenContainer}>
      <div style={styles.wechatHeader}>
        <span style={styles.wechatTitle}>WECHAT{totalUnreadCount > 0 ? `(${totalUnreadCount})` : ''}</span>
        <span style={styles.plusIcon}>+</span>
      </div>
      <div style={styles.searchBar}>
        <span>🔍</span>
        <span style={styles.searchText}>SEARCH...</span>
      </div>
      <div style={styles.contactList}>
        {contactList.map(contact => {
          const unreadCount = getUnreadCountForContact(contact.id);
          return (
            <div key={contact.id} style={styles.contactItem} onClick={() => handleContactClick(contact)}>
              <div style={{ ...styles.avatar, background: contact.avatar }}>{contact.name[0]}</div>
              <div style={styles.contactInfo}>
                <div style={styles.contactTop}>
                  <span style={{...styles.contactName, color: contact.id === 99 ? '#d9534f' : '#4ecdc4'}}>{contact.name}</span>
                  <span style={styles.contactTime}>{contact.time}</span>
                </div>
                <div style={{...styles.contactMsg, color: contact.id === 99 ? '#d9534f' : '#8a9fb0'}}>{contact.lastMsg}</div>
              </div>
              {unreadCount > 0 && <div style={styles.unreadDot}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  const WeChatChatScreen = () => {
    const messages = currentChat ? allMessages[currentChat.id] : [];
    
    // 如果消息为空（防止崩溃），返回空数组
    if (!messages) return <div style={styles.screenContainer}>Loading...</div>;

    return (
      <div style={styles.screenContainer}>
        <div style={styles.chatHeader}>
          <div style={styles.chatBack} onClick={() => setAppState('WECHAT_LIST')}>{'<'} BACK</div>
          <span style={{...styles.chatName, color: currentChat?.id === 99 ? '#d9534f' : '#c8d5e0'}}>
            {currentChat?.name || 'Chat'}
          </span>
          <span style={styles.moreIcon}>⋯</span>
        </div>
        <div style={styles.chatMessages}>
          {messages.map(msg => {
            if (msg.type === 'system') return <div key={msg.id} style={styles.systemMsg}>{msg.text}</div>;
            const isVoice = msg.isVoice;
            // 4. 新增：处理恐怖短信的样式 (isCreepy)
            const isCreepy = msg.isCreepy; 
            return (
              <div key={msg.id} style={{
                ...styles.messageBubble, 
                ...(msg.type === 'sent' ? styles.sentBubble : styles.receivedBubble), 
                ...(isVoice && styles.voiceBubble),
                ...(isCreepy && styles.creepyBubble) // 应用恐怖样式
              }}>
                {msg.text}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
        <div style={styles.chatInput}>
          <span style={styles.micIcon}>🎤</span>
          <div style={styles.inputField}>...</div>
          <span style={styles.emojiIcon}>😊</span>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.phoneWrapper}>
      <div style={styles.phoneFrame}>
        <StatusBar />
        <div style={styles.screenArea}>
          {appState === 'HOME' && <HomeScreen />}
          {appState === 'CALENDAR' && <CalendarScreen />}
          {appState === 'WECHAT_LIST' && <WeChatListScreen />}
          {appState === 'WECHAT_CHAT' && <WeChatChatScreen />}
        </div>
        <div style={styles.bottomNav}>
          <div style={styles.navBtn}></div>
          <div style={styles.navBtnActive} onClick={() => { 
            // 如果处于神秘消息模式，禁止返回Home，或者处理特殊逻辑
            if (showMysteriousMessage && appState === 'WECHAT_CHAT') {
                if (onClose) onClose(); // 强制关闭手机触发剧情
            } else {
                if (appState === 'HOME' && onClose) onClose(); 
                else setAppState('HOME'); 
            }
          }}></div>
          <div style={styles.navBtn}></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  phoneWrapper: { width: '100%', minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '"Press Start 2P", monospace' },
  phoneFrame: { width: '320px', height: '640px', background: '#0a1428', border: '4px solid #3a7d7c', borderRadius: '8px', boxShadow: '0 0 40px rgba(78, 205, 196, 0.3), inset 0 0 20px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  statusBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0a1428', borderBottom: '2px solid #1a2332', fontSize: '8px' },
  statusLeft: { display: 'flex', alignItems: 'center', gap: '6px' },
  signalDot: { color: '#4ecdc4', fontSize: '6px' },
  signalText: { color: '#3a7d7c' },
  statusTime: { color: '#c8d5e0', fontSize: '10px' },
  statusRight: { display: 'flex', alignItems: 'center', gap: '6px', color: '#3a7d7c' },
  screenArea: { flex: 1, overflow: 'hidden', background: '#0a1428' },
  screenContainer: { height: '100%', display: 'flex', flexDirection: 'column' },
  homeScreen: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' },
  homeTitle: { textAlign: 'center', marginTop: '20px', marginBottom: '40px' },
  appGrid: { display: 'flex', gap: '40px', justifyContent: 'center' },
  appContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' },
  appIcon: { width: '64px', height: '64px', background: '#1a2332', border: '2px solid #3a7d7c', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '8px' },
  calendarTop: { position: 'absolute', top: 0, left: 0, width: '100%', height: '14px', background: '#d9534f' },
  calendarDate: { color: '#c8d5e0', fontSize: '20px', marginTop: '8px' },
  wechatIcon: { fontSize: '28px' },
  badge: { position: 'absolute', top: '-6px', right: '-6px', background: '#d9534f', color: 'white', fontSize: '8px', padding: '2px 6px', borderRadius: '2px' },
  appLabel: { color: '#4ecdc4', fontSize: '10px' },
  navBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: '2px solid #3a7d7c' },
  backBtn: { background: 'transparent', border: '2px solid #3a7d7c', color: '#4ecdc4', padding: '8px 12px', fontSize: '10px', cursor: 'pointer', fontFamily: '"Press Start 2P", monospace' },
  navTitle: { color: '#c8d5e0', fontSize: '12px' },
  calendarContent: { padding: '16px', flex: 1, overflow: 'auto' },
  scheduleTitle: { color: '#4ecdc4', fontSize: '12px', textAlign: 'center', marginBottom: '16px' },
  daysRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' },
  dayLabel: { color: '#3a7d7c', fontSize: '8px', textAlign: 'center' },
  datesGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' },
  dateCell: { aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5d6f7f', fontSize: '10px', cursor: 'pointer' },
  todayCell: { border: '2px solid #4ecdc4', color: '#4ecdc4', background: 'rgba(78,205,196,0.1)' },
  deadlineCell: { background: '#e8c468', color: '#0a1428' },
  deadlineCard: { marginTop: '16px', background: '#1a2332', border: '2px solid #3a7d7c', padding: '12px' },
  deadlineHeader: { color: '#e8c468', fontSize: '10px', marginBottom: '8px' },
  deadlineContent: { color: '#c8d5e0', fontSize: '8px', lineHeight: '2' },
  urgentText: { color: '#d9534f' },
  wechatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '2px solid #3a7d7c' },
  wechatTitle: { color: '#c8d5e0', fontSize: '12px' },
  plusIcon: { color: '#4ecdc4', fontSize: '16px' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '8px', margin: '12px', padding: '8px 12px', border: '2px solid #3a7d7c', background: '#0a1428' },
  searchText: { color: '#3a7d7c', fontSize: '8px' },
  contactList: { flex: 1, overflow: 'auto', padding: '0 12px' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '8px', background: '#1a2332', border: '2px solid #253447', cursor: 'pointer' },
  avatar: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  contactInfo: { flex: 1, minWidth: 0 },
  contactTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  contactName: { color: '#4ecdc4', fontSize: '10px' },
  contactTime: { color: '#5d6f7f', fontSize: '8px' },
  contactMsg: { color: '#8a9fb0', fontSize: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  unreadDot: { width: '8px', height: '8px', background: '#d9534f' },
  chatHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: '2px solid #3a7d7c' },
  chatBack: { color: '#4ecdc4', fontSize: '10px', cursor: 'pointer' },
  chatName: { color: '#c8d5e0', fontSize: '12px' },
  moreIcon: { color: '#3a7d7c', fontSize: '16px' },
  chatMessages: { flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' },
  systemMsg: { textAlign: 'center', color: '#3a7d7c', fontSize: '8px', padding: '8px 0' },
  messageBubble: { maxWidth: '80%', padding: '12px', fontSize: '10px', lineHeight: '1.6', position: 'relative' },
  sentBubble: { alignSelf: 'flex-end', background: '#4ecdc4', color: '#0a1428', borderRight: '4px solid #3a7d7c' },
  voiceBubble: { background: '#3a9d94', border: '2px dashed #4ecdc4', fontStyle: 'italic' },
  // 5. 恐怖短信样式
  creepyBubble: { background: '#1a0505', color: '#d9534f', border: '1px solid #d9534f', textShadow: '0 0 5px #d9534f' },
  receivedBubble: { alignSelf: 'flex-start', background: '#253447', color: '#c8d5e0', borderLeft: '4px solid #5d6f7f' },
  chatInput: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderTop: '2px solid #3a7d7c', background: '#1a2332' },
  micIcon: { fontSize: '14px', opacity: 0.5 },
  inputField: { flex: 1, padding: '8px 12px', background: '#0a1428', border: '2px solid #253447', color: '#4ecdc4', fontSize: '10px' },
  emojiIcon: { fontSize: '14px' },
  bottomNav: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', padding: '12px', background: '#1a2332', borderTop: '2px solid #253447' },
  navBtn: { width: '32px', height: '8px', background: '#0a1428', border: '1px solid #3a7d7c' },
  navBtnActive: { width: '32px', height: '8px', background: '#4ecdc4', border: '1px solid #3a7d7c', cursor: 'pointer' }
};

export default PhoneSystem;