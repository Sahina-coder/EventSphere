export const getEventCsvUrl = (eventId: number): string => {
  return `http://127.0.0.1:8000/reports/event/${eventId}/csv`;
};

export const getEventPdfUrl = (eventId: number): string => {
  return `http://127.0.0.1:8000/reports/event/${eventId}/pdf`;
};