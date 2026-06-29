const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

const buildWallClockDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}:00.000Z`);
};

const generateHourlySlots = (blocks, dateStr, bookedSessions = [], bufferMinutes = 10) => {
  const slots = [];
  const now = new Date();

  for (const block of blocks) {
    let cursor = timeToMinutes(block.start_time);
    const blockEnd = timeToMinutes(block.end_time);

    while (cursor + 60 <= blockEnd) {
      const slotStart = minutesToTime(cursor);
      const slotEnd = minutesToTime(cursor + 60);
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
        available: !isPast && !isBooked,
      });

      cursor += 60;
    }
  }

  return slots;
};

module.exports = {
  DAY_NAMES,
  timeToMinutes,
  minutesToTime,
  getDayOfWeekFromDateString,
  getWallClockTime,
  getWallClockDayOfWeek,
  buildWallClockDateTime,
  generateHourlySlots,
};
