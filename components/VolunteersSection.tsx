"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  MapPin,
  Phone,
  Search,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";

export function VolunteersSection() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (error: any) {
      console.error("Error fetching volunteers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (volunteer.organization &&
        volunteer.organization
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
  );

  return (
    <div
      id="volunteers-section"
      className="w-full bg-muted/20 py-24 border-t border-border/50 relative overflow-hidden scroll-mt-16"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Community Heroes</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Our Dedicated{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Volunteers
            </span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mb-10">
            Reach out to our active volunteers in your area for immediate
            assistance regarding blood or oxygen management.
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-lg group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Search by area, name, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-card border-border shadow-lg focus:border-emerald-500 focus:ring-emerald-500/20 text-lg font-medium transition-all"
            />
          </div>
        </div>

        {/* Volunteers Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
            <p className="text-muted-foreground font-medium">
              Loading community heroes...
            </p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-[2rem] border border-dashed border-border/60 max-w-2xl mx-auto shadow-sm">
            <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No volunteers found</h3>
            <p className="text-muted-foreground font-medium">
              Try searching with a different keyword or location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredVolunteers.map((volunteer) => (
              <Card
                key={volunteer.id}
                className="group overflow-hidden border-border/50 shadow-md hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all hover:-translate-y-2 bg-background/60 backdrop-blur-xl flex flex-col rounded-3xl"
              >
                <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
                  {/* Avatar & Status */}
                  <div className="relative mb-4 mt-2">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-700 dark:text-emerald-400 text-3xl font-black">
                        {volunteer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-border/50 whitespace-nowrap">
                      {volunteer.is_available ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
                          <XCircle className="w-3 h-3" /> Busy
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-foreground mt-2 mb-1">
                    {volunteer.name}
                  </h3>

                  {volunteer.organization && (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1.5 rounded-lg mb-4">
                      <Building2 className="w-3.5 h-3.5" />
                      {volunteer.organization}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg mb-6 w-full">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{volunteer.location}</span>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto w-full">
                    <a href={`tel:${volunteer.phone}`} className="block w-full">
                      <Button
                        disabled={!volunteer.is_available}
                        className="w-full h-11 bg-slate-900 hover:bg-emerald-600 dark:bg-white dark:text-black dark:hover:bg-emerald-600 dark:hover:text-white transition-all rounded-xl font-bold shadow-md hover:shadow-emerald-600/20 group disabled:opacity-50"
                      >
                        <Phone className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        {volunteer.is_available
                          ? "Call Volunteer"
                          : "Currently Busy"}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
