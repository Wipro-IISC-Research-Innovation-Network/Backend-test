// pages/index.js
import React, { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { split } from 'sentence-splitter';
import firebase from 'firebase/compat/app'; // Import Firebase
import 'firebase/compat/firestore'; // Import Firestore

const keyValuePairList = {
  'open the doors': 'The doors are now open.',
  'close the doors': 'The doors are now closed.',
  'open the windows': 'The windows are now open.',
  'close the windows': 'The windows are now closed.',
  'turn on the AC': 'The AC is now turned on.',
  'turn off the AC': 'The AC is now turned off.',
  'turn up the music': 'The music volume is now turned up.',
};

const fixedAnswers = {
  'what is your name': 'My name is Wipod and I am a superfast and intelligent car',
  'how are you': 'I am just a computer program, so I don\'t have feelings, but I am here to help you',
  // Add more predefined questions and answers here
};

const Home = ({ socket }) => {
  const [messages, setMessages] = useState([{ text: 'Hello, I am Chatbot', fromUser: false }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { speak } = useSpeechSynthesis();
  const { transcript, listening } = useSpeechRecognition();

  const initializeFirebase = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyDEKrObBP5N3mpSQu5SvixHIIivcQLc4fU",
      authDomain: "talkbot-997f5.firebaseapp.com",
      projectId: "talkbot-997f5",
      storageBucket: "talkbot-997f5.appspot.com",
      messagingSenderId: "909398922881",
      appId: "1:909398922881:web:03baacbc080eeebf389f80",
      measurementId: "G-9XK1PTBQX6"
    };

    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
  };

  const handleUserInput = async () => {
    initializeFirebase(); // Initialize Firebase

    const userMessage = input.trim();

    if (userMessage) {
      if (keyValuePairList.hasOwnProperty(userMessage)) {
        // Handle key-value pairs
        const value = keyValuePairList[userMessage];
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `${userMessage}`, fromUser: true },
          { text: `${value}`, fromUser: false },
        ]);

        // Store the user question in 'keyValuePairQuestions' collection
        const firestore = firebase.firestore();
        firestore.collection('keyValuePairQuestions').add({
          question: userMessage,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        speak({ text: value });
      } else if (fixedAnswers.hasOwnProperty(userMessage)) {
        // Handle predefined answers
        const fixedAnswer = fixedAnswers[userMessage];
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `${userMessage}`, fromUser: true },
          { text: `${fixedAnswer}`, fromUser: false },
        ]);

        // Store the user question in 'userQuestions' collection
        const firestore = firebase.firestore();
        firestore.collection('userQuestions').add({
          question: userMessage,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        speak({ text: fixedAnswer });
      } else {
        // Handle other user messages
        setIsTyping(true);
        const userMessage = input;
        setInput('');

        const typingDelay = 20;

        setMessages((prevMessages) => [...prevMessages, { text: 'You: ', fromUser: true }]);

        await delay(userMessage.length * typingDelay);

        setMessages((prevMessages) => prevMessages.slice(0, prevMessages.length - 1));

        setMessages((prevMessages) => [...prevMessages, { text: userMessage, fromUser: true }]);

        // Store the user question in 'userQuestions' collection
        const firestore = firebase.firestore();
        firestore.collection('userQuestions').add({
          question: userMessage,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        socket.emit('user-message', userMessage);
      }

      setInput('');
    }
  };

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (!listening && input.trim() !== '') {
      handleSubmit();
    }
  }, [listening]);

  const isProcessingRef = useRef(false);

  useEffect(() => {
    socket.on('bot-message', async (message) => {
      if (!isProcessingRef.current) {
        isProcessingRef.current = true;
        setIsTyping(true);

        const typingDelay = 5;

        if (message) {
          const sentences = split(message);

          for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i].raw;
            await delay(i * typingDelay);

            if (i === 0) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  text: isTyping ? prevMessages.pop().text + sentence : sentence,
                  fromUser: false,
                },
              ]);
            }
          }

          setIsTyping(false);
        }

        isProcessingRef.current = false;
      }
    });
  }, [socket]);

  const lastSpokenMessageRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.fromUser && lastMessage.text !== lastSpokenMessageRef.current) {
        speak({ text: lastMessage.text });
        lastSpokenMessageRef.current = lastMessage.text;
      }
    }
  }, [messages, speak]);

  

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    handleUserInput();
  };

  return (
    <div className="bg-gradient-to-b from-white-400 to-blue-600 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-3 w-96">
        <div className="h-96 overflow-y-scroll" style={{ color: 'whitesmoke', color: 'black' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.fromUser ? 'text-black-600 text-right to-blue' : 'text-white-800'}`}
            >
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className="mb-4 text-gray-600">
              <span className="animate-bounce inline-block">&#9612;</span>
              <span className="animate-bounce inline-block">&#9612;</span>
              <span className="animate-bounce inline-block">&#9612;</span>
            </div>
          )}
        </div>
        <p style={{ color: 'green' }}>Microphone: {listening ? 'on' : 'off'}</p>
        <form className="flex">
          <button
            type="button"
            className="bg-yellow-400 text-black p-6 rounded-l-lg"
            style={{
              borderRadius: '20%',
              width: '10%',
              padding: '10px',
              backgroundColor: 'rgb(10,40,30)',
              padding: '10px',
              borderRadius: '20%',
            }}
            onClick={SpeechRecognition.startListening}
          >
            🎤
          </button>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-grow border rounded-l-lg p-2 text-black bg-white"
            placeholder="Type your message..."
          ></input>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-6 rounded-r-lg"
            style={{
              backgroundColor: 'rgb(10,40,30)',
              color: 'white',
              marginLeft: '1%',
              borderRadius: '20%',
              width: '10%',
              padding: '10px',
            }}
          >
            OK
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;