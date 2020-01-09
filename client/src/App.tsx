import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './App.module.css';

type Message = String;

const App: React.FC = () => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [receivedMessage, setReceivedMessage] = useState<Message>('');
  const [inputtedValue, setInputtedValue] = useState('');
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('receiveMessage', (message: Message) => {
      setReceivedMessage(message);
    });
  }, []);

  useEffect(() => {
    if (messageList.length === 0 && receivedMessage === '') return;
    setMessageList([...messageList, receivedMessage]);
  }, [receivedMessage]);

  const onChangeHandler = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setInputtedValue(e.currentTarget.value);
  };

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!socket) {
      return;
    }
    e.preventDefault();
    socket.emit('sendMessage', inputtedValue);
    setInputtedValue('');
  };

  return (
    <div className={styles.app}>
      <ul className={styles.message}>
        {messageList.map((msg, i) => (
          <li key={`${msg}${i}`}>
            <p className={styles.msg}>{msg}</p>
          </li>
        ))}
      </ul>
      <div className={styles.inputWrapper}>
        <input className={styles.input} type="text" value={inputtedValue} onChange={onChangeHandler} />
        <button className={styles.submitButton} onClick={onClickHandler}>Send</button>
      </div>
    </div>
  )
}

export default App;