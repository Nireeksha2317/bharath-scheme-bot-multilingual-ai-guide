import { useState } from "react";
import { useSchemes } from "@/hooks/use-schemes";
import { SchemeCard } from "@/components/SchemeCard";
import { Navigation } from "@/components/Navigation";
import { Search, Loader2, FilterX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SchemesList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [state, setState] = useState<string>("all");

  const { data: schemes, isLoading, error } = useSchemes({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    state: state !== "all" ? state : undefined,
  });

  const categories = ["Farmer", "Student", "Women", "Health", "Business", "Housing"];
  const states = ["Pan India", "Karnataka", "Maharashtra", "Uttar Pradesh", "Tamil Nadu"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-foreground">All Schemes</h1>
          <div className="hidden md:block">
            <Navigation />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search schemes by name or description..." 
              className="pl-10 h-12 text-lg rounded-xl bg-gray-50 border-border/60 focus:bg-white transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-xl h-11 bg-gray-50 border-border/60">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="rounded-xl h-11 bg-gray-50 border-border/60">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Loading schemes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            <p>Error loading schemes. Please try again.</p>
          </div>
        ) : schemes?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FilterX className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No schemes found</h3>
            <p>Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setSearch(""); setCategory("all"); setState("all"); }}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes?.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </main>

      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
