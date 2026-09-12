import React from 'react';

export default function QuestionPalette({
  totalQuestions = 40,
  currentIndex,
  answers = {},
  markedForReview = {},
  onSelectQuestion,
  onSubmitClick
}) {
  const qList = Array.from({ length: totalQuestions }, (_, i) => i);

  let answeredCount = 0;
  let markedCount = 0;

  qList.forEach((idx) => {
    const qid = idx + 1;
    if (answers[qid]) answeredCount++;
    if (markedForReview[qid]) markedCount++;
  });

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col h-full">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Question Palette (40)
        </h3>
        <span className="text-[11px] font-medium text-slate-500">
          {answeredCount}/{totalQuestions} Answered
        </span>
      </div>

      {/* Summary Badges */}
      <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 text-center">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-1.5">
          <div className="text-xs font-bold text-emerald-700">{answeredCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium">Answered</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5">
          <div className="text-xs font-bold text-slate-700">{unansweredCount}</div>
          <div className="text-[10px] text-slate-500 font-medium">Not Answered</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-1.5">
          <div className="text-xs font-bold text-amber-700">{markedCount}</div>
          <div className="text-[10px] text-amber-600 font-medium">Review</div>
        </div>
      </div>

      {/* 40 Questions Grid */}
      <div className="flex-1 overflow-y-auto py-3 pr-1">
        <div className="grid grid-cols-5 gap-2">
          {qList.map((idx) => {
            const qid = idx + 1;
            const isAnswered = !!answers[qid];
            const isMarked = !!markedForReview[qid];
            const isCurrent = currentIndex === idx;

            let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";

            if (isAnswered && isMarked) {
              btnClass = "bg-purple-600 border-purple-700 text-white font-bold shadow-sm";
            } else if (isAnswered) {
              btnClass = "bg-emerald-600 border-emerald-700 text-white font-bold shadow-sm";
            } else if (isMarked) {
              btnClass = "bg-amber-500 border-amber-600 text-white font-bold shadow-sm";
            }

            return (
              <button
                key={qid}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={`relative h-9 rounded-lg text-xs font-semibold border flex items-center justify-center transition-all ${btnClass} ${
                  isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 z-10' : ''
                }`}
                title={`Question ${qid} - ${isAnswered ? 'Answered' : 'Not Answered'}${isMarked ? ' (Marked for Review)' : ''}`}
              >
                {qid}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border border-white rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend & Submit button */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"></span>
            Answered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-white border border-slate-300 inline-block"></span>
            Unanswered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
            Marked
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block"></span>
            Answered & Marked
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmitClick}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
