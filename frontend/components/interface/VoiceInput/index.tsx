"use client"
import 'regenerator-runtime/runtime'
import { Mic } from 'lucide-react';
import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { clsx } from 'clsx';

const  VoiceInput = ({setSearch}:{setSearch:React.Dispatch<React.SetStateAction<string>>}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  const toggleListening = () =>{
    listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening()
  }

  useEffect(()=>{
    setSearch(transcript)
  },[transcript])

  return (
    <div className='text-white'>
      <button onClick={toggleListening} className={`bg-opacity-10 rounded-full p-2 ${listening && "bg-white animate-pulse"}`}>
        <Mic className=' text-white text-opacity-50'/>    
      </button>
    </div>
  );
};
export default  VoiceInput;