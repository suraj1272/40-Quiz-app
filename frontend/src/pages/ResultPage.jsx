import React, { useState, useEffect } from 'react';
import CompanyLogo from '../components/CompanyLogo';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Award,
  BookOpen,
  Printer,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResultPage({ resultData, autoReason, onRestart }) {
  const [filter, setFilter] = useState('all'); // all, correct, incorrect, unanswered
  const [expandedIndex, setExpandedIndex] = useState(null);

  const summary = resultData?.submission_summary || {};
  const candidate = resultData?.candidate || {};
  const sectionBreakdown = resultData?.section_breakdown || {};
  const review = resultData?.detailed_review || [];

  const isPassed = summary.percentage >= 50;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // non-blocking
      }
    }
  }, [isPassed]);

  const filteredQuestions = review.filter((item) => {
    if (filter === 'correct') return item.status === 'correct';
    if (filter === 'incorrect') return item.status === 'incorrect';
    if (filter === 'unanswered') return item.status === 'unanswered';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <CompanyLogo size="md" showSubtitle={false} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </button>
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              New Candidate Exam
            </button>
          </div>
        </div>

        {/* Auto submission alert banner */}
        {autoReason && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Automated Submission Triggered</p>
              <p className="text-amber-700 mt-0.5">{autoReason}</p>
            </div>
          </div>
        )}

        {/* Score Card Hero */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className={`p-6 sm:p-8 text-white ${
            isPassed
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
              : 'bg-gradient-to-r from-blue-700 to-indigo-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                  Assessment Completed
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">
                  {candidate.name || "Candidate"}
                </h1>
                <p className="text-xs text-blue-100 mt-0.5">{candidate.email}</p>
              </div>

              {/* Big Score circle */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <Award className="w-10 h-10 text-amber-300" />
                <div>
                  <div className="text-3xl font-black leading-none">
                    {summary.score} <span className="text-lg font-medium opacity-80">/ {summary.total_questions}</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-200 mt-1">
                    {summary.percentage}% Score &bull; {summary.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 text-center">
            <div className="bg-white p-4">
              <div className="text-xs text-slate-500 font-medium">Attempted</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{summary.answered_questions} / 40</div>
            </div>
            <div className="bg-white p-4">
              <div className="text-xs text-emerald-600 font-medium">Correct Answers</div>
              <div className="text-lg font-bold text-emerald-600 mt-0.5">{summary.correct_answers}</div>
            </div>
            <div className="bg-white p-4">
              <div className="text-xs text-rose-600 font-medium">Incorrect Answers</div>
              <div className="text-lg font-bold text-rose-600 mt-0.5">{summary.wrong_answers}</div>
            </div>
            <div className="bg-white p-4">
              <div className="text-xs text-slate-500 font-medium">Time Taken</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {summary.time_display || "40m 00s"}
              </div>
            </div>
          </div>
        </div>

        {/* Section-Wise Breakdown */}
        {Object.keys(sectionBreakdown).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Sectional Performance
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {Object.entries(sectionBreakdown).map(([secName, data]) => {
                const secPercent = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={secName} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{secName}</div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-extrabold text-blue-600">{data.correct}/{data.total}</span>
                      <span className="text-xs font-semibold text-slate-600">{secPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${secPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Question Review Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Question-by-Question Review</h3>
              <p className="text-xs text-slate-500">Inspect each question, your response, and the verified correct answer</p>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All (40)
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-3 py-1 rounded-lg transition-all ${filter === 'correct' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Correct
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-3 py-1 rounded-lg transition-all ${filter === 'incorrect' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Incorrect
              </button>
              <button
                onClick={() => setFilter('unanswered')}
                className={`px-3 py-1 rounded-lg transition-all ${filter === 'unanswered' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Unanswered
              </button>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isOpen = expandedIndex === q.question_id;

              return (
                <div
                  key={q.question_id}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isOpen ? null : q.question_id)}
                    className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                        {q.question_id}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 line-clamp-1 max-w-md">
                        {q.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {q.status === 'correct' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      )}
                      {q.status === 'incorrect' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                      {q.status === 'unanswered' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                          Unattempted
                        </span>
                      )}
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-white space-y-4 border-t border-slate-100">
                      {q.passage && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-serif leading-relaxed">
                          <strong>Passage:</strong> {q.passage}
                        </div>
                      )}

                      <div className="text-sm font-semibold text-slate-900">
                        {q.text}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isCandidateChoice = q.selected_option === opt.key;
                          const isCorrectOption = q.correct_option === opt.key;

                          let cardStyle = "border-slate-200 bg-white text-slate-700";
                          if (isCorrectOption) {
                            cardStyle = "border-emerald-500 bg-emerald-50/70 text-emerald-900 font-medium";
                          } else if (isCandidateChoice && !isCorrectOption) {
                            cardStyle = "border-rose-400 bg-rose-50/70 text-rose-900 line-through";
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${cardStyle}`}
                            >
                              <span className="font-bold w-5 h-5 rounded-md flex items-center justify-center bg-black/5">
                                {opt.key}
                              </span>
                              <span>{opt.text}</span>
                              {isCorrectOption && (
                                <span className="ml-auto text-[10px] font-bold text-emerald-700 uppercase">
                                  Correct
                                </span>
                              )}
                              {isCandidateChoice && !isCorrectOption && (
                                <span className="ml-auto text-[10px] font-bold text-rose-700 uppercase">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
