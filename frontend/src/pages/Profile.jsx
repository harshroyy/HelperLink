import { useState, useContext, useEffect } from 'react';
import { User, MapPin, Github, Linkedin, Twitter, Save, X, Edit2, CheckCircle2, Camera, Link as LinkIcon } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, login } = useContext(AuthContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    headline: '',
    bio: '',
    skills: '', 
    github: '',
    linkedin: '',
    twitter: '',
    profileImage: '' // <--- Added this
  });

  // Load user data into form when page loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        city: user.city || '',
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.helperProfile?.skills?.join(', ') || user.receiverProfile?.needs?.join(', ') || '',
        github: user.socials?.github || '',
        linkedin: user.socials?.linkedin || '',
        twitter: user.socials?.twitter || '',
        profileImage: user.profileImage || '' // <--- Load existing image
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        city: formData.city,
        headline: formData.headline,
        bio: formData.bio,
        profileImage: formData.profileImage, // <--- Send to backend
        socials: {
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter
        }
      };

      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      
      if (user.role === 'helper') {
        payload.skills = skillsArray;
      } else {
        payload.needs = skillsArray;
      }

      const res = await api.put('/users/profile', payload);
      
      // Update Context
      login(res.data, res.data.token);
      
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER CARD --- */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 relative">
          {/* Cover Gradient */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-center gap-6 -mt-12">
            
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-4xl font-bold text-blue-600 uppercase overflow-hidden">
                {/* Show LIVE PREVIEW from formData if editing, otherwise stored user image */}
                {(isEditing ? formData.profileImage : user.profileImage) ? (
                  <img 
                    src={isEditing ? formData.profileImage : user.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {e.target.src = "https://via.placeholder.com/150"}} // Fallback if link breaks
                  />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              
              {/* Camera Icon Overlay (Visual only) */}
              {isEditing && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center border-4 border-white">
                  <Camera className="text-white" size={32} />
                </div>
              )}

              {/* Status Dot */}
              {!isEditing && (
                <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Name & Headline Inputs */}
            <div className="flex-1 pt-4 md:pt-0 w-full">
              {isEditing ? (
                <div className="space-y-3 w-full">
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full bg-transparent" 
                    placeholder="Your Name"
                  />
                  <input 
                    name="headline" 
                    value={formData.headline} 
                    onChange={handleChange} 
                    className="text-lg text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full bg-transparent" 
                    placeholder="Headline (e.g. Student at IIT)"
                  />
                  {/* NEW IMAGE INPUT */}
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} className="text-gray-400" />
                    <input 
                      name="profileImage" 
                      value={formData.profileImage} 
                      onChange={handleChange} 
                      className="text-sm text-blue-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full bg-transparent placeholder-gray-400" 
                      placeholder="Paste Image URL (https://...)"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "'Vollkorn', serif" }}>
                    {user.name}
                    {user.isVerified && <CheckCircle2 size={20} className="text-blue-500" />}
                  </h1>
                  <p className="text-lg text-gray-500 font-medium">
                    {user.headline || "No headline yet"}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <MapPin size={14} /> {user.city} • <span className="capitalize">{user.role}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Edit/Save Buttons */}
            <div className="mb-4 md:mb-0">
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100">
                    <X size={20} />
                  </button>
                  <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2">
                    <Save size={18} /> {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 font-bold hover:bg-gray-50 flex items-center gap-2">
                  <Edit2 size={16} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Bio & Socials */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Bio Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                About Me
              </h3>
              {isEditing ? (
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {user.bio || "This user hasn't written a bio yet."}
                </p>
              )}
            </div>

            {/* Stats / Badges */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100/50">
              <h3 className="text-blue-900 font-bold mb-4">Community Impact</h3>
              <div className="flex gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-blue-400 uppercase font-bold tracking-wider">Requests</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-400 uppercase font-bold tracking-wider">Helped</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Skills & Socials */}
          <div className="space-y-8">
            
            {/* Skills Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {user.role === 'helper' ? 'Skills & Expertise' : 'Looking for'}
              </h3>
              
              {isEditing ? (
                <div>
                   <input 
                    name="skills" 
                    value={formData.skills} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="Python, Math, React..."
                  />
                  <p className="text-xs text-gray-400 mt-2">Separate with commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(user.helperProfile?.skills || user.receiverProfile?.needs || []).length > 0 ? (
                    (user.helperProfile?.skills || user.receiverProfile?.needs).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-sm">No tags added</span>
                  )}
                </div>
              )}
            </div>

            {/* Social Links Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect</h3>
              <div className="space-y-4">
                
                {/* Github */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Github size={18} />
                  </div>
                  {isEditing ? (
                    <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub Username" className="flex-1 text-sm border-b focus:outline-none" />
                  ) : (
                     <span className="text-sm text-gray-600">{user.socials?.github || "Not connected"}</span>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Linkedin size={18} />
                  </div>
                  {isEditing ? (
                    <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Username" className="flex-1 text-sm border-b focus:outline-none" />
                  ) : (
                     <span className="text-sm text-gray-600">{user.socials?.linkedin || "Not connected"}</span>
                  )}
                </div>

                {/* Twitter */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                    <Twitter size={18} />
                  </div>
                  {isEditing ? (
                    <input name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter Username" className="flex-1 text-sm border-b focus:outline-none" />
                  ) : (
                     <span className="text-sm text-gray-600">{user.socials?.twitter || "Not connected"}</span>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;