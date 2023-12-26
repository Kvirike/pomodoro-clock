import { useState, useEffect } from 'react';
import './App.css';
import sound from './media/alarm.mp3'


function App() {
  const [displayTime, setDisplayTime]= useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnbreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(sound));

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds) 
    )
  }

  const changeTime = (amount, type) =>{
    if(type == 'break'){
      if(breakTime <= 60 && amount < 0){
        return;
      }
      setBreakTime((prev) => prev + amount);
    }else{
      if(sessionTime <= 60 && amount < 0){
        return;
      }
      setSessionTime((prev) => prev + amount)
      if(!timerOn){
        setDisplayTime(sessionTime + amount)
      }
    }
  }

  
  const controlTime = () => {
    setTimerOn((prevTimerOn) => !prevTimerOn); // Toggle timer
  };

  useEffect(() => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let interval;

    if (timerOn) {
      interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreak) {
              playBreakSound();
              setOnbreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreak) {
              playBreakSound();
              setOnbreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);

      localStorage.clear();
      localStorage.setItem('interval-id', interval);
    } else {
      clearInterval(localStorage.getItem('interval-id'));
    }

    return () => {
      clearInterval(interval);
    };
  }, [timerOn, onBreak, breakTime, sessionTime]);

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  }

  return (
    <div className='center-align main-div'>
      <h1>Pomodoro Clock</h1>
      <div className='dual-container'>
        <Length 
          title={"Break Length"} 
          changeTime={changeTime} 
          type={"break"} 
          time={breakTime} 
          formatTime={formatTime}
        />
        <Length 
          title={"Session Length"} 
          changeTime={changeTime} 
          type={"session"} 
          time={sessionTime} 
          formatTime={formatTime}
        />
      </div>
      <h3 className='text'>{onBreak ? "Break" : "Session"}</h3>
      <h1>{formatTime(displayTime)}</h1>
      <button className='"btn-large deep-purple lighten-2 btns' onClick={controlTime}>
        {timerOn ? 
          (<i className='material-icons'>pause_circle_filled</i>)
          :
          (<i className='material-icons'>play_circle_filled</i>)
        }
      </button>
      <button className='"btn-large deep-purple lighten-2 btns' onClick={resetTime}>
        <i className='material-icons'>autorenew</i>
      </button>
    </div>
  );
}

function Length({title, changeTime, type, time, formatTime}){
  return(
    <div className='div-sec'>
      <h3>{title}</h3>
      <div className='time-sets'>
        <button className='btn-small lighten-2 btn' onClick={() => changeTime(-60, type)}>
          <i className='material-icons'>arrow_downward</i>
        </button>
        <h3>{formatTime(time)}</h3>
        <button className='btn-small  lighten-2 btn' onClick={() => changeTime(60, type)}>
          <i className='material-icons'>arrow_upward</i>
        </button>
      </div>
    </div>
  )
}

export default App;