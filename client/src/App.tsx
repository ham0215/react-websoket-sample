import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './App.module.css';
import { InitialForm } from './components/InitialForm';

interface Message {
  name: string
  msg: string
};

const App: React.FC = () => {
  const [displayInitialForm, setDisplayInitialForm] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [receivedMessage, setReceivedMessage] = useState<Message>({ name: '', msg: '' });
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
    socket.on('joined', (name: string) => {
      setReceivedMessage({ name: name, msg: 'joined!' });
    });
    socket.on('left', (name: string) => {
      setReceivedMessage({ name: name, msg: 'left this group.' });
    });
  }, [socket]);

  useEffect(() => {
    if (messageList.length === 0 && receivedMessage.msg === '') return;
    setMessageList([...messageList, receivedMessage]);
  }, [receivedMessage]);　// eslint-disable-line

  const onChangeHandler = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setInputtedValue(e.currentTarget.value);
  };

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!socket) return;

    e.preventDefault();
    socket.emit('sendMessage', { name: userName, msg: inputtedValue });
    setInputtedValue('');
  };

  const changeUserNameHandler = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value);
  };

  const submitHandler = () => {
    if (!socket) {
      return;
    }

    socket.emit('join', userName);
    setDisplayInitialForm(false);
  };

  if (displayInitialForm) {
    return <InitialForm inputtedValue={userName} changeHandler={changeUserNameHandler} submitHandler={submitHandler} />;
  }

  return (
    <div className={styles.app}>
      <ul className={styles.message}>
        {messageList.map((c, i) => (
          <li key={`${c.msg}${i}`}>
            <span className={styles.name}>
              {c.name}
            </span>
            <p className={styles.msg}>{c.msg}</p>
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