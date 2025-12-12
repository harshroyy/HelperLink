import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Added missing icons: Clock, CheckCircle2, XCircle, MessageCircle
import { Search, MapPin, SlidersHorizontal, Loader2, Sparkles, LayoutList, Users, Clock, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
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

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      await api.delete(`/requests/${requestId}`);
      // Optimistic UI Update or Reload
      setMyRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      alert("Failed to delete request");
    }
  };

  // --- NEW HELPER FUNCTION FOR STATUS BADGES ---
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
            <CheckCircle2 size={14} /> Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
            <XCircle size={14} /> Declined
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-100">
            <Clock size={14} /> Pending
          </span>
        );
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

            {/* VIEW 2: MY REQUESTS (Redesigned) */}
            {activeTab === 'requests' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-[#181E4B] mb-6">Track Your Requests</h2>

                {myRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myRequests.map((req) => (
                      <div key={req._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full relative overflow-hidden group">

                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${req.status === 'accepted' ? 'bg-green-500' :
                          req.status === 'declined' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}></div>

                        {/* Delete Button (Absolute Top Right) */}
                        <button
                          onClick={() => handleDeleteRequest(req._id)}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Cancel Request"
                        >
                          <XCircle size={20} />
                        </button>

                        {/* Top: Helper Info */}
                        <div className="flex justify-between items-start mb-4 pl-3 pr-8">
                          <div className="flex items-center gap-3">
                            {/* Helper Avatar Circle */}
                            <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100">
                              {req.helperId?.profileImage ? (
                                <img src={req.helperId.profileImage} alt="Helper" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg">
                                  {req.helperId?.name?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>

                            {/* Helper Name */}
                            <div>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Request to</p>
                              <h3 className="font-bold text-gray-900 text-lg leading-none">{req.helperId?.name || 'Unknown Helper'}</h3>
                            </div>
                          </div>

                          {/* Status Badge Icon */}
                          {getStatusBadge(req.status)}
                        </div>

                        {/* Content: Reason & Details */}
                        <div className="pl-3 mb-6 flex-grow">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-sm font-bold text-gray-800 mb-1">{req.reason}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{req.details}</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 text-right">
                            Sent on {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Footer Action */}
                        <div className="pl-3 mt-auto">
                          {req.status === 'accepted' ? (
                            <button
                              onClick={() => navigate(`/chat/${req.matchId}`)}
                              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                            >
                              <MessageCircle size={18} />
                              Open Chat
                            </button>
                          ) : req.status === 'declined' ? (
                            <div className="w-full py-3 bg-red-50 text-red-400 text-center rounded-xl text-sm font-medium border border-red-100 opacity-70">
                              Request Declined
                            </div>
                          ) : (
                            <div className="w-full py-3 bg-yellow-50 text-yellow-600 text-center rounded-xl text-sm font-medium border border-yellow-100 animate-pulse">
                              Waiting for response...
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/50 rounded-3xl border border-gray-100">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300">
                      <LayoutList size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">No requests yet</h3>
                    <p className="text-gray-500 mt-1">Go to "Request Support" to start a new request.</p>
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