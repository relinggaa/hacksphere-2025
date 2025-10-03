import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

export default function StationSelectionModal({ 
    isOpen, 
    onClose, 
    onStationSelect, 
    searchQuery, 
    onSearchChange, 
    stations, 
    allStations,
    recentSearches, 
    onClearRecentSearches,
    loading = false
}) {
    const [suggestion, setSuggestion] = useState(null);
    const [fuse, setFuse] = useState(null);

    // Smart mapping untuk nama kota alternatif
    const cityAliasMap = {
        'surakarta': ['solo', 'sala', 'surakarta hadiningrat'],
        'jogya': ['yogyakarta', 'jogja', 'diy', 'ngayogyakarta'],
        'diy': ['yogyakarta', 'jogja', 'yogya', 'ngayogyakarta'],
        'betawi': ['jakarta', 'dki jakarta', 'ibukota', 'jkt', 'jabodetabek'],
        'ibukota': ['jakarta', 'dki jakarta', 'betawi', 'jkt', 'jabodetabek'],
        'jkt': ['jakarta', 'dki jakarta', 'betawi', 'ibukota', 'jabodetabek'],
        'bdg': ['bandung', 'kota kembang', 'paris van java'],
        'kota kembang': ['bandung', 'bdg', 'paris van java'],
        'sby': ['surabaya', 'suroboyo', 'kota pahlawan', 'arek suroboyo'],
        'suroboyo': ['surabaya', 'sby', 'kota pahlawan', 'arek suroboyo'],
        'kota pahlawan': ['surabaya', 'sby', 'suroboyo', 'arek suroboyo'],
        'smg': ['semarang', 'kota lumpia'],
        'kota lumpia': ['semarang', 'smg'],
        'sala': ['solo', 'surakarta', 'surakarta hadiningrat']
    };

    // Initialize Fuse.js dengan semua stasiun
    useEffect(() => {
        if (allStations.length > 0) {
            const fuseOptions = {
                keys: [
                    { name: 'name', weight: 0.7 },
                    { name: 'city', weight: 0.3 }
                ],
                threshold: 0.4, // Lower threshold = more strict matching
                includeScore: true,
                includeMatches: true,
                minMatchCharLength: 2
            };
            
            setFuse(new Fuse(allStations, fuseOptions));
        }
    }, [allStations]);

    // Smart NLS Logic untuk single best suggestion
    useEffect(() => {
        if (searchQuery && searchQuery.length >= 2 && fuse) {
            const searchLower = searchQuery.toLowerCase();
            let bestSuggestion = null;
            let bestScore = 1.0; // Higher score = worse match
            
            // 1. Cari dengan Fuse.js (fuzzy search)
            const fuseResults = fuse.search(searchQuery);
            
            // 2. Cari berdasarkan city alias mapping
            const aliasMatches = [];
            Object.keys(cityAliasMap).forEach(alias => {
                if (alias.includes(searchLower) || searchLower.includes(alias)) {
                    const targetCities = cityAliasMap[alias];
                    targetCities.forEach(targetCity => {
                        const matchingStations = allStations.filter(station => 
                            station.city.toLowerCase().includes(targetCity.toLowerCase()) ||
                            station.name.toLowerCase().includes(targetCity.toLowerCase())
                        );
                        aliasMatches.push(...matchingStations);
                    });
                }
            });
            
            // 3. Evaluasi hasil Fuse.js
            if (fuseResults.length > 0) {
                const topFuseResult = fuseResults[0];
                if (topFuseResult.score > 0.2 && topFuseResult.score < 0.8) {
                    bestSuggestion = {
                        text: `Mungkin maksud Anda: ${topFuseResult.item.name}`,
                        station: topFuseResult.item,
                        type: 'fuzzy'
                    };
                    bestScore = topFuseResult.score;
                }
            }
            
            // 4. Evaluasi hasil alias mapping (prioritas lebih tinggi)
            if (aliasMatches.length > 0) {
                // Pilih stasiun pertama dari kota yang cocok
                const firstAliasMatch = aliasMatches[0];
                const aliasScore = 0.05; // Score sangat rendah untuk alias match
                
                if (aliasScore < bestScore) {
                    bestSuggestion = {
                        text: `Stasiun di ${firstAliasMatch.city}: ${firstAliasMatch.name}`,
                        station: firstAliasMatch,
                        type: 'alias'
                    };
                    bestScore = aliasScore;
                }
            }
            
            setSuggestion(bestSuggestion);
        } else {
            setSuggestion(null);
        }
    }, [searchQuery, fuse, allStations]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
                {/* Header Modal */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center"
                    >
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">Pilih Stasiun atau Kota</h2>
                    <div className="w-8"></div>
                </div>

                {/* Search Box */}
                <div className="p-4">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari stasiun atau kota"
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Single Best Suggestion */}
                {suggestion && (
                    <div className="px-4 pb-2">
                        <button
                            onClick={() => onStationSelect(suggestion.station)}
                            className={`w-full text-left p-3 border-2 rounded-xl hover:bg-opacity-80 transition-colors ${
                                suggestion.type === 'alias' 
                                    ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                            }`}
                        >
                            <div className="flex items-center">
                                {suggestion.type === 'alias' ? (
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <div className="flex-1">
                                    <span className={`font-medium ${
                                        suggestion.type === 'alias' ? 'text-green-700' : 'text-blue-700'
                                    }`}>
                                        {suggestion.text}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {suggestion.station.code} • {suggestion.station.city}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {searchQuery === '' ? (
                        <>
                            {/* Terakhir dicari */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Terakhir dicari</h3>
                                    <button 
                                        onClick={onClearRecentSearches}
                                        className="text-blue-600 text-sm font-medium"
                                    >
                                        Hapus Semua
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {recentSearches.map((station) => (
                                        <StationItem 
                                            key={station.id} 
                                            station={station} 
                                            onSelect={onStationSelect} 
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Semua Stasiun */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Semua Stasiun</h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {allStations.map((station) => (
                                        <StationItem 
                                            key={station.id} 
                                            station={station} 
                                            onSelect={onStationSelect} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Hasil Pencarian */
                        <div>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : stations.length > 0 ? (
                                <div className="space-y-2">
                                    {stations.map((station) => (
                                        <StationItem 
                                            key={station.id} 
                                            station={station} 
                                            onSelect={onStationSelect} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Stasiun tidak ditemukan</p>
                                    <p className="text-gray-400 text-xs mt-1">Coba kata kunci lain</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Komponen StationItem untuk menghindari duplikasi kode
function StationItem({ station, onSelect }) {
    return (
        <button
            onClick={() => onSelect(station)}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between"
        >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center">
                        <span className="font-medium text-gray-800 mr-2">{station.name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{station.code}</span>
                    </div>
                    <div className="text-sm text-gray-500">{station.city}</div>
                </div>
            </div>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        </button>
    );
}
