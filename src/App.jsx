// import { useState, useRef, useEffect, useCallback } from "react";

// const WS_URL = "wss://unseconded-mirna-demiurgically.ngrok-free.dev/ws";
// const API_URL = "https://unseconded-mirna-demiurgically.ngrok-free.dev";
// const CHUNK_DURATION_MS = 4000;

// function getSupportedMimeType() {
//   const types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4", ""];
//   for (const type of types) {
//     if (type === "" || MediaRecorder.isTypeSupported(type)) return type;
//   }
//   return "";
// }

// // ── Emotion config ───────────────────────────────────────
// const EMOTION_CONFIG = {
//   fear:     { emoji: "😨", color: "#9c27b0", label: "Fear" },
//   anger:    { emoji: "😡", color: "#f44336", label: "Anger" },
//   disgust:  { emoji: "🤢", color: "#795548", label: "Disgust" },
//   sadness:  { emoji: "😢", color: "#2196f3", label: "Sadness" },
//   joy:      { emoji: "😊", color: "#00e676", label: "Joy" },
//   surprise: { emoji: "😲", color: "#ff9800", label: "Surprise" },
//   neutral:  { emoji: "😐", color: "#607d8b", label: "Neutral" },
//   uncertain:{ emoji: "❓", color: "#455a64", label: "Uncertain" },
// };

// function emotionInfo(label) {
//   return EMOTION_CONFIG[label?.toLowerCase()] || EMOTION_CONFIG.neutral;
// }

// // ── Shield ───────────────────────────────────────────────
// function Shield({ safe, scam, idle }) {
//   return (
//     <svg width="100" height="116" viewBox="0 0 120 140" fill="none">
//       <defs>
//         <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={scam ? "#ff3b3b" : safe ? "#00e676" : "#3d5afe"} />
//           <stop offset="100%" stopColor={scam ? "#8b0000" : safe ? "#00695c" : "#1a237e"} />
//         </linearGradient>
//         <filter id="glow">
//           <feGaussianBlur stdDeviation="4" result="coloredBlur" />
//           <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
//         </filter>
//       </defs>
//       <path d="M60 8 L108 28 L108 72 Q108 108 60 132 Q12 108 12 72 L12 28 Z"
//         fill="url(#sg)" filter="url(#glow)" style={{ transition: "all 0.6s ease" }} />
//       <path d="M60 18 L100 35 L100 72 Q100 103 60 124 Q20 103 20 72 L20 35 Z"
//         fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
//       {scam && <text x="60" y="80" textAnchor="middle" fontSize="38" fill="white" filter="url(#glow)">⚠</text>}
//       {safe && <text x="60" y="82" textAnchor="middle" fontSize="40" fill="white" filter="url(#glow)">✓</text>}
//       {idle && <text x="60" y="82" textAnchor="middle" fontSize="36" fill="rgba(255,255,255,0.7)">🛡</text>}
//     </svg>
//   );
// }

// function PulseRing({ active }) {
//   if (!active) return null;
//   return (
//     <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
//       {[1, 2, 3].map(i => (
//         <div key={i} style={{
//           position: "absolute",
//           width: `${120 + i * 45}px`, height: `${120 + i * 45}px`,
//           borderRadius: "50%", border: `2px solid #3d5afe`,
//           opacity: 0, animation: `pulse 2s ease-out ${i * 0.5}s infinite`,
//         }} />
//       ))}
//     </div>
//   );
// }

// // ── Confidence Bar ───────────────────────────────────────
// function ConfidenceBar({ scamPct, safePct }) {
//   return (
//     <div style={{ width: "100%", marginBottom: "6px" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
//         <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#00e676" }}>✓ SAFE {safePct}%</span>
//         <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#ff3b3b" }}>⚠ SCAM {scamPct}%</span>
//       </div>
//       <div style={{ height: "7px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", overflow: "hidden", display: "flex" }}>
//         <div style={{ width: `${safePct}%`, background: "linear-gradient(90deg,#00695c,#00e676)", transition: "width 0.6s ease", borderRadius: "4px 0 0 4px" }} />
//         <div style={{ width: `${scamPct}%`, background: "linear-gradient(90deg,#ff6b35,#ff3b3b)", transition: "width 0.6s ease", borderRadius: "0 4px 4px 0" }} />
//       </div>
//     </div>
//   );
// }

// // ── Emotion Badge ────────────────────────────────────────
// function EmotionBadge({ emotion, emotionScore }) {
//   if (!emotion || emotion === "uncertain") return null;
//   const info = emotionInfo(emotion);
//   return (
//     <div style={{
//       display: "inline-flex", alignItems: "center", gap: "5px",
//       background: `${info.color}22`, border: `1px solid ${info.color}55`,
//       borderRadius: "20px", padding: "3px 10px", marginTop: "6px",
//     }}>
//       <span style={{ fontSize: "13px" }}>{info.emoji}</span>
//       <span style={{ fontFamily: "monospace", fontSize: "11px", color: info.color, fontWeight: 700 }}>
//         {info.label}
//       </span>
//       {emotionScore && (
//         <span style={{ fontFamily: "monospace", fontSize: "10px", color: `${info.color}99` }}>
//           {emotionScore}%
//         </span>
//       )}
//     </div>
//   );
// }

