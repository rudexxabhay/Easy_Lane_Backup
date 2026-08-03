import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Eye, Search, Trash2, X } from 'lucide-react';
import { api, clearAdminAuthToken } from '../../lib/api.js';
import { navigate } from '../../lib/router.js';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

function fieldText(value) {
  const text = String(value ?? '').trim();
  return text || '—';
}

export default function ContactLeadsModule() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState({ search: '', page: 1 });
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0 });
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [state, setState] = useState({ loading: true, saving: false, error: '' });

  const params = useMemo(() => new URLSearchParams({
    page: String(query.page),
    limit: '10',
    ...(query.search ? { search: query.search } : {}),
  }).toString(), [query]);

  const load = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await api(`/admin/contact-leads?${params}`);
      setItems(response.items || []);
      setPageInfo({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
      });
      setState({ loading: false, saving: false, error: '' });
    } catch (error) {
      if (/session|authentication|invalid/i.test(error.message)) {
        clearAdminAuthToken();
        navigate('/admin/login');
        return;
      }
      setState({ loading: false, saving: false, error: error.message });
    }
  };

  useEffect(() => {
    load();
  }, [params]);

  const openLead = (lead) => setSelected(lead);

  const removeLead = async () => {
    if (!deleteTarget || state.saving) return;
    setState((current) => ({ ...current, saving: true, error: '' }));
    try {
      const id = String(deleteTarget._id || '').trim();
      const response = await api(`/admin/contact-leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response?.success) throw new Error(response?.message || 'Unable to delete contact lead.');
      if (selected?._id === id) setSelected(null);
      setDeleteTarget(null);
      await load();
    } catch (error) {
      if (/session|authentication|invalid/i.test(error.message)) {
        clearAdminAuthToken();
        navigate('/admin/login');
        return;
      }
      setState((current) => ({ ...current, saving: false, error: error.message }));
    } finally {
      setState((current) => ({ ...current, saving: false }));
    }
  };

  return (
    <>
      <section className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="font-extrabold">Contact Leads</h2>
          <p className="text-xs text-slate-500">Manage messages submitted through the public Contact Us form.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={16} />
            <input
              value={query.search}
              onChange={(event) => setQuery({ search: event.target.value, page: 1 })}
              placeholder="Search contact leads"
              className="min-w-0 w-full py-2.5 outline-none"
            />
          </label>
        </div>

        {state.error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

        <div className="mt-5 max-w-full overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="border-b text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {['Name', 'Email', 'Phone', 'Company', 'Subject', 'Status', 'Received', ''].map((label) => (
                  <th key={label} className="px-2 py-3">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-500">Loading contact leads…</td>
                </tr>
              ) : items.length ? (
                items.map((lead) => (
                  <tr key={lead._id} className="border-b border-slate-100">
                    <td className="px-2 py-3 font-semibold">
                      {fieldText(lead.fullName)}
                      <small className="block font-normal text-slate-500">{fieldText(lead.source)}</small>
                    </td>
                    <td className="px-2 py-3">{fieldText(lead.email)}</td>
                    <td className="px-2 py-3">{fieldText(lead.phone)}</td>
                    <td className="px-2 py-3">{fieldText(lead.companyName)}</td>
                    <td className="px-2 py-3 max-w-[320px]">
                      <p className="truncate font-medium text-slate-800">{fieldText(lead.subject)}</p>
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                        {fieldText(lead.status)}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-slate-500">{formatDate(lead.createdAt)}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openLead(lead)}
                          aria-label={`View ${fieldText(lead.fullName)}`}
                          className="rounded p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(lead)}
                          aria-label={`Delete ${fieldText(lead.fullName)}`}
                          className="rounded p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-500">No contact leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>{pageInfo.total} leads</span>
          <div className="flex items-center gap-2">
            <button
              disabled={pageInfo.page <= 1}
              onClick={() => setQuery({ ...query, page: query.page - 1 })}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <span>{pageInfo.page} / {pageInfo.pages}</span>
            <button
              disabled={pageInfo.page >= pageInfo.pages}
              onClick={() => setQuery({ ...query, page: query.page + 1 })}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onDelete={() => setDeleteTarget(selected)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmation
          target={deleteTarget}
          deleting={state.saving}
          error={state.error}
          cancel={() => !state.saving && setDeleteTarget(null)}
          confirm={removeLead}
        />
      )}
    </>
  );
}

function LeadDrawer({ lead, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-[65] bg-slate-950/35" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="ml-auto h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl sm:p-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold">{fieldText(lead.fullName)}</h2>
            <p className="text-xs text-slate-500">{formatDate(lead.createdAt)}</p>
          </div>
          <button onClick={onClose} className="rounded p-2">
            <X size={20} />
          </button>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['fullName', 'Full Name'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['companyName', 'Company Name'],
            ['subject', 'Subject'],
            ['status', 'Status'],
            ['source', 'Source'],
            ['createdAt', 'Created At'],
            ['updatedAt', 'Updated At'],
          ].map(([key, label]) => (
            <div key={key} className="grid gap-1 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="break-words text-sm font-medium text-slate-800">
                {key === 'createdAt' || key === 'updatedAt' ? formatDate(lead[key]) : fieldText(lead[key])}
              </p>
            </div>
          ))}
          <div className="sm:col-span-2 grid gap-1 rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Message</p>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">{fieldText(lead.message)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={onDelete} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </aside>
    </div>
  );
}

function DeleteConfirmation({ target, deleting, error, cancel, confirm }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    buttonRef.current?.focus();
    const escape = (event) => {
      if (event.key === 'Escape' && !deleting) cancel();
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [cancel, deleting]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-5">
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-contact-lead-title" className="w-full max-w-md rounded-t-[14px] bg-white p-6 shadow-2xl sm:rounded-[14px]">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle size={22} />
        </span>
        <h2 id="delete-contact-lead-title" className="mt-4 text-xl font-extrabold">Delete Contact Lead?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Permanently delete <strong>{fieldText(target.fullName)}</strong>? This action cannot be undone.
        </p>
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" disabled={deleting} onClick={cancel} className="rounded-lg border px-4 py-2.5 text-sm font-bold disabled:opacity-50">
            Cancel
          </button>
          <button
            type="button"
            ref={buttonRef}
            disabled={deleting}
            onClick={confirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete Lead'}
          </button>
        </div>
      </section>
    </div>
  );
}
