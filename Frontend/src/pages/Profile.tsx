import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Shield,
  Heart,
  Edit3,
  CheckCircle2,
  FileText,
  Save,
  QrCode,
  Printer,
  Plus,
  Activity,
  Award,
  Download,
  Users,
  Camera,
  HeartPulse,
  Briefcase,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { emergencyContacts, medicalId } from "@/data/dashboardData";
import { cn } from "@/utils/cn";


// Multi-profile dataset for instant profile switching shortcut
const profileOptions = [
  {
    id: "self",
    relation: "Self (Primary)",
    avatarBg: "bg-primary-600",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    address: "Sector 14, MG Road, Gurgaon, HR - 122001",
    bloodGroup: "O+",
    height: "175 cm",
    weight: "72 kg",
    doctorName: "Dr. Sameer Verma (Apollo Cardiology)",
    insuranceId: "STAR-HEALTH-994812",
    allergies: "Penicillin, Peanuts",
    conditions: "Mild Asthma, Seasonal Rhinitis",
    emergencyContactName: "Priya Sharma (Spouse)",
    emergencyContactPhone: "+91 98111 22334",
    organDonor: "Yes (Registered Donor)",
  },
  {
    id: "spouse",
    relation: "Spouse",
    avatarBg: "bg-rose-600",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98111 22334",
    address: "Sector 14, MG Road, Gurgaon, HR - 122001",
    bloodGroup: "A+",
    height: "162 cm",
    weight: "58 kg",
    doctorName: "Dr. Ananya Roy (Max Healthcare)",
    insuranceId: "STAR-HEALTH-994813",
    allergies: "Dust Mites",
    conditions: "None Reported",
    emergencyContactName: "Aarav Sharma (Husband)",
    emergencyContactPhone: "+91 98765 43210",
    organDonor: "Yes (Registered Donor)",
  },
  {
    id: "child",
    relation: "Child (Dependent)",
    avatarBg: "bg-amber-600",
    name: "Kavya Sharma",
    email: "kavya.parent@example.com",
    phone: "+91 98765 43210 (Parent)",
    address: "Sector 14, MG Road, Gurgaon, HR - 122001",
    bloodGroup: "O+",
    height: "110 cm",
    weight: "18.5 kg",
    doctorName: "Dr. Rahul Mehta (Pediatric Specialist)",
    insuranceId: "STAR-HEALTH-994814",
    allergies: "Lactose Sensitivity",
    conditions: "Child Immunization Up to Date",
    emergencyContactName: "Aarav Sharma (Father)",
    emergencyContactPhone: "+91 98765 43210",
    organDonor: "N/A (Minor)",
  },
  {
    id: "elderly",
    relation: "Senior (Dependent)",
    avatarBg: "bg-indigo-600",
    name: "Ramesh Kumar",
    email: "ramesh.kumar@example.com",
    phone: "+91 98999 44332",
    address: "Sector 14, MG Road, Gurgaon, HR - 122001",
    bloodGroup: "B+",
    height: "168 cm",
    weight: "65 kg",
    doctorName: "Dr. Rajesh Varma (Geriatric Care)",
    insuranceId: "STAR-HEALTH-994815",
    allergies: "Sulfa Drugs",
    conditions: "Hypertension, Type 2 Diabetes",
    emergencyContactName: "Aarav Sharma (Son)",
    emergencyContactPhone: "+91 98765 43210",
    organDonor: "Yes (Registered Donor)",
  },
];

const avatarPresets = [
  "👨‍⚕️", "👩‍⚕️", "👨‍💻", "👩‍💼", "👴", "👶", "🦸‍♀️", "🏃‍♂️"
];

