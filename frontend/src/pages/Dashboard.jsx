import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Loader2, Sparkles, LayoutList, Users } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import HelperCard from '../components/dashboard/HelperCard';
import RequestCard from '../components/dashboard/RequestCard';
import CreateRequestModal from '../components/dashboard/CreateRequestModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: State for Tabs ('requests' or 'helpers')
  const [activeTab, setActiveTab] = useState('helpers'); // Default to finding help

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'receiver') {
          // 1. Fetch Helpers
          const helpersRes = await api.get('/users/helpers');
          setData(helpersRes.data);

          // 2. Fetch My Requests
          const requestsRes = await api.get('/requests/my-requests');
          setMyRequests(requestsRes.data);
        } else {
          // Helper Logic
          const res = await api.get('/requests/my-requests');
          setData(res.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  const handleRequestClick = (helper) => {
    setSelectedHelper(helper);
    setIsModalOpen(true);
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.put(`/requests/${requestId}/accept`);
      alert("Request Accepted! Chat opened.");
      window.location.reload();
    } catch (err) {
      alert("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (requestId) => {
    if (!window.confirm("Decline this request?")) return;
    try {
      await api.put(`/requests/${requestId}/decline`);
      window.location.reload();
    } catch (err) {
      alert("Failed to decline");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ebf2fa] font-sans pt-24 pb-12 px-6">
      <div className="max-w-[1440px] mx-auto">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold font-color-[#747def] text-[#181E4B] mb-2 mt-4" style={{ fontFamily: "sans-serif" }}>
              Welcome back, <span style={{ color: "#747def" }}>{user.name.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-[#5E6282] text-lg">
              {user.role === 'receiver'
                ? 'Let’s get you connected.'
                : 'Here are people who need your help.'}
            </p>
          </div>
        </div>

        {/* --- RECEIVER VIEW --- */}
        {user.role === 'receiver' ? (
          <div>

            {/* --- TOGGLE BUTTONS --- */}
            <div className="flex gap-4 mb-10 border-b border-gray-200 pb-1">
              <button
                onClick={() => setActiveTab('helpers')}
                className={`pb-3 px-2 flex items-center gap-2 font-bold text-lg transition-all relative ${activeTab === 'helpers'
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <Users size={20} />
                Request Support
                {/* Active Underline */}
                {activeTab === 'helpers' && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-blue-600 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`pb-3 px-2 flex items-center gap-2 font-bold text-lg transition-all relative ${activeTab === 'requests'
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <LayoutList size={20} />
                Your Open Requests
                {myRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                    {myRequests.length}
                  </span>
                )}
                {activeTab === 'requests' && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-blue-600 rounded-full"></span>
                )}
              </button>
            </div>

            {/* --- CONDITIONAL CONTENT --- */}

            {/* VIEW 1: AVAILABLE HELPERS */}
            {activeTab === 'helpers' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#181E4B]">Available Helpers</h2>

                  {/* Search Bar */}
                  <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input placeholder="Search by skill..." className="outline-none text-sm text-gray-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {data.length > 0 ? (
                    data.map(helper => (
                      <HelperCard key={helper._id} helper={helper} onRequestClick={handleRequestClick} />
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center bg-white/50 rounded-3xl border border-dashed border-gray-300">
                      <p className="text-gray-500">No helpers found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: MY REQUESTS */}
            {activeTab === 'requests' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-[#181E4B] mb-6">Track Your Requests</h2>

                {myRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myRequests.map((req) => (
                      <div key={req._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {req.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-1">{req.reason}</h3>
                        <p className="text-sm text-gray-500 mb-4">To: {req.helperId?.name || 'Unknown'}</p>

                        {req.status === 'accepted' ? (
                          <button
                            onClick={() => navigate(`/chat/${req.matchId}`)}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-green-200"
                          >
                            Open Chat
                          </button>
                        ) : (
                          <div className="w-full py-2 bg-gray-50 text-gray-400 text-center rounded-xl text-sm font-medium">
                            Waiting for response...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/50 rounded-3xl border border-gray-100">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300">
                      <LayoutList size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">No requests yet</h3>
                    <p className="text-gray-500 mt-1">Go to "Find Helpers" to start a request.</p>
                    <button
                      onClick={() => setActiveTab('helpers')}
                      className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                      Find a Helper &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedHelper && (
              <CreateRequestModal
                helper={selectedHelper}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        ) : (

          /* --- HELPER VIEW (Unchanged) --- */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

              <h2 className="text-2xl font-bold text-[#181E4B] mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><SlidersHorizontal size={24} /></div>
                Incoming Requests
              </h2>

              {data.length > 0 ? (
                <div className="space-y-6">
                  {data.map(req => (
                    <RequestCard
                      key={req._id}
                      request={req}
                      onAccept={handleAcceptRequest}
                      onDecline={handleDeclineRequest}
                      onChatClick={() => navigate(`/chat/${req.matchId}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-200">
                    <Sparkles size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                  <p className="text-gray-500 mt-2">You have no pending requests at the moment.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;