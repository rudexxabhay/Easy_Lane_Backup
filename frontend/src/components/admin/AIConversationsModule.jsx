import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3, BookMarked, Download, Eye, Filter, MessageSquare, Search, X,
} from 'lucide-react';
import { api, clearAdminAuthToken, readAdminAuthToken } from '../../lib/api.js';
import { navigate } from '../../lib/router.js';

const conversationStatuses = ['new', 'active', 'inactive', 'closed', 'converted', 'abandoned', 'error'];
const categories = ['General', 'TMS', 'Fleet', 'AMS', 'Finance', 'Tracking', 'Integrations', 'Industries', 'Security', 'Pricing', 'Demo', 'Support'];
const tabs = [
  { key: 'conversations', label: 'Conversations', icon: MessageSquare },
  { key: 'unmatched', label: 'Unmatched Questions', icon: BookMarked },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Retention', icon: Filter },
];

const emptyConversationFilters = {
  search: '',
  status: '',
  category: '',
  intent: '',
  device: '',
  lead: '',
  matched: '',
  unmatched: '',
  sort: 'newest',
  dateRange: '30d',
  startDate: '',
  endDate: '',
  page: 1,
};

const emptyUnmatchedFilters = {
  search: '',
  reviewStatus: '',
  category: '',
  page: 1,
};

