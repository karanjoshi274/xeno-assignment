import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // frontend/App.jsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.withCredentials = true;

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [campaigns, setCampaigns] = useState([]);

//   useEffect(() => {
//     axios.get(`${BACKEND_URL}/auth/user`).then(res => setUser(res.data)).catch(() => setUser(null));
//     axios.get(`${BACKEND_URL}/api/campaigns`).then(res => setCampaigns(res.data));
//   }, []);

//   const handleLogin = () => {
//     window.open(`${BACKEND_URL}/auth/google`, '_self');
//   };

//   const handleLogout = () => {
//     window.open(`${BACKEND_URL}/auth/logout`, '_self');
//   };

//   return (
//     <div className="p-4 font-sans">
//       <h1 className="text-2xl font-bold mb-4">Xeno Mini CRM</h1>
//       {!user ? (
//         <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login with Google</button>
//       ) : (
//         <div>
//           <p className="mb-2">Welcome, {user.name}</p>
//           <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
//           <h2 className="mt-6 text-xl font-semibold">Campaigns</h2>
//           <ul className="mt-2 space-y-2">
//             {campaigns.map(c => (
//               <li key={c._id} className="border p-2 rounded">
//                 <strong>{c.name}</strong><br/>
//                 Audience Size: {c.audienceSize} | Created: {new Date(c.createdAt).toLocaleString()}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }