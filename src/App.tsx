import { useEffect,  useRef } from 'react';
import * as tf from '@tensorflow/tfjs'
import * as cocossd from "@tensorflow-models/coco-ssd"
import Webcam from 'react-webcam';
import {drawRect} from "./utility"

import './App.css'

tf.setBackend('webgl');


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    const net = await cocossd.load();

    setInterval(() => {
    detect(net)
    }, 10)
    
  }

  const detect = async (net : any) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      (webcamRef.current as any).video.readyState === 4
    ) {
      // Get Video Properties
      const video = (webcamRef.current as any).video;
      const videoWidth = (webcamRef.current as any).video.videoWidth;
      const videoHeight = (webcamRef.current as any).video.videoHeight;

      // Set video width
      (webcamRef.current as any).video.width = videoWidth;
     (webcamRef.current as any).video.height = videoHeight;

      // Set canvas height and width
      if (canvasRef.current !== null) {
        (canvasRef.current as any).width = videoWidth;
        (canvasRef.current as any).height = videoHeight;
      } 

      const obj = await net.detect(video);

      // Draw mesh
      const ctx = (canvasRef.current as any).getContext("2d");

      drawRect(obj, ctx)
    }
  }
 
  useEffect(() => { runCoco() }, []);

  return (
    <main>
      <div>
        <div >
          <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            width: 540,
            height: 380,
          }}
          />
          <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            width: 540,
            height: 380,
          }}
        />
        </div>
      </div>

    </main>
  )
}

export default App
