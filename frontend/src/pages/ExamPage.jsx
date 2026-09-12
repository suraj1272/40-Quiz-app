import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Timer from '../components/Timer';
import WebcamMonitor from '../components/WebcamMonitor';
import QuestionCard from '../components/QuestionCard';
import QuestionPalette from '../components/QuestionPalette';
import ConfirmModal from '../components/ConfirmModal';
import { fetchQuestions, submitExam } from '../services/api';
import { AlertCircle, CameraOff } from 'lucide-react';

export default function ExamPage({ candidate, onExamCompleted }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answers map: { "1": "C", "2": "A", ... }
  const [answers, setAnswers] = useState({});
  // Marked for review map: { "1": true, ... }
  const [markedForReview, setMarkedForReview] = useState({});

  // Camera proctoring state
  const [cameraState, setCameraState] = useState({ active: true, error: null });

  // Submission state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeSpentRef = useRef(0);
  const isSubmittedRef = useRef(false);

  // Load questions on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchQuestions();
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Unable to load examination questions from server. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle final submission
  const executeSubmission = useCallback(async (autoReason = null) => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    setIsSubmitting(true);

    try {
      const payload = {
        candidate,
        answers,
        time_spent_seconds: timeSpentRef.current || 2400
      };

      const result = await submitExam(payload);
      onExamCompleted(result, autoReason);
    } catch (err) {
      console.error("Submission failed, generating client-side report:", err);
      // Fallback local report generation if backend is down
      const fallbackResult = {
        candidate,
        submission_summary: {
          total_questions: 40,
          answered_questions: Object.keys(answers).length,
          unanswered_questions: 40 - Object.keys(answers).length,
          score: 0,
          percentage: 0,
          status: "SUBMITTED",
          time_spent_seconds: timeSpentRef.current,
          time_display: `${Math.floor(timeSpentRef.current / 60)}m ${timeSpentRef.current % 60}s`
        },
        detailed_review: []
      };
      onExamCompleted(fallbackResult, autoReason);
    } finally {
      setIsSubmitting(false);
    }
  }, [candidate, answers, onExamCompleted]);

  // Auto-submit when timer expires
  const handleTimeUp = useCallback(() => {
    executeSubmission("Time duration of 40 minutes has expired. Your examination was submitted automatically.");
  }, [executeSubmission]);

  // Option select
  const handleSelectOption = (key) => {
    const qid = currentIndex + 1;
    setAnswers((prev) => ({
      ...prev,
      [qid]: key
    }));
  };

  // Clear current option
  const handleClearOption = () => {
    const qid = currentIndex + 1;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qid];
      return copy;
    });
  };

  // Toggle mark for review
  const handleToggleMark = () => {
    const qid = currentIndex + 1;
    setMarkedForReview((prev) => ({
      ...prev,
      [qid]: !prev[qid]
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentQ = questions[currentIndex];
  const currentQId = currentIndex + 1;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-700">Loading Examination Questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-rose-200 shadow-lg text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Unable to Start Exam</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Bar with Timer and Proctoring Badge */}
      <Navbar
        candidate={candidate}
        showProctorBadge={cameraState.active}
        timerComponent={
          <Timer
            totalDurationMinutes={40}
            onTimeUp={handleTimeUp}
            onTick={(secondsElapsed) => {
              timeSpentRef.current = secondsElapsed;
            }}
          />
        }
      />

      {/* Disconnection Banner if camera is lost during test */}
      {!cameraState.active && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-pulse sticky top-16 z-20">
          <CameraOff className="w-4 h-4" />
          <span>PROCTORING ALERT: Camera disconnected! Your camera must remain active throughout the examination.</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Area: Question Card (8 Cols) */}
        <div className="lg:col-span-8 h-[calc(100vh-140px)] min-h-[560px]">
          <QuestionCard
            question={currentQ}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQId]}
            isMarkedForReview={!!markedForReview[currentQId]}
            onSelectOption={handleSelectOption}
            onClearOption={handleClearOption}
            onToggleMarkForReview={handleToggleMark}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentIndex === 0}
            isLast={currentIndex === questions.length - 1}
            onSubmitClick={() => setIsConfirmOpen(true)}
          />
        </div>

        {/* Right Sidebar: Camera Feed & Question Palette (4 Cols) */}
        <div className="lg:col-span-4 h-[calc(100vh-140px)] min-h-[560px] flex flex-col gap-4">
          {/* Active Proctoring Camera Box */}
          <div>
            <WebcamMonitor
              compact={false}
              onStatusChange={(status) => setCameraState(status)}
            />
          </div>

          {/* Question Palette Navigation */}
          <div className="flex-1 overflow-hidden">
            <QuestionPalette
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answers={answers}
              markedForReview={markedForReview}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              onSubmitClick={() => setIsConfirmOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => executeSubmission()}
        isSubmitting={isSubmitting}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        markedCount={markedCount}
      />
    </div>
  );
}