// // ── Transcript Line ──────────────────────────────────────
// function TranscriptLine({ item, index }) {
//   const isScam = item.prediction === "SCAM";
//   return (
//     <div style={{
//       padding: "14px 16px", borderRadius: "10px", marginBottom: "10px",
//       background: isScam ? "rgba(255,59,59,0.1)" : "rgba(61,90,254,0.07)",
//       borderLeft: `3px solid ${isScam ? "#ff3b3b" : "#3d5afe"}`,
//       animation: "slideIn 0.3s ease",
//     }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
//         <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", color: isScam ? "#ff3b3b" : "#00e676", fontFamily: "monospace" }}>
//           {isScam ? "⚠ SCAM" : "✓ SAFE"}
//         </span>
//         <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>#{index + 1}</span>
//       </div>
//       <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.5", fontFamily: "'Georgia',serif", fontStyle: "italic" }}>
//         "{item.chunk}"
//       </p>
//       <ConfidenceBar scamPct={item.scam_pct ?? 0} safePct={item.safe_pct ?? 100} />
//       <EmotionBadge emotion={item.emotion} emotionScore={item.emotion_score} />
//     </div>
//   );
// }

// // ── Scam Report ──────────────────────────────────────────
// function ScamReport({ transcript, onReset }) {
//   const scamChunks = transcript.filter(t => t.prediction === "SCAM");
//   const avgScamPct = transcript.length > 0
//     ? Math.round(transcript.reduce((a, b) => a + (b.scam_pct ?? 0), 0) / transcript.length) : 0;

//   // Emotion summary
//   const emotionCounts = {};
//   transcript.forEach(t => {
//     if (t.emotion && t.emotion !== "uncertain") emotionCounts[t.emotion] = (emotionCounts[t.emotion] || 0) + 1;
//   });
//   const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

//   return (
//     <div style={{ background:"rgba(139,0,0,0.15)", border:"1.5px solid #ff3b3b", borderRadius:"16px", padding:"24px", marginBottom:"24px", animation:"shake 0.5s ease, fadeUp 0.4s ease", boxShadow:"0 0 40px rgba(255,59,59,0.2)" }}>
//       <div style={{ textAlign:"center", marginBottom:"20px" }}>
//         <div style={{ fontSize:"36px", marginBottom:"8px" }}>🚨</div>
//         <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"24px", color:"#ff3b3b", marginBottom:"4px" }}>SCAM DETECTED</h2>
//         <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>Recording stopped automatically</p>
//       </div>

//       <div style={{ background:"rgba(255,59,59,0.1)", borderRadius:"10px", padding:"16px", marginBottom:"16px", textAlign:"center" }}>
//         <p style={{ fontFamily:"monospace", fontSize:"11px", color:"rgba(255,255,255,0.35)", marginBottom:"6px", letterSpacing:"1px" }}>OVERALL SCAM RISK</p>
//         <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"48px", color:"#ff3b3b", lineHeight:1 }}>{avgScamPct}%</p>
//         {dominantEmotion && (
//           <div style={{ marginTop:"8px" }}>
//             <span style={{ fontFamily:"monospace", fontSize:"11px", color:"rgba(255,255,255,0.3)" }}>Dominant emotion: </span>
//             <EmotionBadge emotion={dominantEmotion} />
//           </div>
//         )}
//       </div>

//       <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
//         <div style={{ flex:1, background:"rgba(255,255,255,0.05)", borderRadius:"10px", padding:"12px", textAlign:"center" }}>
//           <p style={{ fontFamily:"monospace", fontSize:"10px", color:"rgba(255,255,255,0.3)", marginBottom:"4px" }}>TOTAL CHUNKS</p>
//           <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"28px", color:"white" }}>{transcript.length}</p>
//         </div>
//         <div style={{ flex:1, background:"rgba(255,59,59,0.1)", borderRadius:"10px", padding:"12px", textAlign:"center" }}>
//           <p style={{ fontFamily:"monospace", fontSize:"10px", color:"rgba(255,255,255,0.3)", marginBottom:"4px" }}>SCAM CHUNKS</p>
//           <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"28px", color:"#ff3b3b" }}>{scamChunks.length}</p>
//         </div>
//       </div>

