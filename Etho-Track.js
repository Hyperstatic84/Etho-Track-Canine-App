import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Activity, Users, Clock, Save, 
  FileText, Send, TrendingDown, Target, MapPin 
} from 'lucide-react';

const EthoTrackApp = () => {
  // --- ÉTATS ---
  const [sessions, setSessions] = useState([]); // Historique des sessions
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString(),
    environnement: 'campagne',
    typeSortie: 'travail',
    latence: '2', // 1: <2s, 2: 2-10s, 3: >10s
    excitation: 3,
    reactionSociale: 'indifference',
    redescente: 'moyenne',
    notes: ''
  });
  const [showReport, setShowReport] = useState(false);

  // --- LOGIQUE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSession = () => {
    setSessions([formData, ...sessions]);
    alert("Session enregistrée dans l'historique !");
    // Réinitialisation partielle
    setFormData({...formData, notes: '', date: new Date().toLocaleDateString()});
  };

  const calculateStats = () => {
    if (sessions.length === 0) return null;
    const avgExcitation = (sessions.reduce((acc, s) => acc + parseInt(s.excitation), 0) / sessions.length).toFixed(1);
    const focusRate = (sessions.filter(s => s.reactionSociale === 'indifference').length / sessions.length * 100).toFixed(0);
    return { avgExcitation, focusRate };
  };

  const stats = calculateStats();

  const handleSendEmail = () => {
    const subject = `Bilan de suivi : Évolution de la transition`;
    const body = `Bonjour,\n\nVoici le bilan des dernières sessions.\n\nStatistiques :\n- Excitation moyenne : ${stats?.avgExcitation}/5\n- Taux de focus : ${stats?.focusRate}%\n\nNotes récentes : ${sessions[0]?.notes}\n\nCordialement,\nVotre Comportementaliste.`;
    window.location.href = `mailto:client@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10 shadow-2xl font-sans text-gray-800">
      
      {/* HEADER DYNAMIQUE */}
      <header className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white p-6 rounded-b-[2.5rem] shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity size={28} className="text-green-400" /> Etho-Track
            </h1>
            <p className="text-indigo-100 text-xs opacity-80 uppercase tracking-widest mt-1">Bilan Transition Caninne</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <MapPin size={20} />
          </div>
        </div>

        {/* MINI DASHBOARD */}
        {stats && (
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 flex-1 p-3 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
              <p className="text-[10px] uppercase opacity-70">Focus</p>
              <p className="text-xl font-bold">{stats.focusRate}%</p>
            </div>
            <div className="bg-white/10 flex-1 p-3 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
              <p className="text-[10px] uppercase opacity-70">Excitation</p>
              <p className="text-xl font-bold">{stats.avgExcitation}/5</p>
            </div>
          </div>
        )}
      </header>

      <main className="p-4 space-y-6 -mt-4">
        
        {/* SECTION 1 : FORMULAIRE TERRAIN */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-indigo-900 font-bold flex items-center gap-2 border-b pb-2">
            <ClipboardList size={20} className="text-indigo-600" /> Saisie Terrain
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Milieu</label>
              <select name="environnement" value={formData.environnement} onChange={handleChange} className="w-full p-2 bg-gray-50 border-none rounded-xl text-sm mt-1">
                <option value="campagne">🏞️ Campagne</option>
                <option value="ville">🏙️ Ville</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Activité</label>
              <select name="typeSortie" value={formData.typeSortie} onChange={handleChange} className="w-full p-2 bg-gray-50 border-none rounded-xl text-sm mt-1">
                <option value="travail">🎯 Recherche</option>
                <option value="mulotage">🐭 Mulotage</option>
                <option value="social">🤝 Social</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Latence Déconnexion</label>
            <select name="latence" value={formData.latence} onChange={handleChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm mt-1">
              <option value="1">Immédiate (< 2s)</option>
              <option value="2">Modérée (2s - 10s)</option>
              <option value="3">Difficile (> 10s)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase flex justify-between">
              Niveau Excitation <span>{formData.excitation}/5</span>
            </label>
            <input 
              type="range" name="excitation" min="1" max="5" 
              value={formData.excitation} onChange={handleChange}
              className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Réaction Sociale Humaine</label>
            <select name="reactionSociale" value={formData.reactionSociale} onChange={handleChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm mt-1">
              <option value="indifference">😐 Focus Maître</option>
              <option value="vigilance">🧐 Vigilance</option>
              <option value="tension">🐕 Tension laisse</option>
              <option value="contact">🚀 Fonce au contact</option>
            </select>
          </div>

          <textarea 
            name="notes" value={formData.notes} onChange={handleChange}
            placeholder="Notes (vent, stimuli particuliers...)"
            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm h-20 outline-none focus:ring-1 focus:ring-indigo-400"
          ></textarea>

          <button 
            onClick={handleSaveSession}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save size={20} /> ENREGISTRER LA SESSION
          </button>
        </div>

        {/* SECTION 2 : ACTIONS RAPPORT */}
        {sessions.length > 0 && (
          <div className="flex gap-3">
            <button 
              onClick={() => setShowReport(!showReport)}
              className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText size={18} /> {showReport ? "Masquer" : "Voir Rapport"}
            </button>
            <button 
              onClick={handleSendEmail}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Send size={18} /> Envoyer Client
            </button>
          </div>
        )}

        {/* AFFICHAGE DU RAPPORT ANALYTIQUE */}
        {showReport && stats && (
          <div className="bg-indigo-50 p-5 rounded-3xl border-2 border-dashed border-indigo-200 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <Target size={18} /> Analyse des tendances
            </h3>
            <div className="space-y-3 text-sm text-indigo-800">
              <p className="flex justify-between border-b border-indigo-100 pb-1">
                <span>Stabilité émotionnelle :</span>
                <span className="font-bold">{stats.avgExcitation < 3 ? "Excellente" : "À surveiller"}</span>
              </p>
              <p className="flex justify-between border-b border-indigo-100 pb-1">
                <span>Renoncement social :</span>
                <span className="font-bold">{stats.focusRate}% de réussite</span>
              </p>
              <div className="mt-4 p-3 bg-white rounded-xl text-xs italic text-gray-600 shadow-sm">
                "La chienne semble ${stats.avgExcitation > 3 ? 'saturée' : 'équilibrée'}. 
                ${stats.focusRate < 50 ? 'Renforcer les exercices de calme.' : 'Prête pour une immersion urbaine modérée.'}"
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EthoTrackApp;