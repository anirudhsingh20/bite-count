
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import type { Setter } from '../../../types';
import { getDateStringFromDateDifference } from '../helpers';

const DashboardHeader = ({
  dateDifferenceFromToday,
  setDateDifferenceFromToday,
}: {
  dateDifferenceFromToday: 0 | 1 | 2;
  setDateDifferenceFromToday: Setter<0 | 1 | 2>;
}) => {
  const changeDateDifferenceFromToday = useCallback(
    (days: 1 | -1) => {
      setDateDifferenceFromToday((prev) => (prev + days) as 0 | 1 | 2);
    },
    [setDateDifferenceFromToday]
  );

  const isPrevDayBtnDisabled = useMemo(() => {
    return dateDifferenceFromToday === 2;
  }, [dateDifferenceFromToday]);

  const isNextDayBtnDisabled = useMemo(() => {
    return dateDifferenceFromToday === 0;
  }, [dateDifferenceFromToday]);

  return (
    <div className='flex items-center justify-center p-4 bg-white'>
      <div className='flex items-center gap-2 bg-gray-100/30 rounded-xl p-2'>
        <Button
          variant='ghost'
          id='prevDayBtn'
          onClick={() => {
            if (isPrevDayBtnDisabled) {
              toast.error('Only meals from the last 2 days ⏳ can join the party!', {
                icon: '⏳',
                description: 'Stay consistent! 🍴🕒'
              });
              return;
            }
            changeDateDifferenceFromToday(1);
          }}
          className={cn(
            'w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full',
            isPrevDayBtnDisabled && 'opacity-50'
          )}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M15 19l-7-7 7-7'
            ></path>
          </svg>
        </Button>
        <span
          id='currentDate'
          className='px-4 text-black font-medium min-w-26 text-center'
        >
          {getDateStringFromDateDifference(dateDifferenceFromToday)}
        </span>
        <Button
          variant='ghost'
          id='nextDayBtn'
          onClick={() => {
            if (isNextDayBtnDisabled) {
              return;
            }
            changeDateDifferenceFromToday(-1);
          }}
          className={cn(
            'w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full',
            isNextDayBtnDisabled && 'opacity-50'
          )}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M9 5l7 7-7 7'
            ></path>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
