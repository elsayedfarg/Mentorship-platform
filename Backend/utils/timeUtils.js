const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SESSION_DURATION_MINUTES = 45;
const BUFFER_MINUTES = 10;

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const getDayOfWeekFromDateString = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return DAY_NAMES[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
};

const getWallClockTime = (date) => {
  const value = new Date(date);
  return `${String(value.getUTCHours()).padStart(2, "0")}:${String(value.getUTCMinutes()).padStart(2, "0")}`;
};

const getWallClockDayOfWeek = (date) => {
  return DAY_NAMES[new Date(date).getUTCDay()];
};

const getWallClockDateString = (date) => {
  const value = new Date(date);
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildWallClockDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}:00.000Z`);
};

const getSessionDurationMinutes = (startDate, endDate) => {
  return Math.round((new Date(endDate) - new Date(startDate)) / (60 * 1000));
};

const isSameWallClockDay = (startDate, endDate) => {
  return getWallClockDateString(startDate) === getWallClockDateString(endDate);
};

const generateSessionSlots = (
  blocks,
  dateStr,
  bookedSessions = [],
  slotDurationMinutes = SESSION_DURATION_MINUTES,
  bufferMinutes = BUFFER_MINUTES,
) => {
  const slots = [];
  const now = new Date();

  for (const block of blocks) {
    let cursor = timeToMinutes(block.start_time);
    const blockEnd = timeToMinutes(block.end_time);

    while (cursor + slotDurationMinutes <= blockEnd) {
      const slotStart = minutesToTime(cursor);
      const slotEnd = minutesToTime(cursor + slotDurationMinutes);
      const slotStartDate = buildWallClockDateTime(dateStr, slotStart);
      const slotEndDate = buildWallClockDateTime(dateStr, slotEnd);

      const isPast = slotStartDate <= now;
      const bufferMs = bufferMinutes * 60 * 1000;
      const isBooked = bookedSessions.some((session) => {
        const sessionStart = new Date(session.start_time).getTime() - bufferMs;
        const sessionEnd = new Date(session.end_time).getTime() + bufferMs;
        return slotStartDate.getTime() < sessionEnd && slotEndDate.getTime() > sessionStart;
      });

      slots.push({
        start_time: slotStart,
        end_time: slotEnd,
        duration_minutes: slotDurationMinutes,
        available: !isPast && !isBooked,
      });

      cursor += slotDurationMinutes;
    }
  }

  return slots;
};

module.exports = {
  DAY_NAMES,
  SESSION_DURATION_MINUTES,
  BUFFER_MINUTES,
  timeToMinutes,
  minutesToTime,
  getDayOfWeekFromDateString,
  getWallClockTime,
  getWallClockDayOfWeek,
  getWallClockDateString,
  buildWallClockDateTime,
  getSessionDurationMinutes,
  isSameWallClockDay,
  generateSessionSlots,
};
