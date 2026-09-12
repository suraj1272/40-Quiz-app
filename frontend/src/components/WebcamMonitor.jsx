import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, AlertCircle, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

export default function WebcamMonitor({ compact = false, onStatusChange }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const onStatusChangeRef = useRef(onStatusChange);

  // Keep ref up to date without causing re-renders
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  const [state, setState] = useState('detecting'); // 'detecting' | 'active' | 'error'
  const [isSimulated, setIsSimulated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function stopAll() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function startRealCamera() {
    stopAll();
    setIsSimulated(false);
    setState('detecting');
    setErrorMsg('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Camera API not supported. Please use Chrome or Edge browser.';
      setState('error');
      setErrorMsg(msg);
      onStatusChangeRef.current?.({ active: false, error: msg });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;

      const vid = videoRef.current;
      if (vid) {
        vid.srcObject = stream;
        // Do NOT wait for onloadedmetadata — just play directly
        try { await vid.play(); } catch (_) {}
      }

      // If camera disconnects mid-exam
      const track = stream.getVideoTracks()[0];
      if (track) {
        track.addEventListener('ended', () => {
          setState('error');
          setErrorMsg('Camera disconnected. Please reconnect and click Retry.');
          onStatusChangeRef.current?.({ active: false, error: 'Camera disconnected.' });
        });
      }

      setState('active');
      onStatusChangeRef.current?.({ active: true, error: null });
    } catch (err) {
      let msg = 'Camera access was denied or failed.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Click the camera/lock icon in your browser address bar and allow access, then click Retry.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera hardware found. Please connect a webcam and click Retry, or use Demo Camera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is in use by another app (e.g. Zoom, Teams). Close it and click Retry.';
      }
      setState('error');
      setErrorMsg(msg);
      onStatusChangeRef.current?.({ active: false, error: msg });
    }
  }

  function startDemoCamera() {
    stopAll();
    setIsSimulated(true);
    setState('detecting');

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    let tick = 0;
    function draw() {
      tick += 0.04;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 320, 240);

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < 320; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 240); ctx.stroke(); }
      for (let y = 0; y < 240; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(320, y); ctx.stroke(); }

      // Silhouette body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.ellipse(160, 215, 90, 70, 0, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(160, 93, 45, 0, Math.PI * 2); ctx.fill();

      // Face feature dots
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.arc(145, 90, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(175, 90, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(160, 108, 10, 0, Math.PI); ctx.fill();

      // Tracking box with pulse
      const p = Math.sin(tick) * 4;
      ctx.strokeStyle = `rgba(16,185,129,${0.7 + Math.sin(tick) * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(105 - p, 42 - p, 110 + p * 2, 110 + p * 2);

      // Corner ticks
      const corners = [[105-p, 42-p], [215+p, 42-p], [105-p, 152+p], [215+p, 152+p]];
      ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2;
      corners.forEach(([cx, cy], i) => {
        const dx = i % 2 === 0 ? 10 : -10;
        const dy = i < 2 ? 10 : -10;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + dy); ctx.stroke();
      });

      // Status text
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('FACE TRACKED', 110, 38);
      ctx.fillStyle = '#64748b';
      ctx.font = '8px monospace';
      ctx.fillText(`PROCTOR ACTIVE  ${new Date().toLocaleTimeString()}`, 60, 230);

      animFrameRef.current = requestAnimationFrame(draw);
    }
    draw();

    // Pipe canvas to video element
    try {
      const stream = canvas.captureStream(30);
      streamRef.current = stream;
      const vid = videoRef.current;
      if (vid) {
        vid.srcObject = stream;
        vid.play().catch(() => {});
      }
      setState('active');
      onStatusChangeRef.current?.({ active: true, error: null });
    } catch (e) {
      console.warn('captureStream error:', e);
      setState('error');
      setErrorMsg('Demo camera failed. Please try the real webcam.');
      onStatusChangeRef.current?.({ active: false, error: 'Demo camera failed.' });
    }
  }

  // Start camera on mount
  useEffect(() => {
    startRealCamera();
    return () => { stopAll(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = state === 'active';
  const isDetecting = state === 'detecting';

  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col ${compact ? 'w-full' : 'w-full'}`}>
      {/* Hidden canvas for demo mode */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Status bar */}
      <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-400 animate-pulse' : isDetecting ? 'bg-yellow-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-[10px] font-semibold text-slate-200 uppercase tracking-wider">
            {isDetecting ? 'Checking Camera...' : isSimulated ? 'Demo Proctor Mode' : isActive ? 'Camera Live' : 'Camera Offline'}
          </span>
        </div>
        {isActive
          ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          : <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
        }
      </div>

      {/* Video area */}
      <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
        {/* Always render video — visibility controlled by opacity not display:none */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isSimulated ? 'none' : 'scaleX(-1)',
            display: 'block',
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Overlay when not active */}
        {!isActive && (
          <div
            style={{ position: 'absolute', inset: 0 }}
            className="flex flex-col items-center justify-center text-center p-3 bg-slate-900"
          >
            {isDetecting ? (
              <>
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-[11px] text-slate-300 font-medium">Requesting camera access…</p>
                <p className="text-[9px] text-slate-500 mt-1">Please allow permission in your browser</p>
              </>
            ) : (
              <>
                <CameraOff className="w-7 h-7 text-rose-400 mb-2" />
                <p className="text-[11px] font-bold text-rose-300 mb-1">Camera Not Active</p>
                <p className="text-[9px] text-slate-400 max-w-[200px] leading-relaxed mb-3">
                  {errorMsg}
                </p>
                <div className="flex flex-col gap-1.5 w-full px-2">
                  <button
                    type="button"
                    onClick={startRealCamera}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Allow / Retry Camera
                  </button>
                  <button
                    type="button"
                    onClick={startDemoCamera}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Use Demo Camera
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* LIVE badge */}
        {isActive && (
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-300 border border-emerald-600/30">
            <Camera className="w-2.5 h-2.5" />
            {isSimulated ? 'DEMO' : 'LIVE'}
          </div>
        )}
      </div>

      {/* Footer — switch mode */}
      {isActive && (
        <div className="bg-slate-800/60 border-t border-slate-700 px-2.5 py-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>{isSimulated ? 'Demo Camera active' : 'Real Webcam active'}</span>
          {isSimulated ? (
            <button type="button" onClick={startRealCamera} className="text-blue-400 hover:text-blue-300 transition-colors">
              Switch to Real Cam
            </button>
          ) : (
            <button type="button" onClick={startDemoCamera} className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Use Demo Cam
            </button>
          )}
        </div>
      )}
    </div>
  );
}
