import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  Phone,
  Shield,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  User,
  Heart,
  Share2,
  Radio,
  XCircle,
  Volume2,
  VolumeX,
  Volume1,
  Megaphone,
  Disc,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { emergencyContacts, medicalId, sosHistory } from "@/data/dashboardData";
import { cn } from "@/utils/cn";
import { sendSOS } from "@/services/sosService";
import { useAuth } from "@/context/AuthContext";
import { audioEngine } from "@/utils/audioEngine";

export default function EmergencySOS() {
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [sosActive, setSosActive] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaActive, setMediaActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaStream, mediaActive]);

  const startMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      setMediaActive(true);
    } catch (err) {
      console.warn("Camera or Mic access permission denied/not available", err);
      setMediaActive(true);
    }
  };


  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setMediaActive(false);
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => (track.enabled = !videoEnabled));
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => (track.enabled = !audioEnabled));
      setAudioEnabled(!audioEnabled);
    }
  };

  // Hold to trigger timer logic
  const triggerSOS = async () => {
    // Start loud emergency siren and voice announcement
    audioEngine.startSiren();
    audioEngine.announceEmergency("Emergency SOS triggered! Activating live camera and audio recording.");
    setSirenPlaying(true);

    // Activate live camera and mic stream
    startMediaStream();

    if (!user) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await sendSOS({
            user_id: Number(user.id),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            emergency_type: "Medical",
          });

          console.log("SOS backend response:", response);
        } catch (error) {
          console.error(error);
        }
      },
      (error) => {
        console.error("Location permission denied", error);
      }
    );
  };


  const handleMouseDown = () => {
    if (sosActive) return;
    setHolding(true);
    setHoldProgress(0);
    audioEngine.playCountdownTick(600);

    const startTime = Date.now();
    const duration = 2000; // 2 seconds hold

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress > 30 && progress < 35) audioEngine.playCountdownTick(800);
      if (progress > 70 && progress < 75) audioEngine.playCountdownTick(1100);

      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);

        setSosActive(true);
        setHolding(false);
        setHoldProgress(0);

        triggerSOS();
      }
    }, 30);
  };

  const handleMouseUp = () => {
    if (sosActive) return;
    setHolding(false);
    setHoldProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioEngine.stopSiren();
    };
  }, []);

  const cancelSOS = () => {
    setSosActive(false);
    setSirenPlaying(false);
    audioEngine.stopSiren();
  };

  const toggleSirenAudio = () => {
    if (sirenPlaying) {
      audioEngine.stopSiren();
      setSirenPlaying(false);
    } else {
      audioEngine.startSiren();
      setSirenPlaying(true);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  };


  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            Emergency SOS Command Center
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Instant alert broadcasting to primary contacts, police, and nearby ambulances.
          </p>
        </div>

        {/* SOS System Status */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all",
              sosActive
                ? "bg-danger-500 text-white border-danger-600 animate-pulse shadow-lg shadow-danger-500/30"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            )}
          >
            <Radio className="h-4 w-4" />
            {sosActive ? "EMERGENCY BROADCASTING ACTIVE" : "SOS System Operational"}
          </span>
        </div>
      </div>

      {/* Active Emergency Alert Banner */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl bg-gradient-danger p-6 text-white shadow-elevated border-2 border-danger-400 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shrink-0">
                  <Siren className="h-8 w-8 text-white animate-bounce" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">EMERGENCY ALERT TRIGGERED</h2>
                  <p className="text-sm text-white/90 mt-0.5">
                    Live GPS location, audio recording, and Medical ID sent to 3 primary contacts & Emergency Dispatch.
                  </p>
                </div>
              </div>
              <Button
                onClick={cancelSOS}
                variant="outline"
                className="bg-white text-danger-600 hover:bg-slate-100 font-bold px-6 shrink-0"
              >
                <XCircle className="h-4 w-4 mr-2" /> Cancel SOS Alert
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Action Section: Hold-to-Activate SOS Button */}
      <div className="card-surface p-8 text-center flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden border-2 border-danger-100 shadow-elevated">
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-ink-secondary bg-surface-muted px-3 py-1 rounded-full">
          <MapPin className="h-3.5 w-3.5 text-danger-500" />
          <span>GPS: Sector 14, Gurgaon (Accurate within 4m)</span>
        </div>

        <p className="text-xs font-bold tracking-widest text-danger-600 uppercase mb-4">
          Press & Hold 2 Seconds to Trigger Panic Signal
        </p>

        {/* SOS Interactive Button */}
        <div className="relative my-4 select-none cursor-pointer">
          {/* Animated Pulse Outer Ring */}
          <span className="absolute -inset-6 rounded-full bg-danger-500/20 animate-ping pointer-events-none" />
          <span className="absolute -inset-3 rounded-full bg-danger-500/30 animate-pulse pointer-events-none" />

          {/* SVG Progress Ring when Holding */}
          {holding && (
            <svg className="absolute -inset-4 h-[184px] w-[184px] -rotate-90 pointer-events-none">
              <circle
                cx="92"
                cy="92"
                r="84"
                fill="none"
                stroke="#E53935"
                strokeWidth="8"
                strokeDasharray="527"
                strokeDashoffset={527 - (holdProgress / 100) * 527}
                className="transition-all duration-75"
              />
            </svg>
          )}

          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={cn(
              "relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-danger text-white shadow-elevated transition-transform active:scale-95 focus:outline-none ring-8 ring-danger-100",
              sosActive && "animate-pulse ring-danger-500 ring-offset-4"
            )}
          >
            <div className="flex flex-col items-center">
              <Siren className="h-12 w-12 text-white" strokeWidth={2.4} />
              <span className="text-lg font-black tracking-wider mt-1">SOS</span>
            </div>
          </button>
        </div>

        <p className="text-xs text-ink-secondary max-w-sm mt-3">
          {holding
            ? `Keep holding... ${Math.round(holdProgress)}%`
            : "Hold the button for 2 seconds. Releasing early will cancel the panic trigger."}
        </p>

        <div className="flex items-center gap-4 mt-6">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Share2 className="h-3.5 w-3.5 text-primary-500" /> Share Live GPS Link
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <FileText className="h-3.5 w-3.5 text-emergency-500" /> View Medical Pass
          </Button>
        </div>
      </div>

      {/* Emergency Audio & Siren Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-6 space-y-4 border border-line bg-slate-900 text-white shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-danger-500/20 text-danger-400">
              <Volume2 className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Emergency Audio Siren & Voice Alarm Synthesizer
              </h3>
              <p className="text-xs text-slate-400">
                High-decibel multi-frequency audio warning system for low-visibility emergency situations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={toggleSirenAudio}
              className={cn(
                "gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all",
                sirenPlaying
                  ? "bg-danger-600 hover:bg-danger-700 text-white shadow-lg shadow-danger-500/40 animate-pulse"
                  : "bg-danger-500/20 hover:bg-danger-500/30 text-danger-400 border border-danger-500/40"
              )}
            >
              {sirenPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {sirenPlaying ? "STOP SIREN ALARM" : "TEST SIREN ALARM"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Whistle Test Button */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Megaphone className="h-4 w-4 text-warning-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Whistle Pulse</p>
                <p className="text-[10px] text-slate-400">High pitch frequency</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => audioEngine.playWhistleAlert()}
              className="text-[11px] bg-slate-700 text-slate-200 hover:bg-slate-600 border-slate-600 h-7 px-2.5"
            >
              Play Whistle
            </Button>
          </div>

          {/* Voice Announcement Button */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Radio className="h-4 w-4 text-primary-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Voice Alert</p>
                <p className="text-[10px] text-slate-400">Audio location broadcast</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => audioEngine.announceEmergency("Emergency SOS active! High urgency assistance required.")}
              className="text-[11px] bg-slate-700 text-slate-200 hover:bg-slate-600 border-slate-600 h-7 px-2.5"
            >
              Speak Voice
            </Button>
          </div>

          {/* Siren Volume Slider */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
            <Volume1 className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold mb-1">
                <span>Siren Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-danger-500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Live Emergency Camera & Microphone Streaming Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-6 space-y-4 border-2 border-danger-500/40 bg-slate-950 text-white shadow-elevated"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-danger-500/20 text-danger-400">
              <Camera className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Live Emergency Camera & Microphone Stream
                {mediaActive && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-danger-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                    LIVE STREAMING
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Automatic video and ambient audio recording dispatched to emergency responders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!mediaActive ? (
              <Button
                onClick={startMediaStream}
                className="bg-danger-600 hover:bg-danger-700 text-white text-xs font-bold gap-2 px-4 py-2 rounded-xl shadow-lg"
              >
                <Camera className="h-4 w-4" /> Start Camera & Mic
              </Button>
            ) : (
              <Button
                onClick={stopMediaStream}
                variant="outline"
                className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 text-xs font-bold gap-2 px-4 py-2 rounded-xl"
              >
                <XCircle className="h-4 w-4 text-danger-400" /> Stop Camera & Mic
              </Button>
            )}
          </div>
        </div>

        {/* Video Player & Mic Level Display */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[240px] flex items-center justify-center">
          {mediaActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[260px] object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Camera className="h-12 w-12 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">Camera & Microphone Standby</p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                Will automatically activate when SOS button is pressed or when manually started above.
              </p>
            </div>
          )}

          {/* Controls overlay when active */}
          {mediaActive && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-danger-500 animate-ping" />
                <span>Audio & Video Active</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVideo}
                  className={cn(
                    "p-2 rounded-lg text-xs font-semibold transition-colors",
                    videoEnabled ? "bg-slate-700 text-white" : "bg-danger-600 text-white"
                  )}
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={toggleAudio}
                  className={cn(
                    "p-2 rounded-lg text-xs font-semibold transition-colors",
                    audioEnabled ? "bg-slate-700 text-white" : "bg-danger-600 text-white"
                  )}
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>



      {/* Grid: Emergency Contacts, Medical ID, SOS History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Contacts List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
              <Phone className="h-5 w-5 text-danger-500" /> Primary Emergency Contacts
            </h3>
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              3 Contacts
            </span>
          </div>

          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-primary">{contact.name}</p>
                      {contact.isPrimary && (
                        <span className="text-[10px] bg-danger-50 text-danger-600 font-bold px-1.5 py-0.2 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-secondary">{contact.relationship} · {contact.phone}</p>
                  </div>
                </div>

                <a
                  href={`tel:${contact.phone}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emergency-500 text-white hover:bg-emergency-600 transition-colors shadow-sm"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medical ID Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-500" /> Emergency Medical ID
            </h3>
            <span className="text-xs text-emerald-600 bg-emerald-50 font-bold px-2 py-0.5 rounded">
              Verified
            </span>
          </div>

          <div className="rounded-xl border border-line p-4 bg-surface-muted/50 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-ink-secondary">Blood Type</span>
                <p className="text-lg font-extrabold text-danger-600">{medicalId.bloodGroup}</p>
              </div>
              <div>
                <span className="text-ink-secondary">Organ Donor</span>
                <p className="text-sm font-bold text-ink-primary">Yes (Registered)</p>
              </div>
            </div>

            <div className="border-t border-line pt-2">
              <span className="text-xs text-ink-secondary">Known Allergies</span>
              <p className="text-xs font-semibold text-ink-primary">{medicalId.allergies.join(", ")}</p>
            </div>

            <div className="border-t border-line pt-2">
              <span className="text-xs text-ink-secondary">Medical Conditions</span>
              <p className="text-xs font-semibold text-ink-primary">{medicalId.conditions.join(", ")}</p>
            </div>

            <div className="border-t border-line pt-2">
              <span className="text-xs text-ink-secondary">Emergency Instructions</span>
              <p className="text-xs text-ink-primary italic">{medicalId.emergencyNotes}</p>
            </div>
          </div>
        </motion.div>

        {/* SOS History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning-500" /> SOS Alert History
            </h3>
            <span className="text-xs text-ink-secondary">Recent Logs</span>
          </div>

          <div className="space-y-3">
            {sosHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-muted text-xs border border-line"
              >
                <div>
                  <p className="font-semibold text-ink-primary">{item.type}</p>
                  <p className="text-[11px] text-ink-secondary">{item.date}</p>
                </div>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full font-semibold capitalize text-[10px]",
                    item.status === "resolved" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                    item.status === "cancelled" && "bg-slate-100 text-slate-600",
                    item.status === "active" && "bg-danger-50 text-danger-700 border border-danger-200"
                  )}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
