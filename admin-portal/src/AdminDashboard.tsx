import { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { adminApiUrl } from './lib/api';

interface AdminDashboardProps {
    onLogout: () => void;
}

const API_BASE = adminApiUrl('/api/admin');

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [stats, setStats] = useState<any>(null);
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab !== 'Dashboard') {
            fetchData(activeTab);
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            if (!res.ok) return;
            const d = await res.json();
            setStats(d);
        } catch (e) {
            console.error('Stats fetch error:', e);
        }
    };

    const fetchData = async (tab: string) => {
        setIsLoading(true);
        let endpoint = '';
        switch (tab) {
            case 'Users': endpoint = '/users'; break;
            case 'Payments': endpoint = '/payments'; break;
            case 'Applications Pending': endpoint = '/applications-pending'; break;
            case 'Applications': endpoint = '/applications'; break;
            case 'Documents': endpoint = '/documents'; break;
        }

        try {
            const res = await fetch(`${API_BASE}${endpoint}`);
            if (!res.ok) {
                const errorData = await res.json();
                console.error('API Error:', errorData);
                setData([]);
                return;
            }
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) {
            console.error('Fetch Error:', e);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading data...</div>;

        switch (activeTab) {
            case 'Dashboard':
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                            <h1>Dashboard Overview</h1>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Updated: {new Date().toLocaleTimeString()}</span>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Registrations</div>
                                <div className="stat-value">{stats?.registered_students || 0}</div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--success)' }}>↑ {stats?.registration_trend?.length > 0 ? stats.registration_trend[stats.registration_trend.length - 1].count : 0} today</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Successful Payments</div>
                                <div className="stat-value">{stats?.payments_completed || 0}</div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completion Rate: {stats?.registered_students > 0 ? Math.round((stats.payments_completed / stats.registered_students) * 100) : 0}%</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Final Submissions</div>
                                <div className="stat-value">{stats?.applications_filled || 0}</div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified: {stats?.applications_filled || 0}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Ongoing Drafts</div>
                                <div className="stat-value">{stats?.applications_pending || 0}</div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--warning)' }}>In progress</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="chart-container">
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>REGISTERATION TREND</h3>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={stats?.registration_trend || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#86868b' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#86868b' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ fontSize: '12px' }}
                                            />
                                            <Line type="monotone" dataKey="count" stroke="#333" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="chart-container">
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>APPLICATION RATIO</h3>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={[
                                            { name: 'Partial', value: stats?.applications_pending || 0 },
                                            { name: 'Complete', value: stats?.applications_filled || 0 }
                                        ]}>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#86868b' }} />
                                            <YAxis hide />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                <Cell fill="#e5e5ea" />
                                                <Cell fill="#333" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Users':
                return (
                    <div>
                        <h1>Registered Students</h1>
                        <div className="table-container" style={{ marginTop: '1.5rem' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Joined At</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((user: any) => (
                                        <tr key={user.id}>
                                            <td style={{ fontWeight: 600 }}>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'Payments':
                return (
                    <div>
                        <h1>Payment Records</h1>
                        {data.length === 0 ? (
                            <div style={{ padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                                No payment transactions found.
                            </div>
                        ) : (
                            <div className="table-container" style={{ marginTop: '1.5rem' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Transaction ID</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((p: any) => (
                                            <tr key={p?.id || Math.random()}>
                                                <td style={{ fontWeight: 500 }}>{p?.user_email || 'Unknown'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p?.transaction_id || 'N/A'}</td>
                                                <td>₹{p?.amount ?? 0}</td>
                                                <td>{p?.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${p?.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                                                        {p?.status || 'PENDING'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );

            case 'Applications Pending':
                return (
                    <div>
                        <h1>Pending Drafts</h1>
                        <div className="table-container" style={{ marginTop: '1.5rem' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Session ID</th>
                                        <th>User Email</th>
                                        <th>Last Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((app: any) => (
                                        <tr key={app.id}>
                                            <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{app.session_id}</td>
                                            <td>{app.user_id}</td>
                                            <td>{new Date(app.updated_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'Applications':
                return (
                    <div>
                        <h1>Submitted Applications</h1>
                        <div className="table-container" style={{ marginTop: '1.5rem' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Campus</th>
                                        <th>Department</th>
                                        <th>Last Update</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((app: any) => (
                                        <tr key={app.id}>
                                            <td style={{ fontWeight: 500 }}>{app.user_email}</td>
                                            <td>{app.campus}</td>
                                            <td>{app.department}</td>
                                            <td>{new Date(app.updated_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className="badge badge-neutral">
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'Documents':
                return (
                    <div>
                        <h1>Documents Repository</h1>
                        {(!data || data.length === 0) ? (
                            <div style={{ padding: '3rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                                No documents have been uploaded yet.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                                {data.map((group: any) => (
                                    <div key={group?.email || Math.random()} className="user-group">
                                        <div className="user-header" onClick={() => setExpandedUser(expandedUser === group?.email ? null : group?.email)}>
                                            <div>
                                                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{group?.full_name || 'Anonymous User'}</strong>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{group?.email || 'No Email'}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <span className="badge badge-neutral">{group?.documents?.length || 0} Files</span>
                                                <span style={{ transition: 'transform 0.2s', transform: expandedUser === group?.email ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                                            </div>
                                        </div>
                                        {expandedUser === group?.email && (
                                            <div className="user-docs">
                                                {(!group?.documents || group.documents.length === 0) ? (
                                                    <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', gridColumn: '1 / -1' }}>
                                                        No files found.
                                                    </div>
                                                ) : (
                                                    group.documents.map((doc: any) => (
                                                        <div key={doc?.id || Math.random()} className="doc-card">
                                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                                                                {(doc?.document_type || 'unspecified').replace('_', ' ')}
                                                            </span>
                                                            <a
                                                                href={doc?.file_path || '#'}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ display: 'block', marginBottom: '0.5rem', wordBreak: 'break-all', lineHeight: '1.2' }}
                                                            >
                                                                {doc?.file_name || 'Missing File Name'}
                                                            </a>
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                                {doc?.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Unknown Date'}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            default:
                return <div>Select an option from the sidebar</div>;
        }
    }

    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="logo">
                    VIGNAN
                    <div style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: '0.2rem' }}>ADMINISTRATION</div>
                </div>
                <ul className="nav-links">
                    {['Dashboard', 'Users', 'Payments', 'Applications Pending', 'Applications', 'Documents'].map(tab => (
                        <li
                            key={tab}
                            className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                <div style={{ marginTop: 'auto' }}>
                    <button
                        className="nav-link"
                        style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid var(--border)', borderRadius: '0', paddingTop: '1.5rem' }}
                        onClick={onLogout}
                    >
                        Sign Out
                    </button>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', padding: '1rem 0 0 1rem' }}>v1.0.4 Normal Mode</div>
                </div>
            </div>
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