//       <p style={{ fontFamily:"monospace", fontSize:"11px", letterSpacing:"1.5px", color:"rgba(255,255,255,0.3)", marginBottom:"12px", textTransform:"uppercase" }}>Chunk-by-chunk breakdown</p>
//       {transcript.map((item, i) => (
//         <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"8px", marginBottom:"6px", background: item.prediction==="SCAM"?"rgba(255,59,59,0.1)":"rgba(0,230,118,0.05)" }}>
//           <span style={{ fontFamily:"monospace", fontSize:"11px", color:"rgba(255,255,255,0.3)", minWidth:"50px" }}>#{i+1}</span>
//           <div style={{ flex:1 }}>
//             <p style={{ fontFamily:"'Georgia',serif", fontStyle:"italic", fontSize:"12px", color:"rgba(255,255,255,0.55)", marginBottom:"4px" }}>
//               "{item.chunk?.slice(0,55)}{item.chunk?.length > 55 ? "…" : ""}"
//             </p>
//             <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
//               <div style={{ flex:1, height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
//                 <div style={{ width:`${item.scam_pct??0}%`, height:"100%", background: item.prediction==="SCAM"?"#ff3b3b":"#00e676", transition:"width 0.6s ease" }} />
//               </div>
//               {item.emotion && item.emotion !== "uncertain" && (
//                 <span style={{ fontSize:"14px" }}>{emotionInfo(item.emotion).emoji}</span>
//               )}
//             </div>
//           </div>
//           <div style={{ textAlign:"right", minWidth:"60px" }}>
//             <p style={{ fontFamily:"monospace", fontSize:"13px", fontWeight:700, color: item.prediction==="SCAM"?"#ff3b3b":"#00e676" }}>
//               {item.prediction==="SCAM"?item.scam_pct:item.safe_pct}%
//             </p>
//             <p style={{ fontFamily:"monospace", fontSize:"10px", color: item.prediction==="SCAM"?"#ff3b3b":"#00e676" }}>{item.prediction}</p>
//           </div>
//         </div>
//       ))}

//       <p style={{ textAlign:"center", marginTop:"20px", fontSize:"14px", color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>
//         <strong style={{ color:"white" }}>Hang up immediately.</strong><br />
//         Do not share any personal or financial information.
//       </p>
//     </div>
//   );
// }

// // ── Result Card (for upload modes) ──────────────────────
// function ResultCard({ result }) {
//   if (!result) return null;
//   const isScam = result.prediction === "SCAM";
//   return (
//     <div style={{
//       padding:"24px", borderRadius:"16px", marginBottom:"20px",
//       background: isScam?"rgba(255,59,59,0.1)":"rgba(0,230,118,0.07)",
//       border: `1.5px solid ${isScam?"#ff3b3b":"#00e676"}`,
//       animation:"fadeUp 0.4s ease",
//     }}>
//       <div style={{ textAlign:"center", marginBottom:"16px" }}>
//         <div style={{ fontSize:"40px", marginBottom:"8px" }}>{isScam?"🚨":"✅"}</div>
//         <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"26px", color: isScam?"#ff3b3b":"#00e676" }}>
//           {isScam ? "SCAM DETECTED" : "LOOKS SAFE"}
//         </h2>
//       </div>

//       <ConfidenceBar scamPct={result.scam_pct ?? 0} safePct={result.safe_pct ?? 100} />

//       <div style={{ textAlign:"center", marginTop:"12px" }}>
//         <EmotionBadge emotion={result.emotion} emotionScore={result.emotion_score} />
//       </div>

//       {result.chunk && (
//         <div style={{ marginTop:"16px", padding:"12px", background:"rgba(255,255,255,0.04)", borderRadius:"8px" }}>
//           <p style={{ fontFamily:"monospace", fontSize:"10px", color:"rgba(255,255,255,0.3)", marginBottom:"6px", letterSpacing:"1px" }}>TRANSCRIPTION</p>
//           <p style={{ fontFamily:"'Georgia',serif", fontStyle:"italic", fontSize:"13px", color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>"{result.chunk}"</p>
//         </div>
//       )}

//       {isScam && (
//         <p style={{ textAlign:"center", marginTop:"16px", fontSize:"13px", color:"rgba(255,255,255,0.6)" }}>
//           <strong style={{ color:"white" }}>Do not engage.</strong> This content shows signs of a scam.
//         </p>
//       )}
//     </div>
//   );
// }

// // ── Mode Tab ─────────────────────────────────────────────
// function ModeTab({ id, label, emoji, active, onClick }) {
//   return (
//     <button onClick={() => onClick(id)} style={{
//       flex:1, padding:"10px 6px", border:"none", borderRadius:"10px", cursor:"pointer",
//       fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"12px", letterSpacing:"0.5px",
//       transition:"all 0.2s",
//       background: active?"rgba(61,90,254,0.25)":"transparent",
//       color: active?"white":"rgba(255,255,255,0.35)",
//       borderBottom: active?"2px solid #3d5afe":"2px solid transparent",
//     }}>
//       <div style={{ fontSize:"18px", marginBottom:"3px" }}>{emoji}</div>
//       {label}
//     </button>
//   );
// }

// // ── MAIN APP ─────────────────────────────────────────────
// export default function TrustCall() {
//   const [mode, setMode] = useState("call"); // call | audio | text
//   const [phase, setPhase] = useState("idle");
//   const [transcript, setTranscript] = useState([]);
//   const [statusText, setStatusText] = useState("Ready to protect your call");
//   const [wsStatus, setWsStatus] = useState("disconnected");
//   const [latestPrediction, setLatestPrediction] = useState(null);
//   const [latestScamPct, setLatestScamPct] = useState(0);

