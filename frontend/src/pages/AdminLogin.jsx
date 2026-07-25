import { useState } from 'react';
import { api, clearAdminAuthToken, writeAdminAuthToken } from '../lib/api.js';
import { navigate } from '../lib/router.js';
import logo from '../assets/logo.png';

export default function AdminLogin() {
  const [adminId, setAdminId] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    clearAdminAuthToken();
    try {
      const response = await api('admin/login', { method: 'POST', body: { adminId, password }, auth: false });
      writeAdminAuthToken(response?.data?.token || response?.token || '');
      navigate('/admin');
    } catch (requestError) {
      clearAdminAuthToken();
      const message = requestError.message === 'Authentication required.'
        ? 'Invalid Admin ID or password.'
        : /Unable to connect/i.test(requestError.message)
          ? 'Unable to connect to the authentication server.'
          : requestError.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return <main className="grid min-h-screen place-items-center bg-[#041333] p-5"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"><img src={logo} alt="Easy Lane" className="mx-auto h-14 w-auto object-contain" /><h1 className="mt-4 text-3xl font-extrabold text-slate-950">Admin sign in</h1><p className="mt-2 text-sm text-slate-600">Use credentials configured on the server.</p><label className="mt-7 grid gap-1.5 text-sm font-semibold">Admin ID<input required autoComplete="username" value={adminId} onChange={(event) => setAdminId(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-3" /></label><label className="mt-4 grid gap-1.5 text-sm font-semibold">Password<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-3" /></label>{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
