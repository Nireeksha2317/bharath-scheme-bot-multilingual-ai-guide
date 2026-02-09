import { useState } from "react";
import { type Scheme } from "@shared/routes";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ExternalLink, 
  GraduationCap, 
  Tractor, 
  Heart, 
  Briefcase, 
  Users,
  Building2,
  FileText
} from "lucide-react";

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes("farmer") || c.includes("agri")) return <Tractor className="w-5 h-5 text-green-600" />;
    if (c.includes("student") || c.includes("education")) return <GraduationCap className="w-5 h-5 text-blue-600" />;
    if (c.includes("health")) return <Heart className="w-5 h-5 text-red-600" />;
    if (c.includes("women") || c.includes("child")) return <Users className="w-5 h-5 text-pink-600" />;
    if (c.includes("business") || c.includes("employment")) return <Briefcase className="w-5 h-5 text-purple-600" />;
    return <Building2 className="w-5 h-5 text-gray-600" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="p-4 md:p-5 flex items-start justify-between gap-4 bg-gradient-to-br from-white to-gray-50/50">
        <div className="flex gap-4">
          <div className="mt-1 p-2 bg-secondary/30 rounded-lg shrink-0">
            {getIcon(scheme.category)}
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                {scheme.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                {scheme.state}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground leading-tight">{scheme.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{scheme.description}</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="px-4 py-3 bg-gray-50 border-t border-border/50 flex items-center justify-between">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          {expanded ? "Hide Details" : "View Details"}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        
        {scheme.officialLink && (
          <a 
            href={scheme.officialLink}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Now <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white"
          >
            <div className="p-5 pt-2 space-y-4 text-sm border-t border-border/50">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Beneficiaries
                  </h4>
                  <p className="text-muted-foreground pl-6">{scheme.beneficiaries}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Documents Required
                  </h4>
                  <p className="text-muted-foreground pl-6">{scheme.documents}</p>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <h4 className="font-semibold text-foreground">Benefits</h4>
                <p className="text-muted-foreground bg-secondary/20 p-3 rounded-lg border border-secondary/30">
                  {scheme.benefits}
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <h4 className="font-semibold text-foreground">Eligibility</h4>
                <p className="text-muted-foreground">{scheme.eligibility}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
