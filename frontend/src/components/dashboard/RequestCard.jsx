import React from 'react';
import { Clock, MapPin, MessageCircle, Check, X, User } from 'lucide-react';

const RequestCard = ({ request, onAccept, onDecline, onChatClick }) => {
  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all mb-4 relative overflow-hidden">
      
      {/* Status Stripe (Left Border Color) */}
      <div className={`absolute top-0 left-0 w-1.5 h-full 
        ${isPending ? 'bg-yellow-400' : isAccepted ? 'bg-green-500' : 'bg-red-400'}`} 
      />

      <div className="pl-4">
        
        {/* Header: User Info & Time */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                {request.receiverId?.name || "Anonymous User"}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={10} /> {request.receiverId?.city || "Unknown"}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
            ${isPending ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 
              isAccepted ? 'bg-green-50 text-green-600 border border-green-100' : 
              'bg-red-50 text-red-600 border border-red-100'}`}>
            {request.status}
          </span>
        </div>

        {/* Content: Reason & Details */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: "'Vollkorn', serif" }}>
            {request.reason}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
            {request.details}
          </p>
        </div>

        {/* Actions Toolbar */}
        {isPending && (
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button 
              onClick={() => onAccept(request._id)}
              className="flex-1 bg-gray-900 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check size={16} /> Accept Request
            </button>
            <button 
              onClick={() => onDecline(request._id)}
              className="px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <X size={16} /> Decline
            </button>
          </div>
        )}
        
        {isAccepted && (
          <button 
            onClick={onChatClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Open Chat Room
          </button>
        )}

      </div>
    </div>
  );
};

export default RequestCard;