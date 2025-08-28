import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { getUserComparisons } from '../firestoreService';
import '../styles/HistoryPage.css'; 
import Header from '../components/Header';


const HistoryPage = () => {
  const [user] = useAuthState(auth);
  const [comparisons, setComparisons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserComparisons(user.uid);
          if (data.length === 0) {
            const dummy = [{
              id: 'test1',
              prompt: 'Example prompt for sorting array',
              models: ['chatgpt', 'gemini'],
              timestamp: { toDate: () => new Date() },
              analysis: { bestModel: 'chatgpt' }
            }];
            setComparisons(dummy);
            setSelected(dummy[0]);
          } else {
            setComparisons(data);
            setSelected(data[0]);
          }
        } catch (err) {
          console.error("❌ Error fetching comparisons:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="loading">Please log in to view your history.</div>;

  return (
    <div className="page-wrapper">
    <Header user={user} />
    <div className="history-container">
      <div className="history-sidebar">
        <h2>🗂 Your Comparisons</h2>
        {comparisons.length === 0 ? (
          <p>No comparisons found.</p>
        ) : (
          comparisons.map(item => (
            <div
              key={item.id}
              className={`history-item ${selected?.id === item.id ? 'selected' : ''}`}
              onClick={() => setSelected(item)}
            >
              <div className="history-prompt">{item.prompt.slice(0, 60)}...</div>
              <div className="history-date">{item.timestamp?.toDate().toLocaleString()}</div>
            </div>
          ))
        )}
      </div>

      <div className="history-details">
        {selected ? (
          <>
            <h2>📄 Comparison Details</h2>
            <p><strong>🔍 Prompt:</strong> {selected.prompt}</p>
            <p><strong>🤖 Models Compared:</strong> {selected.models?.join(', ')}</p>
            {selected.analysis?.bestModel && (
              <p><strong>🏆 Best Model:</strong> <span className="best-model">{selected.analysis.bestModel.toUpperCase()}</span></p>
            )}
            <p><strong>📅 Date:</strong> {selected.timestamp?.toDate().toLocaleString()}</p>

            <button className="view-btn" onClick={() => navigate(`/comparison/${selected.id}`)}>
              View Full Comparison →
            </button>
          </>
        ) : (
          <p className="no-selection">Select a comparison to view its details.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default HistoryPage;
