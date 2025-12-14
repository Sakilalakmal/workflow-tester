import { intervalToDuration } from "date-fns";

export function DateToDurationString(
  end: Date | string | null | undefined,
  start: Date | string | null | undefined
) {
  if (!start || !end) {
    return;
  }

  const endDate = typeof end === 'string' ? new Date(end) : end;
  const startDate = typeof start === 'string' ? new Date(start) : start;

  const timeElapsed = endDate.getTime() - startDate.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed} ms`;
  }

  const duration = intervalToDuration({ start: 0, end: timeElapsed });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}
