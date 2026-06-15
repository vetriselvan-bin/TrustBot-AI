import React, { useState } from "react";
import { KBArticle } from "../types";
import { Search, Eye, Filter, Languages, HelpCircle } from "lucide-react";

interface KnowledgeBaseViewProps {
  articles: KBArticle[];
  isDark: boolean;
}

export default function KnowledgeBaseView({ articles, isDark }: KnowledgeBaseViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'ta'>('all');
  const [articleViews, setArticleViews] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    articles.forEach(a => { initial[a.id] = a.views; });
    return initial;
  });

  const categories = ["All", "Billing", "Account Access", "Troubleshooting", "Product Features"];

  // Perform filtering
  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesLanguage = selectedLanguage === "all" || art.language === selectedLanguage;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const incrementView = (id: string) => {
    setArticleViews(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div className="space-y-8 text-left">
      <div className="text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Security & Resolution Directory</h2>
        <p className="text-xs text-gray-400">Searchable repository of developer and client manuals. Toggle languages to view localized Tamil instructions.</p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search help topics (e.g., 2FA setup, billing invoices, கடவுச்சொல்)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Language Filter */}
        <div className="md:col-span-3 flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border">
          <button
            onClick={() => setSelectedLanguage('all')}
            className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${selectedLanguage === 'all' ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-white shadow-xs' : 'text-gray-400'}`}
          >
            All Langs
          </button>
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`py-1 px-2 text-xs rounded-lg font-bold transition ${selectedLanguage === 'en' ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-white shadow-xs' : 'text-gray-400'}`}
          >
            EN
          </button>
          <button
            onClick={() => setSelectedLanguage('ta')}
            className={`py-1 px-2 text-xs rounded-lg font-bold transition ${selectedLanguage === 'ta' ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-white shadow-xs' : 'text-gray-400'}`}
          >
            தமிழ்
          </button>
        </div>

        <div className="md:col-span-3 text-right">
          <p className="text-xs text-gray-400 font-mono">Found {filteredArticles.length} matching logs</p>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${selectedCategory === cat ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ARTICLES GRID */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 border border-dashed rounded-2xl text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-500">No Articles Found</p>
          <p className="text-xs text-gray-400">Try broad terms like 'Card', '2FA', or switch languages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => incrementView(art.id)}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:border-violet-500/20 hover:shadow-lg transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    {art.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{articleViews[art.id] || Number(art.views)} views</span>
                  </span>
                </div>
                
                <h3 className="font-bold text-base leading-snug hover:text-violet-600 dark:hover:text-violet-400 transition">
                  {art.title}
                </h3>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left">
                  {art.content}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Language Code: {art.language.toUpperCase()}</span>
                </span>
                <span>ID: KB-{art.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
