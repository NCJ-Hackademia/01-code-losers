export const parseDateString = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(year, month - 1, day, 0, 0, 0); 
};


export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

export const getQueueStartTime = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(year, month - 1, day, 9, 0, 0);
};
