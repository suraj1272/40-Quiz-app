import React, { useState } from 'react';
import CompanyLogo from '../components/CompanyLogo';
import WebcamMonitor from '../components/WebcamMonitor';
import {
  Clock,
  HelpCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Shield,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function InstructionsPage({ onProceed, config }) {
  const [agreed, setAgreed] = useState(false);
  const [cameraState, setCameraState] = useState({ active: false, error: null });

  const isCameraActive = cameraState.active;
  const canProceed = agreed && isCameraActive;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header with Company Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <CompanyLogo size="lg" showSubtitle={true} />
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide uppercase">
            Official Online Assessment Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {config?.title || "Online Assessment - TTS Set D"}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-lg">
            Please review the examination instructions, terms, and system requirements carefully before proceeding.
          </p>
        </div>

        {/* Main Instruction Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6">
          {/* Top Quick Highlights Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 text-white p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <HelpCircle className="w-5 h-5 mx-auto mb-1 text-cyan-200" />
              <div className="text-xl font-black">40</div>
              <div className="text-xs text-blue-100 font-medium">Questions</div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Clock className="w-5 h-5 mx-auto mb-1 text-cyan-200" />
              <div className="text-xl font-black">40 Mins</div>
              <div className="text-xs text-blue-100 font-medium">Total Duration</div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
              <div className="text-xl font-black">No</div>
              <div className="text-xs text-blue-100 font-medium">Negative Marking</div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Camera className="w-5 h-5 mx-auto mb-1 text-cyan-200" />
              <div className="text-xl font-black">Active</div>
              <div className="text-xs text-blue-100 font-medium">Camera Required</div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Terms and Conditions Section */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Examination Terms & Conditions
              </h2>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 text-sm text-slate-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span><strong>Total Questions:</strong> The candidate must answer <strong>40 multiple-choice questions</strong> covering Quantitative Aptitude, Logical Reasoning, and Verbal Ability.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span><strong>Total Duration:</strong> The total examination duration is strictly <strong>40 minutes</strong>. A live countdown timer will be displayed at the top of your screen.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span><strong>Marking Scheme:</strong> Each question carries 1 mark. There is <strong>no negative marking</strong> for incorrect answers. Attempting all questions is encouraged.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span><strong>Mandatory Camera Monitoring:</strong> The candidate’s <strong>laptop camera must remain active throughout the examination</strong>. The portal will prevent starting without an active camera feed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                    <span><strong>Automatic Submission:</strong> The examination will automatically submit all chosen responses once the 40-minute timer expires.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</span>
                    <span><strong>Fair Examination Policy:</strong> Navigating away from the exam window, opening new tabs, or disabling the webcam may lead to disqualification.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Camera Setup & Readiness Check */}
            <div className={`grid md:grid-cols-3 gap-4 items-center rounded-xl p-4 sm:p-5 border transition-all ${
              isCameraActive
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-rose-50/50 border-rose-200'
            }`}>
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Shield className={`w-4 h-4 ${isCameraActive ? 'text-emerald-600' : 'text-rose-600'}`} />
                  Mandatory Camera Hardware Verification
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The candidate’s laptop camera must remain active throughout the examination. If your camera is not detected or permission is blocked, you will not be permitted to proceed to the examination.
                </p>

                {isCameraActive ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Webcam Verified & Streaming
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-100/90 text-rose-800 text-xs font-bold">
                    <CameraOff className="w-4 h-4 text-rose-600" />
                    Camera Not Detected — Cannot Proceed
                  </div>
                )}

                {cameraState.error && (
                  <p className="text-[11px] text-rose-700 font-medium">
                    {cameraState.error}
                  </p>
                )}
              </div>

              <div className="md:col-span-1 flex justify-center">
                <WebcamMonitor
                  compact={true}
                  onStatusChange={(status) => setCameraState(status)}
                />
              </div>
            </div>

            {/* Candidate Agreement Checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-800 select-none">
                  I have read, understood, and agree to all the examination terms and conditions, and I consent to my laptop camera being active during the test.
                </span>
              </label>
            </div>

            {/* Blocker alert message if camera is not active */}
            {!isCameraActive && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Camera Required to Proceed</p>
                  <p className="text-rose-700 text-[11px] mt-0.5">
                    Your camera must be connected and authorized before you can continue. Click "Retry Detection" on the camera preview or enable camera permissions in your browser.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer with "OK" Button */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              {!isCameraActive ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Camera detection required to proceed
                </span>
              ) : !agreed ? (
                <span>Please check the agreement box above to proceed.</span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to proceed to candidate details
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onProceed}
              disabled={!canProceed}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                canProceed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              {!isCameraActive ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>OK (Camera Required)</span>
                </>
              ) : (
                <>
                  <span>OK (Proceed)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 mt-6">
        &copy; {new Date().getFullYear()} TTS Assessment Portal &bull; All Rights Reserved &bull; Secure Proctoring Engine
      </div>
    </div>
  );
}
