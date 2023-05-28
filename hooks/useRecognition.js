import 'regenerator-runtime/runtime'
import {useEffect, useState} from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

export  const useRecognition = () => {
  const { transcript, resetTranscript} = useSpeechRecognition()
  const [isListening, setIsListening] = useState(false)

  const handleStartListening= () => {
    setIsListening(true)
    resetTranscript()
    SpeechRecognition.startListening({
      language: 'ru',
      continuous: true,
    })
  }
  const handleStopListening = () => {
    setIsListening(false)
    SpeechRecognition.stopListening()
  }

  const array = [
    {
      id: 1,
      name: 'Alex',
      job: 'doctor',
      birthday: '10.11.1994',
      residence: 'Poland'
    },
    {
      id: 2,
      name: 'engineer',
      job: false,
      birthday: '09.10.1985',
      residence: 'USA'
    }
  ]



return [isListening, handleStartListening, handleStopListening, transcript]

}
