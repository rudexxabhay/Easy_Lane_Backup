const BLOCKED_RESPONSE_PATTERNS = [
  'system prompt',
  'developer message',
  'hidden instructions',
  'xai_api_key',
  'api key',
  'mongodb',
  'jwt secret',
  'bearer ',
  'database records',
  'retrieved context',
  'ignore previous instructions',
];

export function validateGroundedResponse(text = '') {
  const normalized = String(text || '').toLowerCase();
  const violation = BLOCKED_RESPONSE_PATTERNS.find((pattern) => normalized.includes(pattern));
  return {
    ok: !violation,
    violation: violation || '',
  };
}
