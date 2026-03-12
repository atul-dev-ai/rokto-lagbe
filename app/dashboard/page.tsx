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
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [specialData, setSpecialData] = useState<any>(null); // For Volunteer/Oxygen status

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

        // ২. যদি Volunteer বা Oxygen হয়, তবে তাদের এক্সট্রা ডাটা আনা (স্ট্যাটাস চেঞ্জ করার জন্য)
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
  };

  // ডোনারদের রক্তদানের তারিখ আপডেট
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

  // ভলান্টিয়ার বা অক্সিজেনের এভেইলেবল স্ট্যাটাস আপডেট
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
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
        <p className="text-muted-foreground font-bold">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 🟢 Common Header for all users */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-background/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                profile.account_type === "donor"
                  ? "bg-red-500 shadow-red-500/30"
                  : profile.account_type === "oxygen"
                    ? "bg-blue-500 shadow-blue-500/30"
                    : profile.account_type === "volunteer"
                      ? "bg-emerald-500 shadow-emerald-500/30"
                      : "bg-slate-700 shadow-slate-700/30"
              }`}
            >
              {profile.account_type === "donor" && (
                <HeartHandshake className="w-7 h-7" />
              )}
              {profile.account_type === "oxygen" && (
                <Wind className="w-7 h-7" />
              )}
              {profile.account_type === "volunteer" && (
                <ShieldCheck className="w-7 h-7" />
              )}
              {profile.account_type === "finder" && (
                <Search className="w-7 h-7" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">
                {profile.full_name}
              </h1>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mt-1">
                {profile.account_type} Account
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="rounded-xl font-bold"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🟢 Left Column: Basic Info (Same for everyone) */}
          <Card className="md:col-span-1 rounded-3xl border-border/50 shadow-sm bg-background/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-black border-b border-border pb-2 mb-4">
                Profile Details
              </h3>
              <div className="space-y-3 text-sm font-medium">
                <p className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-foreground" /> {profile.phone}
                </p>
                <p className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-foreground" />{" "}
                  {profile.location}
                </p>
                <p className="flex items-center gap-3 text-muted-foreground capitalize">
                  <Briefcase className="w-4 h-4 text-foreground" />{" "}
                  {profile.occupation.replace("_", " ")}
                </p>
                {profile.blood_group && (
                  <p className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 p-2 rounded-lg mt-2">
                    <Droplet className="w-4 h-4" /> Blood Group:{" "}
                    {profile.blood_group}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 🟢 Right Column: Specific Dashboards based on Account Type */}
          <div className="md:col-span-2 space-y-6">
            {/* --- 1. FINDER DASHBOARD --- */}
            {profile.account_type === "finder" && (
              <Card className="rounded-3xl border-border/50 shadow-sm bg-slate-50 dark:bg-slate-900/20">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-black mb-2">Welcome, Finder!</h2>
                  <p className="text-muted-foreground font-medium mb-6">
                    You can now search and contact verified donors, oxygen
                    suppliers, and volunteers from the homepage.
                  </p>
                  <Button
                    onClick={() => router.push("/")}
                    className="rounded-xl font-bold bg-slate-900 text-white"
                  >
                    Go to Homepage
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* --- 2. DONOR DASHBOARD --- */}
            {profile.account_type === "donor" && (
              <Card className="rounded-3xl border-red-100 dark:border-red-900/30 shadow-sm bg-red-50/30 dark:bg-red-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-black">
                      Update Donation Status
                    </h2>
                  </div>
                  <div className="bg-background p-5 rounded-2xl border border-border shadow-sm">
                    <label className="block text-sm font-bold text-muted-foreground mb-2">
                      When did you last donate blood?
                    </label>
                    <div className="flex gap-3">
                      <Input
                        type="date"
                        value={lastDonation}
                        onChange={(e) => setLastDonation(e.target.value)}
                        className="h-12 rounded-xl font-medium"
                      />
                      <Button
                        onClick={updateDonationDate}
                        disabled={updating}
                        className="h-12 px-6 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
                      >
                        {updating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 font-medium flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Our system will automatically hide your profile for 90
                      days from this date to ensure your safety.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* --- 3. OXYGEN SUPPLIER DASHBOARD --- */}
            {profile.account_type === "oxygen" && specialData && (
              <Card className="rounded-3xl border-blue-100 dark:border-blue-900/30 shadow-sm bg-blue-50/30 dark:bg-blue-900/10">
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <Wind className="w-16 h-16 text-blue-500 mb-4" />
                  <h2 className="text-2xl font-black mb-2">
                    Oxygen Stock Manager
                  </h2>
                  <p className="text-muted-foreground font-medium mb-8 max-w-md">
                    Update your current oxygen availability so people know if
                    they can contact you for emergencies.
                  </p>

                  <div className="bg-background p-6 rounded-3xl border border-border shadow-sm w-full max-w-sm flex flex-col items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-full font-black text-sm uppercase tracking-wider flex items-center gap-2 ${specialData.is_available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {specialData.is_available ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" /> IN STOCK
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" /> STOCK OUT
                        </>
                      )}
                    </div>

                    <Button
                      onClick={toggleStatus}
                      disabled={updating}
                      className={`w-full h-14 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-1 ${specialData.is_available ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"}`}
                    >
                      {updating ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : specialData.is_available ? (
                        "Mark as Stock Out"
                      ) : (
                        "Mark as In Stock"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* --- 4. VOLUNTEER DASHBOARD --- */}
            {profile.account_type === "volunteer" && specialData && (
              <Card className="rounded-3xl border-emerald-100 dark:border-emerald-900/30 shadow-sm bg-emerald-50/30 dark:bg-emerald-900/10">
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
                  <h2 className="text-2xl font-black mb-2">
                    Volunteer Duty Status
                  </h2>
                  <p className="text-muted-foreground font-medium mb-8 max-w-md">
                    Let the community know if you are currently available to
                    help with emergencies.
                  </p>

                  <div className="bg-background p-6 rounded-3xl border border-border shadow-sm w-full max-w-sm flex flex-col items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-full font-black text-sm uppercase tracking-wider flex items-center gap-2 ${specialData.is_available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
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
                      className={`w-full h-14 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-1 ${specialData.is_available ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"}`}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
