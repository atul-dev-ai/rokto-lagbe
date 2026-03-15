"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Wind,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Loader2,
  HeartPulse,
  LogOut,
} from "lucide-react";

// 🔴 আপনার অ্যাডমিন ইমেইলটি এখানে বসান
const ADMIN_EMAIL = "paulatul020@gmail.com";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [profiles, setProfiles] = useState<any[]>([]);
  const [oxygen, setOxygen] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // 🟢 Security Check Function
  const checkAdminAccess = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // কেউ লগইন না করে থাকলে লগইন পেজে পাঠাও
      if (!session) {
        router.push("/login");
        return;
      }

      // ইমেইল চেক করো (অ্যাডমিন কিনা)
      if (session.user.email !== ADMIN_EMAIL) {
        alert("Access Denied! You are not authorized to view the Admin Panel.");
        router.push("/dashboard"); // সাধারণ ইউজার হলে ড্যাশবোর্ডে পাঠিয়ে দাও
        return;
      }

      // যদি অ্যাডমিন হয়, তবেই এক্সেস দাও এবং ডাটা লোড করো
      setIsAuthorized(true);
      fetchAllData();
    } catch (error) {
      console.error("Auth Error:", error);
      router.push("/");
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const { data: profileData } = await supabase
        .from("users_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: oxygenData } = await supabase
        .from("oxygen_suppliers")
        .select("*");
      const { data: volData } = await supabase.from("volunteers").select("*");

      setProfiles(profileData || []);
      setOxygen(oxygenData || []);
      setVolunteers(volData || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBanStatus = async (userId: string, currentStatus: boolean) => {
    const confirmMessage = currentStatus
      ? "Are you sure you want to UNBAN this user?"
      : "Are you sure you want to BAN this user? They won't be trusted in the system anymore.";

    if (!window.confirm(confirmMessage)) return;

    try {
      const { error } = await supabase
        .from("users_profiles")
        .update({ is_banned: !currentStatus })
        .eq("user_id", userId);
      if (error) throw error;

      setProfiles(
        profiles.map((p) =>
          p.user_id === userId ? { ...p, is_banned: !currentStatus } : p,
        ),
      );
      alert(
        `User has been ${!currentStatus ? "BANNED" : "UNBANNED"} successfully.`,
      );
    } catch (error: any) {
      alert("Error updating status: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!isAuthorized || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">
          Verifying Admin Access...
        </h2>
      </div>
    );
  }

  const totalUsers = profiles.length;
  const totalBanned = profiles.filter((p) => p.is_banned).length;
  const findersCount = profiles.filter(
    (p) => p.account_type === "finder",
  ).length;
  const allDonors = profiles.filter((p) => p.account_type === "donor");
  const eligibleDonors = allDonors.filter((donor) => {
    if (!donor.last_donation_date) return true;
    const diffTime = Math.abs(
      new Date().getTime() - new Date(donor.last_donation_date).getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) >= 90;
  }).length;
  const activeOxygen = oxygen.filter((o) => o.is_available).length;
  const activeVolunteers = volunteers.filter((v) => v.is_available).length;

  return (
    <div className="min-h-screen bg-[#050505] py-18 text-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                System Admin Center
              </h1>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Monitor and manage the entire LifeFlow network.
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="rounded-xl font-bold mt-4 md:mt-0"
          >
            <LogOut className="w-4 h-4 mr-2" /> Admin Logout
          </Button>
        </div>

        {/* Analytics Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">
                Total Accounts
              </p>
              <h3 className="text-2xl font-black text-white">{totalUsers}</h3>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <HeartPulse className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">
                Eligible Donors
              </p>
              <h3 className="text-2xl font-black text-white">
                {eligibleDonors}{" "}
                <span className="text-xs text-slate-500">
                  / {allDonors.length}
                </span>
              </h3>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Search className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">
                Blood Seekers
              </p>
              <h3 className="text-2xl font-black text-white">{findersCount}</h3>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Wind className="w-8 h-8 text-cyan-400 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">
                Active Oxygen
              </p>
              <h3 className="text-2xl font-black text-white">
                {activeOxygen}{" "}
                <span className="text-xs text-slate-500">
                  / {oxygen.length}
                </span>
              </h3>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">
                Active Volunteers
              </p>
              <h3 className="text-2xl font-black text-white">
                {activeVolunteers}{" "}
                <span className="text-xs text-slate-500">
                  / {volunteers.length}
                </span>
              </h3>
            </CardContent>
          </Card>
          <Card className="bg-red-950/20 border-red-900/50">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Ban className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-xs font-bold text-red-400 uppercase">
                Banned Users
              </p>
              <h3 className="text-2xl font-black text-red-500">
                {totalBanned}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-800 bg-slate-900/80 p-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <Users className="w-5 h-5" /> Network Users & Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-slate-800">
                    User Details
                  </th>
                  <th className="p-4 font-bold border-b border-slate-800">
                    Contact
                  </th>
                  <th className="p-4 font-bold border-b border-slate-800">
                    Role
                  </th>
                  <th className="p-4 font-bold border-b border-slate-800">
                    Status
                  </th>
                  <th className="p-4 font-bold border-b border-slate-800 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-bold text-white text-base">
                        {profile.full_name}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {profile.location}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-300">
                        {profile.phone}
                      </p>
                      <p className="text-xs text-slate-500">{profile.email}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider
                        ${
                          profile.account_type === "donor"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : profile.account_type === "oxygen"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : profile.account_type === "volunteer"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        }
                      `}
                      >
                        {profile.account_type}
                      </span>
                    </td>
                    <td className="p-4">
                      {profile.is_banned ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                          <Ban className="w-4 h-4" /> BANNED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        onClick={() =>
                          toggleBanStatus(profile.user_id, profile.is_banned)
                        }
                        variant={profile.is_banned ? "outline" : "destructive"}
                        size="sm"
                        className={`font-bold rounded-lg ${profile.is_banned ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white" : ""}`}
                      >
                        {profile.is_banned ? "Unban User" : "Ban User"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
