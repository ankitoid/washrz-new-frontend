import React, { useRef, useState } from "react";

const Recorder = ({ onRecordingComplete }) => {
  const audioChunk = useRef([]);
  const [streamRecording, setStreamRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null); // State to store the audio URL
  const mediaRecorderRef = useRef(null);
  const stopTimeoutRef = useRef(null); // Ref to store the timeout ID

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunk.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunk.current, { type: "audio/wav" });
        const newAudioUrl = URL.createObjectURL(audioBlob); // Create a URL for the recorded audio
        setAudioUrl(newAudioUrl); // Set the audio URL to be displayed in the UI

        // Send the audio Blob to the parent component
        onRecordingComplete(audioBlob);

        // Clear the chunks for the next recording
        audioChunk.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setStreamRecording(true);

      // Automatically stop recording after 20 seconds
      stopTimeoutRef.current = setTimeout(() => {
        stopRec();
      }, 20000); // 20 seconds
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  };

  const stopRec = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setStreamRecording(false);

      // Clear the timeout if it exists (in case the user manually stops before 20 seconds)
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
    }
  };

  return (
    <div className="mt-5">
      {!streamRecording ? (
        <button className="btn btn-success" onClick={startRec}>
          Start Recording
        </button>
      ) : (
        <button className="btn btn-danger" onClick={stopRec}>
          Stop Recording
        </button>
      )}

      {/* Display the recorded audio with a playback option */}
      {audioUrl && (
        <div>
          <h3>Recorded Audio:</h3>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default Recorder;
