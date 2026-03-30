"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogOut,
  User,
  Droplet,
  Search,
  ShieldCheck,
  Wind,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  HeartHandshake,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [specialData, setSpecialData] = useState<any>(null);

  // States for updating
  const [lastDonation, setLastDonation] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // ১. প্রোফাইল ডাটা আনা
      const { data: profileData } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        if (profileData.last_donation_date) {
          setLastDonation(profileData.last_donation_date);
        }

        // ২. স্পেশাল ডাটা আনা
        if (profileData.account_type === "volunteer") {
          const { data: volData } = await supabase
            .from("volunteers")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          setSpecialData(volData);
        } else if (profileData.account_type === "oxygen") {
          const { data: oxyData } = await supabase
            .from("oxygen_suppliers")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          setSpecialData(oxyData);
        }
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const updateDonationDate = async () => {
    if (!lastDonation) return;
    setUpdating(true);
    const { error } = await supabase
      .from("users_profiles")
      .update({ last_donation_date: lastDonation })
      .eq("user_id", profile.user_id);
    setUpdating(false);
    if (!error) alert("Donation date updated successfully!");
  };

  const toggleStatus = async () => {
    if (!specialData) return;
    setUpdating(true);
    const newStatus = !specialData.is_available;

    if (profile.account_type === "volunteer") {
      await supabase
        .from("volunteers")
        .update({ is_available: newStatus })
        .eq("user_id", profile.user_id);
    } else if (profile.account_type === "oxygen") {
      await supabase
        .from("oxygen_suppliers")
        .update({ is_available: newStatus })
        .eq("user_id", profile.user_id);
    }

    setSpecialData({ ...specialData, is_available: newStatus });
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">
          Loading secure dashboard...
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050505] py-10 pt-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* ================= COMMON HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-lg mb-8 gap-4">
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                profile.account_type === "donor"
                  ? "bg-red-600 shadow-red-600/30"
                  : profile.account_type === "oxygen"
                    ? "bg-blue-600 shadow-blue-600/30"
                    : profile.account_type === "volunteer"
                      ? "bg-emerald-600 shadow-emerald-600/30"
                      : "bg-slate-700 shadow-slate-700/30"
              }`}
            >
              {profile.account_type === "donor" && (
                <HeartHandshake className="w-8 h-8" />
              )}
              {profile.account_type === "oxygen" && (
                <Wind className="w-8 h-8" />
              )}
              {profile.account_type === "volunteer" && (
                <ShieldCheck className="w-8 h-8" />
              )}
              {profile.account_type === "finder" && (
                <Search className="w-8 h-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {profile.full_name}
              </h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1 bg-slate-800 inline-block px-3 py-1 rounded-full">
                {profile.account_type} Account
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="rounded-xl cursor-pointer font-bold bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ================= SIDEBAR (COMMON PROFILE DATA) ================= */}
          <Card className="md:col-span-1 rounded-3xl border-slate-800 shadow-sm bg-slate-900/30 backdrop-blur-xl h-fit">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
                Profile Identity
              </h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone Number</p>
                    <p>{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p>{profile.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 capitalize">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Occupation</p>
                    <p>{profile.occupation.replace("_", " ")}</p>
                  </div>
                </div>
                {profile.blood_group && (
                  <div className="flex items-center gap-3 text-red-400 font-bold bg-red-950/30 border border-red-900/50 p-4 rounded-xl mt-4">
                    <Droplet className="w-6 h-6 fill-red-500/20" />
                    <div>
                      <p className="text-xs text-red-500/70 font-semibold">
                        Blood Group
                      </p>
                      <p className="text-lg">{profile.blood_group}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ================= DYNAMIC DASHBOARD VIEWS ================= */}
          <div className="md:col-span-2 space-y-6">
            {profile.account_type === "finder" && <FinderDashboard />}

            {profile.account_type === "donor" && (
              <DonorDashboard
                lastDonation={lastDonation}
                setLastDonation={setLastDonation}
                updateDonationDate={updateDonationDate}
                updating={updating}
              />
            )}

            {profile.account_type === "oxygen" && specialData && (
              <OxygenDashboard
                specialData={specialData}
                toggleStatus={toggleStatus}
                updating={updating}
              />
            )}

            {profile.account_type === "volunteer" && specialData && (
              <VolunteerDashboard
                specialData={specialData}
                toggleStatus={toggleStatus}
                updating={updating}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= MODULAR COMPONENTS (Separated Logic) =================

// ১. Finder Dashboard
function FinderDashboard() {
  return (
    <Card className="rounded-3xl border-slate-800 shadow-sm bg-slate-900/40 backdrop-blur-md">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
          <div className="p-3 bg-slate-800 rounded-xl">
            <Search className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Search Directory</h2>
            <p className="text-slate-400 text-sm">
              Find emergency help quickly
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/#search-section"
            className="flex items-center justify-between p-5 rounded-2xl bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Droplet className="w-6 h-6 text-red-500" />
              <span className="font-bold text-slate-200">Find Blood</span>
            </div>
            <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/#oxygen-section"
            className="flex items-center justify-between p-5 rounded-2xl bg-blue-950/20 border border-blue-900/30 hover:bg-blue-950/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Wind className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-slate-200">Find Oxygen</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ২. Donor Dashboard (With Eligibility Logic)
function DonorDashboard({
  lastDonation,
  setLastDonation,
  updateDonationDate,
  updating,
}: any) {
  // Eligibility Check
  const isEligible = () => {
    if (!lastDonation) return true;
    const diffTime = Math.abs(
      new Date().getTime() - new Date(lastDonation).getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90;
  };
  const eligible = isEligible();

  return (
    <Card className="rounded-3xl border-red-900/30 shadow-sm bg-red-950/10 backdrop-blur-md">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Calendar className="w-6 h-6 text-red-500" /> Donation Tracker
            </h2>
            <p className="text-slate-400 mt-1">
              Update your latest blood donation date
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider border flex items-center gap-2 ${eligible ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-red-950/50 text-red-400 border-red-900"}`}
          >
            {eligible ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Eligible to Donate
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" /> Resting Phase
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <label className="block text-sm font-bold text-slate-300 mb-3">
            When did you last donate blood?
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="date"
              value={lastDonation}
              onChange={(e) => setLastDonation(e.target.value)}
              className="h-14 rounded-xl font-medium bg-slate-950 border-slate-800 text-white"
            />
            <Button
              onClick={updateDonationDate}
              disabled={updating}
              className="h-14 px-8 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
            >
              {updating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Save Date"
              )}
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-4 font-medium flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            Your profile will be automatically hidden from search results for 90
            days after this date to ensure your health safety.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ৩. Oxygen Supplier Dashboard
