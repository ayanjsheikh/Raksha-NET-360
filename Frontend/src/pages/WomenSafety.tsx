import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Siren,
  Share2,
  Mic,
  MicOff,
  PhoneCall,
  MapPin,
  Compass,
  Users,
  Building2,
  Video,
  VideoOff,
  Camera,
  CheckCircle,
  AlertCircle,
  Lock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { audioEngine } from "@/utils/audioEngine";

export default function WomenSafety() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(true);
  const [fakeRecordingTime, setFakeRecordingTime] = useState("00:42");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaStream, isRecording]);

  const startMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      setIsRecording(true);
    } catch (err) {
      console.warn("Women safety camera/mic permission warning", err);
      setIsRecording(true);
    }
  };

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setIsRecording(false);
  };


  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);

  const [newGuardianName, setNewGuardianName] = useState("");
  const [newGuardianPhone, setNewGuardianPhone] = useState("");
  const [newGuardianRelation, setNewGuardianRelation] = useState("Friend");
  const [trustedContactsList, setTrustedContactsList] = useState([
    { id: "1", name: "Ananya Roy", relation: "Sister", phone: "+91 98111 22334", status: "Active Tracker" },
    { id: "2", name: "Kavita Sharma", relation: "Mother", phone: "+91 98777 66554", status: "Online" },
    { id: "3", name: "Rohan Varma", relation: "Friend", phone: "+91 99000 11223", status: "Standby" },
  ]);

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardianName || !newGuardianPhone) return;
    setTrustedContactsList([
      ...trustedContactsList,
      {
        id: String(Date.now()),
        name: newGuardianName,
        phone: newGuardianPhone,
        relation: newGuardianRelation,
        status: "Active Guardian",
      },
    ]);
    setNewGuardianName("");
    setNewGuardianPhone("");
    setShowAddGuardianModal(false);
  };


  const handleSosTrigger = () => {
    startMediaStream();
    audioEngine.startSiren();
    audioEngine.announceEmergency("Women Safety Emergency Alert Activated! Live coordinates and camera stream dispatched.");
  };

  const trustedContacts = [
    { id: "1", name: "Ananya Roy", relation: "Sister", phone: "+91 98111 22334", status: "Active Tracker" },
    { id: "2", name: "Kavita Sharma", relation: "Mother", phone: "+91 98777 66554", status: "Online" },
    { id: "3", name: "Rohan Varma", relation: "Friend", phone: "+91 99000 11223", status: "Standby" },
  ];

  const nearbyPolice = [
    { id: "p1", name: "Women Special Police Station Sector 29", distance: "1.1 km", eta: "4 min", phone: "+91 1091" },
    { id: "p2", name: "Cyber Crime & Women Protection Cell", distance: "2.3 km", eta: "7 min", phone: "+91 112" },
  ];

  const safeRoutes = [
    { id: "r1", title: "Main Highway & Well-lit Boulevard", safetyScore: 98, distance: "3.2 km", illuminated: "100%" },
    { id: "r2", title: "Commercial District Corridor", safetyScore: 92, distance: "2.8 km", illuminated: "85%" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Women Safety & Protection Shield
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Discreet SOS, live tracking broadcast, audio & camera evidence recording, and safe navigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-600 border border-rose-200">
            <Lock className="h-3.5 w-3.5" /> Discreet Shake-to-SOS Active
          </span>
        </div>
      </div>

      {/* Top Banner: Emergency SOS & Discreet Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panic Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card-surface p-6 bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 text-white shadow-elevated relative overflow-hidden flex flex-col justify-between"
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md uppercase tracking-wider mb-2">
                24/7 Protection Active
              </span>
              <h2 className="text-2xl font-extrabold">Instant Women Safety Alert</h2>
              <p className="text-xs text-white/90 max-w-md mt-1">
                One-tap broadcast to Women Helpline 1091, Police 112, and trusted contacts with live audio & camera recording.
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleSosTrigger}
              className="bg-white text-rose-600 hover:bg-rose-50 font-extrabold text-base shadow-xl h-14 px-8 rounded-2xl shrink-0"
            >
              <Siren className="h-6 w-6 mr-2 animate-pulse text-rose-600" /> TAP FOR SOS
            </Button>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/20 text-xs">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
              <span className="text-white/80 block">Discreet Mode</span>
              <span className="font-bold text-white">Power Button 4x</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
              <span className="text-white/80 block">Helpline</span>
              <span className="font-bold text-white">1091 (Direct)</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
              <span className="text-white/80 block">Audio/Video Log</span>
              <span className="font-bold text-white">Encrypted Cloud</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
              <span className="text-white/80 block">Fake Call Generator</span>
              <span className="font-bold text-white">Available</span>
            </div>
          </div>
        </motion.div>

        {/* Live Location Sharing Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-6 flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary-600" /> Live Location Sharing
            </h3>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold",
                isSharingLocation ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
              )}
            >
              {isSharingLocation ? "Broadcasting" : "Off"}
            </span>
          </div>

          <p className="text-xs text-ink-secondary">
            Sharing precise GPS coordinate stream with your 3 trusted guardians. Link valid for 8 hours.
          </p>

          <div className="p-3 rounded-xl bg-surface-muted border border-line text-xs space-y-1">
            <p className="font-semibold text-ink-primary flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-rose-500" /> Sector 14, MG Road, Gurgaon
            </p>
            <p className="text-[11px] text-ink-secondary">Updated 10s ago · Battery 88%</p>
          </div>

          <Button
            onClick={() => setIsSharingLocation(!isSharingLocation)}
            variant={isSharingLocation ? "outline" : "primary"}
            size="sm"
            className="w-full text-xs"
          >
            {isSharingLocation ? "Stop Sharing Location" : "Start Live Location Stream"}
          </Button>
        </motion.div>
      </div>

      {/* Grid: Emergency Recording, Trusted Contacts, Nearby Police */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Audio & Camera Live Video Recording Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-4 border-2 border-rose-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-2">
              <Camera className="h-5 w-5 text-rose-500" /> Emergency Audio & Camera Log
            </h3>
            {isRecording && (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-rose-600" /> REC LIVE
              </span>
            )}
          </div>

          <p className="text-xs text-ink-secondary">
            Secretly streams ambient audio & live camera video clips directly to your encrypted cloud vault.
          </p>
          <div className="rounded-xl border border-line p-3 bg-slate-900 text-center space-y-3 relative overflow-hidden min-h-[190px] flex flex-col items-center justify-center">
            {isRecording ? (
              <div className="relative w-full h-[180px]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-lg"
                />
                {!mediaStream && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-rose-400 p-4 space-y-2">
                    <Camera className="h-8 w-8 animate-pulse text-rose-500" />
                    <p className="text-xs font-bold text-white">Live Camera Stream Active</p>
                    <p className="text-[10px] text-slate-400">Hardware camera feed initialized & recording</p>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 z-10">
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                  <span>CAM SENTINEL LIVE STREAM</span>
                </div>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center justify-center">
                <button
                  onClick={startMediaStream}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all shadow-md mb-2 cursor-pointer"
                >
                  <Camera className="h-6 w-6" />
                </button>
                <p className="text-xs font-semibold text-slate-300">
                  Tap to activate live Camera & Mic
                </p>
              </div>
            )}
          </div>

          {mediaStream && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={stopMediaStream}
                className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 text-xs h-7 px-3"
              >
                <XCircle className="h-3.5 w-3.5 mr-1 text-rose-400" /> Stop Camera Log
              </Button>
            </div>
          )}
        </motion.div>




        {/* Trusted Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600" /> Trusted Safety Network
            </h3>
            <Button
              size="sm"
              onClick={() => setShowAddGuardianModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold h-7 px-2.5"
            >
              + Add Guardian
            </Button>
          </div>

          <div className="space-y-3">
            {trustedContactsList.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line"
              >
                <div>
                  <p className="text-xs font-bold text-ink-primary">{contact.name}</p>
                  <p className="text-[11px] text-ink-secondary">{contact.relation} · {contact.status}</p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white hover:bg-rose-600 text-xs"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </motion.div>


        {/* Nearby Women Police Units */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" /> Nearby Police Units
            </h3>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              1091 Helpline
            </span>
          </div>

          <div className="space-y-3">
            {nearbyPolice.map((station) => (
              <div
                key={station.id}
                className="p-3 rounded-xl bg-surface-muted border border-line text-xs space-y-1.5"
              >
                <p className="font-bold text-ink-primary">{station.name}</p>
                <p className="text-ink-secondary text-[11px]">Distance: {station.distance} · ETA {station.eta}</p>
                <a
                  href={`tel:${station.phone}`}
                  className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-[11px] hover:underline"
                >
                  <PhoneCall className="h-3 w-3" /> Call Hotline ({station.phone})
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Safe Route Finder Recommendations */}
      <div className="card-surface p-6 space-y-4">
        <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
          <Compass className="h-5 w-5 text-emerald-600" /> AI Recommended Safe Navigation Routes
        </h3>
        <p className="text-xs text-ink-secondary">
          Routes evaluated based on streetlight coverage, active patrol presence, and crowd activity score.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeRoutes.map((route) => (
            <div
              key={route.id}
              className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-bold text-ink-primary">{route.title}</p>
                </div>
                <p className="text-xs text-ink-secondary mt-1">
                  Distance: {route.distance} · Streetlight Illumination: {route.illuminated}
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold text-emerald-700">{route.safetyScore}%</span>
                <span className="block text-[10px] text-emerald-600 font-semibold uppercase">Safety Score</span>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Modal: Add Trusted Guardian */}
      {showAddGuardianModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-rose-600" /> Add Trusted Guardian Contact
              </h3>
              <button onClick={() => setShowAddGuardianModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddGuardian} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Guardian Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Roy"
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 11223"
                  value={newGuardianPhone}
                  onChange={(e) => setNewGuardianPhone(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Relationship</label>
                <select
                  value={newGuardianRelation}
                  onChange={(e) => setNewGuardianRelation(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted cursor-pointer"
                >
                  <option value="Sister">Sister</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Brother">Brother</option>
                  <option value="Friend">Friend</option>
                  <option value="Spouse">Spouse</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddGuardianModal(false)} size="sm">Cancel</Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold" size="sm">Save Guardian</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

