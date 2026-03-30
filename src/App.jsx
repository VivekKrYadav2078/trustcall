

import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

// ── Config ────────────────────────────────────────────────────────────────────
const WS_URL        = "wss://unseconded-mirna-demiurgically.ngrok-free.dev/ws";
const API_URL       = "https://unseconded-mirna-demiurgically.ngrok-free.dev";
const CHUNK_MS      = 4000;

// ── Emotion config ────────────────────────────────────────────────────────────
// const EMOTIONS = {
//   fear:      { emoji: "😨", color: "#9c27b0", label: "Fear" },
//   anger:     { emoji: "😡", color: "#f74f4f", label: "Anger" },
//   disgust:   { emoji: "🤢", color: "#795548", label: "Disgust" },
//   sadness:   { emoji: "😢", color: "#4f9cf7", label: "Sadness" },
//   joy:       { emoji: "😊", color: "#22d98e", label: "Joy" },
//   surprise:  { emoji: "😲", color: "#f7a94f", label: "Surprise" },
//   neutral:   { emoji: "😐", color: "#607d8b", label: "Neutral" },
//   uncertain: { emoji: "❓", color: "#455a64", label: "Uncertain" },
// };
// const getEmotion = (label) => EMOTIONS[label?.toLowerCase()] || EMOTIONS.neutral;

// ── Helpers ───────────────────────────────────────────────────────────────────
function getSupportedMimeType() {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4", ""];
  return types.find(t => t === "" || MediaRecorder.isTypeSupported(t)) ?? "";
}

function riskClass(pct) {
  if (pct > 60) return "high";
  if (pct > 30) return "mid";
  return "low";
}

// ── Small Components ──────────────────────────────────────────────────────────

// function EmotionBadge({ emotion, score }) {
//   if (!emotion || emotion === "uncertain") return null;
//   const { emoji, color, label } = getEmotion(emotion);
//   return (
//     <span
//       className="emotion-badge"
//       style={{ backgroundColor: `${color}18`, borderColor: `${color}44`, color }}
//     >
//       {emoji}
//       {label}
//       {score != null && <span className="emotion-badge__score">{score}%</span>}
//     </span>
//   );
// }

function ConfBar({ scamPct = 0, safePct = 100 }) {
  return (
    <div className="conf-bar">
      <div className="conf-bar__labels">
        <span className="conf-bar__safe">✓ SAFE {safePct}%</span>
        <span className="conf-bar__scam">⚠ SCAM {scamPct}%</span>
      </div>
      <div className="conf-bar__track">
        <div className="conf-bar__safe-fill" style={{ width: `${safePct}%` }} />
        <div className="conf-bar__scam-fill" style={{ width: `${scamPct}%` }} />
      </div>
    </div>
  );
}

function Shield({ safe, scam, idle }) {
  const start  = scam ? "#f74f4f" : safe ? "#22d98e" : "#4f6ef7";
  const stop   = scam ? "#5c0000" : safe ? "#0a5c3a" : "#1a237e";
  return (
    <svg width="100" height="116" viewBox="0 0 120 140" fill="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={start} />
          <stop offset="100%" stopColor={stop} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d="M60 8 L108 28 L108 72 Q108 108 60 132 Q12 108 12 72 L12 28 Z"
        fill="url(#sg)" filter="url(#glow)"
        style={{ transition: "all .6s ease" }}
      />
      <path
        d="M60 18 L100 35 L100 72 Q100 103 60 124 Q20 103 20 72 L20 35 Z"
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"
      />
      {scam && <text x="60" y="80" textAnchor="middle" fontSize="38" fill="white" filter="url(#glow)">⚠</text>}
      {safe && <text x="60" y="82" textAnchor="middle" fontSize="40" fill="white" filter="url(#glow)">✓</text>}
      {idle && <text x="60" y="82" textAnchor="middle" fontSize="34" fill="rgba(255,255,255,0.6)">🛡</text>}
    </svg>
  );
}