//   // Upload mode state
//   const [uploadResult, setUploadResult] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const [textInput, setTextInput] = useState("");
//   const [dragOver, setDragOver] = useState(false);

//   const wsRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null);
//   const chunksRef = useRef([]);
//   const isRecordingRef = useRef(false);
//   const transcriptEndRef = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (transcriptEndRef.current) transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [transcript]);

//   // Switch mode → reset everything
//   const switchMode = (m) => {
//     setMode(m);
//     setPhase("idle");
//     setTranscript([]);
//     setUploadResult(null);
//     setUploadError("");
//     setTextInput("");
//     setLatestScamPct(0);
//     setStatusText("Ready to protect your call");
//     if (isRecordingRef.current) stopRecording("manual");
//   };

//   // ── LIVE CALL LOGIC ────────────────────────────────────
//   const stopRecording = useCallback((reason = "manual") => {
//     isRecordingRef.current = false;
//     if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
//     if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
//     if (wsRef.current) wsRef.current.close();
//     if (reason === "scam") { setPhase("scam"); setStatusText("⚠ SCAM DETECTED — Recording stopped"); }
//     else { setPhase("done"); setStatusText("Recording stopped"); }
//   }, []);

//   const connectWS = useCallback(() => {
//     return new Promise((resolve, reject) => {
//       const ws = new WebSocket(WS_URL);
//       ws.onopen = () => { setWsStatus("connected"); resolve(ws); };
//       ws.onerror = () => { setWsStatus("error"); reject(new Error("WS failed")); };
//       ws.onclose = () => setWsStatus("disconnected");
//       ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         setLatestPrediction(data.prediction);
//         setLatestScamPct(data.scam_pct ?? 0);
//         setTranscript(prev => [...prev, data]);
//         if (data.prediction === "SCAM") stopRecording("scam");
//       };
//       wsRef.current = ws;
//     });
//   }, [stopRecording]);

//   const sendChunk = useCallback((blob) => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
//     const reader = new FileReader();
//     reader.onloadend = () => wsRef.current.send(reader.result.split(",")[1]);
//     reader.readAsDataURL(blob);
//   }, []);

//   const startChunkLoop = useCallback((stream) => {
//     const mimeType = getSupportedMimeType();
//     const scheduleNextChunk = () => {
//       if (!isRecordingRef.current) return;
//       let mr;
//       try { mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream); }
//       catch (e) { try { mr = new MediaRecorder(stream); } catch (e2) { setStatusText("❌ Recording not supported"); return; } }
//       chunksRef.current = [];
//       mr.ondataavailable = (e) => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
//       mr.onstop = () => {
//         if (chunksRef.current.length > 0) sendChunk(new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" }));
//         scheduleNextChunk();
//       };
//       try { mr.start(); } catch (e) { return; }
//       mediaRecorderRef.current = mr;
//       setTimeout(() => { if (mr.state === "recording") mr.stop(); }, CHUNK_DURATION_MS);
//     };
//     scheduleNextChunk();
//   }, [sendChunk]);

//   const startListening = useCallback(async () => {
//     setTranscript([]); setLatestPrediction(null); setLatestScamPct(0);
//     setPhase("listening"); setStatusText("Requesting microphone access…");
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//       streamRef.current = stream;
//       setStatusText("Connecting to server…");
//       await connectWS();
//       setStatusText("Listening… analyzing your call");
//       isRecordingRef.current = true;
//       startChunkLoop(stream);
//     } catch (err) {
//       setPhase("idle");
//       if (err.name === "NotAllowedError") setStatusText("❌ Mic denied — allow in browser settings");
//       else if (err.name === "NotFoundError") setStatusText("❌ No microphone found");
//       else setStatusText("❌ " + err.message);
//     }
//   }, [connectWS, startChunkLoop]);

//   const resetCall = () => {
//     setPhase("idle"); setTranscript([]); setLatestPrediction(null);
//     setLatestScamPct(0); setStatusText("Ready to protect your call");
//   };

//   // ── AUDIO UPLOAD LOGIC ─────────────────────────────────
//   const analyzeAudioFile = async (file) => {
//     setUploadLoading(true); setUploadResult(null); setUploadError("");
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await fetch(`${API_URL}/analyze-audio`, { method: "POST", body: formData });
//       if (!res.ok) throw new Error("Server error: " + res.status);
//       const data = await res.json();
//       setUploadResult(data);
//     } catch (err) {
//       setUploadError("❌ " + err.message);
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handleAudioDrop = (e) => {
//     e.preventDefault(); setDragOver(false);
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith("audio/")) analyzeAudioFile(file);
//     else setUploadError("Please drop an audio file (mp3, wav, webm, etc.)");
//   };

