import { format, startOfDay, endOfDay } from 'date-fns';

const getDateString = ({date = new Date(), dateFormat = 'yyyy-MM-dd'}: {date: Date, dateFormat?: string}) => {
    return format(date, dateFormat);
};

const getStartDateEpoch = () => {
    return startOfDay(new Date()).getTime();
};

const getEndDateEpoch = () => {
    return endOfDay(new Date()).getTime();
};

const getCurrentEpoch = () => {
    return new Date().getTime();
};

export { getDateString, getStartDateEpoch, getEndDateEpoch, getCurrentEpoch };