import React from 'react';

interface MetricProgressBarProps {
  id?: string;
  percent: number;
  label?: string;
  colorClass?: string;
  trackClass?: string;
  showPercentBadge?: boolean;
}

export const MetricProgressBar: React.FC<MetricProgressBarProps> = ({
  id,
  percent,
  label = 'Tiến độ hoàn thành',
  colorClass = 'bg-indigo-600',
  trackClass = 'bg-slate-100',
  showPercentBadge = true,
}) => {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div
      id={id || `metric-progress-${safePercent}`}
      className="w-full mb-3.5 pb-2 border-b border-slate-100/80 space-y-1.5"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-medium text-slate-500 truncate" title={label}>
          {label}
        </span>
        {showPercentBadge && (
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
            {safePercent}%
          </span>
        )}
      </div>

      <div className={`w-full ${trackClass} h-1.5 rounded-full overflow-hidden`}>
        <div
          role="progressbar"
          aria-valuenow={safePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
          className={`${colorClass} h-full rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
};
