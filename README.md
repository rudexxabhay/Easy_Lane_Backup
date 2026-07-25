# Easy Lane Assistant Phase 2

Phase 2 keeps the assistant UI manual and approved-only. It adds MongoDB-backed knowledge management, full conversation tracking, unmatched-question workflows, analytics, and retention controls without OpenAI or any external AI service.

## Architecture

- Widget UI: `frontend/src/components/EasyAiAssistant.jsx`
- Widget transport/session logic: `frontend/src/ai/assistantClient.js`
- Manual matching engine: `frontend/src/ai/knowledgeEngine.js`
- Local fallback knowledge: `frontend/src/ai/knowledge.js`
- Knowledge loading and cache fallback: `frontend/src/ai/knowledgeService.js`
- Knowledge-base admin module: `frontend/src/components/admin/AIKnowledgeBaseModule.jsx`
- Conversation admin module: `frontend/src/components/admin/AIConversationsModule.jsx`
- Knowledge API and CRUD: `backend/src/routes/aiKnowledgeRoutes.js`
- Conversation tracking, analytics, unmatched questions, retention: `backend/src/routes/assistantRoutes.js`
- Conversation models:
  - `backend/src/models/AssistantConversation.js`
  - `backend/src/models/AssistantMessage.js`
  - `backend/src/models/AssistantEvent.js`
  - `backend/src/models/AssistantUnmatchedQuestion.js`
  - `backend/src/models/AssistantSettings.js`

## Knowledge Base Model

Each approved knowledge entry stores:

- `id`
- `category`
- `primaryQuestion`
- `alternativeQuestions[]`
- `keywords[]`
- `answer`
- `ctaLabel`
- `ctaTarget`
- `priority`
- `isEnabled`
- `createdAt`
- `updatedAt`

The assistant searches the manual knowledge base in this order:

1. Exact primary-question match
2. Exact alternative-question match
3. Partial alternative-question match
4. Keyword match count
5. Category relevance
6. Entry priority

## Conversation Data Model

Every conversation is stored in MongoDB with:

- `conversationId`
- `sessionId`
- `visitorId`
- `status`
- `startPageUrl`
- `pageTitle`
- `referrerUrl`
- `deviceType`
- `browser`
- `operatingSystem`
- `screenSize`
- `language`
- `timezone`
- `ipAddress` only when privacy settings allow it
- `approximateLocation` only when legally and technically appropriate
- `startedAt`
- `endedAt`
- `lastActivityAt`
- `durationSeconds`
- `totalMessageCount`
- `totalUserMessages`
- `totalAssistantMessages`
- `matchedQuestions`
- `unmatchedQuestions`
- `ctaClicks`
- `demoRequested`
- `contactDetailsSubmitted`
- `convertedToLead`
- `leadId`
- `detectedCategory`
- `detectedIntent`
- `matchedModule`
- `rating`
- `adminNotes`
- `createdAt`
- `updatedAt`

## Message Data Model

Every message is stored separately with:

- `messageId`
- `conversationId`
- `sender`
- `messageText`
- `messageType`
- `sentAt`
- `deliveredAt`
- `responseDelay`
- `knowledgeEntryId`
- `matchedPrimaryQuestion`
- `matchedAlternativeQuestion`
- `matchedKeywords`
- `matchingScore`
- `matchingConfidence`
- `category`
- `CTA label`
- `CTA target`
- `fallbackUsed`
- `errorOccurred`
- `errorDetails`
- `metadata`
- `createdAt`

Supported message types:

- `text`
- `quick-question`
- `assistant-answer`
- `fallback`
- `system-message`
- `CTA`
- `form`
- `form-submission`
- `error`

## Event-Tracking Model

Assistant session events are stored separately with:

- `eventId`
- `conversationId`
- `eventType`
- `eventTimestamp`
- `pageUrl`
- `relatedMessageId`
- `relatedKnowledgeEntryId`
- `relatedCTA`
- `metadata`

Tracked event types include:

- Widget displayed
- Widget opened
- Conversation started
- Welcome message displayed
- Quick question clicked
- User message sent
- Knowledge answer matched
- Fallback response used
- CTA displayed
- CTA clicked
- Widget minimised
- Widget closed
- Widget reopened
- Page changed
- Session resumed
- Conversation ended
- Browser refreshed
- API error occurred

## Conversation Lifecycle Rules

