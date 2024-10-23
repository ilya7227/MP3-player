import { useState, useRef, useEffect } from 'react';
import './App.css';
import music1  from "./musics/1.mp3";
import music2  from "./musics/2.mp3";
import music3  from "./musics/3.mp3";
import music4  from "./musics/4.mp3";

const musicList = [music1, music2, music3, music4];

function App() {
  const [onSwitch, setOnSwitch] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(0);
  const [musicVolume, setMusicVolume] =  useState(50);
  const [musicTime, setMusicTime] = useState(0);
  const [currentMusicTime, setCurrentMusicTime] = useState(0);
  
  const audioRef = useRef(null);

  const  handleVolume = (e) => {
    const newVolume = e.target.value;
    setMusicVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
   
  }

  const handleSwitchTime = (e) => {
    const newTime =  e.target.value;
    setCurrentMusicTime(newTime);
    audioRef.current.currentTime = newTime;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentMusicTime(audioRef.current.currentTime);
      }
    }, 1000); 
  
    return () => clearInterval(interval); 
  }, []);

  const handleOnClick1 = () => { //пауза в принципе самая изи
    if (onSwitch) {
      setOnSwitch(false);
      audioRef.current.pause();
      
    }
  }

  const handleOnClick2 = () => { // старт музыки, вроде терпимо
    if (!onSwitch) {
      setOnSwitch(true);
      audioRef.current.play(); // вот эту тему загуглил, так как не знал как запускать
    }
  }

  const  handleOnClick3 = () => {
    const nextIndex = (currentMusic + 1) % musicList.length; // эт для нового индекса для след песни и чтоб за рамки не выйти, на информатике проходил
    setCurrentMusic(nextIndex);
    setOnSwitch(false);
    var playPromise = audioRef.current.play();
    if (playPromise !== undefined) { // эта хуйня, извините за выражение, для того, чтобы пофиксить ошибку прерывания play, я не мог это дело решить 3 часа
      playPromise.then(_ => {
        audioRef.current.pause();
        audioRef.current.src = musicList[nextIndex];
        audioRef.current.play()
        setOnSwitch(true)

      })
      .catch(error => {
        
      });
    }

    
  }

  const handleOnClick4 = () => {
    const  prevIndex = (currentMusic - 1 + musicList.length) % musicList.length;
    setCurrentMusic(prevIndex);
    setOnSwitch(false);
    var playPromise = audioRef.current.play();
    if (playPromise !== undefined) { 
      playPromise.then(_ => {
        audioRef.current.pause();
        audioRef.current.src = musicList[prevIndex];
        audioRef.current.play()
        setOnSwitch(true)

      })
      .catch(error => {
        
      });
    }

  }


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // эт написал, в случае если секунды меньше 10, то чтоб 0 приписывался, типа красиво
  }

  return (
    <div className="App">
      <audio ref={audioRef} src={musicList[currentMusic]} onLoadedMetadata={()=> {
        setMusicTime(audioRef.current.duration) // вот эту тему тоже загуглил, т.к. хер знал как продолжительность найти
      }}></audio>
      <div className="pleer">
        <div className='malenkiy_visual'>
          <button className='stop' onClick={handleOnClick1}>Пауза</button>
          <button className='play' onClick={handleOnClick2}>Начать</button>
          <button className='previous' onClick={handleOnClick4}>Предыдущая песня</button>
          <button className='next' onClick={handleOnClick3}>Следующая песня</button>
        </div>
        <input type="range" min={0} max={100} value={musicVolume} onChange={handleVolume}/>
        <p>Громкость: {musicVolume}</p>
        <p>Время: {formatTime(currentMusicTime)} / {formatTime(musicTime)}</p>
        <input type="range" min={0} max={musicTime} value={currentMusicTime} onChange={handleSwitchTime} />
      </div>
      
    </div>
  );
}

export default App;
