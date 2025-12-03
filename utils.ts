export const formatCurrency = (amount: number): string => {
  return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const day = (`0${d.getDate()}`).slice(-2);
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateShort = (date: Date): string => {
  const d = new Date(date);
  const day = (`0${d.getDate()}`).slice(-2);
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  return `${day}/${month}`;
};

// Generate array of dates between start and end
export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const date = new Date(startDate.getTime());
  const dates = [];
  
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return dates;
};

export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};