- A conversation starts when the user sends the first message, clicks a quick question, or uses a guided assistant action.
- Widget display is tracked separately from conversation start.
- Closing the widget does not immediately destroy history.
- The same visitor can resume within the configured session window.
- Conversation status values:
  - `new`
  - `active`
  - `inactive`
  - `closed`
  - `converted`
  - `abandoned`
  - `error`

## Admin Conversation Module

The Admin Panel now includes `AI Conversations`, which provides:

- Conversation list with search, filters, sort, and pagination
- Complete message timeline
- Session events timeline
- Conversation status updates
- Admin notes
- Conversation deletion with confirmation
- Export of conversations and unmatched questions
- Retention / privacy settings
- Analytics dashboard
- Knowledge usage analytics

## Unmatched-Question Workflow

Unmatched or low-confidence questions are stored with:

- Original question
- Normalised question
- ConversationId
- VisitorId
- Date and time
- Page URL
- Suggested category
- Match candidates
- Highest rejected score
- Times asked
- Review status
- Linked knowledge entry after resolution

Admins can:

- View unmatched questions
- Search and filter them
- Mark them reviewed or ignored
- Link them to an existing answer
- Convert them into a new Knowledge Base entry
- Add alternatives and keywords during conversion

## Analytics Calculations

The analytics view aggregates:

- Total widget opens
- Total conversations started
- Active conversations
- Closed conversations
- Abandoned conversations
- Total messages
- Average messages per conversation
- Average response time
- Average conversation duration
- Match success rate
- Fallback rate
- Most asked questions
- Most used categories
- Most used modules
- Top unmatched questions
- CTA click rate
- Demo-request rate
- Lead-conversion rate
- Returning visitor count
- Conversations by device
- Conversations by page
- Conversations by date

Selectable date ranges are supported:

- Today
- Last 7 days
- Last 30 days
- Custom range

## API Endpoints

Public assistant APIs:

- `POST /api/assistant/conversations/start-or-resume`
- `POST /api/assistant/messages`
- `POST /api/assistant/events`
- `POST /api/assistant/end`
- `POST /api/assistant/match`
- `GET /api/assistant/knowledge`

Protected admin APIs:

- `GET /api/admin/assistant/conversations`
- `GET /api/admin/assistant/conversations/:conversationId`
- `GET /api/admin/assistant/conversations/:conversationId/messages`
- `GET /api/admin/assistant/conversations/:conversationId/events`
- `PATCH /api/admin/assistant/conversations/:conversationId`
- `POST /api/admin/assistant/conversations/:conversationId/notes`
- `DELETE /api/admin/assistant/conversations/:conversationId`
- `GET /api/admin/assistant/unmatched`
- `PATCH /api/admin/assistant/unmatched/:id`
- `POST /api/admin/assistant/unmatched/:id/convert`
- `GET /api/admin/assistant/export/conversations`
- `GET /api/admin/assistant/export/unmatched`
- `GET /api/admin/assistant/analytics`
- `GET /api/admin/assistant/analytics/knowledge`
- `GET /api/admin/assistant/settings`
- `PATCH /api/admin/assistant/settings`

Knowledge-base APIs remain under `backend/src/routes/aiKnowledgeRoutes.js`.

## CSV Import Format

Required fields:

- `category`
- `primaryQuestion`
- `alternativeQuestions`
- `keywords`
- `answer`
- `ctaLabel`
- `ctaTarget`
- `priority`
- `isEnabled`

Notes:

- Use `|` to separate `alternativeQuestions` and `keywords`.
- Rows are validated before import.
- Invalid rows are reported with row-level errors.
- Duplicate entries are rejected after normalization.

## Privacy and Retention Controls

Configured in `AssistantSettings`:

- Conversation inactivity timeout
- Session resume window
- Data retention period
- Whether anonymous technical metadata is collected
- Whether IP logging is enabled
- Whether exports are allowed

Defaults are privacy-safe:

- Technical metadata collection: off
- IP logging: off
- Exporting: on
- Retention: 90 days

The assistant avoids storing sensitive personal data, and public endpoints are rate-limited.

## Completed Phase 2 Work

- Added MongoDB conversation tracking
- Added per-message persistence
- Added session event tracking
- Added unmatched-question tracking
- Added admin conversation list and detail view
- Added analytics summary endpoints and UI
- Added knowledge-usage analytics
- Added retention settings
- Kept the assistant manual and approved-only
- Kept the current white Beta widget design and single close control

## Phase 3 Next Steps

- Guided recommendations
- Lead capture from assistant conversations
- Conversation reporting exports and automations