function PulseRings({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="pulse-ring"
          style={{ width: `${110 + i * 44}px`, height: `${110 + i * 44}px`, animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </div>
  );
}

// ── Chunk Card ────────────────────────────────────────────────────────────────
function ChunkCard({ item, index }) {
  const isScam    = item.prediction === "SCAM";
  const cardClass = `chunk-card chunk-card--${isScam ? "scam" : "safe"}`;
  const rc        = riskClass(item.scam_pct ?? 0);

  return (
    <div className={cardClass}>
      <div className="chunk-card__meta">
        <span className={`chunk-card__prediction chunk-card__prediction--${isScam ? "scam" : "safe"}`}>
          {isScam ? "⚠ SCAM" : "✓ SAFE"}
        </span>
        <span className="chunk-card__index">#{index + 1}</span>
      </div>

      {/* Chunk text */}
      <p className="chunk-card__text">"{item.chunk}"</p>

      {/* Context (if present) */}
      {item.context && item.context !== item.chunk && (
        <p className="chunk-card__context">
          <span className="chunk-card__context-label">CTX</span>
          {item.context.slice(0, 120)}{item.context.length > 120 ? "…" : ""}
        </p>
      )}

      {/* Confidence */}
      {item.confidence != null && (
        <div className="chunk-card__confidence">
          <span className="chunk-card__conf-label">Confidence</span>
          <span className={`chunk-card__conf-val risk-bar__value--${rc}`}>
            {Math.round(item.confidence)}%
          </span>
        </div>
      )}

      <ConfBar scamPct={item.scam_pct ?? 0} safePct={item.safe_pct ?? 100} />
      <EmotionBadge emotion={item.emotion} score={item.emotion_score} />
    </div>
  );
}

// ── Scam Report ───────────────────────────────────────────────────────────────
function ScamReport({ transcript }) {
  const scamCount   = transcript.filter(t => t.prediction === "SCAM").length;
  const avgScamPct  = transcript.length
    ? Math.round(transcript.reduce((a, b) => a + (b.scam_pct ?? 0), 0) / transcript.length)
    : 0;

  const emotionCounts = {};
  transcript.forEach(t => {
    if (t.emotion && t.emotion !== "uncertain")
      emotionCounts[t.emotion] = (emotionCounts[t.emotion] || 0) + 1;
  });
  const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="scam-report">
      <div className="scam-report__hero">
        <div className="scam-report__icon">🚨</div>
        <h2 className="scam-report__title">SCAM DETECTED</h2>
        <p className="scam-report__sub">Recording stopped automatically</p>
      </div>

      {/* <div className="scam-report__risk-box">
        <p className="scam-report__risk-label">Overall Scam Risk</p>
        <p className="scam-report__risk-pct">{avgScamPct}%</p>
        {dominant && (
          <div className="scam-report__emotion-row">
            Dominant emotion: <EmotionBadge emotion={dominant} />
          </div>
        )}
      </div> */}

      <div className="scam-report__stats">
        <div className="stat-box">
          <p className="stat-box__label">Total Chunks</p>
          <p className="stat-box__value">{transcript.length}</p>
        </div>
        <div className="stat-box stat-box--danger">
          <p className="stat-box__label">Scam Chunks</p>
          <p className="stat-box__value stat-box__value--danger">{scamCount}</p>
        </div>
      </div>

      <p className="scam-report__breakdown-title">Chunk-by-chunk breakdown</p>
      {transcript.map((item, i) => {
        const s = item.prediction === "SCAM";
        return (
          <div key={i} className={`breakdown-row breakdown-row--${s ? "scam" : "safe"}`}>
            <span className="breakdown-row__idx">#{i + 1}</span>
            <div style={{ flex: 1 }}>
              <p className="breakdown-row__text">
                "{item.chunk?.slice(0, 52)}{(item.chunk?.length ?? 0) > 52 ? "…" : ""}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div className="breakdown-row__mini-bar">
                  <div
                    className={`breakdown-row__mini-fill breakdown-row__mini-fill--${s ? "scam" : "safe"}`}
                    style={{ width: `${s ? (item.scam_pct ?? 0) : (item.safe_pct ?? 100)}%` }}
                  />
                </div>
                {item.emotion && item.emotion !== "uncertain" && (
                  <span style={{ fontSize: 13 }}>{getEmotion(item.emotion).emoji}</span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className={`breakdown-row__pct breakdown-row__pct--${s ? "scam" : "safe"}`}>
                {s ? item.scam_pct : item.safe_pct}%
              </p>
              <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: s ? "var(--red)" : "var(--green)" }}>
                {item.prediction}
              </p>
            </div>
          </div>
        );
      })}

      <p className="scam-report__cta">
        <strong>Hang up immediately.</strong><br />
        Do not share any personal or financial information.
      </p>
    </div>
  );
}

// ── Result Card (upload modes) ────────────────────────────────────────────────
function ResultCard({ result }) {
  if (!result) return null;
  const isScam = result.prediction === "SCAM";
  return (
    <div className={`result-card result-card--${isScam ? "scam" : "safe"}`}>
      <div className="result-card__hero">
        <div className="result-card__icon">{isScam ? "🚨" : "✅"}</div>
        <h2 className={`result-card__title result-card__title--${isScam ? "scam" : "safe"}`}>
          {isScam ? "SCAM DETECTED" : "LOOKS SAFE"}
        </h2>
      </div>

      <ConfBar scamPct={result.scam_pct ?? 0} safePct={result.safe_pct ?? 100} />

      <div style={{ textAlign: "center" }}>
        <EmotionBadge emotion={result.emotion} score={result.emotion_score} />
      </div>

      {result.chunk && (
        <div className="result-card__transcript">
          <p className="result-card__transcript-label">Transcription</p>
          <p className="result-card__transcript-text">"{result.chunk}"</p>
        </div>
      )}

      {isScam && (
        <p className="result-card__cta">
          <strong style={{ color: "var(--text)" }}>Do not engage.</strong> This content shows signs of a scam.
        </p>
      )}
    </div>
  );
}

// ── Live Risk Bar ─────────────────────────────────────────────────────────────
function LiveRiskBar({ scamPct }) {
  const rc = riskClass(scamPct);
  return (
    <div className="risk-bar">
      <div className="risk-bar__header">
        <span className="risk-bar__label">Live Risk</span>
        <span className={`risk-bar__value risk-bar__value--${rc}`}>{scamPct}% scam</span>
      </div>
      <div className="risk-bar__track">
        <div className={`risk-bar__fill risk-bar__fill--${rc}`} style={{ width: `${scamPct}%` }} />
      </div>
    </div>
  );
}

// ── Mode Tab ──────────────────────────────────────────────────────────────────
function Tab({ id, label, emoji, active, onClick }) {
  return (
    <button className={`tab${active ? " tab--active" : ""}`} onClick={() => onClick(id)}>
      <span className="tab__icon">{emoji}</span>
      {label}
    </button>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function TrustCall() {
  const [mode, setMode]               = useState("call");   // call | audio | text
  const [phase, setPhase]             = useState("idle");   // idle | listening | done | scam
  const [transcript, setTranscript]   = useState([]);
  const [statusText, setStatusText]   = useState("Ready to protect your call");
  const [wsStatus, setWsStatus]       = useState("disconnected");
  const [latestScamPct, setLatestScamPct] = useState(0);

  // Upload state
  const [uploadResult,  setUploadResult]  = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError,   setUploadError]   = useState("");
  const [textInput,     setTextInput]     = useState("");
  const [dragOver,      setDragOver]      = useState(false);

  const wsRef           = useRef(null);
  const mediaRecRef     = useRef(null);
  const streamRef       = useRef(null);
  const chunksRef       = useRef([]);
  const recordingRef    = useRef(false);
  const transcriptEnd   = useRef(null);
  const fileInputRef    = useRef(null);

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // ── Mode switch ────────────────────────────────────────────────────────────
  const switchMode = (m) => {
    if (recordingRef.current) stopRecording("manual");
    setMode(m);
    setPhase("idle");
    setTranscript([]);
    setUploadResult(null);
    setUploadError("");
    setTextInput("");
    setLatestScamPct(0);
    setStatusText("Ready to protect your call");
  };

  // ── Live call: stop ────────────────────────────────────────────────────────
  const stopRecording = useCallback((reason = "manual") => {
    recordingRef.current = false;
    if (mediaRecRef.current?.state === "recording") mediaRecRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    wsRef.current?.close();
    setPhase(reason === "scam" ? "scam" : "done");
    setStatusText(reason === "scam" ? "⚠ SCAM DETECTED — Recording stopped" : "Recording stopped");
  }, []);

  // ── Live call: WebSocket ───────────────────────────────────────────────────
  const connectWS = useCallback(() => new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    ws.onopen  = () => { setWsStatus("connected"); resolve(ws); };
    ws.onerror = () => { setWsStatus("error"); reject(new Error("WebSocket failed")); };
    ws.onclose = () => setWsStatus("disconnected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // Expected fields: chunk, context, prediction, confidence, scam_pct, safe_pct
      setLatestScamPct(data.scam_pct ?? 0);
      setTranscript(prev => [...prev, data]);
      if (data.prediction === "SCAM") stopRecording("scam");
    };
    wsRef.current = ws;
  }), [stopRecording]);

  // ── Live call: chunked recording loop ─────────────────────────────────────
  const sendChunk = useCallback((blob) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    const reader = new FileReader();
    reader.onloadend = () => wsRef.current.send(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  }, []);

  const startChunkLoop = useCallback((stream) => {
    const mime = getSupportedMimeType();
    const loop = () => {
      if (!recordingRef.current) return;
      let mr;
      try { mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
      catch { try { mr = new MediaRecorder(stream); } catch { setStatusText("❌ Recording not supported"); return; } }
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        if (chunksRef.current.length) sendChunk(new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" }));
        loop();
      };
      try { mr.start(); } catch { return; }
      mediaRecRef.current = mr;
      setTimeout(() => { if (mr.state === "recording") mr.stop(); }, CHUNK_MS);
    };
    loop();
  }, [sendChunk]);

  const startListening = useCallback(async () => {
    setTranscript([]); setLatestScamPct(0);
    setPhase("listening"); setStatusText("Requesting microphone access…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      setStatusText("Connecting to server…");
      await connectWS();
      setStatusText("Listening… analysing your call");
      recordingRef.current = true;
      startChunkLoop(stream);
    } catch (err) {
      setPhase("idle");
      if (err.name === "NotAllowedError") setStatusText("❌ Mic denied — allow in browser settings");
      else if (err.name === "NotFoundError") setStatusText("❌ No microphone found");
      else setStatusText("❌ " + err.message);
    }
  }, [connectWS, startChunkLoop]);

  const resetCall = () => {
    setPhase("idle"); setTranscript([]);
    setLatestScamPct(0); setStatusText("Ready to protect your call");
  };

  // ── Audio upload ───────────────────────────────────────────────────────────
  // const analyzeAudio = async (file) => {
  //   setUploadLoading(true); setUploadResult(null); setUploadError("");
  //   try {
  //     const fd = new FormData();
  //     fd.append("file", file);
  //     const res = await fetch(`${API_URL}/analyze-audio`, { method: "POST", body: fd });
  //     if (!res.ok) throw new Error("Server error: " + res.status);
  //     setUploadResult(await res.json());
  //   } catch (err) {
  //     setUploadError("❌ " + err.message);
  //   } finally {
  //     setUploadLoading(false);
  //   }
  // };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("audio/")) analyzeAudio(file);
    else setUploadError("Please drop an audio file (mp3, wav, webm, etc.)");
  };

  // ── Text analyze ───────────────────────────────────────────────────────────
  const analyzeText = async () => {
    if (!textInput.trim()) return;
    setUploadLoading(true); setUploadResult(null); setUploadError("");
    try {
      const res = await fetch(`${API_URL}/analyze-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      if (!res.ok) throw new Error("Server error: " + res.status);
      const data = await res.json();
      setUploadResult({ ...data, chunk: textInput });
    } catch (err) {
      setUploadError("❌ " + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // ── Derived booleans ───────────────────────────────────────────────────────
  const isIdle      = phase === "idle";
  const isListening = phase === "listening";
  const isDone      = phase === "done";
  const isScam      = phase === "scam";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`app${isScam ? " app--scam" : ""}`}>
      {/* Background */}
      <div className="app__bg-grid" />
      <div className={`app__bg-glow app__bg-glow--${isScam ? "scam" : "idle"}`} />

      <div className="app__inner">

        {/* Header */}
        <header className="header">
          <div className="header__status">
            <div className={`header__dot header__dot--${wsStatus === "connected" ? "connected" : wsStatus === "error" ? "error" : "idle"}`} />
            <span className="header__status-label">
              {wsStatus === "connected" ? "live" : wsStatus === "error" ? "offline" : "standby"}
            </span>
          </div>
          <h1 className="header__title">
            Intent<span>IQ</span>
          </h1>
          <p className="header__sub">AI-powered scam detection · Whisper  </p>
        </header>

        {/* Mode Tabs */}
        <div className="tabs">
          <Tab id="call"  label="Live Call"    emoji="📞" active={mode === "call"}  onClick={switchMode} />
          {/* <Tab id="audio" label="Audio Upload" emoji="🎵" active={mode === "audio"} onClick={switchMode} /> */}
          <Tab id="text"  label="Text Analyse" emoji="📝" active={mode === "text"}  onClick={switchMode} />
        </div>

        {/* ── LIVE CALL ── */}
        {mode === "call" && (
          <>
            {(isIdle || isListening) && (
              <div className="hint">
                <span className="hint__icon">📢</span>
                <div>
                  <p className="hint__title">Put your call on speaker</p>
                  <p className="hint__body">Hold phone near speaker so TrustCall can hear both sides.</p>
                </div>
              </div>
            )}

            {/* Shield */}
            <div className="shield-wrap">
              <div className="shield-ring-wrap">
                <PulseRings active={isListening} />
                <Shield
                  safe={isDone && transcript.length > 0 && transcript[transcript.length - 1]?.prediction !== "SCAM"}
                  scam={isScam}
                  idle={isIdle || isListening}
                />
              </div>
            </div>

            {/* Live risk bar */}
            {isListening && transcript.length > 0 && (
              <LiveRiskBar scamPct={latestScamPct} />
            )}

            {/* Status */}
            <p className={`status-text${isScam ? " status-text--scam" : ""}`}>{statusText}</p>

            {/* Scam report */}
            {isScam && <ScamReport transcript={transcript} />}

            {/* Action buttons */}
            <div className="btn-row">
              {isIdle      && <button className="btn btn--primary" onClick={startListening}>Start Listening</button>}
              {isListening && <button className="btn btn--stop"    onClick={() => stopRecording("manual")}>Stop Recording</button>}
              {(isScam || isDone) && <button className="btn btn--reset" onClick={resetCall}>New Session</button>}
            </div>

            {/* Live transcript */}
            {(isListening || isDone) && transcript.length > 0 && (
              <div className="transcript">
                <div className="transcript__header">
                  <span className="transcript__title">Live Transcript</span>
                  <div className="transcript__divider" />
                  <span className="transcript__count">{transcript.length} chunks</span>
                </div>
                <div className="transcript__list">
                  {transcript.map((item, i) => <ChunkCard key={i} item={item} index={i} />)}
                  <div ref={transcriptEnd} />
                </div>
              </div>
            )}
          </>
        )}

        {/* ── AUDIO UPLOAD ── */}
        {/* {mode === "audio" && (
          <div>
            <p className="upload-hint">Upload a recorded call or audio file to analyse</p>

            <div
              className={`dropzone${dragOver ? " dropzone--over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone__icon">🎵</div>
              <p className="dropzone__title">Drop audio file here</p>
              <p className="dropzone__hint">mp3 · wav · webm · ogg · m4a — or click to browse</p>
            </div>

            <input
              ref={fileInputRef} type="file" accept="audio/*" style={{ display: "none" }}
              onChange={(e) => { if (e.target.files[0]) analyzeAudio(e.target.files[0]); }}
            />

            {uploadLoading && <p className="loading-text"><span className="spinner" />Transcribing + analysing…</p>}
            {uploadError  && <p className="error-text">{uploadError}</p>}
            {uploadResult && <ResultCard result={uploadResult} />}
          </div>
        )} */}

        {/* ── TEXT ANALYSE ── */}
        {mode === "text" && (
          <div>
            <p className="upload-hint">Paste a call transcript or suspicious message to analyse</p>

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste call transcript or suspicious text here…"
            />

            <div className="btn-row">
              <button
                className="btn btn--primary"
                onClick={analyzeText}
                disabled={!textInput.trim() || uploadLoading}
              >
                {uploadLoading ? <><span className="spinner" />Analysing…</> : "Analyse Text"}
              </button>
            </div>

            {uploadError  && <p className="error-text">{uploadError}</p>}
            {uploadResult && <ResultCard result={uploadResult} />}
          </div>
        )}

        {/* Footer */}
        <p className="footer">Powered by Whisper · DistilBERT </p>
      </div>
    </div>
  );
}