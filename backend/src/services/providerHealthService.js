import { config } from '../config.js';

const FAILURE_THRESHOLD = 3;

const providerState = {
  consecutiveFailures: 0,
  cooldownUntil: 0,
  lastFailureType: '',
};

function now() {
  return Date.now();
}

function isCooldownErrorType(type = '') {
  return [
    'rate_limit',
    'quota_exhausted',
    'service_unavailable',
    'provider_error',
    'network_error',
    'timeout',
  ].includes(type);
}

export function getProviderHealthStatus() {
  const cooldownRemainingMs = Math.max(0, providerState.cooldownUntil - now());
  return {
    available: cooldownRemainingMs <= 0,
    cooldownRemainingMs,
    consecutiveFailures: providerState.consecutiveFailures,
    lastFailureType: providerState.lastFailureType,
  };
}

export function recordProviderSuccess() {
  providerState.consecutiveFailures = 0;
  providerState.cooldownUntil = 0;
  providerState.lastFailureType = '';
}

export function recordProviderFailure(type = '') {
  providerState.consecutiveFailures += 1;
  providerState.lastFailureType = type || 'provider_error';
  const cooldownMs = Math.max(1000, Number(config().chatbotProviderCooldownMs || 90000));

  if (
    type === 'quota_exhausted'
    || type === 'authentication_error'
    || (providerState.consecutiveFailures >= FAILURE_THRESHOLD && isCooldownErrorType(type))
  ) {
    providerState.cooldownUntil = now() + cooldownMs;
  }
}
