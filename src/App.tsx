import { invoke } from '@tauri-apps/api/core';
import { useRef, useState } from 'react';
import './App.css';
import DroneVisualizer from './components/common/Drone';
import Topbar from './components/common/TopBar';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const mountRef = useRef<HTMLDivElement>(null);

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <>
      <Topbar />
      <main className='w-screen h-[calc(100vh-50px)] bg-background mt-12.5'>
        <DroneVisualizer />
      </main>
    </>
  );
}

export default App;