export default function Profile() {
  const { user } = useAuth();
  const [activeProfileId, setActiveProfileId] = useState("self");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "medical" | "emergency">("personal");

  // Profile Form States
  const currentProf = profileOptions.find((p) => p.id === activeProfileId) || profileOptions[0];
  const [name, setName] = useState(currentProf.name);
  const [email, setEmail] = useState(currentProf.email);
  const [phone, setPhone] = useState(currentProf.phone);
  const [address, setAddress] = useState(currentProf.address);
  const [bloodGroup, setBloodGroup] = useState(currentProf.bloodGroup);
  const [height, setHeight] = useState(currentProf.height);
  const [weight, setWeight] = useState(currentProf.weight);
  const [doctorName, setDoctorName] = useState(currentProf.doctorName);
  const [insuranceId, setInsuranceId] = useState(currentProf.insuranceId);
  const [allergies, setAllergies] = useState(currentProf.allergies);
  const [conditions, setConditions] = useState(currentProf.conditions);
  const [emergencyContactName, setEmergencyContactName] = useState(currentProf.emergencyContactName);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(currentProf.emergencyContactPhone);
  const [organDonor, setOrganDonor] = useState(currentProf.organDonor);
  
  const [selectedAvatar, setSelectedAvatar] = useState("👤");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [saved, setSaved] = useState(false);

  // Emergency Contacts List State
  const [emergencyContactsList, setEmergencyContactsList] = useState([
    { id: "ec-1", name: "Priya Sharma", relation: "Spouse", phone: "+91 98111 22334", priority: "Primary Guardian" },
    { id: "ec-2", name: "Dr. Sameer Verma", relation: "Physician", phone: "+91 98765 44332", priority: "Apollo Cardiology" },
    { id: "ec-3", name: "Vikram Sharma", relation: "Brother", phone: "+91 99000 11223", priority: "Secondary Backup" },
  ]);

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("Spouse");
  const [newContactPriority, setNewContactPriority] = useState("Primary Guardian");

  const handleAddEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    setEmergencyContactsList([
      ...emergencyContactsList,
      {
        id: String(Date.now()),
        name: newContactName,
        phone: newContactPhone,
        relation: newContactRelation,
        priority: newContactPriority,
      },
    ]);
    setNewContactName("");
    setNewContactPhone("");
    setShowAddContactModal(false);
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContactsList(emergencyContactsList.filter((c) => c.id !== id));
  };


  const handleProfileSwitch = (id: string) => {
    const prof = profileOptions.find((p) => p.id === id);
    if (!prof) return;
    setActiveProfileId(id);
    setName(prof.name);
    setEmail(prof.email);
    setPhone(prof.phone);
    setAddress(prof.address);
    setBloodGroup(prof.bloodGroup);
    setHeight(prof.height);
    setWeight(prof.weight);
    setDoctorName(prof.doctorName);
    setInsuranceId(prof.insuranceId);
    setAllergies(prof.allergies);
    setConditions(prof.conditions);
    setEmergencyContactName(prof.emergencyContactName);
    setEmergencyContactPhone(prof.emergencyContactPhone);
    setOrganDonor(prof.organDonor);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            User Profile & Medical Passport
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Personal health ID, multi-family profile switching, and encrypted medical pass.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowQrModal(true)}
            variant="outline"
            className="border-primary-500 text-primary-700 bg-primary-50 hover:bg-primary-100 font-bold gap-2 text-xs"
          >
            <QrCode className="h-4 w-4 text-primary-600" /> Medical QR Pass
          </Button>

          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold gap-2 text-xs shadow-md"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* Quick Profile Switcher Shortcut Toolbar */}
      <div className="card-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-primary-600">
        <div className="flex items-center gap-2 text-xs font-bold text-ink-primary">
          <UserCheck className="h-4 w-4 text-primary-600" />
          <span>Switch Active Profile Shortcut:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {profileOptions.map((prof) => (
            <button
              key={prof.id}
              onClick={() => handleProfileSwitch(prof.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                activeProfileId === prof.id
                  ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                  : "bg-surface-muted text-ink-primary border-line hover:border-primary-400"
              )}
            >
              {prof.relation}
            </button>
          ))}
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Profile and Medical Passport details updated!
        </motion.div>
      )}

      {/* Top Banner Hero Card */}
      <div className="card-surface p-6 bg-gradient-hero text-white shadow-elevated rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="relative group shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-4xl font-black shrink-0 ring-4 ring-white/30 text-white">
              {selectedAvatar !== "👤" ? selectedAvatar : name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg border border-white hover:bg-primary-700 transition-all cursor-pointer"
              title="Change Profile Avatar Shortcut"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold">{name}</h2>
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                VERIFIED MEDICAL PASS
              </span>
            </div>
            <p className="text-xs text-white/90 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-3.5 w-3.5" /> {email} · <Phone className="h-3.5 w-3.5" /> {phone}
            </p>
            <p className="text-xs text-white/80 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-rose-300" /> {address}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
                Blood Group: {bloodGroup}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
                Height: {height} · Weight: {weight}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
                Insurance ID: {insuranceId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <button
          onClick={() => setActiveTab("personal")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
            activeTab === "personal"
              ? "bg-primary-600 text-white"
              : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
          )}
        >
          Personal & Contact Details
        </button>
        <button
          onClick={() => setActiveTab("medical")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
            activeTab === "medical"
              ? "bg-primary-600 text-white"
              : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
          )}
        >
          Medical History & Vitals
        </button>
        <button
          onClick={() => setActiveTab("emergency")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
            activeTab === "emergency"
              ? "bg-primary-600 text-white"
              : "bg-surface-muted text-ink-secondary hover:text-ink-primary"
          )}
        >
          Emergency Guardians & Doctors
        </button>
      </div>

      {/* Tab Content 1: Personal Information */}
      {activeTab === "personal" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary-600" /> Editable Personal & Contact Record
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Full Name</label>
              <Input
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Email Address</label>
              <Input
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Mobile Phone Number</label>
              <Input
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Residential Address</label>
              <Input
                disabled={!isEditing}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Content 2: Medical History */}
      {activeTab === "medical" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
            <Shield className="h-5 w-5 text-danger-500" /> Medical Passport & Biometric Record
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line">
              <span className="text-ink-secondary font-medium">Blood Group</span>
              {isEditing ? (
                <Input
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="h-8 text-xs font-bold mt-1 bg-white"
                />
              ) : (
                <p className="text-xl font-extrabold text-danger-600 mt-1">{bloodGroup}</p>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line">
              <span className="text-ink-secondary font-medium">Height</span>
              {isEditing ? (
                <Input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-8 text-xs font-bold mt-1 bg-white"
                />
              ) : (
                <p className="text-base font-bold text-ink-primary mt-1">{height}</p>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line">
              <span className="text-ink-secondary font-medium">Weight</span>
              {isEditing ? (
                <Input
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-8 text-xs font-bold mt-1 bg-white"
                />
              ) : (
                <p className="text-base font-bold text-ink-primary mt-1">{weight}</p>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line">
              <span className="text-ink-secondary font-medium">Organ Donor Status</span>
              {isEditing ? (
                <Input
                  value={organDonor}
                  onChange={(e) => setOrganDonor(e.target.value)}
                  className="h-8 text-xs font-bold mt-1 bg-white"
                />
              ) : (
                <p className="text-xs font-bold text-emerald-600 mt-1">{organDonor}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Known Allergies</label>
              <Input
                disabled={!isEditing}
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Pre-existing Chronic Conditions</label>
              <Input
                disabled={!isEditing}
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Health Insurance ID Number</label>
              <Input
                disabled={!isEditing}
                value={insuranceId}
                onChange={(e) => setInsuranceId(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Content 3: Emergency Contacts */}
      {activeTab === "emergency" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line">
            <div>
              <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <Phone className="h-5 w-5 text-rose-600" /> Emergency Guardians & Contact Network
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Contacts notified automatically when an Emergency SOS or Fall Alarm is triggered.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddContactModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs gap-1.5 shrink-0 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Emergency Contact
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Primary Emergency Contact Name</label>
              <Input
                disabled={!isEditing}
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
            <div>
              <label className="text-ink-secondary block font-semibold mb-1">Primary Emergency Contact Phone</label>
              <Input
                disabled={!isEditing}
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-ink-secondary block font-semibold mb-1">Primary Physician / Hospital</label>
              <Input
                disabled={!isEditing}
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="h-9 text-xs bg-surface-muted"
              />
            </div>
          </div>

          {/* List of Emergency Contacts */}
          <div className="pt-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Active SOS Contact List ({emergencyContactsList.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyContactsList.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-xl bg-surface-muted border border-line flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink-primary">{contact.name}</p>
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {contact.relation}
                      </span>
                    </div>
                    <p className="text-ink-secondary">{contact.phone}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{contact.priority}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
                      title="Call Emergency Contact"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold"
                        title="Remove Contact"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}


      {/* Modal: Avatar Picker Shortcut */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary-600" /> Select Profile Avatar Emoji
              </h3>
              <button onClick={() => setShowAvatarModal(false)} className="font-bold text-lg">×</button>
            </div>

            <div className="grid grid-cols-4 gap-3 py-2">
              {avatarPresets.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setSelectedAvatar(emoji);
                    setShowAvatarModal(false);
                  }}
                  className="h-14 text-2xl flex items-center justify-center rounded-xl bg-surface-muted border border-line hover:bg-primary-50 hover:border-primary-400 cursor-pointer transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowAvatarModal(false)} className="text-xs">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal: Digital QR Medical Pass */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-line text-center text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary-600" /> Digital Medical Emergency Pass
              </h3>
              <button onClick={() => setShowQrModal(false)} className="font-bold text-lg">×</button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-muted border border-line inline-block">
              {/* QR Code SVG */}
              <svg className="w-40 h-40 mx-auto" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                <path d="M10 10h30v30h-30zM15 15v20h20v-20zM20 20h10v10h-10z" fill="#0f172a" />
                <path d="M60 10h30v30h-30zM65 15v20h20v-20zM70 20h10v10h-10z" fill="#0f172a" />
                <path d="M10 60h30v30h-30zM15 65v20h20v-20zM20 70h10v10h-10z" fill="#0f172a" />
                <path d="M50 50h10v10h-10zM70 50h20v10h-20zM50 70h20v20h-20zM80 80h10v10h-10z" fill="#0f172a" />
              </svg>
              <p className="text-[11px] font-bold text-ink-secondary mt-2">SCAN FOR INSTANT MEDICAL ID</p>
            </div>

            <div className="text-xs space-y-1 text-ink-secondary">
              <p className="font-bold text-ink-primary">{name} ({bloodGroup})</p>
              <p>Height: {height} · Weight: {weight}</p>
              <p>Emergency Contact: {emergencyContactName} ({emergencyContactPhone})</p>
              <p>Insurance Policy: {insuranceId}</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button size="sm" onClick={() => window.print()} className="bg-primary-600 text-white font-bold gap-1 text-xs">
                <Printer className="h-3.5 w-3.5" /> Print Pass
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowQrModal(false)} className="text-xs">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal: Add Emergency Contact */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-line text-ink-primary"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Phone className="h-5 w-5 text-rose-600" /> Add New Emergency Contact
              </h3>
              <button onClick={() => setShowAddContactModal(false)} className="font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddEmergencyContact} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Full Name</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Dr. Vikram Varma"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>

              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Phone Number</label>
                <Input
                  type="tel"
                  required
                  placeholder="+91 98000 12345"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted"
                />
              </div>

              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">Relationship</label>
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted cursor-pointer font-medium"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Physician">Physician / Doctor</option>
                  <option value="Guardian">Legal Guardian</option>
                  <option value="Neighbor">Neighbor</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink-secondary mb-1 block">SOS Priority Level</label>
                <select
                  value={newContactPriority}
                  onChange={(e) => setNewContactPriority(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-surface-muted cursor-pointer font-medium"
                >
                  <option value="Primary Guardian">Primary Guardian (1st Call)</option>
                  <option value="Secondary Backup">Secondary Backup</option>
                  <option value="Medical Specialist">Medical Specialist</option>
                  <option value="Neighborhood Assist">Neighborhood Assist</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddContactModal(false)} size="sm">
                  Cancel
                </Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold" size="sm">
                  Save Emergency Contact
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}



