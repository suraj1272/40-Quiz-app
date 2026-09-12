import React from 'react';
import { Bookmark, BookmarkCheck, RotateCcw, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  isMarkedForReview,
  onSelectOption,
  onClearOption,
  onToggleMarkForReview,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onSubmitClick
}) {
  if (!question) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Question Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {question.section}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMarkForReview}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isMarkedForReview
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isMarkedForReview ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" />
                Marked for Review
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                Mark for Review
              </>
            )}
          </button>

          {selectedAnswer && (
            <button
              type="button"
              onClick={onClearOption}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Clear selection"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Question Body */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
        {/* Reading Passage (if applicable) */}
        {question.passage && (
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-slate-800">
            <div className="flex items-center gap-2 font-semibold text-indigo-900 text-xs uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Reference Passage
            </div>
            <p className="text-sm leading-relaxed text-slate-700 font-serif">
              {question.passage}
            </p>
          </div>
        )}

        {/* Question Text */}
        <div className="text-slate-900 text-lg font-medium leading-relaxed">
          {question.text}
        </div>

        {/* 4 Options */}
        <div className="space-y-3 pt-2">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;
            return (
              <label
                key={opt.key}
                onClick={() => onSelectOption(opt.key)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <span
                  className={`w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {opt.key}
                </span>

                <span className={`text-base font-normal pt-0.5 ${isSelected ? 'text-blue-950 font-medium' : 'text-slate-700'}`}>
                  {opt.text}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
            isFirst
              ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
              : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmitClick}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all"
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
