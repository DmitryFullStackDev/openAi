import 'regenerator-runtime/runtime'
import Head from "next/head";
import {useEffect, useState, useRef} from "react";
import styles from "./index.module.css";
import {useRecognition} from "../hooks/useRecognition";

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isListening, handleStartListening, handleStopListening, transcript] = useRecognition()

  const abortController = useRef()

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true)
    handleStopListening()

    try {
      abortController.current = new AbortController()
      const signal = abortController.current.signal

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: input }),
        signal,
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const splitResult = data.result.message.content

      setResult(splitResult);
      setIsLoading(false)
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="animal"
            placeholder="Enter a question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className={styles.listeningBox}>
            <button type='button' className={styles.listeningStart} onClick={(e) => {
              if (abortController.current) {
                e.preventDefault()
                abortController.current.abort()
              }
              handleStartListening()
              setInput('')
            }}>start</button>
            {isListening && <button type='button' className={styles.listeningStop} onClick={() => {
              setInput('')
              handleStopListening()
            }}
            >stop</button>}
          </div>

          <input disabled={isLoading} type="submit" value={isLoading ? 'Loading...' :"Ask"} />
        </form>

        <div style={{whiteSpace: 'pre-wrap'}} className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
