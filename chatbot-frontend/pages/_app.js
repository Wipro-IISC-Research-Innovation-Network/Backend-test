// pages/_app.js
import '@/styles/globals.css';
import io from 'socket.io-client';

const serverUrl = 'http://localhost:8001';
const socket = io(serverUrl);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} socket={socket} />;
}

export default MyApp;
