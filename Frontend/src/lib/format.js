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

export function formatDateTime(value) {
  if (!value) return "TBD";
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDate(value) {
  if (!value) return "TBD";
  return new Date(value).toLocaleDateString();
}

export function formatTime(value) {
  if (!value) return "TBD";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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
