"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Droplet,
  Search,
  MapPin,
  Phone,
  Loader2,
  Calendar,
  School,
  Briefcase,
  CheckCircle2,
  XCircle,
  HeartPulse,
} from "lucide-react";

export function DonorFinder() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [bloodGroup, setBloodGroup] = useState("all");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("all");

  // 🟢 নতুন যোগ করা স্টেট এবং বাংলাদেশের শহরের লিস্ট
  const [showSuggestions, setShowSuggestions] = useState(false);

  const bangladeshCities = [
    "Dhaka",
    "Manikganj",
    "Chattogram",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
    "Gazipur",
    "Narayanganj",
    "Tangail",
    "Faridpur",
    "Cumilla",
    "Noakhali",
    "Bogura",
    "Dinajpur",
    "Jashore",
    "Kushtia",
    "Pabna",
    "Cox's Bazar",
    "Brahmanbaria",
    "Jamalpur",
    "Patuakhali",
    "Sirajganj",
    "Feni",
    "Gopalganj",
  ];

  // ইউজারের টাইপ করা লেখা অনুযায়ী শহর ফিল্টার করা
  const suggestedCities = bangladeshCities.filter((city) =>
    city.toLowerCase().includes(location.toLowerCase()),
  );

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("account_type", "donor")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error: any) {
      console.error("Error fetching donors:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = (lastDonationDate: string | null) => {
    if (!lastDonationDate) return { eligible: true, text: "Ready to Donate" };

    const lastDate = new Date(lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 90) {
      return { eligible: true, text: "Ready to Donate" };
    } else {
      const daysLeft = 90 - diffDays;
      return { eligible: false, text: `Eligible in ${daysLeft} days` };
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchBloodGroup =
      bloodGroup === "all" || donor.blood_group === bloodGroup;
    const matchLocation = donor.location
      .toLowerCase()
      .includes(location.toLowerCase());
    const matchOccupation =
      occupation === "all" || donor.occupation === occupation;

    return matchBloodGroup && matchLocation && matchOccupation;
  });

  return (
    <div
      id="search-section"
      className="w-full bg-muted/30 pb-20 pt-16 border-t border-border/50 scroll-mt-16"
    >
      <div className="container mx-auto px-4">
        {/* 🟢 Section Header (টাইটেল যোগ করা হলো) */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-medium text-sm mb-6">
            <HeartPulse className="w-4 h-4 animate-pulse" />
            <span>Verified Blood Donors</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Find{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
              Blood
            </span>{" "}
            Near You
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mb-2">
            Use the filters below to find verified heroes near you who are ready
            to donate blood.
          </p>
        </div>

        {/* 🟢 Filter Bar */}
        <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-2xl border border-border shadow-lg rounded-3xl p-4 max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Blood Group
              </Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-red-500 font-bold cursor-pointer">
                  <Droplet className="mr-2 h-4 w-4 text-red-500" />
                  <SelectValue placeholder="Any Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    Any Group
                  </SelectItem>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <SelectItem
                        key={bg}
                        value={bg}
                        className="cursor-pointer"
                      >
                        {bg}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Location / City
              </Label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Dhaka"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setShowSuggestions(true); // টাইপ করলে সাজেশন দেখাবে
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  } // ক্লিক করার সময় দেওয়ার জন্য ডিলে
                  className="pl-11 h-12 rounded-xl bg-muted/50 border-transparent focus:border-red-500 font-medium relative z-10"
                  autoComplete="off"
                />

                {/* 🟢 Suggestion Dropdown Menu */}
                {showSuggestions && location && suggestedCities.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {suggestedCities.map((city) => (
                      <li
                        key={city}
                        className="px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer text-sm font-bold transition-colors border-b border-border/50 last:border-0 flex items-center gap-2"
                        onClick={() => {
                          setLocation(city); // ক্লিক করলে ইনপুটে বসে যাবে
                          setShowSuggestions(false); // ক্লিক করার পর ড্রপডাউন বন্ধ হয়ে যাবে
                        }}
                      >
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Donor Status
              </Label>
              <Select value={occupation} onValueChange={setOccupation}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-red-500 font-medium cursor-pointer">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Anyone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    Anyone
                  </SelectItem>
                  <SelectItem
                    value="university_student"
                    className="cursor-pointer"
                  >
                    University Student
                  </SelectItem>
                  <SelectItem
                    value="college_student"
                    className="cursor-pointer"
                  >
                    College Student
                  </SelectItem>
                  <SelectItem value="job_holder" className="cursor-pointer">
                    Job Holder
                  </SelectItem>
                  <SelectItem value="public" className="cursor-pointer">
                    General Public
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col justify-center items-center text-center p-2 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              <span className="text-xs font-bold text-red-600/70 dark:text-red-400 uppercase tracking-wider">
                Found Heroes
              </span>
              <span className="text-3xl font-black text-red-600">
                {filteredDonors.length}
              </span>
            </div>
          </div>
        </div>

        {/* 🟢 Donors Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
            <p className="text-muted-foreground font-medium">
              Searching for heroes...
            </p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-[2rem] border border-dashed border-border/60 max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No donors found</h3>
            <p className="text-muted-foreground font-medium">
              Try changing your filters or searching a different location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredDonors.map((donor) => {
              const status = checkEligibility(donor.last_donation_date);

              return (
                <Card
                  key={donor.id}
                  className="group overflow-hidden border-border/50 shadow-md hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all hover:-translate-y-2 bg-background/60 backdrop-blur-xl rounded-3xl"
                >
                  <div className="h-24 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 relative">
                    <div className="absolute -bottom-10 left-6">
                      <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                        <AvatarImage
                          src={donor.avatar_url}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-red-100 text-red-600 text-2xl font-bold">
                          {donor.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-border/50">
                      <Droplet className="w-4 h-4 text-red-600 fill-red-600" />
                      <span className="font-black text-foreground">
                        {donor.blood_group}
                      </span>
                    </div>
                  </div>

                  <CardContent className="pt-14 pb-6 px-6">
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-foreground truncate">
                        {donor.full_name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        {status.eligible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                            {status.text}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-900/30">
                            <XCircle className="w-3.5 h-3.5" /> {status.text}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-muted/30 p-4 rounded-2xl border border-border/50">
                      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{donor.location}</span>
                      </div>

                      {donor.institution_name ? (
                        <div className="flex items-center gap-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                          <School className="w-4 h-4" />
                          <span className="truncate">
                            {donor.institution_name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground capitalize">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="truncate">
                            {donor.occupation.replace("_", " ")}
                          </span>
                        </div>
                      )}

                      {donor.last_donation_date && (
                        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="truncate">
                            Last:{" "}
                            {new Date(
                              donor.last_donation_date,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <a href={`tel:${donor.phone}`} className="block w-full">
                      <Button className="w-full h-11 bg-slate-900 hover:bg-red-600 dark:bg-white dark:text-black dark:hover:bg-red-600 dark:hover:text-white transition-all rounded-xl font-bold shadow-md hover:shadow-red-600/20 group">
                        <Phone className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        Call Donor
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