//   // ── TEXT ANALYZE LOGIC ─────────────────────────────────
//   const analyzeText = async () => {
//     if (!textInput.trim()) return;
//     setUploadLoading(true); setUploadResult(null); setUploadError("");
//     try {
//       const res = await fetch(`${API_URL}/analyze-text`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: textInput }),
//       });
//       if (!res.ok) throw new Error("Server error: " + res.status);
//       const data = await res.json();
//       setUploadResult({ ...data, chunk: textInput });
//     } catch (err) {
//       setUploadError("❌ " + err.message);
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const isScam = phase === "scam";
//   const isListening = phase === "listening";
//   const isDone = phase === "done";
//   const isIdle = phase === "idle";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&family=Lora:ital@0;1&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         body { background: #05060f; color: white; font-family: 'Syne', sans-serif; min-height: 100vh; }
//         @keyframes pulse { 0% { transform:scale(0.95); opacity:0.6; } 100% { transform:scale(1.8); opacity:0; } }
//         @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes scamFlash { 0%,100%{background:#05060f} 50%{background:rgba(139,0,0,0.15)} }
//         @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
//         @keyframes spin { to { transform:rotate(360deg); } }
//         .btn-primary { background:linear-gradient(135deg,#3d5afe,#1a237e); border:none; color:white; font-family:'Syne',sans-serif; font-weight:700; font-size:15px; letter-spacing:2px; text-transform:uppercase; padding:14px 40px; border-radius:50px; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 0 30px rgba(61,90,254,0.4); width:100%; }
//         .btn-primary:hover { transform:translateY(-2px); box-shadow:0 0 45px rgba(61,90,254,0.6); }
//         .btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
//         .btn-stop { background:transparent; border:1.5px solid rgba(255,255,255,0.25); color:rgba(255,255,255,0.6); font-family:'Syne Mono',monospace; font-size:13px; letter-spacing:1px; padding:10px 28px; border-radius:50px; cursor:pointer; transition:all 0.2s; width:100%; }
//         .btn-stop:hover { border-color:rgba(255,255,255,0.5); color:white; }
//         .btn-reset { background:linear-gradient(135deg,rgba(61,90,254,0.2),rgba(26,35,126,0.2)); border:1.5px solid rgba(61,90,254,0.4); color:#3d5afe; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; letter-spacing:1.5px; text-transform:uppercase; padding:12px 36px; border-radius:50px; cursor:pointer; transition:all 0.2s; width:100%; }
//         .btn-reset:hover { background:rgba(61,90,254,0.25); }
//         textarea { width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:white; font-family:'Lora',serif; font-size:14px; padding:14px; resize:vertical; outline:none; min-height:120px; transition:border 0.2s; }
//         textarea:focus { border-color:rgba(61,90,254,0.5); }
//         textarea::placeholder { color:rgba(255,255,255,0.2); }
//         .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.2); border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; display:inline-block; margin-right:8px; vertical-align:middle; }
//       `}</style>

//       <div style={{
//         minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center",
//         padding:"32px 20px", animation: isScam?"scamFlash 1s ease 3":"none",
//         position:"relative", overflow:"hidden",
//       }}>
//         {/* Background */}
//         <div style={{ position:"fixed", inset:0, zIndex:0, backgroundImage:`linear-gradient(rgba(61,90,254,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(61,90,254,0.04) 1px,transparent 1px)`, backgroundSize:"40px 40px", pointerEvents:"none" }} />
//         <div style={{ position:"fixed", top:"-20%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"400px", pointerEvents:"none", zIndex:0, transition:"background 1s ease", background: isScam?"radial-gradient(ellipse,rgba(139,0,0,0.15) 0%,transparent 70%)":"radial-gradient(ellipse,rgba(61,90,254,0.12) 0%,transparent 70%)" }} />

//         <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"480px" }}>

//           {/* Header */}
//           <div style={{ textAlign:"center", marginBottom:"24px", animation:"fadeUp 0.6s ease" }}>
//             <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", marginBottom:"8px" }}>
//               <div style={{ width:"8px", height:"8px", borderRadius:"50%", transition:"all 0.4s", background: wsStatus==="connected"?"#00e676":wsStatus==="error"?"#ff3b3b":"rgba(255,255,255,0.2)", boxShadow: wsStatus==="connected"?"0 0 8px #00e676":"none" }} />
//               <span style={{ fontFamily:"'Syne Mono',monospace", fontSize:"11px", letterSpacing:"2px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
//                 {wsStatus==="connected"?"live":wsStatus==="error"?"offline":"standby"}
//               </span>
//             </div>
//             <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(32px,8vw,48px)", letterSpacing:"-2px", color:"white", lineHeight:1 }}>
//               Trust<span style={{ color:"transparent", WebkitTextStroke:"1.5px #3d5afe" }}>Call</span>
//             </h1>
//             <p style={{ marginTop:"8px", fontSize:"12px", color:"rgba(255,255,255,0.3)", letterSpacing:"0.5px", fontFamily:"'Syne Mono',monospace" }}>
//               AI-powered scam detection · Whisper + DistilBERT + Emotion AI
//             </p>
//           </div>

