"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Droplet,
  Mail,
  Lock,
  User,
  Phone,
  Search,
  HeartHandshake,
  Loader2,
  MapPin,
  Briefcase,
  School,
  Wind,
  ShieldCheck,
  Building2,
  Info,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    accountType: "finder",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    occupation: "",
    institutionName: "",
    location: "",
    bloodGroup: "",
    // নতুন ফিল্ডগুলো
    organization: "",
    providerType: "free",
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    if (
      field === "occupation" &&
      value !== "university_student" &&
      value !== "college_student"
    ) {
      setFormData({ ...formData, [field]: value, institutionName: "" });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ভ্যালিডেশন
    if (formData.accountType === "donor" && !formData.bloodGroup) {
      setError("Please select a blood group.");
      setLoading(false);
      return;
    }

    const isStudent =
      formData.occupation === "university_student" ||
      formData.occupation === "college_student";

    if (isStudent && !formData.institutionName) {
      setError("Please enter your Institution Name.");
      setLoading(false);
      return;
    }

    try {
      // ১. Auth Table এ ইউজার তৈরি
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // ২. মেইন প্রোফাইল টেবিলে ডাটা ইনসার্ট (লগইন করার জন্য)
        const { error: profileError } = await supabase
          .from("users_profiles")
          .insert([
            {
              user_id: authData.user.id,
              full_name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              account_type: formData.accountType,
              occupation: formData.occupation,
              institution_name: isStudent ? formData.institutionName : null,
              location: formData.location,
              blood_group:
                formData.accountType === "donor" ? formData.bloodGroup : null,
              last_donation_date: null,
            },
          ]);

        if (profileError) {
          console.error("Profile Insert Error:", profileError);
          throw new Error(
            "Failed to create profile. Are you using an email that already exists?",
          );
        }

        // ৩. অ্যাকাউন্ট টাইপ অনুযায়ী স্পেসিফিক টেবিলে ডাটা ইনসার্ট
        if (formData.accountType === "volunteer") {
          const { error: volError } = await supabase.from("volunteers").insert([
            {
              user_id: authData.user.id, // 🟢 এই লাইনটি যোগ করা হয়েছে
              name: formData.fullName,
              phone: formData.phone,
              location: formData.location,
              organization: formData.organization || null,
              is_available: true,
            },
          ]);
          if (volError) console.error("Volunteer Insert Error:", volError);
        } else if (formData.accountType === "oxygen") {
          const { error: oxyError } = await supabase
            .from("oxygen_suppliers")
            .insert([
              {
                user_id: authData.user.id, // 🟢 এই লাইনটি যোগ করা হয়েছে
                name: formData.fullName,
                phone: formData.phone,
                location: formData.location,
                provider_type: formData.providerType,
                details: formData.details || null,
                is_available: true,
              },
            ]);
          if (oxyError) console.error("Oxygen Insert Error:", oxyError);
        }

        alert("Signup successful! Please log in.");
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden py-10">
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl bg-background/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-border p-8 md:p-10 transform transition-all hover:scale-[1.01]">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
            <Droplet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
            Join LifeFlow
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Create your emergency profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* 🟢 EXPANDED ACCOUNT TYPE SELECTOR (4 Options) */}
          <div className="space-y-3 mb-6">
            <Label className="font-bold ml-1 text-foreground">
              I want to join as a:
            </Label>
            <RadioGroup
              value={formData.accountType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  accountType: value,
                  bloodGroup: "",
                  organization: "",
                  details: "",
                })
              }
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div>
                <RadioGroupItem
                  value="finder"
                  id="finder"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="finder"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-muted bg-transparent p-3 hover:border-slate-300 dark:hover:border-slate-700 peer-data-[state=checked]:border-slate-600 peer-data-[state=checked]:bg-slate-50 dark:peer-data-[state=checked]:bg-slate-900/20 cursor-pointer transition-all text-center"
                >
                  <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    Finder
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="donor"
                  id="donor"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="donor"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-muted bg-transparent p-3 hover:border-red-300 dark:hover:border-red-800 peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 dark:peer-data-[state=checked]:bg-red-900/20 cursor-pointer transition-all text-center"
                >
                  <HeartHandshake className="h-5 w-5 text-red-600" />
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    Donor
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="volunteer"
                  id="volunteer"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="volunteer"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-muted bg-transparent p-3 hover:border-emerald-300 dark:hover:border-emerald-800 peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-900/20 cursor-pointer transition-all text-center"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    Volunteer
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="oxygen"
                  id="oxygen"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="oxygen"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-muted bg-transparent p-3 hover:border-blue-300 dark:hover:border-blue-800 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/20 cursor-pointer transition-all text-center"
                >
                  <Wind className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    Oxygen
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-bold ml-1">
                {formData.accountType === "oxygen"
                  ? "Supplier / Company Name"
                  : "Full Name"}
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder={
                    formData.accountType === "oxygen"
                      ? "e.g. MSA Oxygen Bank"
                      : "John Doe"
                  }
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-11 h-11 rounded-xl bg-muted/50 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold ml-1">
                Phone Number
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-11 h-11 rounded-xl bg-muted/50 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="font-bold ml-1">Occupation / Status</Label>
              <Select
                value={formData.occupation}
                onValueChange={(val) => handleSelectChange("occupation", val)}
                required
              >
                <SelectTrigger className="h-11 rounded-xl bg-muted/50 font-medium">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="university_student">
                    University Student
                  </SelectItem>
                  <SelectItem value="college_student">
                    College Student
                  </SelectItem>
                  <SelectItem value="job_holder">
                    Job Holder / Agency
                  </SelectItem>
                  <SelectItem value="public">General Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-bold ml-1">
                City / Area
              </Label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g. Dhaka, Mirpur"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-11 h-11 rounded-xl bg-muted/50 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Conditional Institution Name Field */}
          {(formData.occupation === "university_student" ||
            formData.occupation === "college_student") && (
            <div className="space-y-2 animate-in fade-in zoom-in duration-300">
              <Label htmlFor="institutionName" className="font-bold ml-1">
                Institution Name
              </Label>
              <div className="relative group">
                <School className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="institutionName"
                  type="text"
                  placeholder="e.g. Dhaka University / Dhaka College"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="pl-11 h-11 rounded-xl bg-muted/50 font-medium border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>
          )}

          {/* 🟢 Conditional Field: Blood Group (For Donors) */}
          {formData.accountType === "donor" && (
            <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 animate-in fade-in zoom-in duration-300">
              <div className="space-y-2">
                <Label className="font-bold ml-1 text-red-700 dark:text-red-400">
                  Blood Group
                </Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(val) => handleSelectChange("bloodGroup", val)}
                  required
                >
                  <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-900 border-red-200 dark:border-red-800 font-medium">
                    <Droplet className="mr-2 h-4 w-4 text-red-500" />
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 🟢 Conditional Field: Organization (For Volunteers) */}
          {formData.accountType === "volunteer" && (
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 animate-in fade-in zoom-in duration-300">
              <div className="space-y-2">
                <Label
                  htmlFor="organization"
                  className="font-bold ml-1 text-emerald-700 dark:text-emerald-400"
                >
                  Organization / Foundation Name (Optional)
                </Label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-3.5 h-4 w-4 text-emerald-500" />
                  <Input
                    id="organization"
                    type="text"
                    placeholder="e.g. Red Crescent Society"
                    value={formData.organization}
                    onChange={handleChange}
                    className="pl-11 h-11 rounded-xl bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 🟢 Conditional Fields: Provider Type & Details (For Oxygen) */}
          {formData.accountType === "oxygen" && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 animate-in fade-in zoom-in duration-300 space-y-4">
              <div className="space-y-2">
                <Label className="font-bold ml-1 text-blue-700 dark:text-blue-400">
                  Provider Type
                </Label>
                <Select
                  value={formData.providerType}
                  onValueChange={(val) =>
                    handleSelectChange("providerType", val)
                  }
                  required
                >
                  <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 font-medium">
                    <Wind className="mr-2 h-4 w-4 text-blue-500" />
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">
                      Free Service (Charity/Bank)
                    </SelectItem>
                    <SelectItem value="paid">
                      Paid Service (Commercial)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="details"
                  className="font-bold ml-1 text-blue-700 dark:text-blue-400"
                >
                  Details / Instructions (Optional)
                </Label>
                <div className="relative group">
                  <Info className="absolute left-4 top-3.5 h-4 w-4 text-blue-500" />
                  <Input
                    id="details"
                    type="text"
                    placeholder="e.g. 24/7 service, delivery available..."
                    value={formData.details}
                    onChange={handleChange}
                    className="pl-11 h-11 rounded-xl bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-11 h-11 rounded-xl bg-muted/50 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold ml-1">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-11 h-11 rounded-xl bg-muted/50 font-medium"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              id="terms"
              required
              className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none text-muted-foreground"
            >
              I agree to the{" "}
              <Link href="#" className="text-red-600 hover:underline font-bold">
                Terms
              </Link>{" "}
              &{" "}
              <Link href="#" className="text-red-600 hover:underline font-bold">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 text-lg font-bold rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating
                Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
