import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function Timer({ totalDurationMinutes = 40, onTimeUp, onTick }) {
  const totalSeconds = totalDurationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        const nextVal = prev - 1;
        if (onTick) onTick(totalSeconds - nextVal);
        if (nextVal <= 0) {
          clearInterval(intervalId);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft, totalSeconds, onTimeUp, onTick]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Visual cues based on remaining time
  const isUrgent = secondsLeft < 300; // under 5 minutes
  const isCritical = secondsLeft < 120; // under 2 minutes

  let badgeColor = "bg-blue-50 text-blue-800 border-blue-200";
  let iconColor = "text-blue-600";

  if (isCritical) {
    badgeColor = "bg-rose-50 text-rose-800 border-rose-300 animate-pulse";
    iconColor = "text-rose-600";
  } else if (isUrgent) {
    badgeColor = "bg-amber-50 text-amber-800 border-amber-300";
    iconColor = "text-amber-600";
  }

  return (
    <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border shadow-sm ${badgeColor}`}>
      {isCritical ? (
        <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
      ) : (
        <Clock className={`w-5 h-5 ${iconColor}`} />
      )}
      <div>
        <div className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
          Time Remaining
        </div>
        <div className="font-mono text-lg font-bold tracking-tight leading-none">
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