//           {/* Mode Tabs */}
//           <div style={{ display:"flex", gap:"6px", background:"rgba(255,255,255,0.04)", borderRadius:"14px", padding:"6px", marginBottom:"24px", animation:"fadeUp 0.5s ease 0.1s both" }}>
//             <ModeTab id="call"  label="Live Call"     emoji="📞" active={mode==="call"}  onClick={switchMode} />
//             <ModeTab id="audio" label="Audio Upload"  emoji="🎵" active={mode==="audio"} onClick={switchMode} />
//             <ModeTab id="text"  label="Text Analyze"  emoji="📝" active={mode==="text"}  onClick={switchMode} />
//           </div>

//           {/* ── LIVE CALL MODE ── */}
//           {mode === "call" && (
//             <>
//               {(isIdle || isListening) && (
//                 <div style={{ background:"rgba(61,90,254,0.1)", border:"1px solid rgba(61,90,254,0.25)", borderRadius:"12px", padding:"12px 20px", display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px", animation:"fadeUp 0.5s ease 0.2s both" }}>
//                   <span style={{ fontSize:"20px" }}>📢</span>
//                   <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", lineHeight:1.4 }}>
//                     <strong style={{ color:"rgba(255,255,255,0.9)", display:"block", marginBottom:"2px" }}>Put your call on speaker</strong>
//                     Hold phone near speaker so TrustCall can hear both sides.
//                   </p>
//                 </div>
//               )}

//               <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}>
//                 <div style={{ position:"relative", width:"160px", height:"160px", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                   <PulseRing active={isListening} />
//                   <Shield safe={isDone && latestPrediction !== "SCAM"} scam={isScam} idle={isIdle || isListening} />
//                 </div>
//               </div>

//               {isListening && transcript.length > 0 && (
//                 <div style={{ marginBottom:"16px", animation:"fadeUp 0.3s ease" }}>
//                   <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
//                     <span style={{ fontFamily:"monospace", fontSize:"11px", color:"rgba(255,255,255,0.3)", letterSpacing:"1px" }}>LIVE RISK</span>
//                     <span style={{ fontFamily:"monospace", fontSize:"12px", fontWeight:700, color: latestScamPct>60?"#ff3b3b":latestScamPct>30?"#ff9800":"#00e676" }}>
//                       {latestScamPct}% scam
//                     </span>
//                   </div>
//                   <div style={{ height:"8px", borderRadius:"4px", background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
//                     <div style={{ height:"100%", borderRadius:"4px", width:`${latestScamPct}%`, background: latestScamPct>60?"linear-gradient(90deg,#ff6b35,#ff3b3b)":latestScamPct>30?"linear-gradient(90deg,#ff9800,#ffb74d)":"linear-gradient(90deg,#00695c,#00e676)", transition:"width 0.8s ease,background 0.5s ease" }} />
//                   </div>
//                 </div>
//               )}

//               <div style={{ textAlign:"center", marginBottom:"20px" }}>
//                 <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"14px", color: isScam?"#ff3b3b":"rgba(255,255,255,0.45)", transition:"all 0.4s ease" }}>
//                   {statusText}
//                 </p>
//               </div>

//               {isScam && <ScamReport transcript={transcript} />}

//               <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
//                 {isIdle && <button className="btn-primary" onClick={startListening}>Start Listening</button>}
//                 {isListening && <button className="btn-stop" onClick={() => stopRecording("manual")}>Stop Recording</button>}
//                 {(isScam || isDone) && <button className="btn-reset" onClick={resetCall}>New Session</button>}
//               </div>

//               {(isListening || isDone) && transcript.length > 0 && (
//                 <div style={{ animation:"fadeUp 0.4s ease" }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
//                     <span style={{ fontFamily:"'Syne Mono',monospace", fontSize:"11px", letterSpacing:"2px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>Live Transcript</span>
//                     <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.08)" }} />
//                     <span style={{ fontFamily:"'Syne Mono',monospace", fontSize:"11px", color:"rgba(255,255,255,0.2)" }}>{transcript.length} chunks</span>
//                   </div>
//                   <div style={{ maxHeight:"360px", overflowY:"auto", paddingRight:"4px", scrollbarWidth:"thin", scrollbarColor:"rgba(61,90,254,0.3) transparent" }}>
//                     {transcript.map((item, i) => <TranscriptLine key={i} item={item} index={i} />)}
//                     <div ref={transcriptEndRef} />
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {/* ── AUDIO UPLOAD MODE ── */}
//           {mode === "audio" && (
//             <div style={{ animation:"fadeUp 0.4s ease" }}>
//               <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"14px", color:"rgba(255,255,255,0.4)", textAlign:"center", marginBottom:"20px" }}>
//                 Upload a recorded call or audio file to analyze
//               </p>

