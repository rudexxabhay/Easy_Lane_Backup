import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';
import { api } from '../../lib/api.js';

const CATEGORIES = ['General', 'TMS', 'Fleet', 'AMS', 'Finance', 'Tracking', 'Integrations', 'Industries', 'Security', 'Pricing', 'Demo', 'Support'];
const emptyEntry = {
  category: 'General',
  primaryQuestion: '',
  alternativeQuestions: [],
  keywords: [],
  answer: '',
  ctaLabel: '',
  ctaTarget: '',
  priority: 100,
  isEnabled: true,
};

function csvTemplate() {
  return [
    ['category', 'primaryQuestion', 'alternativeQuestions', 'keywords', 'answer', 'ctaLabel', 'ctaTarget', 'priority', 'isEnabled'].join(','),
    ['General', 'What is Easy Lane?', 'Tell me about Easy Lane|Explain Easy Lane', 'easy lane|logistics platform', 'Easy Lane is a logistics platform.', 'Explore Easy Lane', '#solutions', '100', 'true'].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','),
  ].join('\n');
}

function toArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  return String(value || '').split(/\r?\n|,|;/g).map((item) => item.trim()).filter(Boolean);
}

function normalizeDraft(entry = emptyEntry) {
  return {
    ...emptyEntry,
    ...entry,
    alternativeQuestions: toArray(entry.alternativeQuestions),
    keywords: toArray(entry.keywords),
    priority: Number.isFinite(Number(entry.priority)) ? Number(entry.priority) : 100,
    isEnabled: entry.isEnabled !== false,
  };
}

function downloadText(filename, text, type = 'text/plain') {
  const blob = new Blob([text], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function ChipInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const addValue = (raw) => {
    const next = String(raw || '').trim();
    if (!next) return;
    const nextValues = [...values, next].filter(Boolean);
    const unique = [...new Set(nextValues.map((item) => item.trim()))];
    onChange(unique);
    setInput('');
  };
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <div className="rounded-xl border border-slate-200 bg-white p-2.5">
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <span key={item} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {item}
              <button type="button" onClick={() => onChange(values.filter((value) => value !== item))} className="text-blue-500" aria-label={`Remove ${item}`}>
                ×
              </button>
            </span>
          ))}
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                addValue(input);
              }
            }}
            onBlur={() => addValue(input)}
            placeholder={placeholder}
            className="min-w-40 flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
          />
        </div>
      </div>
    </label>
  );
}

function StatusPill({ enabled }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{enabled ? 'Enabled' : 'Disabled'}</span>;
}

