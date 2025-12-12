import { useState } from 'react';
import { X, Send, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import api from '../../services/api';

const CreateRequestModal = ({ isOpen, onClose, helper }) => {
  const [formData, setFormData] = useState({
    category: '',
    details: ''
  });
  const [loading, setLoading] = useState(false);

  // Quick tags
  const quickTags = ["Mentorship", "Code Review", "Career Advice", "Study Partner", "Emotional Support"];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.details) return;

    setLoading(true);
    try {
      await api.post('/requests', {
        helperId: helper._id,

        // --- THE FIX ---
        // The backend requires 'category'. 
        // We send the selected tag (e.g., "Mentorship") as both category and reason.
        category: formData.category,
        reason: formData.category,

        details: formData.details
      });

      alert('Request sent successfully!');
      onClose();
    } catch (err) {
      console.error(err); // Log the full error to console for debugging
      alert(err.response?.data?.message || err.response?.data?.msg || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 opacity-100">

        {/* --- HEADER: HELPER INFO --- */}
        <div className="bg-gradient-to-r from-[#181E4B] to-[#2A3468] p-6 text-white relative overflow-hidden">

          {/* Decorative Circles (z-0 to stay behind) */}
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl z-0"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-[#747def]/20 rounded-full blur-xl z-0"></div>

          {/* --- CLOSE BUTTON (Fixed with z-50) --- */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            {/* Helper Avatar */}
            <div className="w-16 h-16 rounded-full border-2 border-white/30 p-1">
              <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-[#181E4B] font-bold text-xl">
                {helper.profileImage ? (
                  <img src={helper.profileImage} alt={helper.name} className="w-full h-full object-cover" />
                ) : (
                  helper.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Reach out to</p>
              <h2 className="text-2xl font-bold font-serif leading-none">{helper.name}</h2>
            </div>
          </div>
        </div>

        {/* --- BODY: FORM --- */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. Quick Select Reason */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#747def]" />
                What do you need help with?
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: tag })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${formData.category === tag
                        ? 'bg-[#747def] text-white border-[#747def] shadow-md transform scale-105'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#747def] hover:text-[#747def]'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Custom Input fallback */}
              <input
                type="text"
                placeholder="Or type your own reason..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#747def]/20 focus:border-[#747def] text-sm transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            {/* 2. Details */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#747def]" />
                Message details
              </label>
              <textarea
                rows="4"
                placeholder={`Hi ${helper.name.split(' ')[0]}, I saw that you are good at...`}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#747def]/20 focus:border-[#747def] text-sm transition-all resize-none"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              ></textarea>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Be specific so they know how to help!
              </p>
            </div>

            {/* Actions */}
            <button
              type="submit"
              disabled={loading || !formData.category || !formData.details}
              className="w-full py-4 bg-[#181E4B] hover:bg-[#747def] text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
              {loading ? 'Sending...' : 'Send Request'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateRequestModal;