import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { documentService } from '../../services/documentService';
import { userService } from '../../services/userService';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalUsers: 0,
    totalFavorites: 0,
    totalEligibilityChecks: 0,
    totalAiInteractions: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts since we don't have historical aggregated data yet
  const activityData = [
    { name: 'Mon', views: 400, checks: 240, ai: 200 },
    { name: 'Tue', views: 300, checks: 139, ai: 221 },
    { name: 'Wed', views: 200, checks: 980, ai: 229 },
    { name: 'Thu', views: 278, checks: 390, ai: 200 },
    { name: 'Fri', views: 189, checks: 480, ai: 218 },
    { name: 'Sat', views: 239, checks: 380, ai: 250 },
    { name: 'Sun', views: 349, checks: 430, ai: 210 },
  ];

  const popularDocsData = [
    { name: 'Aadhaar Card', views: 4000 },
    { name: 'PAN Card', views: 3000 },
    { name: 'Driving License', views: 2000 },
    { name: 'Passport', views: 2780 },
    { name: 'Voter ID', views: 1890 },
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const adminStats = await userService.getAdminStats();
        const docResult = await documentService.getAdminDocuments(1, 1);
        
        setStats({
          ...adminStats,
          totalDocuments: docResult.totalDocuments
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Platform Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Documents</div>
          <div className="stat-value">{stats.totalDocuments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Favorites</div>
          <div className="stat-value">{stats.totalFavorites}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Eligibility Checks</div>
          <div className="stat-value">{stats.totalEligibilityChecks}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">AI Interactions</div>
          <div className="stat-value">{stats.totalAiInteractions}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Recent Activity</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="checks" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Most Viewed Documents</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularDocsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#a0a0a0" />
                <YAxis dataKey="name" type="category" width={100} stroke="#a0a0a0" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
                <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
