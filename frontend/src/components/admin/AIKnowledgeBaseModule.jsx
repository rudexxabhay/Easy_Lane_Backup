import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  XCircle,
} from 'lucide-react';
import { api } from '../../lib/api.js';

const emptyDraft = {
  recordId: '',
  module: 'Easy Lane',
  topic: '',
  subtopic: '',
  contentType: 'FAQ',
  questionTrigger: '',
  approvedAnswer: '',
  keywords: '',
  language: 'ALL',
  priorityLabel: 'Medium',
  active: true,
  sourceOwner: '',
};

function toKeywordString(value = []) {
  return Array.isArray(value) ? value.join(', ') : String(value || '');
}

function normalizeDraft(entry = emptyDraft) {
  return {
    ...emptyDraft,
    ...entry,
    keywords: toKeywordString(entry.keywords),
    active: entry.active !== false && entry.isEnabled !== false,
  };
}

function SummaryCard({ label, value, tone = 'blue' }) {
  const tones = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
  };
  return (
    <article className={`rounded-[16px] border p-4 shadow-sm ${tones[tone] || tones.blue}`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em]">{label}</p>
      <strong className="mt-2 block text-3xl font-extrabold">{value ?? '—'}</strong>
    </article>
  );
}

function StatusPill({ active }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function fieldClass() {
  return 'rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1260ff] focus:ring-2 focus:ring-blue-100';
}

export default function AIKnowledgeBaseModule() {
  const [items, setItems] = useState([]);
  const [imports, setImports] = useState([]);
  const [meta, setMeta] = useState({ modules: [], languages: [], priorities: [], summary: {} });
  const [query, setQuery] = useState({ search: '', module: '', topic: '', language: '', priority: '', status: '', page: 1, sort: 'updatedAt', direction: 'desc' });
  const [result, setResult] = useState({ total: 0, page: 1, pages: 1 });
  const [viewing, setViewing] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [state, setState] = useState({ loading: true, saving: false, publishing: false, error: '', message: '' });
  const fileInputRef = useRef(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(query.page),
      limit: '12',
      sort: query.sort,
      direction: query.direction,
    });
    if (query.search.trim()) params.set('search', query.search.trim());
    if (query.module) params.set('module', query.module);
    if (query.topic.trim()) params.set('topic', query.topic.trim());
    if (query.language) params.set('language', query.language);
    if (query.priority) params.set('priority', query.priority);
    if (query.status) params.set('status', query.status);
    return params.toString();
  }, [query]);

  const load = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const [list, importResult] = await Promise.all([
        api(`/admin/chatbot/knowledge?${queryString}`),
        api('/admin/chatbot/knowledge/imports'),
      ]);
      setItems(Array.isArray(list.items) ? list.items : []);
      setResult({ total: list.total || 0, page: list.page || 1, pages: list.pages || 1 });
      setMeta({
        modules: list.modules || [],
        languages: list.languages || [],
        priorities: list.priorities || [],
        summary: list.summary || {},
      });
      setImports(Array.isArray(importResult.items) ? importResult.items : []);
      setState((current) => ({ ...current, loading: false }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message || 'Unable to load knowledge base.' }));
    }
  };

  useEffect(() => { load(); }, [queryString]);

  const downloadTemplate = async () => {
    try {
      const response = await api('/admin/chatbot/knowledge/template');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'EasyLane_Knowledge_Base_Template.xlsx';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      setState((current) => ({ ...current, error: error.message || 'Unable to download template.' }));
    }
  };

  const openCreate = () => {
    setEditingId('');
    setViewing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setViewing(item);
    setDraft(normalizeDraft(item));
    setFormOpen(true);
  };

  const openView = (item) => {
    setViewing(item);
    setFormOpen(false);
  };

  const saveDraft = async (event) => {
    event.preventDefault();
    if (state.saving) return;
    setState((current) => ({ ...current, saving: true, error: '', message: '' }));
    try {
      const payload = {
        ...draft,
        keywords: draft.keywords,
      };
      const response = await api(editingId ? `/admin/chatbot/knowledge/${editingId}` : '/admin/chatbot/knowledge', {
        method: editingId ? 'PUT' : 'POST',
        body: payload,
      });
      setViewing(response);
      setFormOpen(false);
      setState({ loading: false, saving: false, publishing: false, error: '', message: editingId ? 'Knowledge record updated.' : 'Knowledge record created.' });
      load();
    } catch (error) {
      setState((current) => ({ ...current, saving: false, error: error.message || 'Unable to save knowledge record.' }));
    }
  };

  const toggleActive = async (item) => {
    try {
      await api(`/admin/chatbot/knowledge/${item.id}`, {
        method: 'PUT',
        body: {
          ...item,
          active: !item.active,
          keywords: toKeywordString(item.keywords),
        },
      });
      load();
    } catch (error) {
      setState((current) => ({ ...current, error: error.message || 'Unable to update status.' }));
    }
  };

  const deleteRecord = async (item) => {
    if (!window.confirm(`Delete this knowledge record?\n\nThis will remove it from future chatbot knowledge.`)) return;
    try {
      await api(`/admin/chatbot/knowledge/${item.id}`, { method: 'DELETE' });
      setViewing((current) => (current?.id === item.id ? null : current));
      setState((current) => ({ ...current, message: 'Knowledge record deleted.', error: '' }));
      load();
    } catch (error) {
      setState((current) => ({ ...current, error: error.message || 'Unable to delete knowledge record.' }));
    }
  };

  const uploadWorkbook = async (file) => {
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) {
      setState((current) => ({ ...current, error: 'Only .xlsx knowledge base files are supported.' }));
      return;
    }
    setState((current) => ({ ...current, error: '', message: '' }));
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let index = 0; index < bytes.byteLength; index += 1) binary += String.fromCharCode(bytes[index]);
      const contentBase64 = btoa(binary);
      const response = await api('/admin/chatbot/knowledge/upload', {
        method: 'POST',
        body: { fileName: file.name, contentBase64 },
      });
      setPreview(response);
      setState((current) => ({ ...current, message: response.canPublish ? 'Workbook validated. Review the preview before publishing.' : 'Workbook validation failed. Review the errors below.' }));
      load();
    } catch (error) {
      setPreview(null);
      setState((current) => ({ ...current, error: error.message || 'Unable to validate workbook.' }));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const publishPreview = async () => {
    if (!preview?.importId || state.publishing) return;
    setState((current) => ({ ...current, publishing: true, error: '', message: '' }));
    try {
      const response = await api('/admin/chatbot/knowledge/publish', {
        method: 'POST',
        body: { importId: preview.importId },
      });
      setState({
        loading: false,
        saving: false,
        publishing: false,
        error: response.publishErrors?.length ? response.publishErrors.join(' ') : '',
        message: response.success ? 'Knowledge Base published successfully.' : 'Knowledge Base published with some record-level errors.',
      });
      setPreview(null);
      load();
    } catch (error) {
      setState((current) => ({ ...current, publishing: false, error: error.message || 'Unable to publish knowledge base.' }));
    }
  };

  return (
    <section className="grid gap-6">
      <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Chatbot Knowledge Base</h2>
            <p className="mt-1 text-sm text-slate-500">Manage the information used by the Easy Lane chatbot.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <Download size={15} /> Download Template
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white">
              <Upload size={15} /> Upload Knowledge Base
            </button>
            <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={(event) => uploadWorkbook(event.target.files?.[0])} />
            <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white">
              <Plus size={15} /> Add Knowledge
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Knowledge Records" value={meta.summary?.totalKnowledgeRecords || 0} tone="blue" />
          <SummaryCard label="Active Records" value={meta.summary?.activeRecords || 0} tone="emerald" />
          <SummaryCard label="Inactive Records" value={meta.summary?.inactiveRecords || 0} tone="amber" />
          <SummaryCard label="Last Published" value={meta.summary?.lastPublished ? new Date(meta.summary.lastPublished).toLocaleDateString() : '—'} tone="slate" />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input value={query.search} onChange={(event) => setQuery({ ...query, search: event.target.value, page: 1 })} placeholder="Search" className="min-w-0 w-full outline-none" />
          </label>
          <select value={query.module} onChange={(event) => setQuery({ ...query, module: event.target.value, page: 1 })} className={fieldClass()}>
            <option value="">All Modules</option>
            {meta.modules.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input value={query.topic} onChange={(event) => setQuery({ ...query, topic: event.target.value, page: 1 })} placeholder="Topic" className={fieldClass()} />
          <select value={query.language} onChange={(event) => setQuery({ ...query, language: event.target.value, page: 1 })} className={fieldClass()}>
            <option value="">All Languages</option>
            {meta.languages.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={query.priority} onChange={(event) => setQuery({ ...query, priority: event.target.value, page: 1 })} className={fieldClass()}>
            <option value="">All Priorities</option>
            {meta.priorities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={query.status} onChange={(event) => setQuery({ ...query, status: event.target.value, page: 1 })} className={fieldClass()}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {state.error && <p role="alert" className="mt-4 rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
        {state.message && <p role="status" className="mt-4 rounded-[10px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</p>}
      </div>

      {preview && (
        <section className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Validation Preview</h3>
              <p className="mt-1 text-sm text-slate-500">File: {preview.fileName}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setPreview(null)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
              <button type="button" disabled={!preview.canPublish || state.publishing} onClick={publishPreview} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                {state.publishing ? 'Publishing…' : 'Publish Knowledge Base'}
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Total Rows" value={preview.summary?.totalRows || 0} />
            <SummaryCard label="Valid" value={preview.summary?.validRecords || 0} tone="emerald" />
            <SummaryCard label="Warnings" value={preview.summary?.warningCount || 0} tone="amber" />
            <SummaryCard label="Errors" value={preview.summary?.errorCount || 0} tone="slate" />
          </div>

          {(preview.errors?.length || preview.warnings?.length) > 0 && (
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[14px] border border-red-100 bg-red-50 p-4">
                <h4 className="font-extrabold text-red-700">Errors</h4>
                <ul className="mt-2 space-y-2 text-sm text-red-700">
                  {(preview.errors || []).map((message) => <li key={message}>• {message}</li>)}
                </ul>
              </div>
              <div className="rounded-[14px] border border-amber-100 bg-amber-50 p-4">
                <h4 className="font-extrabold text-amber-700">Warnings</h4>
                <ul className="mt-2 space-y-2 text-sm text-amber-700">
                  {(preview.warnings || []).length ? (preview.warnings || []).map((message) => <li key={message}>• {message}</li>) : <li>• No warnings</li>}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-5 max-h-[420px] overflow-auto rounded-[14px] border border-slate-200">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {['Sheet', 'Row', 'Status', 'Record ID', 'Module', 'Topic', 'Message'].map((label) => <th key={label} className="px-3 py-2">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {(preview.previewRows || []).map((row, index) => (
                  <tr key={`${row.sheet}-${row.rowNumber}-${index}`} className="border-b last:border-0">
                    <td className="px-3 py-2">{row.sheet}</td>
                    <td className="px-3 py-2">{row.rowNumber}</td>
                    <td className="px-3 py-2 capitalize">{row.status}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.recordId || '—'}</td>
                    <td className="px-3 py-2">{row.module || '—'}</td>
                    <td className="px-3 py-2">{row.topic || '—'}</td>
                    <td className="px-3 py-2 text-slate-500">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_.9fr]">
        <section className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Knowledge Records</h3>
              <p className="mt-1 text-sm text-slate-500">Search, filter and manage approved chatbot knowledge.</p>
            </div>
          </div>

          <div className="mt-5 max-w-full overflow-x-auto">
            {state.loading ? (
              <div className="grid min-h-48 place-items-center text-sm text-slate-500">Loading knowledge records…</div>
            ) : (
              <table className="w-full min-w-[1280px] text-left text-sm">
                <thead className="border-b text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {['Record ID', 'Module', 'Topic', 'Subtopic', 'Content Type', 'Question / Trigger', 'Knowledge / Answer', 'Language', 'Priority', 'Status', 'Last Updated', 'Actions'].map((label) => <th key={label} className="px-2 py-3">{label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 align-top">
                      <td className="px-2 py-3 font-mono text-xs">{item.recordId}</td>
                      <td className="px-2 py-3">{item.module}</td>
                      <td className="px-2 py-3 font-semibold text-slate-900">{item.topic}</td>
                      <td className="px-2 py-3 text-slate-500">{item.subtopic || '—'}</td>
                      <td className="px-2 py-3 text-slate-500">{item.contentType}</td>
                      <td className="px-2 py-3">
                        <div className="max-w-[18rem] truncate font-medium text-slate-800">{item.questionTrigger}</div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="max-w-[20rem] truncate text-slate-500">{item.approvedAnswer}</div>
                      </td>
                      <td className="px-2 py-3">{item.language}</td>
                      <td className="px-2 py-3">{item.priorityLabel}</td>
                      <td className="px-2 py-3"><StatusPill active={item.active} /></td>
                      <td className="px-2 py-3 text-slate-500">{formatDate(item.updatedAt || item.lastUpdatedLabel)}</td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => openView(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
                            <Eye size={14} /> View
                          </button>
                          <button type="button" onClick={() => openEdit(item)} className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                            <Pencil size={14} /> Edit
                          </button>
                          <button type="button" onClick={() => toggleActive(item)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
                            {item.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button type="button" onClick={() => deleteRecord(item)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!items.length && (
                    <tr>
                      <td colSpan="12" className="py-10 text-center text-slate-500">No knowledge records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span>{result.total} records</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={result.page <= 1} onClick={() => setQuery({ ...query, page: query.page - 1 })} className="rounded border px-3 py-1 disabled:opacity-40">Previous</button>
              <span className="px-2 py-1">{result.page} / {result.pages}</span>
              <button type="button" disabled={result.page >= result.pages} onClick={() => setQuery({ ...query, page: query.page + 1 })} className="rounded border px-3 py-1 disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>

        <div className="grid gap-6">
          {formOpen ? (
            <form onSubmit={saveDraft} className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{editingId ? 'Edit Knowledge' : 'Add Knowledge'}</h3>
                  <p className="mt-1 text-sm text-slate-500">Manually create or update a chatbot knowledge record.</p>
                </div>
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-50">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <input value={draft.recordId} onChange={(event) => setDraft({ ...draft, recordId: event.target.value })} placeholder="Record ID" className={fieldClass()} />
                <select value={draft.module} onChange={(event) => setDraft({ ...draft, module: event.target.value })} className={fieldClass()}>
                  {meta.modules.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <input value={draft.topic} onChange={(event) => setDraft({ ...draft, topic: event.target.value })} placeholder="Topic" className={fieldClass()} />
                <input value={draft.subtopic} onChange={(event) => setDraft({ ...draft, subtopic: event.target.value })} placeholder="Subtopic" className={fieldClass()} />
                <input value={draft.contentType} onChange={(event) => setDraft({ ...draft, contentType: event.target.value })} placeholder="Content Type" className={fieldClass()} />
                <textarea rows="3" value={draft.questionTrigger} onChange={(event) => setDraft({ ...draft, questionTrigger: event.target.value })} placeholder="Question / Trigger" className={fieldClass()} />
                <textarea rows="6" value={draft.approvedAnswer} onChange={(event) => setDraft({ ...draft, approvedAnswer: event.target.value })} placeholder="Approved Answer" className={fieldClass()} />
                <textarea rows="2" value={draft.keywords} onChange={(event) => setDraft({ ...draft, keywords: event.target.value })} placeholder="Keywords (comma-separated)" className={fieldClass()} />
                <select value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value })} className={fieldClass()}>
                  {meta.languages.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={draft.priorityLabel} onChange={(event) => setDraft({ ...draft, priorityLabel: event.target.value })} className={fieldClass()}>
                  {meta.priorities.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <input value={draft.sourceOwner} onChange={(event) => setDraft({ ...draft, sourceOwner: event.target.value })} placeholder="Source / Owner" className={fieldClass()} />
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
                  Active
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button disabled={state.saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                  <CheckCircle2 size={15} /> {state.saving ? 'Saving…' : 'Save Knowledge'}
                </button>
                <button type="button" onClick={() => { setFormOpen(false); setEditingId(''); setDraft(emptyDraft); }} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <section className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-extrabold text-slate-900">{viewing ? 'Knowledge Details' : 'Manual Entry'}</h3>
              {viewing ? (
                <div className="mt-4 grid gap-3 text-sm">
                  <div><strong>Record ID:</strong> {viewing.recordId}</div>
                  <div><strong>Module:</strong> {viewing.module}</div>
                  <div><strong>Topic:</strong> {viewing.topic}</div>
                  <div><strong>Subtopic:</strong> {viewing.subtopic || '—'}</div>
                  <div><strong>Content Type:</strong> {viewing.contentType}</div>
                  <div><strong>Language:</strong> {viewing.language}</div>
                  <div><strong>Priority:</strong> {viewing.priorityLabel}</div>
                  <div><strong>Status:</strong> {viewing.active ? 'Active' : 'Inactive'}</div>
                  <div><strong>Source / Owner:</strong> {viewing.sourceOwner || '—'}</div>
                  <div><strong>Keywords:</strong> {(viewing.keywords || []).join(', ') || '—'}</div>
                  <div><strong>Question / Trigger:</strong><p className="mt-1 whitespace-pre-wrap text-slate-600">{viewing.questionTrigger}</p></div>
                  <div><strong>Approved Answer:</strong><p className="mt-1 whitespace-pre-wrap text-slate-600">{viewing.approvedAnswer}</p></div>
                  <div><strong>Response Variants:</strong> {(viewing.responseVariants || []).length || 0}</div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => openEdit(viewing)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
                      <Pencil size={15} /> Edit
                    </button>
                    <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                      <Plus size={15} /> Add Knowledge
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-slate-500">Create records manually when you do not want to upload Excel.</p>
                  <button type="button" onClick={openCreate} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
                    <Plus size={15} /> Add Knowledge
                  </button>
                </>
              )}
            </section>
          )}

          <section className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-extrabold text-slate-900">Recent Uploads</h3>
            <div className="mt-4 space-y-3">
              {imports.length ? imports.map((item) => (
                <article key={item.id} className="rounded-[14px] border border-slate-100 bg-slate-50 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-slate-900">{item.fileName}</strong>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700' : item.status === 'validated' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-500">{formatDate(item.uploadedAt)}</p>
                  <p className="mt-2 text-slate-600">{item.totalRows} rows • {item.createdCount} created • {item.updatedCount} updated • {item.errorCount} errors</p>
                </article>
              )) : <p className="text-sm text-slate-500">No imports yet.</p>}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
