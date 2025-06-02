import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export default function App() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ name: '', rules: { spend: '', visits: '', inactive: '' } });
  const [previewSize, setPreviewSize] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/auth/user`).then(res => setUser(res.data)).catch(() => setUser(null));
    axios.get(`${BACKEND_URL}/api/campaigns`).then(res => setCampaigns(res.data));
  }, []);

  const handleLogin = () => {
    window.open(`${BACKEND_URL}/auth/google`, '_self');
  };

  const handleLogout = () => {
    window.open(`${BACKEND_URL}/auth/logout`, '_self');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'name') setForm(prev => ({ ...prev, name: value }));
    else setForm(prev => ({ ...prev, rules: { ...prev.rules, [name]: value } }));
  };

  const handlePreview = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/campaigns/preview`, form.rules);
      setPreviewSize(res.data.size);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/campaigns`, form);
      const updated = await axios.get(`${BACKEND_URL}/api/campaigns`);
      setCampaigns(updated.data);
      setForm({ name: '', rules: { spend: '', visits: '', inactive: '' } });
      setPreviewSize(null);
      setAiMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuggest = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai/messages`, { name: form.name });
      setAiMessages(res.data.messages);
    } catch (err) {
      console.error('AI error:', err);
    }
  };

  return (
    <div className="p-4 font-sans max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xeno Mini CRM</h1>
      {!user ? (
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login with Google</button>
      ) : (
        <div>
          <p className="mb-2">Welcome, {user.name}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>

          <div className="mt-6 border p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Create Campaign</h2>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Campaign Name" className="w-full mb-2 p-2 border rounded" />
            <input type="number" name="spend" value={form.rules.spend} onChange={handleChange} placeholder="Min Spend ₹" className="w-full mb-2 p-2 border rounded" />
            <input type="number" name="visits" value={form.rules.visits} onChange={handleChange} placeholder="Max Visits" className="w-full mb-2 p-2 border rounded" />
            <input type="number" name="inactive" value={form.rules.inactive} onChange={handleChange} placeholder="Inactive Days" className="w-full mb-2 p-2 border rounded" />
            <div className="flex gap-2 mb-2">
              <button onClick={handlePreview} className="bg-yellow-500 text-white px-3 py-1 rounded">Preview Audience</button>
              <button onClick={handleSubmit} className="bg-green-600 text-white px-3 py-1 rounded">Save Campaign</button>
              <button onClick={handleSuggest} className="bg-indigo-600 text-white px-3 py-1 rounded">Suggest Messages</button>
            </div>
            {previewSize !== null && <p className="text-sm text-gray-600">Estimated Audience: {previewSize}</p>}
            {aiMessages.length > 0 && (
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <p className="font-medium">AI Suggested Messages:</p>
                <ul className="list-disc ml-5 text-sm">
                  {aiMessages.map((msg, idx) => <li key={idx}>{msg}</li>)}
                </ul>
              </div>
            )}
          </div>

          <h2 className="mt-6 text-xl font-semibold">Campaigns</h2>
          <ul className="mt-2 space-y-2">
            {campaigns.map(c => (
              <li key={c._id} className="border p-2 rounded">
                <strong>{c.name}</strong><br/>
                Audience Size: {c.audienceSize} | Created: {new Date(c.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}