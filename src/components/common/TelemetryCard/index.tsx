import { cn } from '@/lib/utils';
import { memo } from 'react';

const TelemetryCard = memo(
  ({
    label,
    value,
    unit,
    icon: Icon,
    color = 'text-slate-200',
    subValue,
  }: {
    label: string;
    value: string | number;
    unit: string;
    icon: any;
    color?: string;
    subValue?: string;
  }) => (
    <div className='bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg flex items-center gap-3 min-w-[140px]'>
      <div className={cn('p-2 rounded-md bg-slate-800/50', color)}>
        <Icon size={18} />
      </div>
      <div>
        <div className='text-[10px] uppercase tracking-wider text-slate-400 font-semibold'>
          {label}
        </div>
        <div className='text-lg font-mono font-bold text-slate-100'>
          {value}
          <span className='text-xs text-slate-500 ml-1'>{unit}</span>
        </div>
        {subValue && (
          <div className='text-[10px] text-slate-500'>{subValue}</div>
        )}
      </div>
    </div>
  )
);

TelemetryCard.displayName = 'TelemetryCard';

export default TelemetryCard;
