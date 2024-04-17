import React, { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { split } from 'sentence-splitter';
import intentsData from '../pages/mydata.json';


export default function Home({ socket }) {
  const [messages, setMessages] = useState([{ text: 'Hello, I am Chatbot', fromUser: false }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { speak } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // ----- *-----
 

  //------*------

  const handleUserInput = async () => {
    const userMessage = input.trim().toLowerCase();
  
    if (userMessage) {
      for (const intent of intentsData.intents) {
        if (new RegExp(intent.pattern, 'i').test(userMessage)) {
          // Matched intent, provide a predefined response
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: ${userMessage}, fromUser: true },
            { text: ${intent.answer}, fromUser: false },
          ]);
          speak({ text: intent.answer });
          setInput('');
          return;
        }
      }
        
      setIsTyping(true);
  
      const typingDelay = 20; // Adjust this as needed
  
      setMessages(prevMessages => [...prevMessages, { text: '', fromUser: true }]);
  
      await delay(userMessage.length * typingDelay);
  
      setMessages(prevMessages => prevMessages.slice(0, prevMessages.length - 1));
  
      setMessages(prevMessages => [...prevMessages, { text: userMessage, fromUser: true }]);
  
      socket.emit('user-message', userMessage);
  
      setInput('');
    }
  };
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  //const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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

  const isSpeakingRef = useRef(false);

useEffect(() => {
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.fromUser && lastMessage.text !== lastSpokenMessageRef.current && !isSpeakingRef.current) {
      isSpeakingRef.current = true;
      speak({ text: lastMessage.text, onEnd: () => (isSpeakingRef.current = false) });
      lastSpokenMessageRef.current = lastMessage.text;
    }
  }
}, [messages, speak]);
  const handleInputChange = event => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    handleUserInput();
  };

  
  
  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };


  return (
    <div className="bg-gradient-to-b from-white-400 to-blue-600 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-3 w-96" style={{background:'rgba(28,30,58,1)'}}>
        <div className="h-96 overflow-y-scroll" style={{ color: 'whitesmoke', color: 'white' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={mb-4 ${message.fromUser ? 'text-black-600 text-right to-blue' : 'text-white-800'}}
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
        <p style={{ color: 'orange' }}>Microphone: {listening ? 'on' : 'off'}</p>
        <form className="flex" onSubmit={handleSubmit}>
          <button
            type="button"
            className="bg-yellow-400 text-black p-6 rounded-l-lg"
            style={{
              borderRadius: '20%',
              width: '10%',
              padding: '10px',
              backgroundColor: 'green',
              padding: '10px',
              borderRadius: '20%'
            }}
            onClick={SpeechRecognition.startListening}
          >
            🎤
          </button>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            className="flex-grow border rounded-l-lg p-2 text-black bg-white"
            placeholder="Type your message..."
          ></input>

          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-6 rounded-r-lg"
            style={{
              backgroundColor: 'green',
              color: 'white',
              marginLeft: '1%',
              borderRadius: '20%',
              width: '10%',
              padding: '10px'
            }}
          >
            OK
          </button>
        </form>
      </div>
    </div>
 
  );
}