//               {/* Drop zone */}
//               <div
//                 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={handleAudioDrop}
//                 onClick={() => fileInputRef.current?.click()}
//                 style={{
//                   border: `2px dashed ${dragOver?"#3d5afe":"rgba(255,255,255,0.12)"}`,
//                   borderRadius:"16px", padding:"40px 20px", textAlign:"center",
//                   cursor:"pointer", transition:"all 0.2s", marginBottom:"16px",
//                   background: dragOver?"rgba(61,90,254,0.08)":"rgba(255,255,255,0.02)",
//                 }}
//               >
//                 <div style={{ fontSize:"36px", marginBottom:"10px" }}>🎵</div>
//                 <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"14px", color:"rgba(255,255,255,0.7)", marginBottom:"6px" }}>
//                   Drop audio file here
//                 </p>
//                 <p style={{ fontFamily:"monospace", fontSize:"11px", color:"rgba(255,255,255,0.25)" }}>
//                   mp3 · wav · webm · ogg · m4a · or click to browse
//                 </p>
//               </div>
//               <input
//                 ref={fileInputRef} type="file"
//                 accept="audio/*" style={{ display:"none" }}
//                 onChange={(e) => { if (e.target.files[0]) analyzeAudioFile(e.target.files[0]); }}
//               />

//               {uploadLoading && (
//                 <div style={{ textAlign:"center", padding:"20px", color:"rgba(255,255,255,0.5)", fontFamily:"monospace", fontSize:"13px" }}>
//                   <span className="spinner" />
//                   Transcribing + analyzing…
//                 </div>
//               )}
//               {uploadError && (
//                 <p style={{ color:"#ff3b3b", fontFamily:"monospace", fontSize:"13px", textAlign:"center", marginBottom:"16px" }}>{uploadError}</p>
//               )}
//               {uploadResult && <ResultCard result={uploadResult} />}
//             </div>
//           )}

//           {/* ── TEXT ANALYZE MODE ── */}
//           {mode === "text" && (
//             <div style={{ animation:"fadeUp 0.4s ease" }}>
//               <p style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"14px", color:"rgba(255,255,255,0.4)", textAlign:"center", marginBottom:"20px" }}>
//                 Paste a call transcript or suspicious message to analyze
//               </p>

//               <textarea
//                 value={textInput}
//                 onChange={(e) => setTextInput(e.target.value)}
//                 placeholder="Paste call transcript or suspicious text here…"
//                 style={{ marginBottom:"12px" }}
//               />

//               <button
//                 className="btn-primary"
//                 onClick={analyzeText}
//                 disabled={!textInput.trim() || uploadLoading}
//                 style={{ marginBottom:"16px" }}
//               >
//                 {uploadLoading ? <><span className="spinner" />Analyzing…</> : "Analyze Text"}
//               </button>

//               {uploadError && (
//                 <p style={{ color:"#ff3b3b", fontFamily:"monospace", fontSize:"13px", textAlign:"center", marginBottom:"16px" }}>{uploadError}</p>
//               )}
//               {uploadResult && <ResultCard result={uploadResult} />}
//             </div>
//           )}

//           {/* Footer */}
//           <div style={{ textAlign:"center", marginTop:"40px" }}>
//             <p style={{ fontFamily:"'Syne Mono',monospace", fontSize:"10px", letterSpacing:"1.5px", color:"rgba(255,255,255,0.1)", textTransform:"uppercase" }}>
//               Powered by Whisper · DistilBERT · Emotion AI
//             </p>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }


//-------

import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

// ── Config ────────────────────────────────────────────────────────────────────
const WS_URL   = "wss://unseconded-mirna-demiurgically.ngrok-free.dev/ws";
const API_URL  = "https://unseconded-mirna-demiurgically.ngrok-free.dev";
const CHUNK_MS = 4000;

// ── Emotion config ────────────────────────────────────────────────────────────
const EMOTIONS = {
  fear:      { emoji: "😨", color: "#9c27b0", label: "Fear" },
  anger:     { emoji: "😡", color: "#f74f4f", label: "Anger" },
  disgust:   { emoji: "🤢", color: "#795548", label: "Disgust" },
  sadness:   { emoji: "😢", color: "#4f9cf7", label: "Sadness" },
  joy:       { emoji: "😊", color: "#22d98e", label: "Joy" },
  surprise:  { emoji: "😲", color: "#f7a94f", label: "Surprise" },
  neutral:   { emoji: "😐", color: "#607d8b", label: "Neutral" },
  uncertain: { emoji: "❓", color: "#455a64", label: "Uncertain" },
};
const getEmotion = (label) => EMOTIONS[label?.toLowerCase()] || EMOTIONS.neutral;

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

