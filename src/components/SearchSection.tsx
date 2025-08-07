import { useState } from "react";
import { Search, Map, Calendar } from "lucide-react";

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tours");

  return (
    <div className="w-full">
      <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">
        Encuentra tu próxima aventura
      </h2>

      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="mb-4">
          <button
            className={`text-sm lg:text-base font-medium px-4 py-2 rounded-lg transition-colors ${
              activeTab === "tours"
                ? "bg-emerald-100 text-emerald-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("tours")}
          >
            Tours y Circuitos
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Ej. CDMX, Cancún, Chiapas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm lg:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm lg:text-base"
            />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm lg:text-base">
            <Search className="w-5 h-5" />
            Buscar aventuras
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
