import { useState, useRef, useEffect, useCallback } from "react";

const WS_URL = "wss://unseconded-mirna-demiurgically.ngrok-free.dev/ws";

const CHUNK_DURATION_MS = 4000;

function Shield({ safe, scam, idle }) {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={scam ? "#ff3b3b" : safe ? "#00e676" : "#3d5afe"} />
          <stop offset="100%" stopColor={scam ? "#8b0000" : safe ? "#00695c" : "#1a237e"} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M60 8 L108 28 L108 72 Q108 108 60 132 Q12 108 12 72 L12 28 Z"
        fill="url(#shieldGrad)"
        filter="url(#glow)"
        style={{ transition: "all 0.6s ease" }}
      />
      <path
        d="M60 18 L100 35 L100 72 Q100 103 60 124 Q20 103 20 72 L20 35 Z"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
      />
      {scam && (
        <text x="60" y="80" textAnchor="middle" fontSize="38" fill="white" filter="url(#glow)">⚠</text>
      )}
      {safe && (
        <text x="60" y="82" textAnchor="middle" fontSize="40" fill="white" filter="url(#glow)">✓</text>
      )}
      {idle && (
        <text x="60" y="82" textAnchor="middle" fontSize="36" fill="rgba(255,255,255,0.7)">🛡</text>
      )}
    </svg>
  );
}

function PulseRing({ active, scam }) {
  if (!active) return null;
  const color = scam ? "#ff3b3b" : "#3d5afe";
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute",
          width: `${140 + i * 50}px`,
          height: `${140 + i * 50}px`,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          opacity: 0,
          animation: `pulse 2s ease-out ${i * 0.5}s infinite`,
        }} />
      ))}
    </div>
  );
}

function WaveBar({ active, scam }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", height: "40px" }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          width: "4px",
          borderRadius: "2px",
          background: scam ? "#ff3b3b" : "#3d5afe",
          height: active ? `${Math.random() * 100}%` : "20%",
          animation: active ? `wave 0.8s ease-in-out ${i * 0.07}s infinite alternate` : "none",
          transition: "background 0.5s ease",
          minHeight: "4px",
        }} />
      ))}
    </div>
  );
}

function TranscriptLine({ item, index }) {
  const isScam = item.prediction === "SCAM";
  return (
    <div style={{
      padding: "12px 16px",
      borderRadius: "10px",
      marginBottom: "8px",
      background: isScam ? "rgba(255,59,59,0.12)" : "rgba(61,90,254,0.08)",
      borderLeft: `3px solid ${isScam ? "#ff3b3b" : "#3d5afe"}`,
      animation: `slideIn 0.3s ease`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: isScam ? "#ff3b3b" : "#3d5afe",
          fontFamily: "'Courier New', monospace",
        }}>
          {isScam ? "⚠ SCAM DETECTED" : "✓ SAFE"}
        </span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
          chunk #{index + 1}
        </span>
      </div>
      <p style={{
        margin: 0,
        fontSize: "13px",
        color: "rgba(255,255,255,0.75)",
        lineHeight: "1.5",
        fontFamily: "'Georgia', serif",
        fontStyle: "italic",
      }}>
        "{item.chunk}"
      </p>
    </div>
  );
}

