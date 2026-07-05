const requests = new Map<
  string,
  number[]
>();

const WINDOW_MS =
  15 * 60 * 1000;

const MAX_REQUESTS = 5;

export function isRateLimited(
  ip: string
) {
  const now = Date.now();

  const timestamps =
    requests.get(ip) || [];

  const recent =
    timestamps.filter(
      (time) =>
        now - time < WINDOW_MS
    );

  if (
    recent.length >=
    MAX_REQUESTS
  ) {
    return true;
  }

  recent.push(now);

  requests.set(ip, recent);

  return false;
}
