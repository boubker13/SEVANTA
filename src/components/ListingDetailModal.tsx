import React from "react";
import { Listing } from "../types";
import { X, Calendar, MapPin, Compass, Phone, User, Anchor, Sparkles, Scale, MessageSquareCode } from "lucide-react";

interface ListingDetailModalProps {
  listing: Listing;
  lang: "ar" | "en";
  onClose: () => void;
  onAction: (actionType: "appraise" | "negotiate" | "contract" | "advisor") => void;
}

export default function ListingDetailModal({ listing, lang, onClose, onAction }: ListingDetailModalProps) {
  const isAr = lang === "ar";

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case "new":
        return isAr ? "جديد بالكامل (وكالة)" : "Brand New";
      case "used_excellent":
        return isAr ? "مستعمل ممتاز جداً" : "Excellent Used";
      case "used_good":
        return isAr ? "مستعمل بحالة جيدة" : "Good Used";
      default:
        return isAr ? "مستعمل بحالة مقبولة" : "Fair Used";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border-2 border-slate-200 overflow-hidden relative text-slate-800"
        dir={isAr ? "rtl" : "ltr"}
        id="listing-detail-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-900/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors z-10 cursor-pointer shadow-md"
          title={isAr ? "إغلاق" : "Close"}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Layout Image */}
        <div className="relative h-64 md:h-80 bg-slate-950">
          <img 
            src={listing.image} 
            alt={isAr ? listing.title : listing.titleEn} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white text-right">
            <span className="text-[10px] bg-cyan-500 text-slate-950 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              {isAr ? (listing.type === "rent" ? "فرصة إيجار" : "فرصة شراء مباشر") : (listing.type === "rent" ? "Charter Asset" : "Direct Purchase")}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2 hover:text-cyan-300 transition-colors">
              {isAr ? listing.title : listing.titleEn}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-cyan-400" />{listing.year}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-400" />{isAr ? listing.location : listing.locationEn}</span>
              <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-emerald-400" />{getConditionLabel(listing.condition)}</span>
            </div>
          </div>
        </div>

        {/* Modal Info Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-23rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Specs & Core Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 border-b pb-1 text-sm text-cyan-700">
                  {isAr ? "الوصف الفني التفصيلي" : "Detailed Technical Description"}
                </h4>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed whitespace-pre-line">
                  {isAr ? listing.description : listing.descriptionEn}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 border-b pb-1 text-sm text-cyan-700">
                  {isAr ? "المواصفات الفنية والمقاييس" : "Technical Specifications & Metrics"}
                </h4>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm space-y-1.5 mt-2 font-mono text-slate-700 leading-relaxed">
                  {isAr ? listing.specifications : listing.specificationsEn}
                </div>
              </div>
            </div>

            {/* Price & Seller Contact Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-center pb-3 border-b border-slate-200">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                    {isAr ? "القيمة المطلوبة" : "Asking Value"}
                  </span>
                  <div className="text-3xl font-extrabold text-slate-950 font-mono mt-1">
                    {listing.price.toLocaleString()} {isAr ? "د.ج" : "DZD"}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {isAr ? "سعر غير شامل ضريبة الميناء" : "Exotic terminal rates exclude handling"}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">{isAr ? "اسم المعلن (المالك):" : "Seller Name:"}</p>
                      <p>{listing.ownerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">{isAr ? "هاتف الاتصال المباشر:" : "Phone:"}</p>
                      <p className="font-mono">{listing.ownerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-4 pt-3 border-t border-slate-200 text-center text-[11px] text-cyan-800 bg-cyan-55/70 p-2 rounded-lg flex items-center justify-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-cyan-600" />
                <span>{isAr ? "وساطة سيفانتا البحرية الموثقة" : "Sevanta Marine Survey verified"}</span>
              </div>
            </div>
          </div>

          {/* AI Broker Features - High Impact Action Cards */}
          <div className="mt-8 border-t pt-5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-600 shrink-0" />
              <span>{isAr ? "تفعيل أدوات الوساطة الذكية سيفانتا (AI)" : "Trigger Sevanta Intelligent Broker Tools (AI)"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Appraisal Action */}
              <button
                id="btn-trigger-appraisal"
                onClick={() => onAction("appraise")}
                className="bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 p-4 rounded-xl text-right md:text-center transition-all duration-300 cursor-pointer hover:shadow-md group active:scale-98"
              >
                <div className="text-cyan-600 font-extrabold text-sm flex items-center gap-1.5 md:justify-center">
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? "التقييم الفني الفوري" : "Instant Survey Appraisal"}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 md:leading-relaxed">
                  {isAr ? "تقدير فني للقيمة العادلة للسفينة أو المحرك وفحص مواصفات مطابقتها." : "Estimate asset's fair localized value & structural specs."}
                </p>
              </button>

              {/* Negotiate Action */}
              <button
                id="btn-trigger-negotiation"
                onClick={() => onAction("negotiate")}
                className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 p-4 rounded-xl text-right md:text-center transition-all duration-300 cursor-pointer hover:shadow-md group active:scale-98"
              >
                <div className="text-indigo-600 font-extrabold text-sm flex items-center gap-1.5 md:justify-center">
                  <MessageSquareCode className="w-4 h-4" />
                  <span>{isAr ? "الدخول في تفاوض ذكي" : "Enter Price Conciliation"}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 md:leading-relaxed">
                  {isAr ? "تقييم العرض والتنسيق بين البائع والمشتري بوجبة اقتراح السعر الوسطي المضمون." : "Draft targeted responses and middle compromises."}
                </p>
              </button>

              {/* Draft Contract Action */}
              <button
                id="btn-trigger-contract"
                onClick={() => onAction("contract")}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 p-4 rounded-xl text-right md:text-center transition-all duration-300 cursor-pointer hover:shadow-md group active:scale-98"
              >
                <div className="text-emerald-600 font-extrabold text-sm flex items-center gap-1.5 md:justify-center">
                  <Scale className="w-4 h-4" />
                  <span>{isAr ? "صياغة العقد البحري" : "Draft Bill of Sale Contract"}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 md:leading-relaxed">
                  {isAr ? "كتابة مسودة تمليك رسمية باللغة العربية مع مراعاة القوانين والموانئ." : "Generate marine sales contracts with complete laws."}
                </p>
              </button>

            </div>
          </div>
        </div>

        {/* Modal Info Footer */}
        <div className="bg-slate-100 py-3 px-6 text-center text-xs text-slate-500 border-t flex flex-wrap gap-2 justify-between items-center">
          <span>{isAr ? "ملاحظة: الصفقات تتم مباشرة في ميناء التسليم" : "Deliveries scheduled securely within regional ports"}</span>
          <span className="font-mono text-[10px] text-slate-400">ID: {listing.id}</span>
        </div>
      </div>
    </div>
  );
}