function OxygenDashboard({ specialData, toggleStatus, updating }: any) {
  return (
    <Card className="rounded-3xl border-blue-900/30 shadow-sm bg-blue-950/10 backdrop-blur-md">
      <CardContent className="p-8 text-center flex flex-col items-center">
        <div className="p-4 bg-blue-500/10 rounded-full mb-4">
          <Wind className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">
          Oxygen Stock Manager
        </h2>
        <p className="text-slate-400 font-medium mb-8 max-w-md">
          Update your current oxygen availability so people know if they can
          contact you.
        </p>

        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-sm w-full max-w-md flex flex-col items-center gap-6">
          <div
            className={`px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wider flex items-center gap-2 border ${specialData.is_available ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-red-950/50 text-red-400 border-red-900"}`}
          >
            {specialData.is_available ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> IN STOCK NOW
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" /> OUT OF STOCK
              </>
            )}
          </div>

          <Button
            onClick={toggleStatus}
            disabled={updating}
            className={`w-full h-16 rounded-2xl font-bold text-lg shadow-xl transition-all hover:-translate-y-1 ${specialData.is_available ? "bg-red-500/10 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"}`}
          >
            {updating ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : specialData.is_available ? (
              "Mark as Out of Stock"
            ) : (
              "Mark as In Stock"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ৪. Volunteer Dashboard
function VolunteerDashboard({ specialData, toggleStatus, updating }: any) {
  return (
    <Card className="rounded-3xl border-emerald-900/30 shadow-sm bg-emerald-950/10 backdrop-blur-md">
      <CardContent className="p-8 text-center flex flex-col items-center">
        <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">
          Volunteer Duty Status
        </h2>
        <p className="text-slate-400 font-medium mb-8 max-w-md">
          Let the community know if you are currently available to help with
          emergencies.
        </p>

        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-sm w-full max-w-md flex flex-col items-center gap-6">
          <div
            className={`px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wider flex items-center gap-2 border ${specialData.is_available ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-amber-950/50 text-amber-400 border-amber-900"}`}
          >
            {specialData.is_available ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> ACTIVE & READY
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" /> CURRENTLY BUSY
              </>
            )}
          </div>

          <Button
            onClick={toggleStatus}
            disabled={updating}
            className={`w-full h-16 rounded-2xl font-bold text-lg shadow-xl transition-all hover:-translate-y-1 ${specialData.is_available ? "bg-amber-500/10 text-amber-500 border border-amber-900/50 hover:bg-amber-600 hover:text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"}`}
          >
            {updating ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : specialData.is_available ? (
              "Take a Break (Busy)"
            ) : (
              "Ready to Help (Active)"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