function EmotionBadge({ emotion, score }) {
  if (!emotion || emotion === "uncertain") return null;
  const { emoji, color, label } = getEmotion(emotion);
  return (
    <span
      className="emotion-badge"
      style={{ backgroundColor: `${color}18`, borderColor: `${color}44`, color }}
    >
      {emoji} {label}
      {score != null && <span className="emotion-badge__score">{score}%</span>}
    </span>
  );
}

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
  const start = scam ? "#f74f4f" : safe ? "#22d98e" : "#4f6ef7";
  const stop  = scam ? "#5c0000" : safe ? "#0a5c3a" : "#1a237e";
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

      <p className="chunk-card__text">"{item.chunk}"</p>

      {item.context && item.context !== item.chunk && (
        <p className="chunk-card__context">
          <span className="chunk-card__context-label">CTX </span>
          {item.context.slice(0, 120)}{item.context.length > 120 ? "…" : ""}
        </p>
      )}

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
  const scamCount  = transcript.filter(t => t.prediction === "SCAM").length;
  const avgScamPct = transcript.length
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

      <div className="scam-report__risk-box">
        <p className="scam-report__risk-label">Overall Scam Risk</p>
        <p className="scam-report__risk-pct">{avgScamPct}%</p>
        {dominant && (
          <div className="scam-report__emotion-row">
            Dominant emotion: <EmotionBadge emotion={dominant} />
          </div>
        )}
      </div>

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

// ── Result Card ───────────────────────────────────────────────────────────────
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

// ── Tab ───────────────────────────────────────────────────────────────────────
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
  const [mode, setMode]               = useState("call");
  const [phase, setPhase]             = useState("idle");
  const [transcript, setTranscript]   = useState([]);
  const [statusText, setStatusText]   = useState("Ready to protect your call");
  const [wsStatus, setWsStatus]       = useState("disconnected");
  const [latestScamPct, setLatestScamPct] = useState(0);

  const [uploadResult,  setUploadResult]  = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError,   setUploadError]   = useState("");
  const [textInput,     setTextInput]     = useState("");

  const wsRef         = useRef(null);
  const mediaRecRef   = useRef(null);
  const streamRef     = useRef(null);
  const chunksRef     = useRef([]);
  const recordingRef  = useRef(false);
  const transcriptEnd = useRef(null);

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

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

  const stopRecording = useCallback((reason = "manual") => {
    recordingRef.current = false;
    if (mediaRecRef.current?.state === "recording") mediaRecRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    wsRef.current?.close();
    setPhase(reason === "scam" ? "scam" : "done");
    setStatusText(reason === "scam" ? "⚠ SCAM DETECTED — Recording stopped" : "Recording stopped");
  }, []);

  const connectWS = useCallback(() => new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    ws.onopen  = () => { setWsStatus("connected"); resolve(ws); };
    ws.onerror = () => { setWsStatus("error"); reject(new Error("WebSocket failed")); };
    ws.onclose = () => setWsStatus("disconnected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // fields: chunk, context, prediction, confidence, scam_pct, safe_pct
      setLatestScamPct(data.scam_pct ?? 0);
      setTranscript(prev => [...prev, data]);
      if (data.prediction === "SCAM") stopRecording("scam");
    };
    wsRef.current = ws;
  }), [stopRecording]);

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

  const isIdle      = phase === "idle";
  const isListening = phase === "listening";
  const isDone      = phase === "done";
  const isScam      = phase === "scam";

  return (
    <div className={`app${isScam ? " app--scam" : ""}`}>
      <div className="app__bg-grid" />
      <div className={`app__bg-glow app__bg-glow--${isScam ? "scam" : "idle"}`} />

      <div className="app__inner">

        <header className="header">
          <div className="header__status">
            <div className={`header__dot header__dot--${wsStatus === "connected" ? "connected" : wsStatus === "error" ? "error" : "idle"}`} />
            <span className="header__status-label">
              {wsStatus === "connected" ? "live" : wsStatus === "error" ? "offline" : "standby"}
            </span>
          </div>
          <h1 className="header__title">Trust<span>CALL</span></h1>
          <p className="header__sub">AI-powered scam detection · Whisper + DistilBERT + Emotion AI</p>
        </header>

        <div className="tabs">
          <Tab id="call" label="Live Call"    emoji="📞" active={mode === "call"} onClick={switchMode} />
          <Tab id="text" label="Text Analyse" emoji="📝" active={mode === "text"} onClick={switchMode} />
        </div>

        {/* ── LIVE CALL ── */}
        {mode === "call" && (
          <>
            {(isIdle || isListening) && (
              <div className="hint">
                <span className="hint__icon">📢</span>
                <div>
                  <p className="hint__title">Put your call on speaker</p>
                  <p className="hint__body">Hold phone near speaker so IntentIQ can hear both sides.</p>
                </div>
              </div>
            )}

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

            {isListening && transcript.length > 0 && <LiveRiskBar scamPct={latestScamPct} />}

            <p className={`status-text${isScam ? " status-text--scam" : ""}`}>{statusText}</p>

            {isScam && <ScamReport transcript={transcript} />}

            <div className="btn-row">
              {isIdle      && <button className="btn btn--primary" onClick={startListening}>Start Listening</button>}
              {isListening && <button className="btn btn--stop"    onClick={() => stopRecording("manual")}>Stop Recording</button>}
              {(isScam || isDone) && <button className="btn btn--reset" onClick={resetCall}>New Session</button>}
            </div>

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

        <p className="footer">Powered by Whisper · DistilBERT · Emotion AI</p>
      </div>
    </div>
  );
}