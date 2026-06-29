export function getId(item) {
  return item?._id || item?.id;
}

export function getSessionStart(session) {
  return session?.start_time || session?.startTime;
}

export function getSessionEnd(session) {
  return session?.end_time || session?.endTime;
}

export function getSessionStatus(session) {
  return session?.status || "Scheduled";
}

export function getMentorFromSession(session) {
  return session?.mentor || session?.mentor_id || {};
}

export function getStudentFromSession(session) {
  const student = session?.student || session?.student_id || {};
  return {
    ...student,
    email: student.email || student.user_id?.email,
  };
}

const WALL_CLOCK_OPTIONS = { timeZone: "UTC" };

export function formatDateTime(value) {
  if (!value) return "TBD";
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
    ...WALL_CLOCK_OPTIONS,
  });
}

export function formatDate(value) {
  if (!value) return "TBD";
  return new Date(value).toLocaleDateString([], WALL_CLOCK_OPTIONS);
}

export function formatTime(value) {
  if (!value) return "TBD";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    ...WALL_CLOCK_OPTIONS,
  });
}

/** Convert datetime-local input value to wall-clock ISO (no timezone shift). */
export function datetimeLocalToISO(value) {
  if (!value) return value;
  const normalized = value.length === 16 ? `${value}:00` : value;
  return `${normalized}.000Z`;
}

/** Format "HH:MM" (24h) as "10:00 AM". */
export function formatSlotTime(time24) {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function addMinutesToTime(time, minutesToAdd) {
  return minutesToTime(Math.min(timeToMinutes(time) + minutesToAdd, 23 * 60 + 59));
}

export function isEndTimeAfterStart(startTime, endTime) {
  return Boolean(startTime && endTime && endTime > startTime);
}

/** Minimum end time for availability blocks (default 1-hour sessions). */
export function getMinEndTime(startTime, minDurationMinutes = 60) {
  return addMinutesToTime(startTime, minDurationMinutes);
}

export function getProfilePath(role) {
  const paths = {
    student: "/dashboard/student/profile",
    mentor: "/dashboard/mentor/profile",
    admin: "/dashboard/admin/settings",
  };
  return paths[role] ?? "/login";
}

export function isNavActive(pathname, linkPath, dashboardPath) {
  if (pathname === linkPath) return true;
  if (linkPath === dashboardPath) return false;
  return pathname.startsWith(`${linkPath}/`);
}