export default function AIKnowledgeBaseModule() {
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(emptyEntry);
  const [editingId, setEditingId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState({ search: '', category: '', status: '', sort: 'priority', direction: 'desc' });
  const [state, setState] = useState({ loading: true, saving: false, error: '', message: '' });
  const [importState, setImportState] = useState({ loading: false, message: '', error: '', report: null });
  const fileInputRef = useRef(null);

  const request = (path, options = {}) => api(path, options);
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (query.search.trim()) params.set('search', query.search.trim());
    if (query.category) params.set('category', query.category);
    if (query.status === 'enabled') params.set('isEnabled', 'true');
    if (query.status === 'disabled') params.set('isEnabled', 'false');
    if (query.sort) params.set('sort', query.sort);
    if (query.direction) params.set('direction', query.direction);
    return params.toString();
  }, [query]);

  const load = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await request(`/admin/ai-knowledge?${queryString}`);
      setItems(Array.isArray(response.items) ? response.items : []);
      setSelectedIds([]);
      setState((current) => ({ ...current, loading: false, error: '' }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  };

  useEffect(() => { load(); }, [queryString]);

  const openCreate = () => {
    setEditingId('');
    setDraft(emptyEntry);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setDraft(normalizeDraft(item));
    setFormOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (state.saving) return;
    setState((current) => ({ ...current, saving: true, error: '', message: '' }));
    try {
      const payload = normalizeDraft(draft);
      const next = await request(editingId ? `/admin/ai-knowledge/${editingId}` : '/admin/ai-knowledge', {
        method: editingId ? 'PATCH' : 'POST',
        body: payload,
      });
      setDraft(normalizeDraft(next));
      setEditingId(next.id || editingId);
      setFormOpen(false);
      setState({ loading: false, saving: false, error: '', message: editingId ? 'Knowledge entry updated.' : 'Knowledge entry created.' });
      load();
    } catch (error) {
      setState((current) => ({ ...current, saving: false, error: error.message, message: '' }));
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete “${item.primaryQuestion}”? This cannot be undone.`)) return;
    try {
      await request(`/admin/ai-knowledge/${item.id}`, { method: 'DELETE' });
      setState({ loading: false, saving: false, error: '', message: 'Knowledge entry deleted.' });
      load();
    } catch (error) {
      setState((current) => ({ ...current, error: error.message, message: '' }));
    }
  };

  const handleDuplicate = async (item) => {
    try {
      const created = await request(`/admin/ai-knowledge/${item.id}/duplicate`, { method: 'POST' });
      setDraft(normalizeDraft(created));
      setEditingId(created.id);
      setFormOpen(true);
      setState({ loading: false, saving: false, error: '', message: 'Entry duplicated. Review the copy and save if needed.' });
      load();
    } catch (error) {
      setState((current) => ({ ...current, error: error.message, message: '' }));
    }
  };

  const handleToggle = async (item) => {
    try {
      await request(`/admin/ai-knowledge/${item.id}`, {
        method: 'PATCH',
        body: { ...item, isEnabled: !item.isEnabled },
      });
      load();
    } catch (error) {
      setState((current) => ({ ...current, error: error.message, message: '' }));
    }
  };

  const handleBulk = async (action) => {
    if (!selectedIds.length) return;
    if (action === 'delete' && !window.confirm(`Delete ${selectedIds.length} selected knowledge entries? This cannot be undone.`)) return;
    try {
      const response = await request(`/admin/ai-knowledge/bulk-${action}`, { method: 'POST', body: { ids: selectedIds } });
      const label = action === 'enable' ? 'enabled' : action === 'disable' ? 'disabled' : 'deleted';
      setState({ loading: false, saving: false, error: '', message: `${selectedIds.length} knowledge entries ${label}.` });
      if (action === 'delete') setSelectedIds([]);
      load();
      return response;
    } catch (error) {
      setState((current) => ({ ...current, error: error.message, message: '' }));
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await request(`/admin/ai-knowledge/export?format=${format}`);
      if (format === 'json') {
        downloadText('easy-lane-ai-knowledge.json', JSON.stringify(response.items || [], null, 2), 'application/json');
        return;
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'easy-lane-ai-knowledge.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      setState((current) => ({ ...current, error: error.message, message: '' }));
    }
  };

  const handleTemplate = () => downloadText('easy-lane-ai-knowledge-template.csv', csvTemplate(), 'text/csv');

  const handleImport = async (file) => {
    if (!file) return;
    if (!window.confirm(`Import ${file.name}? Valid rows will be saved after validation.`)) return;
    setImportState({ loading: true, message: '', error: '', report: null });
    try {
      const content = await file.text();
      const format = file.name.toLowerCase().endsWith('.json') ? 'json' : 'csv';
      const response = await request('/admin/ai-knowledge/bulk-import', {
        method: 'POST',
        body: { format, content },
      });
      setImportState({
        loading: false,
        message: `Imported ${response.importedCount} knowledge entries.`,
        error: '',
        report: response,
      });
      load();
    } catch (error) {
      setImportState({ loading: false, message: '', error: error.message, report: null });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const visibleCount = items.length;
  const allVisibleSelected = visibleCount > 0 && selectedIds.length === visibleCount;
  const toggleAll = () => setSelectedIds(allVisibleSelected ? [] : items.map((item) => item.id));
  const toggleSelected = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);

  return (
    <section className="grid gap-6 xl:grid-cols-[.92fr_1.08fr]">
      <div className="min-w-0 rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">AI Knowledge Base</h2>
            <p className="mt-1 text-sm text-slate-500">Manage the approved questions and answers used by Ask Easy AI.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleTemplate} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <Download size={15} /> CSV Template
            </button>
            <button type="button" onClick={() => handleExport('csv')} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white">
              <Download size={15} /> Export CSV
            </button>
            <button type="button" onClick={() => handleExport('json')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <Download size={15} /> Export JSON
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white">
              <Upload size={15} /> Import CSV / JSON
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,.json,application/json,text/csv" className="hidden" onChange={(event) => handleImport(event.target.files?.[0])} />
            <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white">
              <Plus size={15} /> Add Entry
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input value={query.search} onChange={(event) => setQuery({ ...query, search: event.target.value })} placeholder="Search entries" className="min-w-0 w-full outline-none" />
          </label>
          <select value={query.category} onChange={(event) => setQuery({ ...query, category: event.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
            <option value="">All categories</option>
            {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select value={query.status} onChange={(event) => setQuery({ ...query, status: event.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
            <option value="">All statuses</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <select value={`${query.sort}:${query.direction}`} onChange={(event) => {
            const [sort, direction] = event.target.value.split(':');
            setQuery({ ...query, sort, direction });
          }} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
            <option value="priority:desc">Priority high to low</option>
            <option value="priority:asc">Priority low to high</option>
            <option value="updatedAt:desc">Recently updated</option>
            <option value="createdAt:desc">Newest first</option>
          </select>
        </div>

        {state.error && <p role="alert" className="mt-4 rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
        {state.message && <p role="status" className="mt-4 rounded-[10px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</p>}
        {importState.error && <p role="alert" className="mt-4 rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{importState.error}</p>}
        {importState.message && <p role="status" className="mt-4 rounded-[10px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">{importState.message}</p>}

        {selectedIds.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center">
            <strong className="text-sm text-slate-800">{selectedIds.length} {selectedIds.length === 1 ? 'entry' : 'entries'} selected</strong>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <button type="button" onClick={() => setSelectedIds([])} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">Clear selection</button>
              <button type="button" onClick={() => handleBulk('enable')} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Bulk enable</button>
              <button type="button" onClick={() => handleBulk('disable')} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">Bulk disable</button>
              <button type="button" onClick={() => handleBulk('delete')} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                <Trash2 size={14} /> Bulk delete
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 max-w-full overflow-x-auto">
          {state.loading ? (
            <div className="grid min-h-56 place-items-center text-sm text-slate-500">Loading knowledge entries…</div>
          ) : (
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-10 px-2 py-3">
                    <input type="checkbox" aria-label="Select all entries" checked={allVisibleSelected} onChange={toggleAll} />
                  </th>
                  {['Question', 'Category', 'Priority', 'Status', 'Actions'].map((label) => <th key={label} className="px-2 py-3">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-2 py-3">
                      <input type="checkbox" aria-label={`Select ${item.primaryQuestion}`} checked={selectedIds.includes(item.id)} onChange={() => toggleSelected(item.id)} />
                    </td>
                    <td className="px-2 py-3">
                      <strong className="block max-w-[22rem] truncate font-semibold text-slate-900">{item.primaryQuestion}</strong>
                      <span className="mt-1 block max-w-[24rem] truncate text-xs text-slate-500">{item.answer}</span>
                    </td>
                    <td className="px-2 py-3 text-slate-600">{item.category}</td>
                    <td className="px-2 py-3 text-slate-600">{item.priority}</td>
                    <td className="px-2 py-3"><StatusPill enabled={item.isEnabled} /></td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button type="button" onClick={() => openEdit(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
                          <Pencil size={14} /> Edit
                        </button>
                        <button type="button" onClick={() => handleDuplicate(item)} className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                          <Copy size={14} /> Duplicate
                        </button>
                        <button type="button" onClick={() => handleToggle(item)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
                          {item.isEnabled ? 'Disable' : 'Enable'}
                        </button>
                        <button type="button" onClick={() => handleDelete(item)} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-slate-500">No knowledge entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {importState.loading && <p className="mt-4 text-sm text-slate-500">Import in progress…</p>}

        {importState.report && (
          <div className="mt-5 rounded-[12px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-extrabold text-slate-900">Last import report</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-4">
              <span>Valid: {importState.report.validCount}</span>
              <span>Invalid: {importState.report.invalidCount}</span>
              <span>Duplicates: {importState.report.duplicateCount}</span>
              <span>Imported: {importState.report.importedCount}</span>
            </div>
            <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {importState.report.rows.map((row) => (
                    <tr key={`${row.rowNumber}-${row.status}`} className="border-b last:border-0">
                      <td className="px-3 py-2">{row.rowNumber}</td>
                      <td className="px-3 py-2 capitalize">{row.status}</td>
                      <td className="px-3 py-2 text-slate-500">{row.errors?.length ? row.errors.join(' ') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="min-w-0">
        {formOpen ? (
          <form onSubmit={handleSave} className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{editingId ? 'Edit knowledge entry' : 'Add knowledge entry'}</h3>
                <p className="mt-1 text-sm text-slate-500">Create or update the approved answers shown to customers.</p>
              </div>
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={draft.isEnabled}
                  onChange={(event) => setDraft({ ...draft, isEnabled: event.target.checked })}
                />
                Enabled
              </label>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                Category
                <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                Priority
                <input type="number" min="0" max="1000" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: Number(event.target.value) })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
                Primary question
                <input value={draft.primaryQuestion} onChange={(event) => setDraft({ ...draft, primaryQuestion: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              </label>
              <div className="sm:col-span-2">
                <ChipInput label="Alternative questions" values={draft.alternativeQuestions} onChange={(values) => setDraft({ ...draft, alternativeQuestions: values })} placeholder="Add another phrasing and press Enter" />
              </div>
              <div className="sm:col-span-2">
                <ChipInput label="Keywords" values={draft.keywords} onChange={(values) => setDraft({ ...draft, keywords: values })} placeholder="Add a keyword and press Enter" />
              </div>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
                Approved answer
                <textarea rows="6" value={draft.answer} onChange={(event) => setDraft({ ...draft, answer: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                CTA label
                <input value={draft.ctaLabel} onChange={(event) => setDraft({ ...draft, ctaLabel: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" placeholder="Explore Control Tower" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                CTA target
                <input value={draft.ctaTarget} onChange={(event) => setDraft({ ...draft, ctaTarget: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" placeholder="#contact" />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button disabled={state.saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                <Pencil size={15} /> {state.saving ? 'Saving…' : 'Save entry'}
              </button>
              <button type="button" onClick={() => { setFormOpen(false); setEditingId(''); setDraft(emptyEntry); }} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <section className="rounded-[12px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-extrabold text-slate-900">Knowledge entry editor</h3>
            <p className="mt-2 text-sm text-slate-500">Create or edit an entry to manage the assistant without touching source files.</p>
            <button type="button" onClick={openCreate} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
              <Plus size={15} /> Add your first entry
            </button>
          </section>
        )}
      </div>
    </section>
  );
}
