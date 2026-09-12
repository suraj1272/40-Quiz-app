import React, { useState, useEffect } from 'react';
import InstructionsPage from './pages/InstructionsPage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import { fetchExamConfig } from './services/api';

export default function App() {
  // Navigation stages: 'instructions' | 'details' | 'exam' | 'result'
  const [currentStage, setCurrentStage] = useState('instructions');
  const [examConfig, setExamConfig] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [autoSubmitReason, setAutoSubmitReason] = useState(null);

  useEffect(() => {
    async function loadConfig() {
      const cfg = await fetchExamConfig();
      setExamConfig(cfg);
    }
    loadConfig();
  }, []);

  // Stage 1: Instructions -> Candidate Details
  const handleProceedFromInstructions = () => {
    setCurrentStage('details');
  };

  // Stage 2: Candidate Details -> Exam
  const handleStartExam = (candidateData) => {
    setCandidate(candidateData);
    setCurrentStage('exam');
  };

  // Back from Candidate Details -> Instructions
  const handleBackToInstructions = () => {
    setCurrentStage('instructions');
  };

  // Stage 3: Exam -> Results
  const handleExamCompleted = (resultData, autoReason = null) => {
    setExamResult(resultData);
    setAutoSubmitReason(autoReason);
    setCurrentStage('result');
  };

  // Stage 4: Restart Exam for another candidate
  const handleRestart = () => {
    setCandidate(null);
    setExamResult(null);
    setAutoSubmitReason(null);
    setCurrentStage('instructions');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {currentStage === 'instructions' && (
        <InstructionsPage
          config={examConfig}
          onProceed={handleProceedFromInstructions}
        />
      )}

      {currentStage === 'details' && (
        <CandidateDetailsPage
          onBack={handleBackToInstructions}
          onStartExam={handleStartExam}
        />
      )}

      {currentStage === 'exam' && candidate && (
        <ExamPage
          candidate={candidate}
          onExamCompleted={handleExamCompleted}
        />
      )}

      {currentStage === 'result' && examResult && (
        <ResultPage
          resultData={examResult}
          autoReason={autoSubmitReason}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
