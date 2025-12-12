import React from 'react';
import { MapPin, Sparkles, CheckCircle2, Layers } from 'lucide-react'; // Added Layers icon

const HelperCard = ({ helper, onRequestClick }) => {
  // Consistent gradient based on name
  const gradients = [
    'from-blue-400 to-purple-500',
    'from-emerald-400 to-cyan-500',
    'from-orange-400 to-pink-500',
    'from-indigo-400 to-blue-500',
    'from-rose-400 to-orange-300'
  ];
  const randomGradient = gradients[helper.name.length % gradients.length];

  // Safe access to skills
  const skills = helper.helperProfile?.skills || [];

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">

      {/* --- TOP SECTION: IMAGE --- */}
      <div className="relative h-48 w-full overflow-hidden">
        {helper.profileImage ? (
          <img
            src={helper.profileImage}
            alt={helper.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}

        {/* Fallback Gradient */}
        <div
          className={`w-full h-full bg-gradient-to-br ${randomGradient} flex items-center justify-center ${helper.profileImage ? 'hidden' : 'flex'}`}
        >
          <span className="text-6xl font-bold text-white opacity-40 select-none font-serif">
            {helper.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Verification Badge */}
        {helper.isVerified && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-blue-600" title="Verified Helper">
            <CheckCircle2 size={18} fill="white" className="text-blue-600" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
      </div>

      {/* --- BOTTOM SECTION: CONTENT --- */}
      <div className="p-5 flex flex-col flex-grow relative">

        {/* Name & Location */}
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-[#181E4B] leading-tight mb-1" style={{ fontFamily: "'Vollkorn', serif" }}>
            {helper.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs font-medium uppercase tracking-wide">
            <MapPin size={12} className="text-[#747def]" />
            {helper.city}
          </div>
        </div>

        {/* Bio / Headline */}
        <div className="mb-4 flex-grow">
          <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
            "{helper.headline || helper.bio || "I am here to support the community. Reach out if you need help!"}"
          </p>
        </div>

        {/* --- SKILLS SECTION (Fixed) --- */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Layers size={12} /> Can help with:
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              <>
                {skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg font-bold">
                    +{skills.length - 3}
                  </span>
                )}
              </>
            ) : (
              // Fallback if no skills are listed
              <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-200">
                General Support
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onRequestClick(helper)}
          className="w-full py-3 bg-[#747def] hover:bg-[#5e63c2] text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 mt-auto"
        >
          <Sparkles size={16} />
          Ask for Help
        </button>

      </div>
    </div>
  );
};

export default HelperCard;