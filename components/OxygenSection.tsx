"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wind,
  MapPin,
  Phone,
  Search,
  Loader2,
  Info,
  CheckCircle2,
  XCircle,
  HeartHandshake,
  BadgeDollarSign,
} from "lucide-react";

export function OxygenSection() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("oxygen_suppliers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      console.error("Error fetching oxygen suppliers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      id="oxygen-section"
      className="w-full bg-background py-26 border-t border-border/50 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm mb-6">
            <Wind className="w-4 h-4" />
            <span>Emergency Oxygen Support</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Find{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Oxygen
            </span>{" "}
            Near You
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mb-10">
            Locate free oxygen banks or verified paid suppliers in your area for
            immediate emergency support.
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-lg group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search by area (e.g., Manikganj, Dhaka...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-card border-border shadow-lg focus:border-blue-500 focus:ring-blue-500/20 text-lg font-medium transition-all"
            />
          </div>
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-muted-foreground font-medium">
              Searching for oxygen suppliers...
            </p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-[2rem] border border-dashed border-border/60 max-w-2xl mx-auto shadow-sm">
            <Wind className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No suppliers found</h3>
            <p className="text-muted-foreground font-medium">
              Try searching for a different area.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredSuppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className="group overflow-hidden border-border/50 shadow-md hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all hover:-translate-y-2 bg-background/60 backdrop-blur-xl flex flex-col rounded-3xl"
              >
                <CardContent className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Title & Availability */}
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 pr-4">
                      {supplier.name}
                    </h3>
                    {supplier.is_available ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md shrink-0 border border-emerald-100 dark:border-emerald-900/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-md shrink-0 border border-red-100 dark:border-red-900/30">
                        <XCircle className="w-3.5 h-3.5" /> Stock Out
                      </span>
                    )}
                  </div>

                  {/* Badges (Free/Paid) & Location */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {supplier.provider_type === "free" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1.5 rounded-lg">
                        <HeartHandshake className="w-4 h-4" /> Free Service
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-3 py-1.5 rounded-lg">
                        <BadgeDollarSign className="w-4 h-4" /> Paid Service
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border/50">
                      <MapPin className="w-4 h-4" /> {supplier.location}
                    </span>
                  </div>

                  {/* Details */}
                  {supplier.details && (
                    <div className="mb-8 flex items-start gap-3 text-sm text-muted-foreground bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                      <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                      <p className="leading-relaxed font-medium">
                        {supplier.details}
                      </p>
                    </div>
                  )}

                  {/* Push button to bottom */}
                  <div className="mt-auto">
                    <a href={`tel:${supplier.phone}`} className="block w-full">
                      <Button
                        disabled={!supplier.is_available}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 transition-all rounded-xl font-bold group disabled:opacity-50"
                      >
                        <Phone className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        {supplier.is_available
                          ? "Call for Oxygen"
                          : "Currently Unavailable"}
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
