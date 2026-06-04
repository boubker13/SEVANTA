import React from "react";
import { Listing } from "../types";
import { MapPin, Calendar, Compass, Anchor, Wrench, MessageSquareCode } from "lucide-react";

interface ListingCardProps {
  key?: string;
  listing: Listing;
  lang: "ar" | "en";
  onSelect: (listing: Listing) => void;
}

export default function ListingCard({ listing, lang, onSelect }: ListingCardProps) {
  const isAr = lang === "ar";

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case "new":
        return isAr ? "جديد بالكامل" : "Brand New";
      case "used_excellent":
        return isAr ? "مستعمل ممتاز" : "Excellent Used";
      case "used_good":
        return isAr ? "مستعمل بحالة جيدة" : "Good Used";
      default:
        return isAr ? "مستعمل مقبول" : "Fair Used";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "ships":
        return <Anchor className="w-4 h-4 text-sky-400" />;
      case "engines":
        return <Wrench className="w-4 h-4 text-amber-400" />;
      default:
        return <Compass className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400"
      id={`listing-card-${listing.id}`}
    >
      {/* Visual Header */}
      <div className="relative h-48 overflow-hidden bg-slate-900 group">
        <img 
          src={listing.image} 
          alt={isAr ? listing.title : listing.titleEn} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Price Tag Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/90 text-white font-mono text-sm px-3 py-1 rounded-full border border-sky-400 flex items-center gap-1">
          <span className="text-cyan-400 font-bold">
            {listing.price.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-300">USD</span>
        </div>

        {/* Trade Type Overlay */}
        <div className={`absolute top-3 right-3 ${listing.type === 'rent' ? 'bg-amber-500' : 'bg-cyan-600'} text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow-lg`}>
          {listing.type === "rent" ? (isAr ? "للإيجار" : "For Lease") : (isAr ? "للبيع" : "For Sale")}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-700">
          {getCategoryIcon(listing.category)}
          <span>{isAr ? listing.categoryEn === "Fishing Vessels" ? "سفن وقوارب" : listing.categoryEn === "Marine Engines" ? "محركات بحرية" : listing.categoryEn === "Navigational Gear" ? "رادارات وسونار" : "معدات ومستلزمات" : listing.categoryEn}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 text-lg line-clamp-1 hover:text-cyan-600 transition-colors" dir={isAr ? "rtl" : "ltr"}>
          {isAr ? listing.title : listing.titleEn}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed" dir={isAr ? "rtl" : "ltr"}>
          {isAr ? listing.description : listing.descriptionEn}
        </p>

        {/* Spec table snippet */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5" dir={isAr ? "rtl" : "ltr"}>
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{isAr ? "صناعة:" : "Built:"} {listing.year}</span>
          </div>
          <div className="flex items-center gap-1.5" dir={isAr ? "rtl" : "ltr"}>
            <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{getConditionLabel(listing.condition)}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 mt-1 border-t border-slate-200/50 pt-1 text-slate-500 truncate" dir={isAr ? "rtl" : "ltr"}>
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{isAr ? listing.location : listing.locationEn}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            id={`btn-select-listing-${listing.id}`}
            onClick={() => onSelect(listing)}
            className="w-full bg-slate-900 hover:bg-cyan-700 text-white hover:text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>{isAr ? "تفاصيل الوساطة الفنية" : "View Structural Details"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
