import React, { useState } from 'react';
import CompanyLogo from '../components/CompanyLogo';
import WebcamMonitor from '../components/WebcamMonitor';
import { User, Mail, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, Lock, CameraOff } from 'lucide-react';
import { validateCandidate } from '../services/api';

export default function CandidateDetailsPage({ onBack, onStartExam }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cameraState, setCameraState] = useState({ active: false, error: null });

  const isCameraActive = cameraState.active;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCameraActive) {
      setErrors({ form: 'Camera not detected! Active camera is required to start the examination.' });
      return;
    }

    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await validateCandidate({
        name: name.trim(),
        email: email.trim().toLowerCase()
      });
      onStartExam(result.candidate || { name: name.trim(), email: email.trim().toLowerCase() });
    } catch (err) {
      setErrors({ form: err.message || 'Validation failed. Please check inputs.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <CompanyLogo size="lg" showSubtitle={false} />
          <h1 className="text-2xl font-black text-slate-900 mt-4">Candidate Registration</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your details accurately. Your exam score will be mapped to this identity.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"></div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errors.form && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Candidate Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Candidate Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-medium text-rose-600 pl-1">{errors.name}</p>
              )}
            </div>

            {/* Candidate Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. alex.morgan@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-medium text-rose-600 pl-1">{errors.email}</p>
              )}
            </div>

            {/* Camera Status Card */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isCameraActive
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/60 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2.5 text-xs">
                {isCameraActive ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <CameraOff className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-xs">
                    {isCameraActive ? "Camera Active & Ready" : "Camera Access Required"}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${isCameraActive ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isCameraActive
                      ? "Proctored stream active. Ready to begin."
                      : "Allow webcam access in your browser or click 'Use Demo Camera' to test."}
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <WebcamMonitor
                  compact={true}
                  onStatusChange={(status) => setCameraState(status)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !isCameraActive}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isCameraActive && !isLoading
                    ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'text-slate-400 bg-slate-200 border border-slate-300 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : !isCameraActive ? (
                  <>
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Camera Required to Start</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Start Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Back Link */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Instructions & Terms
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-600 mt-6">
        Protected by Encrypted Candidate Verification &bull; TTS Assessment
      </div>
    </div>
  );
}
