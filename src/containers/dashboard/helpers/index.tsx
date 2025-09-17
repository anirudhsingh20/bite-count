import { format, subDays } from 'date-fns';

export const getDateStringFromDateDifference = (
  dateDifferenceFromToday: 0 | 1 | 2
) => {
  return dateDifferenceFromToday === 0
    ? 'Today'
    : dateDifferenceFromToday === 1
    ? 'Yesterday'
    : format(subDays(new Date(), dateDifferenceFromToday), 'MMM d');
};
