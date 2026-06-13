export function checkRateLimitPlaceholder(key: string) {
  if (!key) {
    // No-op to avoid unused variable warning
  }
  return {
    allowed: true,
    remaining: 60,
    resetAt: null as string | null,
  };
}
