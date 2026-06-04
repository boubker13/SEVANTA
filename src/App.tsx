import React, { useState, useEffect } from "react";
import { Listing } from "./types";
import { INITIAL_LISTINGS } from "./data";

// Subcomponents
import Header from "./components/Header";
import ListingCard from "./components/ListingCard";
import ListingDetailModal from "./components/ListingDetailModal";
import AppraiseForm from "./components/AppraiseForm";
import MediationPane from "./components/MediationPane";
import ContractCenter from "./components/ContractCenter";
import SeaAdvisor from "./components/SeaAdvisor";

import { 
  Anchor, 
  HelpCircle, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  FileText, 
  MessageSquareCode, 
  Compass, 
  Ship, 
  Upload, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function App() {
  // Localization state
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const isAr = lang === "ar";

  // Listings State with LocalStorage syncing
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Filters state
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all"); // 'all' | 'sale' | 'rent'
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"marketplace" | "appraiser" | "mediator" | "contract" | "advisor">("marketplace");

  // Listing creation form state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newTitleEn, setNewTitleEn] = useState<string>("");
  const [newCategory, setNewCategory] = useState<"ships" | "engines" | "gear" | "services">("ships");
  const [newPrice, setNewPrice] = useState<number>(5000);
  const [newYear, setNewYear] = useState<number>(2022);
  const [newCondition, setNewCondition] = useState<"new" | "used_excellent" | "used_good" | "used_fair">("new");
  const [newSpecs, setNewSpecs] = useState<string>("");
  const [newSpecsEn, setNewSpecsEn] = useState<string>("");
  const [newLocation, setNewLocation] = useState<string>("");
  const [newLocationEn, setNewLocationEn] = useState<string>("");
  const [newType, setNewType] = useState<"sale" | "rent">("sale");
  const [newImage, setNewImage] = useState<string>("");
  const [newOwnerName, setNewOwnerName] = useState<string>("");
  const [newOwnerPhone, setNewOwnerPhone] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newDescEn, setNewDescEn] = useState<string>("");

  // Load and sync local storage
  useEffect(() => {
    const saved = localStorage.getItem("sevanta_listings_db");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasEgyptOrGulf = parsed.some((item: any) => 
          item.location?.includes("الإسكندرية") || 
          item.location?.includes("مصر") || 
          item.locationEn?.includes("Alexandria") || 
          item.locationEn?.includes("Egypt") ||
          item.location?.includes("الدوحة") ||
          item.location?.includes("قطر") ||
          item.locationEn?.includes("Doha") ||
          item.locationEn?.includes("Qatar")
        );
        if (hasEgyptOrGulf || parsed.length === 0) {
          setListings(INITIAL_LISTINGS);
          localStorage.setItem("sevanta_listings_db", JSON.stringify(INITIAL_LISTINGS));
        } else {
          setListings(parsed);
        }
      } catch (e) {
        setListings(INITIAL_LISTINGS);
      }
    } else {
      setListings(INITIAL_LISTINGS);
      localStorage.setItem("sevanta_listings_db", JSON.stringify(INITIAL_LISTINGS));
    }
  }, []);

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(searchLower) || item.titleEn.toLowerCase().includes(searchLower);
    const descMatch = item.description.toLowerCase().includes(searchLower) || item.descriptionEn.toLowerCase().includes(searchLower);
    const specMatch = item.specifications.toLowerCase().includes(searchLower) || item.specificationsEn.toLowerCase().includes(searchLower);
    const matchesSearch = searchQuery === "" || titleMatch || descMatch || specMatch;

    return matchesCategory && matchesType && matchesSearch;
  });

  // Handle detailed modal action route triggers
  const handleModalActionRoute = (actionType: "appraise" | "negotiate" | "contract" | "advisor") => {
    if (!selectedListing) return;
    
    // Closer current details modal
    const temp = selectedListing;
    setSelectedListing(null);

    // Route active tab
    if (actionType === "appraise") {
      setActiveTab("appraiser");
    } else if (actionType === "negotiate") {
      setActiveTab("mediator");
    } else if (actionType === "contract") {
      setActiveTab("contract");
    } else if (actionType === "advisor") {
      setActiveTab("advisor");
    }
    
    // Set active item selection in form contexts
    setSelectedListing(temp);
  };

  // Create a new listing post
  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Default high-grade Unsplash image fallback if user empty
    let finalImageUrl = newImage.trim();
    if (!finalImageUrl) {
      if (newCategory === "ships") {
        finalImageUrl = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&auto=format&fit=crop&q=80";
      } else if (newCategory === "engines") {
        finalImageUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80";
      } else {
        finalImageUrl = "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80";
      }
    }

    const newItem: Listing = {
      id: "lst_" + Date.now(),
      title: newTitle || "عتاد بحري متميز",
      titleEn: newTitleEn || "Outstanding Maritime Equipment",
      category: newCategory,
      categoryEn: newCategory === "ships" ? "Fishing Vessels" : newCategory === "engines" ? "Marine Motors" : newCategory === "gear" ? "Navigation Gear" : "Port Services",
      price: newPrice,
      year: newYear,
      condition: newCondition,
      conditionEn: newCondition === "new" ? "Brand New" : "Excellent Used",
      specifications: newSpecs || "طول قياسي مقاوم للأملاح والظروف البحرية القاسية.",
      specificationsEn: newSpecsEn || "Standard marine-grade build resilient to saltwater corroding.",
      location: newLocation || "ميناء الجزائر العاصمة",
      locationEn: newLocationEn || "Algiers Sea Port Marina",
      type: newType,
      image: finalImageUrl,
      ownerName: newOwnerName || "ربان سيفانتا البحري المعتمد",
      ownerPhone: newOwnerPhone || "+213 550-123456",
      ownerId: "own_" + Math.random().toString(36).substr(2, 5),
      description: newDesc || "عتاد بحري ممتاز جاهز للمعاينة الفنية والتفتيش المباشر.",
      descriptionEn: newDescEn || "Superb maritime hardware ready for structural inspection and port tests."
    };

    const updated = [newItem, ...listings];
    setListings(updated);
    localStorage.setItem("sevanta_listings_db", JSON.stringify(updated));

    // Clear inputs and close
    setNewTitle("");
    setNewTitleEn("");
    setNewCategory("ships");
    setNewPrice(5000);
    setNewYear(2022);
    setNewCondition("new");
    setNewSpecs("");
    setNewSpecsEn("");
    setNewLocation("");
    setNewLocationEn("");
    setNewType("sale");
    setNewImage("");
    setNewOwnerName("");
    setNewOwnerPhone("");
    setNewDesc("");
    setNewDescEn("");
    setShowAddForm(false);

    alert(isAr ? "تم نشر عتادك بنجاح! متوفر للمعاينات الآن." : "Maritime listing published successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Brand Header */}
      <Header lang={lang} setLang={setLang} listingCount={listings.length} />

      {/* Main Container Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* Tab selection bar styling with sea vibe */}
        <div className="bg-slate-900 text-white rounded-xl p-2 shadow-md flex flex-wrap gap-1 md:gap-2">
          
          <button
            id="tab-btn-marketplace"
            onClick={() => setActiveTab("marketplace")}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "marketplace" 
                ? "bg-cyan-500 text-slate-950 shadow-sm font-black" 
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Ship className="w-4 h-4 shrink-0" />
            <span>{isAr ? "سوق العتاد البحري" : "Marine Market"}</span>
          </button>

          <button
            id="tab-btn-surveyor"
            onClick={() => setActiveTab("appraiser")}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "appraiser" 
                ? "bg-cyan-500 text-slate-950 shadow-sm font-black" 
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
            <span>{isAr ? "المقيّم الآلي البحري" : "Surveyor (AI)"}</span>
          </button>

          <button
            id="tab-btn-mediator"
            onClick={() => setActiveTab("mediator")}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "mediator" 
                ? "bg-cyan-500 text-slate-950 shadow-sm font-black" 
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <MessageSquareCode className="w-4 h-4 shrink-0" />
            <span>{isAr ? "الوساطة والتفاوض" : "AI Mediator"}</span>
          </button>

          <button
            id="tab-btn-contract"
            onClick={() => setActiveTab("contract")}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "contract" 
                ? "bg-cyan-500 text-slate-950 shadow-sm font-black" 
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>{isAr ? "صياغة العقود" : "Maritime Contracts"}</span>
          </button>

          <button
            id="tab-btn-advisor"
            onClick={() => {
              setActiveTab("advisor");
              setSelectedListing(null);
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "advisor" 
                ? "bg-cyan-500 text-slate-950 shadow-sm font-black" 
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>{isAr ? "المستشار الفني" : "AI Marine Expert"}</span>
          </button>

        </div>

        {/* ==================== TAB 1: MARKETPLACE & LISTINGS ==================== */}
        {activeTab === "marketplace" && (
          <div className="space-y-6">
            
            {/* Filter and Search Rail Controls */}
            <div className="bg-white border p-4 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Text Search BAR */}
                <div className="relative w-full md:max-w-md">
                  <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder={isAr ? "البحث عن سفن صيد، محركات ياماها، أجهزة سونار..." : "Search fishing boats, Garmin, outboard motors..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-10 text-sm focus:outline-hidden focus:bg-white focus:border-cyan-500 font-sans"
                  />
                </div>

                {/* Sell/Rent Filters and Publish Listing CTA button */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  
                  {/* For Sale / Charter filter buttons */}
                  <div className="bg-slate-100 border p-1 rounded-xl flex items-center text-xs">
                    <button
                      onClick={() => setTypeFilter("all")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        typeFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {isAr ? "الكل" : "All type"}
                    </button>
                    <button
                      onClick={() => setTypeFilter("sale")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        typeFilter === "sale" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {isAr ? "عرض شراء" : "For Sale"}
                    </button>
                    <button
                      onClick={() => setTypeFilter("rent")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        typeFilter === "rent" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {isAr ? "عرض إيجار" : "Charter"}
                    </button>
                  </div>

                  {/* Add Product CTA */}
                  <button
                    id="btn-toggle-add-listing-form"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-slate-900 hover:bg-cyan-500 text-white hover:text-slate-950 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{isAr ? "عرض بيع/تأجير عتادي" : "Add Marine Listing"}</span>
                  </button>

                </div>
              </div>

              {/* Categorization controls */}
              <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2 rtl:ml-2">
                  <Filter className="w-3.5 h-3.5" />
                  <span>{isAr ? "الفلاتر البحرية:" : "Seafaring Classes:"}</span>
                </span>
                
                {[
                  { id: "all", labelAr: "الكل", labelEn: "All Hardware" },
                  { id: "ships", labelAr: "سفن وقوارب صيد", labelEn: "Fishing Ships & Vessels" },
                  { id: "engines", labelAr: "محركات خارجية وداخلية", labelEn: "Marine Engines" },
                  { id: "gear", labelAr: "سونار ورادارات ومستلزمات", labelEn: "Navigation & Fishing Gear" },
                  { id: "services", labelAr: "خدمات قوى الملاحة", labelEn: "Maritime Services" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === cat.id 
                        ? "bg-slate-950 text-cyan-400 border border-slate-900 shadow-xs" 
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {isAr ? cat.labelAr : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Listing Creation Form */}
            {showAddForm && (
              <div className="bg-white border-2 border-cyan-500 rounded-2xl shadow-xl p-5 animate-fade-in-down" id="add-listing-form-container">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                    <Plus className="w-5 h-5 text-cyan-600 animate-pulse" />
                    <span>{isAr ? "إضافة عتاد أو سفينة صيد جديدة لسوق سيفانتا" : "List Your Vessel or Marine Motor for Safe Trade"}</span>
                  </h3>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="p-1 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateListingSubmit} className="space-y-4">
                  
                  {/* Form fields Grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Bilingual Titles */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الاسم التجاري للعتاد (عربي):" : "Vessel Title (Arabic):"}</label>
                      <input 
                        type="text" required placeholder="مثال: قارب السردين الميمون 12م"
                        value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الاسم التجاري للعتاد (إنجليزي):" : "Vessel Title (English):"}</label>
                      <input 
                        type="text" required placeholder="Example: Al Maymoona Sardine Trawler"
                        value={newTitleEn} onChange={(e) => setNewTitleEn(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                      />
                    </div>

                    {/* Class Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "التصنيف البحري:" : "Seafaring Class:"}</label>
                      <select
                        value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                      >
                        <option value="ships">{isAr ? "سفن وقوارب صيد" : "Fishing Ships"}</option>
                        <option value="engines">{isAr ? "محركات خارجية وداخلية" : "Marine Motors"}</option>
                        <option value="gear">{isAr ? "أجهزة ومعدات ومستلزمات" : "Sonar & Gear"}</option>
                        <option value="services">{isAr ? "خدمات ملاحية وبحارة" : "Port Services"}</option>
                      </select>
                    </div>

                    {/* Value registration */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "القيمة التجارية المقررة (د.ج):" : "Initial Target Valuation (DZD):"}</label>
                      <input 
                        type="number" min="10" required 
                        value={newPrice} onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-mono"
                      />
                    </div>

                    {/* Build Year */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "سنة الصنع أو التجهيز والتدشين:" : "Model / Build Year:"}</label>
                      <input 
                        type="number" min="1980" max="2027" required
                        value={newYear} onChange={(e) => setNewYear(parseInt(e.target.value) || 2022)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-mono"
                      />
                    </div>

                    {/* Condition */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الحالة الفنية العامة للعتاد:" : "General Mechanical State:"}</label>
                      <select
                        value={newCondition} onChange={(e) => setNewCondition(e.target.value as any)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                      >
                        <option value="new">{isAr ? "جديد بالكامل (وكالة)" : "Brand New"}</option>
                        <option value="used_excellent">{isAr ? "مستعمل ممتاز جداً" : "Excellent Used"}</option>
                        <option value="used_good">{isAr ? "مستعمل نظيف وجيد" : "Good Used"}</option>
                        <option value="used_fair">{isAr ? "مستعمل مقبول" : "Fair Used"}</option>
                      </select>
                    </div>

                    {/* Spatial and Contact Parameters */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "ميناء الرسو الحالي (عربي):" : "Current Port / Location (Arabic):"}</label>
                      <input 
                        type="text" required placeholder="مثال: ميناء بوهارون، تيبازة"
                        value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "ميناء الرسو الحالي (إنجليزي):" : "Current Port / Location (English):"}</label>
                      <input 
                        type="text" required placeholder="Example: Port of Bouharoun, Tipaza"
                        value={newLocationEn} onChange={(e) => setNewLocationEn(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "رابط صورة العتاد البحري (اختياري):" : "Image URL (Optional):"}</label>
                      <input 
                        type="url" placeholder="https://..."
                        value={newImage} onChange={(e) => setNewImage(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-mono"
                      />
                    </div>

                    {/* Contact identities */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "اسم المالك ببطاقة التسجيل:" : "Certified Owner Name:"}</label>
                      <input 
                        type="text" required placeholder="مثال: الربان يوسف التازي"
                        value={newOwnerName} onChange={(e) => setNewOwnerName(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "هاتف التنسيق البحري المباشر:" : "Direct Port Phone:"}</label>
                      <input 
                        type="text" required placeholder="+216 55-123456"
                        value={newOwnerPhone} onChange={(e) => setNewOwnerPhone(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "نوع الإدراج بالسوق:" : "Listing Trade type:"}</label>
                      <div className="flex gap-4 p-2">
                        <label className="flex items-center gap-1.5 text-xs text-slate-750 cursor-pointer">
                          <input 
                            type="radio" name="newType" value="sale" checked={newType === "sale"}
                            onChange={() => setNewType("sale")} className="accent-cyan-500"
                          />
                          <span>{isAr ? "مبايعة بيع" : "Sell Contract"}</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-750 cursor-pointer">
                          <input 
                            type="radio" name="newType" value="rent" checked={newType === "rent"}
                            onChange={() => setNewType("rent")} className="accent-cyan-500"
                          />
                          <span>{isAr ? "للإيجار الملاحي" : "Charter / Rental"}</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Specifications and descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Specifications */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "بيان الجرد الفني والمواصفات (عربي):" : "Detailed Technical Metrics (Arabic):"}</label>
                        <input 
                          type="text" required placeholder="مثال: طول ١٤م، محرك يانمار ٤٠٠ حصان، حمولة ١٠ أطنان مبردة"
                          value={newSpecs} onChange={(e) => setNewSpecs(e.target.value)}
                          className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "بيان الجرد الفني والمواصفات (إنجليزي):" : "Detailed Technical Metrics (English):"}</label>
                        <input 
                          type="text" required placeholder="Example: Length 14m, Yanmar 400HP inboard, 10 Tons refrigerated payload"
                          value={newSpecsEn} onChange={(e) => setNewSpecsEn(e.target.value)}
                          className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                        />
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "وصف وملاحظات عامة للسمسمار (عربي):" : "Broker Notes & Narrative (Arabic):"}</label>
                        <textarea 
                          rows={2} required placeholder="مثال: السفينة نظيفة تخلوا من التشققات وجاهزة للمعاينة في الحوض الجاف في ميناء وهران."
                          value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                          className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "وصف وملاحظات عامة للسمسمار (إنجليزي):" : "Broker Notes & Narrative (English):"}</label>
                        <textarea 
                          rows={2} required placeholder="Example: The boat is pristine, has no structural cracks, ready for dry dock inspection at Oran."
                          value={newDescEn} onChange={(e) => setNewDescEn(e.target.value)}
                          className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:bg-white focus:border-cyan-500 font-sans"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Submit button bar */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs transition-colors shadow-md hover:scale-105"
                    >
                      ⚓ {isAr ? "نشر وتجهيز للمعاينة الآن" : "Publish Registered Listing"}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* List Listings Cards Box */}
            {filteredListings.length === 0 ? (
              <div className="bg-white border text-center p-12 rounded-2xl text-slate-400 font-sans flex flex-col items-center justify-center">
                <Ship className="w-16 h-16 text-slate-200 animate-pulse mb-3" />
                <p className="font-bold text-slate-700 text-base">{isAr ? "لا توجد معدات مطابقة لبحثك" : "No Marine Equipment Found"}</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {isAr 
                    ? "جرّب تغيير فلاتر الصيد، أو إعادة تعيين الكلمات المفتاحية لمراجعة السفن والمحركات المتوفرة."
                    : "Try adjusting categorical switches or clear query tags under the search bar."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    lang={lang}
                    onSelect={(l) => {
                      setSelectedListing(l);
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 2: MARINE SURVEYOR (APPRAISER) ==================== */}
        {activeTab === "appraiser" && (
          <AppraiseForm
            listings={listings}
            selectedListing={selectedListing}
            lang={lang}
          />
        )}

        {/* ==================== TAB 3: SMART MEDIATOR (CONCILIATION) ==================== */}
        {activeTab === "mediator" && (
          <MediationPane
            listings={listings}
            selectedListing={selectedListing}
            lang={lang}
          />
        )}

        {/* ==================== TAB 4: CONTRACT DRAFTER ==================== */}
        {activeTab === "contract" && (
          <ContractCenter
            listings={listings}
            selectedListing={selectedListing}
            lang={lang}
          />
        )}

        {/* ==================== TAB 5: AI MARINE EXPERT / ADVISOR ==================== */}
        {activeTab === "advisor" && (
          <SeaAdvisor
            listings={listings}
            lang={lang}
          />
        )}

      </main>

      {/* Listing Detail Side Modal Overlay */}
      {selectedListing && activeTab === "marketplace" && (
        <ListingDetailModal
          listing={selectedListing}
          lang={lang}
          onClose={() => setSelectedListing(null)}
          onAction={handleModalActionRoute}
        />
      )}

      {/* Brand Elegant Footer */}
      <footer className="bg-slate-900 border-t-2 border-cyan-500 py-6 px-4 text-center text-slate-400 mt-12 text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-white font-sans" style={{ fontVariant: 'lowercase' }}>sevanta</span>
            <span className="text-slate-500 font-mono">|</span>
            <p className="text-slate-400 text-[11px]">{isAr ? "منصة الوساطة البحرية والعتاد الأقوى للموانئ" : "The Marine Industry Mediation Escrow Hub"}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">
              {isAr 
                ? "© ٢٠٢٦ سيفانتا. جميع الحقوق الفنية مصانة للتسليم والتوثيق البحري." 
                : "© 2026 Sevanta Inc. All legal maritime notarizations protect active fishing fleets."}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
