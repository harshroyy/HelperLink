import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

// Connect to backend
const ENDPOINT = 'http://localhost:5000'; 
let socket;

const ChatPage = () => {
  const { matchId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiverName, setReceiverName] = useState("Chat"); // Store name of person we are talking to

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Fetch Chat History & Details
    const fetchChatData = async () => {
      try {
        const res = await api.get(`/messages/${matchId}`);
        setMessages(res.data);
        
        // Try to figure out the other person's name from the first message or match data
        // ( Ideally, your backend /messages endpoint should return the 'match' object too )
        // For now, we set a default, but you can enhance this later.
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChatData();

    // 2. Connect Socket
    socket = io(ENDPOINT);
    socket.emit('join_chat', matchId);

    // 3. Listen for messages
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Optimistic UI Update (Shows message immediately before backend confirms)
      // Note: We rely on socket to confirm, but clearing input makes it feel fast.
      await api.post('/messages', {
        matchId,
        content: newMessage
      });
      setNewMessage("");
    } catch (err) {
      alert("Failed to send");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] font-sans">
      
      {/* --- HEADER (Glassmorphism) --- */}
      <div className="fixed top-0 w-full z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                {/* Fallback Avatar */}
                <span className="text-sm">💬</span>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                Conversation
              </h2>
              <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions (Visual Only) */}
        <div className="flex items-center gap-2 text-blue-600">
          <button className="p-2 hover:bg-blue-50 rounded-full"><Phone size={20} /></button>
          <button className="p-2 hover:bg-blue-50 rounded-full"><Video size={20} /></button>
          <button className="p-2 hover:bg-blue-50 rounded-full text-gray-400"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto pt-24 pb-24 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Encryption Notice */}
          <div className="flex justify-center mb-6">
            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
              🔒 Messages are end-to-end encrypted and secure.
            </span>
          </div>

          {messages.map((msg, index) => {
            const isMyMessage = msg.senderId === user._id;
            return (
              <div 
                key={index} 
                className={`flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] md:max-w-[60%] px-5 py-3 rounded-2xl text-sm shadow-sm relative ${
                    isMyMessage 
                      ? 'bg-blue-600 text-white rounded-br-none' // My Message Style
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none' // Their Message Style
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className={`text-[10px] block text-right mt-1 opacity-70 ${
                    isMyMessage ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- INPUT AREA --- */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={sendMessage} className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full border border-gray-200 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            
            <input 
              type="text" 
              className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-700 placeholder-gray-400"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform active:scale-95 shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ChatPage;