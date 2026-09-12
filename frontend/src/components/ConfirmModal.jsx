import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  totalQuestions = 40,
  answeredCount = 0,
  unansweredCount = 40,
  markedCount = 0
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
          Submit Examination?
        </h3>
        <p className="text-sm text-slate-500 text-center mb-6">
          Are you sure you want to complete and submit your examination? Once submitted, you cannot change your answers.
        </p>

        {/* Breakdown Stats */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 space-y-2.5 text-sm">
          <div className="flex justify-between items-center text-slate-600">
            <span>Total Questions:</span>
            <span className="font-bold text-slate-900">{totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-700 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Answered:
            </span>
            <span className="font-bold">{answeredCount}</span>
          </div>
          <div className="flex justify-between items-center text-rose-700 font-medium">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-rose-500" /> Unanswered:
            </span>
            <span className="font-bold">{unansweredCount}</span>
          </div>
          {markedCount > 0 && (
            <div className="flex justify-between items-center text-amber-700 font-medium">
              <span>Marked for Review:</span>
              <span className="font-bold">{markedCount}</span>
            </div>
          )}
        </div>

        {unansweredCount > 0 && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Notice:</strong> You have {unansweredCount} unanswered questions. Unanswered questions will receive 0 marks.
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Return to Exam
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Yes, Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
