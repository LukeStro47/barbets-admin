/** Copied verbatim from the main app's lib/timezone.ts — pure, repo-agnostic data. */
const FRIENDLY_NAMES: Record<string, string> = {
  'America/New_York': 'Eastern time',
  'America/Chicago': 'Central time',
  'America/Denver': 'Mountain time',
  'America/Phoenix': 'Arizona time',
  'America/Los_Angeles': 'Pacific time',
  'America/Anchorage': 'Alaska time',
  'Pacific/Honolulu': 'Hawaii time',
  'Europe/London': 'UK time',
  UTC: 'UTC',
};

export function friendlyTimezoneName(iana: string): string {
  if (FRIENDLY_NAMES[iana]) return FRIENDLY_NAMES[iana];
  const city = iana.split('/').pop() ?? iana;
  return `${city.replace(/_/g, ' ')} time`;
}

export const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Sao_Paulo',
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
] as const;