export default function TrustCall() {
  const [phase, setPhase] = useState("idle"); // idle | listening | scam | done
  const [transcript, setTranscript] = useState([]);
  const [statusText, setStatusText] = useState("Ready to protect your call");
  const [wsStatus, setWsStatus] = useState("disconnected");
  const [latestPrediction, setLatestPrediction] = useState(null);

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const isRecordingRef = useRef(false);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  const connectWS = useCallback(() => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL);
      ws.onopen = () => { setWsStatus("connected"); resolve(ws); };
      ws.onerror = () => { setWsStatus("error"); reject(new Error("WS connection failed")); };
      ws.onclose = () => setWsStatus("disconnected");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLatestPrediction(data.prediction);
        setTranscript(prev => [...prev, data]);
        if (data.prediction === "SCAM") {
          stopRecording("scam");
        }
      };
      wsRef.current = ws;
    });
  }, []);

  const sendChunk = useCallback((blob) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      wsRef.current.send(base64);
    };
    reader.readAsDataURL(blob);
  }, []);

  const startChunkLoop = useCallback((stream) => {
    const scheduleNextChunk = () => {
      if (!isRecordingRef.current) return;
      // With this — auto picks best supported format:
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4"

      const mr = new MediaRecorder(stream, { mimeType })
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        sendChunk(blob);
        scheduleNextChunk();
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setTimeout(() => {
        if (mr.state === "recording") mr.stop();
      }, CHUNK_DURATION_MS);
    };
    scheduleNextChunk();
  }, [sendChunk]);

  const stopRecording = useCallback((reason = "manual") => {
    isRecordingRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (wsRef.current) wsRef.current.close();
    if (reason === "scam") {
      setPhase("scam");
      setStatusText("⚠ SCAM DETECTED — Recording stopped");
    } else {
      setPhase("done");
      setStatusText("Recording stopped");
    }
  }, []);

  const startListening = useCallback(async () => {
    setTranscript([]);
    setLatestPrediction(null);
    setPhase("listening");
    setStatusText("Listening… analyzing your call");
    try {
      const ws = await connectWS();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      isRecordingRef.current = true;
      startChunkLoop(stream);
    } catch (err) {
      setPhase("idle");
      setStatusText("Mic access denied or server unreachable");
    }
  }, [connectWS, startChunkLoop]);

  const reset = () => {
    setPhase("idle");
    setTranscript([]);
    setLatestPrediction(null);
    setStatusText("Ready to protect your call");
  };

  const isScam = phase === "scam";
  const isListening = phase === "listening";
  const isDone = phase === "done";
  const isIdle = phase === "idle";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&family=Lora:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #05060f;
          color: white;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes wave {
          from { height: 15%; }
          to { height: 90%; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scamFlash {
          0%, 100% { background: #05060f; }
          50% { background: rgba(139,0,0,0.15); }
        }

        .btn-start {
          background: linear-gradient(135deg, #3d5afe, #1a237e);
          border: none;
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 16px 48px;
          border-radius: 50px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 30px rgba(61,90,254,0.4);
        }
        .btn-start:hover { transform: translateY(-2px); box-shadow: 0 0 45px rgba(61,90,254,0.6); }
        .btn-start:active { transform: scale(0.97); }

        .btn-stop {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.6);
          font-family: 'Syne Mono', monospace;
          font-size: 13px;
          letter-spacing: 1px;
          padding: 10px 28px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-stop:hover { border-color: rgba(255,255,255,0.5); color: white; }

        .btn-reset {
          background: linear-gradient(135deg, rgba(61,90,254,0.2), rgba(26,35,126,0.2));
          border: 1.5px solid rgba(61,90,254,0.4);
          color: #3d5afe;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 12px 36px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-reset:hover { background: linear-gradient(135deg, rgba(61,90,254,0.35), rgba(26,35,126,0.35)); }

        .scam-alert-box {
          background: rgba(139,0,0,0.2);
          border: 1.5px solid #ff3b3b;
          border-radius: 16px;
          padding: 24px 32px;
          animation: shake 0.5s ease, fadeUp 0.4s ease;
          box-shadow: 0 0 40px rgba(255,59,59,0.25);
        }

        .speaker-tip {
          background: rgba(61,90,254,0.1);
          border: 1px solid rgba(61,90,254,0.25);
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: fadeUp 0.5s ease 0.3s both;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        animation: isScam ? "scamFlash 1s ease 3" : "none",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(61,90,254,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(61,90,254,0.04) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        {/* Glow blob */}
        <div style={{
          position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: isScam
            ? "radial-gradient(ellipse, rgba(139,0,0,0.15) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(61,90,254,0.12) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
          transition: "background 1s ease",
        }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "480px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px", animation: "fadeUp 0.6s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: wsStatus === "connected" ? "#00e676" : wsStatus === "error" ? "#ff3b3b" : "rgba(255,255,255,0.2)",
                boxShadow: wsStatus === "connected" ? "0 0 8px #00e676" : "none",
                transition: "all 0.4s",
              }} />
              <span style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: "11px",
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
              }}>
                {wsStatus === "connected" ? "live" : wsStatus === "error" ? "offline" : "standby"}
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 8vw, 52px)",
              letterSpacing: "-2px",
              color: "white",
              lineHeight: 1,
            }}>
              Trust<span style={{
                color: "transparent",
                WebkitTextStroke: "1.5px #3d5afe",
              }}>Call</span>
            </h1>
            <p style={{
              marginTop: "10px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.5px",
              fontFamily: "'Syne Mono', monospace",
            }}>
              Real-time scam detection for your calls
            </p>
          </div>

          {/* Speaker tip banner */}
          {(isIdle || isListening) && (
            <div className="speaker-tip" style={{ marginBottom: "36px" }}>
              <span style={{ fontSize: "22px" }}>📢</span>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                <strong style={{ color: "rgba(255,255,255,0.9)", display: "block", marginBottom: "2px" }}>
                  Put your call on speaker
                </strong>
                Hold your phone near your speaker so TrustCall can hear the conversation.
              </p>
            </div>
          )}

          {/* Shield + pulse */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <div style={{ position: "relative", width: "200px", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PulseRing active={isListening} scam={false} />
              <Shield safe={isDone && latestPrediction !== "SCAM"} scam={isScam} idle={isIdle || isListening} />
            </div>
          </div>

          {/* Status */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <p style={{
              fontFamily: isScam ? "'Syne', sans-serif" : "'Lora', serif",
              fontStyle: isScam ? "normal" : "italic",
              fontWeight: isScam ? 700 : 400,
              fontSize: isScam ? "17px" : "15px",
              color: isScam ? "#ff3b3b" : "rgba(255,255,255,0.55)",
              letterSpacing: isScam ? "0.5px" : "0",
              transition: "all 0.4s ease",
            }}>
              {statusText}
            </p>

            {/* Wave bars while listening */}
            {isListening && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
                <WaveBar active={true} scam={false} />
              </div>
            )}
          </div>

          {/* SCAM Alert Box */}
          {isScam && (
            <div className="scam-alert-box" style={{ marginBottom: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚨</div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "22px",
                color: "#ff3b3b",
                letterSpacing: "-0.5px",
                marginBottom: "8px",
              }}>
                SCAM ALERT
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                This call shows signs of a scam. We've stopped recording.<br />
                <strong style={{ color: "rgba(255,255,255,0.85)" }}>Hang up immediately.</strong>
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", marginBottom: "36px" }}>
            {isIdle && (
              <button className="btn-start" onClick={startListening}>
                Start Listening
              </button>
            )}
            {isListening && (
              <button className="btn-stop" onClick={() => stopRecording("manual")}>
                Stop Recording
              </button>
            )}
            {(isScam || isDone) && (
              <button className="btn-reset" onClick={reset}>
                New Session
              </button>
            )}
          </div>

          {/* Transcript */}
          {transcript.length > 0 && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}>
                <span style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}>
                  Live Transcript
                </span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                <span style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.2)",
                }}>
                  {transcript.length} chunk{transcript.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{
                maxHeight: "320px",
                overflowY: "auto",
                paddingRight: "4px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(61,90,254,0.3) transparent",
              }}>
                {transcript.map((item, i) => (
                  <TranscriptLine key={i} item={item} index={i} />
                ))}
                <div ref={transcriptEndRef} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <p style={{
              fontFamily: "'Syne Mono', monospace",
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: "rgba(255,255,255,0.15)",
              textTransform: "uppercase",
            }}>
              Powered by Whisper + DistilBERT · Audio processed locally
            </p>
          </div>

        </div>
      </div>
    </>
  );
}