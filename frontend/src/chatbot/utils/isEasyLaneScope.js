import { normalizeText } from '../../ai/knowledgeEngine.js';
import { CHATBOT_SCOPE } from '../config/chatbotScope.js';

function pickReason(reason = 'easy_lane_topic') {
  return reason;
}

function matchesPhrase(text, phrase) {
  const normalizedText = normalizeText(text);
  const normalizedPhrase = normalizeText(phrase);
  return Boolean(normalizedPhrase) && normalizedText.includes(normalizedPhrase);
}

function countTopicMatches(text = '') {
  return CHATBOT_SCOPE.topicKeywords.reduce((count, phrase) => (
    matchesPhrase(text, phrase) ? count + 1 : count
  ), 0);
}

function hasPromptInjection(text = '') {
  return CHATBOT_SCOPE.promptInjectionPatterns.some((pattern) => matchesPhrase(text, pattern));
}

function hasFollowUpHint(text = '') {
  return CHATBOT_SCOPE.followUpTerms.some((phrase) => matchesPhrase(text, phrase));
}

function getRecentUserContext(history = []) {
  return history
    .filter((message) => message?.role === 'user')
    .slice(-CHATBOT_SCOPE.contextWindowSize);
}

export function isEasyLaneScope(message = '', history = []) {
  const recentUserMessages = getRecentUserContext(history);
  const recentContextText = recentUserMessages.map((item) => item.content || '').join(' ');
  const directMatches = countTopicMatches(message);
  const contextMatches = countTopicMatches(recentContextText);
  const followUp = hasFollowUpHint(message);

  if (hasPromptInjection(message)) {
    return {
      inScope: false,
      reason: pickReason('prompt_injection'),
      directMatches,
      contextMatches,
    };
  }

  if (directMatches > 0) {
    return {
      inScope: true,
      reason: pickReason('easy_lane_topic'),
      directMatches,
      contextMatches,
    };
  }

  if (followUp && contextMatches > 0) {
    return {
      inScope: true,
      reason: pickReason('context_follow_up'),
      directMatches,
      contextMatches,
    };
  }

  return {
    inScope: false,
    reason: pickReason('unrelated_topic'),
    directMatches,
    contextMatches,
  };
}