function fmt(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

function durationLabel(seconds = 0) {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remaining = total % 60;
  return [hours ? `${hours}h` : '', minutes ? `${minutes}m` : '', `${remaining}s`].filter(Boolean).join(' ');
}

function StatCard({ label, value, hint }) {
  return <div className="rounded-[14px] border border-slate-100 bg-white p-4 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>{hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}</div>;
}

function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone] || tones.slate}`}>{children}</span>;
}

function Section({ title, children, action }) {
  return <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-slate-900">{title}</h2></div>{action}</div>{children}</section>;
}

function TimelineRow({ item }) {
  const isUser = item.kind === 'user';
  const isAssistant = item.kind === 'assistant';
  const isSystem = item.kind === 'system';
  const isEvent = item.kind === 'event';
  const tone = isUser ? 'blue' : isAssistant ? 'green' : isEvent ? 'amber' : isSystem ? 'purple' : 'slate';
  return <div className="flex gap-3 rounded-[14px] border border-slate-100 bg-white p-4 shadow-sm"><div className="mt-1"><Badge tone={tone}>{item.label}</Badge></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{fmt(item.timestamp)}</span>{item.pageUrl && <span className="truncate">{item.pageUrl}</span>}</div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.text}</p>{item.meta && <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">{item.meta}</div>}</div></div>;
}

function CsvLine(values = []) {
  return values.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',');
}

function getDateRangeParams(filters) {
  if (filters.dateRange === 'custom') {
    return {
      ...(filters.startDate ? { startDate: filters.startDate } : {}),
      ...(filters.endDate ? { endDate: filters.endDate } : {}),
    };
  }
  const end = new Date();
  const start = new Date();
  if (filters.dateRange === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (filters.dateRange === '7d') {
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (filters.dateRange === '30d') {
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
  }
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

export default function AIConversationsModule() {
  const [tab, setTab] = useState('conversations');
  const [conversationState, setConversationState] = useState({
    conversations: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    summary: { totalConversations: 0, activeConversations: 0, matchedQuestions: 0, unmatchedQuestions: 0, averageDurationSeconds: 0, totalMessages: 0 },
  });
  const [conversationLoading, setConversationLoading] = useState(true);
  const [conversationError, setConversationError] = useState('');
  const [filters, setFilters] = useState(emptyConversationFilters);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [detailState, setDetailState] = useState({ loading: false, error: '', data: null });
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [knowledgeUsage, setKnowledgeUsage] = useState([]);
  const [unmatchedState, setUnmatchedState] = useState({ items: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } });
  const [unmatchedFilters, setUnmatchedFilters] = useState(emptyUnmatchedFilters);
  const [unmatchedLoading, setUnmatchedLoading] = useState(false);
  const [unmatchedError, setUnmatchedError] = useState('');
  const [settings, setSettings] = useState({
    inactivityTimeoutMinutes: 30,
    sessionResumeWindowMinutes: 180,
    dataRetentionDays: 90,
    collectTechnicalMetadata: false,
    logIpAddress: false,
    allowExports: true,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [notice, setNotice] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const request = (path, options = {}) => api(path, options);
  const isAuthProblem = (error) => error?.status === 401 || /authentication required|invalid session|session expired/i.test(error?.message || '');
  const isForbidden = (error) => error?.status === 403;

  const conversationQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.search.trim()) params.set('search', filters.search.trim());
    if (filters.status) params.set('status', filters.status);
    if (filters.category) params.set('category', filters.category);
    if (filters.intent) params.set('intent', filters.intent);
    if (filters.device) params.set('device', filters.device);
    if (filters.lead) params.set('lead', filters.lead);
    if (filters.matched) params.set('matched', filters.matched);
    if (filters.unmatched) params.set('unmatched', filters.unmatched);
    if (filters.sort) params.set('sort', filters.sort);
    const dateParams = getDateRangeParams(filters);
    Object.entries(dateParams).forEach(([key, value]) => params.set(key, value));
    params.set('page', String(filters.page));
    params.set('limit', '10');
    return params.toString();
  }, [filters]);

  const unmatchedQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (unmatchedFilters.search.trim()) params.set('search', unmatchedFilters.search.trim());
    if (unmatchedFilters.reviewStatus) params.set('reviewStatus', unmatchedFilters.reviewStatus);
    if (unmatchedFilters.category) params.set('category', unmatchedFilters.category);
    params.set('page', String(unmatchedFilters.page));
    params.set('limit', '10');
    return params.toString();
  }, [unmatchedFilters]);

  const loadConversations = useCallback(async () => {
    setConversationLoading(true);
    setConversationError('');
    try {
      const response = await request(`/admin/ai-conversations?${conversationQuery}`);
      const data = response?.data || response || {};
      setConversationState({
        conversations: Array.isArray(data.conversations) ? data.conversations : Array.isArray(data.items) ? data.items : [],
        pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
        summary: data.summary || data.analytics?.totals || {
          totalConversations: 0,
          activeConversations: 0,
          matchedQuestions: 0,
          unmatchedQuestions: 0,
          averageDurationSeconds: 0,
          totalMessages: 0,
        },
      });
    } catch (error) {
      if (isAuthProblem(error)) {
        clearAdminAuthToken();
        navigate('/admin/login');
        return;
      }
      setConversationError(error?.message || 'Unable to load AI conversations.');
    } finally {
      setConversationLoading(false);
    }
  }, [conversationQuery]);

  const loadUnmatched = useCallback(async () => {
    setUnmatchedLoading(true);
    setUnmatchedError('');
    try {
      const response = await request(`/admin/assistant/unmatched?${unmatchedQuery}`);
      const data = response?.data || response || {};
      setUnmatchedState({
        items: Array.isArray(data.items) ? data.items : [],
        pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
      });
    } catch (error) {
      if (isAuthProblem(error)) {
        clearAdminAuthToken();
        navigate('/admin/login');
        return;
      }
      setUnmatchedError(error?.message || 'Unable to load unmatched questions.');
    } finally {
      setUnmatchedLoading(false);
    }
  }, [unmatchedQuery]);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const dateParams = new URLSearchParams(getDateRangeParams(filters)).toString();
      const [summaryResponse, usageResponse, settingsResponse] = await Promise.all([
        request(`/admin/ai-conversations-analytics?${dateParams}`),
        request('/admin/assistant/analytics/knowledge?sort=most-used'),
        request('/admin/assistant/settings'),
      ]);
      const summaryData = summaryResponse?.data || summaryResponse || {};
      setAnalytics(summaryData);
      setKnowledgeUsage(Array.isArray(usageResponse?.data?.items || usageResponse?.items) ? (usageResponse?.data?.items || usageResponse?.items) : []);
      setSettings((current) => settingsResponse?.data?.settings || settingsResponse?.settings || current);
    } catch (error) {
      if (isAuthProblem(error)) {
        clearAdminAuthToken();
        navigate('/admin/login');
        return;
      }
      setAnalyticsError(error?.message || 'Unable to load analytics.');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [filters]);

  const loadConversationDetails = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setDetailState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await request(`/admin/ai-conversations/${conversationId}`);
      const data = response?.data || response || {};
      setDetailState({ loading: false, error: '', data });
    } catch (error) {
      if (isAuthProblem(error)) {
        clearAdminAuthToken();
        navigate('/admin/login');
        return;
      }
      setDetailState((current) => ({ ...current, loading: false, error: error?.message || 'Unable to load conversation details.', data: current.data }));
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        if (tab === 'conversations') await loadConversations();
        if (tab === 'unmatched') await loadUnmatched();
        if (tab === 'analytics' || tab === 'settings') await loadAnalytics();
        if (active) setNotice('');
      } catch (error) {
        if (active) setNotice(error?.message || 'Unable to load AI conversations.');
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [tab, loadConversations, loadUnmatched, loadAnalytics, refreshTick]);

  useEffect(() => {
    if (!selectedConversation?.conversationId) return;
    loadConversationDetails(selectedConversation.conversationId);
  }, [selectedConversation?.conversationId, loadConversationDetails]);

  const refresh = () => setRefreshTick((tick) => tick + 1);

  const openConversation = async (item) => {
    setSelectedConversation(item);
    await loadConversationDetails(item.conversationId);
  };

  const updateConversation = async (payload) => {
    if (!selectedConversation?.conversationId) return;
    await request(`/admin/ai-conversations/${selectedConversation.conversationId}/status`, { method: 'PATCH', body: payload });
    setNotice('Conversation saved.');
    await loadConversationDetails(selectedConversation.conversationId);
    await loadConversations();
  };

  const addNote = async () => {
    if (!selectedConversation?.conversationId) return;
    const body = window.prompt('Add an admin note');
    if (!body?.trim()) return;
    await request(`/admin/ai-conversations/${selectedConversation.conversationId}/notes`, { method: 'PATCH', body: { body } });
    setNotice('Note added.');
    await loadConversationDetails(selectedConversation.conversationId);
  };

  const deleteConversation = async () => {
    if (!selectedConversation?.conversationId) return;
    if (!window.confirm(`Delete conversation ${selectedConversation.conversationId}? This cannot be undone.`)) return;
    await request(`/admin/ai-conversations/${selectedConversation.conversationId}`, { method: 'DELETE' });
    setSelectedConversation(null);
    setDetailState({ loading: false, error: '', data: null });
    await loadConversations();
  };

  const exportConversations = async (format = 'csv') => {
    const response = await request(`/admin/assistant/export/conversations?format=${format}`);
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(response?.data || response, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'easy-lane-assistant-conversations.json';
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'easy-lane-assistant-conversations.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportUnmatched = async (format = 'csv') => {
    const response = await request(`/admin/assistant/export/unmatched?format=${format}`);
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(response?.data || response, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'easy-lane-unmatched-questions.json';
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'easy-lane-unmatched-questions.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const updateSettings = async () => {
    const response = await request('/admin/assistant/settings', { method: 'PATCH', body: settings });
    setSettings(response?.data?.settings || response?.settings || settings);
    setNotice('Retention settings saved.');
  };

  const list = conversationState.conversations || [];
  const pagination = conversationState.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
  const summary = conversationState.summary || {};
  const detail = detailState.data || {};
  const currentConversation = detail.conversation || selectedConversation;
  const conversationTimeline = useMemo(() => {
    if (!detail) return [];
    const messages = (detail.messages || []).map((message) => ({
      kind: message.sender,
      label: message.sender === 'user' ? (message.messageType === 'quick-question' ? 'Quick Question' : 'User Message') : message.sender === 'assistant' ? (message.messageType === 'fallback' ? 'Fallback' : 'Assistant Answer') : 'System Message',
      timestamp: message.sentAt,
      pageUrl: message.metadata?.context?.pageUrl || '',
      text: message.messageText,
      meta: (
        <>
          <span>Type: {message.messageType}</span>
          <span>Score: {message.matchingScore || 0}</span>
          <span>Confidence: {Math.round((message.matchingConfidence || 0) * 100)}%</span>
          <span>Fallback: {message.fallbackUsed ? 'Yes' : 'No'}</span>
          {message.knowledgeEntryId && <span>Knowledge ID: {message.knowledgeEntryId}</span>}
        </>
      ),
    }));
    const events = (detail.events || []).map((event) => ({
      kind: 'event',
      label: String(event.eventType || '').replaceAll('_', ' '),
      timestamp: event.eventTimestamp,
      pageUrl: event.pageUrl,
      text: `${event.relatedCTA?.label ? `CTA: ${event.relatedCTA.label}` : ''}`.trim() || 'Session event',
      meta: (
        <>
          <span>Related message: {event.relatedMessageId || '—'}</span>
          <span>Knowledge entry: {event.relatedKnowledgeEntryId || '—'}</span>
        </>
      ),
    }));
    const unmatched = (detail.unmatched || []).map((item) => ({
      kind: 'system',
      label: 'Unmatched Question',
      timestamp: item.askedAt,
      pageUrl: item.pageUrl,
      text: item.originalQuestion,
      meta: (
        <>
          <span>Review: {item.reviewStatus || 'new'}</span>
          <span>Times asked: {item.timesAsked || 0}</span>
        </>
      ),
    }));
    return [...messages, ...events, ...unmatched].sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));
  }, [detail]);

  const renderFilters = () => (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
        <Search size={16} className="text-slate-400" />
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} placeholder="Search conversations" className="min-w-0 w-full py-2.5 outline-none" />
      </label>
      <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="">All statuses</option>
        {conversationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
      </select>
      <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="">All categories</option>
        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      <select value={filters.intent} onChange={(event) => setFilters({ ...filters, intent: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="">All intents</option>
        <option value="primary">Primary</option>
        <option value="alternative">Alternative</option>
        <option value="partial">Partial</option>
        <option value="keyword">Keyword</option>
        <option value="fallback">Fallback</option>
      </select>
      <select value={filters.device} onChange={(event) => setFilters({ ...filters, device: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="">All devices</option>
        <option value="desktop">Desktop</option>
        <option value="tablet">Tablet</option>
        <option value="mobile">Mobile</option>
      </select>
      <select value={filters.lead} onChange={(event) => setFilters({ ...filters, lead: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="">Lead</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <select value={filters.matched} onChange={(event) => setFilters({ ...filters, matched: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="">Matched</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <select value={filters.unmatched} onChange={(event) => setFilters({ ...filters, unmatched: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="">Unmatched</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="longest">Longest duration</option>
        <option value="messages">Most messages</option>
      </select>
      <select value={filters.dateRange} onChange={(event) => setFilters({ ...filters, dateRange: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <option value="today">Today</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="custom">Custom range</option>
      </select>
      {filters.dateRange === 'custom' && (
        <>
          <input type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2" />
          <input type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value, page: 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2" />
        </>
      )}
      <button type="button" onClick={() => exportConversations('csv')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white"><Download size={15} /> CSV</button>
      <button type="button" onClick={() => exportConversations('json')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">JSON</button>
      <button type="button" onClick={refresh} className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">Refresh</button>
    </div>
  );

  useEffect(() => {
    if (!readAdminAuthToken()) navigate('/admin/login');
  }, []);

  const renderTopSummary = () => (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">
      <StatCard label="Total Conversations" value={summary.totalConversations || 0} />
      <StatCard label="Active" value={summary.activeConversations || 0} />
      <StatCard label="Matched Questions" value={summary.matchedQuestions || 0} />
      <StatCard label="Unmatched Questions" value={summary.unmatchedQuestions || 0} />
      <StatCard label="Average Duration" value={durationLabel(summary.averageDurationSeconds || 0)} />
      <StatCard label="Total Messages" value={summary.totalMessages || 0} />
    </section>
  );

  const renderConversationTable = () => {
    if (conversationLoading && !list.length) {
      return <div className="grid gap-3 rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm"><div className="h-6 w-40 animate-pulse rounded bg-slate-100" /><div className="h-10 rounded bg-slate-100" /><div className="h-10 rounded bg-slate-100" /><div className="h-10 rounded bg-slate-100" /></div>;
    }
    if (conversationError) {
      return <div className="rounded-[16px] border border-red-100 bg-red-50 p-5 text-red-700 shadow-sm"><h3 className="text-lg font-extrabold">Unable to load AI conversations.</h3><p className="mt-2 text-sm">{conversationError}</p><button type="button" onClick={refresh} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Retry</button></div>;
    }
    if (!list.length) {
      return <div className="rounded-[16px] border border-slate-100 bg-white p-8 text-center shadow-sm"><h3 className="text-lg font-extrabold text-slate-900">No AI conversations yet.</h3><p className="mt-2 text-sm text-slate-500">Conversations will appear here when visitors interact with the Easy Lane assistant.</p></div>;
    }

    return (
      <div className="overflow-x-auto rounded-[16px] border border-slate-100 bg-white shadow-sm">
        <table className="min-w-[1280px] w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {['Conversation ID', 'Visitor', 'Started At', 'Last Activity', 'Duration', 'Messages', 'Matched', 'Unmatched', 'Category', 'Status', 'Device', 'Starting Page', 'Action'].map((label) => <th key={label} className="px-3 py-3">{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.conversationId} className="border-b border-slate-100 align-top">
                <td className="px-3 py-3 font-mono text-xs text-slate-700">{item.conversationId}</td>
                <td className="px-3 py-3">{item.visitorId || '—'}</td>
                <td className="px-3 py-3 whitespace-nowrap">{fmt(item.startedAt)}</td>
                <td className="px-3 py-3 whitespace-nowrap">{fmt(item.lastActivityAt || item.updatedAt)}</td>
                <td className="px-3 py-3">{durationLabel(item.durationSeconds || 0)}</td>
                <td className="px-3 py-3">{item.totalMessageCount || 0}</td>
                <td className="px-3 py-3">{item.matchedQuestions || 0}</td>
                <td className="px-3 py-3">{item.unmatchedQuestions || 0}</td>
                <td className="px-3 py-3">{item.detectedCategory || '—'}</td>
                <td className="px-3 py-3"><Badge tone={item.status === 'active' ? 'green' : item.status === 'closed' ? 'slate' : item.status === 'abandoned' ? 'amber' : item.status === 'error' ? 'red' : 'blue'}>{item.status || 'new'}</Badge></td>
                <td className="px-3 py-3">{item.deviceType || '—'}</td>
                <td className="px-3 py-3 max-w-[18rem] truncate">{item.startPageUrl || '—'}</td>
                <td className="px-3 py-3">
                  <button type="button" onClick={() => openConversation(item)} className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"><Eye size={14} /> View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPagination = () => (
    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{pagination.total || 0} conversations</span>
      <div className="flex items-center gap-2">
        <button type="button" disabled={(pagination.page || 1) <= 1} onClick={() => setFilters({ ...filters, page: Math.max(1, (pagination.page || 1) - 1) })} className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
        <span className="px-2 py-1">{pagination.page || 1} / {pagination.pages || 0}</span>
        <button type="button" disabled={(pagination.page || 1) >= (pagination.pages || 0)} onClick={() => setFilters({ ...filters, page: (pagination.page || 1) + 1 })} className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
      </div>
    </div>
  );

  const renderConversationDetail = () => {
    if (!selectedConversation) return null;
    const conversation = currentConversation || selectedConversation;
    const notes = conversation?.adminNotes || [];
    return (
      <div className="fixed inset-0 z-[80] bg-slate-950/35" onMouseDown={(event) => event.target === event.currentTarget && setSelectedConversation(null)}>
        <aside className="ml-auto flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl">
          <header className="flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Conversation Detail</h3>
              <p className="mt-1 text-xs text-slate-500">{conversation?.conversationId || selectedConversation.conversationId}</p>
            </div>
            <button type="button" onClick={() => setSelectedConversation(null)} className="rounded p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            {detailState.loading ? <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">Loading conversation details…</div> : detailState.error ? <div className="rounded-[16px] border border-red-100 bg-red-50 p-5 text-red-700"><p className="font-semibold">Unable to load conversation.</p><p className="mt-2 text-sm">{detailState.error}</p></div> : (
              <div className="space-y-5">
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Started" value={fmt(conversation?.startedAt)} />
                  <StatCard label="Ended" value={fmt(conversation?.endedAt)} />
                  <StatCard label="Duration" value={durationLabel(conversation?.durationSeconds || 0)} />
                  <StatCard label="Status" value={conversation?.status || 'new'} />
                </section>
                <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="font-extrabold text-slate-900">Conversation Info</h4>
                    <div className="flex gap-2">
                      <button type="button" onClick={addNote} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold">Add Note</button>
                      <button type="button" onClick={deleteConversation} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white">Delete</button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-3"><span className="block text-xs font-semibold text-slate-400">Visitor</span><span className="block font-semibold text-slate-900">{conversation?.visitorId || '—'}</span></div>
                    <div className="rounded-lg bg-slate-50 p-3"><span className="block text-xs font-semibold text-slate-400">Device</span><span className="block font-semibold text-slate-900">{conversation?.deviceType || '—'}</span></div>
                    <div className="rounded-lg bg-slate-50 p-3"><span className="block text-xs font-semibold text-slate-400">Browser</span><span className="block font-semibold text-slate-900">{conversation?.browser || '—'}</span></div>
                    <div className="rounded-lg bg-slate-50 p-3"><span className="block text-xs font-semibold text-slate-400">Operating System</span><span className="block font-semibold text-slate-900">{conversation?.operatingSystem || '—'}</span></div>
                    <div className="rounded-lg bg-slate-50 p-3"><span className="block text-xs font-semibold text-slate-400">Current Page</span><span className="block break-words font-semibold text-slate-900">{conversation?.startPageUrl || '—'}</span></div>
                    <div className="rounded-lg bg-slate-50 p-3"><span className="block text-xs font-semibold text-slate-400">Category / Intent</span><span className="block font-semibold text-slate-900">{conversation?.detectedCategory || '—'} · {conversation?.detectedIntent || '—'}</span></div>
                  </div>
                </section>
                <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm">
                  <h4 className="font-extrabold text-slate-900">Message Timeline</h4>
                  <div className="mt-4 grid gap-3">
                    {conversationTimeline.length ? conversationTimeline.map((item, index) => <TimelineRow key={`${item.label}-${index}`} item={item} />) : <p className="text-sm text-slate-500">No messages recorded.</p>}
                  </div>
                </section>
                <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm">
                  <h4 className="font-extrabold text-slate-900">Admin Notes</h4>
                  <div className="mt-3 grid gap-2">
                    {notes.length ? notes.map((note) => <div key={note._id || note.createdAt || note.body} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{note.body}</div>) : <p className="text-sm text-slate-500">No admin notes yet.</p>}
                  </div>
                </section>
              </div>
            )}
          </div>
        </aside>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {notice && <div className="rounded-[12px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div>}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === key ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>{label}</button>
        ))}
      </div>

      {tab === 'conversations' && (
        <div className="space-y-6">
          {renderTopSummary()}
          <Section title="Conversations" action={<button type="button" onClick={refresh} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold">Refresh</button>}>
            <div className="space-y-4">
              {renderFilters()}
              {renderConversationTable()}
              {renderPagination()}
            </div>
          </Section>
        </div>
      )}

      {tab === 'unmatched' && (
        <Section title="Unmatched Questions" action={<div className="flex gap-2"><button type="button" onClick={() => exportUnmatched('csv')} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white">CSV</button><button type="button" onClick={() => exportUnmatched('json')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold">JSON</button></div>}>
          {unmatchedLoading ? <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">Loading unmatched questions…</div> : unmatchedError ? <div className="rounded-[16px] border border-red-100 bg-red-50 p-5 text-red-700"><p className="font-semibold">Unable to load unmatched questions.</p><p className="mt-2 text-sm">{unmatchedError}</p><button type="button" onClick={refresh} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Retry</button></div> : !unmatchedState.items.length ? <div className="rounded-[16px] border border-slate-100 bg-white p-8 text-center shadow-sm"><h3 className="text-lg font-extrabold text-slate-900">No unmatched questions yet.</h3><p className="mt-2 text-sm text-slate-500">Fallback questions will appear here for review.</p></div> : <div className="grid gap-3">{unmatchedState.items.map((item) => <div key={item._id} className="rounded-[14px] border border-slate-100 bg-white p-4 shadow-sm"><div className="flex flex-wrap items-center gap-2"><Badge tone="amber">{item.reviewStatus || 'new'}</Badge><span className="text-xs text-slate-500">{fmt(item.askedAt)}</span></div><p className="mt-2 font-semibold text-slate-900">{item.originalQuestion}</p><p className="mt-1 text-sm text-slate-600">Conversation: {item.conversationId}</p><p className="mt-1 text-sm text-slate-600">Times asked: {item.timesAsked || 0}</p></div>)}</div>}
        </Section>
      )}

      {tab === 'analytics' && (
        <Section title="Analytics" action={<button type="button" onClick={refresh} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold">Refresh</button>}>
          {analyticsLoading ? <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">Loading analytics…</div> : analyticsError ? <div className="rounded-[16px] border border-red-100 bg-red-50 p-5 text-red-700"><p className="font-semibold">Unable to load analytics.</p><p className="mt-2 text-sm">{analyticsError}</p><button type="button" onClick={refresh} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Retry</button></div> : <div className="space-y-6"><section className="grid grid-cols-2 gap-3 xl:grid-cols-6"><StatCard label="Widget Opens" value={analytics?.totals?.widgetOpens || 0} /><StatCard label="Conversations Started" value={analytics?.totals?.conversationsStarted || 0} /><StatCard label="Active" value={analytics?.totals?.activeConversations || 0} /><StatCard label="Closed" value={analytics?.totals?.closedConversations || 0} /><StatCard label="Abandoned" value={analytics?.totals?.abandonedConversations || 0} /><StatCard label="Total Messages" value={analytics?.totals?.totalMessages || 0} /></section><div className="grid gap-4 lg:grid-cols-2"><div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm"><h4 className="font-extrabold">Most Asked Questions</h4><div className="mt-3 grid gap-2">{(analytics?.mostAskedQuestions || []).slice(0, 10).map((item) => <div key={item.question} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="truncate">{item.question}</span><span className="font-bold text-slate-700">{item.count}</span></div>)}</div></div><div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm"><h4 className="font-extrabold">Top Unmatched Questions</h4><div className="mt-3 grid gap-2">{(analytics?.topUnmatchedQuestions || []).slice(0, 10).map((item) => <div key={item.question} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="truncate">{item.question}</span><span className="font-bold text-slate-700">{item.timesAsked}</span></div>)}</div></div></div><div className="grid gap-4 lg:grid-cols-3"><div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm"><h4 className="font-extrabold">By Device</h4><div className="mt-3 grid gap-2">{Object.entries(analytics?.byDevice || {}).map(([key, value]) => <div key={key} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"><span>{key}</span><span className="font-bold">{value}</span></div>)}</div></div><div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm"><h4 className="font-extrabold">By Page</h4><div className="mt-3 grid gap-2">{Object.entries(analytics?.byPage || {}).slice(0, 10).map(([key, value]) => <div key={key} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="truncate">{key}</span><span className="font-bold">{value}</span></div>)}</div></div><div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm"><h4 className="font-extrabold">By Category</h4><div className="mt-3 grid gap-2">{Object.entries(analytics?.byCategory || {}).map(([key, value]) => <div key={key} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"><span>{key}</span><span className="font-bold">{value}</span></div>)}</div></div></div><div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm"><h4 className="font-extrabold">Knowledge Usage</h4><div className="mt-3 overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="border-b text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-2 py-2">Question</th><th className="px-2 py-2">Matched</th><th className="px-2 py-2">Exact</th><th className="px-2 py-2">Alternative</th><th className="px-2 py-2">Keyword</th><th className="px-2 py-2">CTA</th><th className="px-2 py-2">Last Used</th></tr></thead><tbody>{knowledgeUsage.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="px-2 py-2 font-semibold">{item.primaryQuestion}</td><td className="px-2 py-2">{item.totalMatched}</td><td className="px-2 py-2">{item.exactMatchCount}</td><td className="px-2 py-2">{item.alternativeMatchCount}</td><td className="px-2 py-2">{item.keywordMatchCount}</td><td className="px-2 py-2">{item.ctaClicks}</td><td className="px-2 py-2">{fmt(item.lastUsedAt)}</td></tr>)}</tbody></table></div></div></div>}
        </Section>
      )}

      {tab === 'settings' && (
        <Section title="Retention Settings" action={<button type="button" onClick={updateSettings} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white">Save</button>}>
          {settingsLoading ? <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">Loading settings…</div> : settingsError ? <div className="rounded-[16px] border border-red-100 bg-red-50 p-5 text-red-700"><p className="font-semibold">Unable to load settings.</p><p className="mt-2 text-sm">{settingsError}</p><button type="button" onClick={refresh} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Retry</button></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><label className="grid gap-1 text-sm font-semibold">Inactivity timeout (minutes)<input type="number" min="5" value={settings.inactivityTimeoutMinutes} onChange={(event) => setSettings({ ...settings, inactivityTimeoutMinutes: Number(event.target.value) || 30 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" /></label><label className="grid gap-1 text-sm font-semibold">Resume window (minutes)<input type="number" min="5" value={settings.sessionResumeWindowMinutes} onChange={(event) => setSettings({ ...settings, sessionResumeWindowMinutes: Number(event.target.value) || 180 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" /></label><label className="grid gap-1 text-sm font-semibold">Retention (days)<input type="number" min="1" value={settings.dataRetentionDays} onChange={(event) => setSettings({ ...settings, dataRetentionDays: Number(event.target.value) || 90 })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" /></label><label className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-3 text-sm font-semibold"><span>Collect technical metadata</span><input type="checkbox" checked={Boolean(settings.collectTechnicalMetadata)} onChange={(event) => setSettings({ ...settings, collectTechnicalMetadata: event.target.checked })} /></label><label className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-3 text-sm font-semibold"><span>Log IP address</span><input type="checkbox" checked={Boolean(settings.logIpAddress)} onChange={(event) => setSettings({ ...settings, logIpAddress: event.target.checked })} /></label><label className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-3 text-sm font-semibold"><span>Allow exports</span><input type="checkbox" checked={Boolean(settings.allowExports)} onChange={(event) => setSettings({ ...settings, allowExports: event.target.checked })} /></label></div>}
        </Section>
      )}

      {renderConversationDetail()}
    </div>
  );
}
