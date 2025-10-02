import React, { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fuse from 'fuse.js';

export default function AdminDashboard({ user }) {
    const [selectedDates, setSelectedDates] = useState('Last 7 days');
    const [activeTab, setActiveTab] = useState('analytics');
    const [showStationModal, setShowStationModal] = useState(false);
    const [stationData, setStationData] = useState({
        nama_stasiun: '',
        kota: ''
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [stations, setStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(false);
    const [editingStation, setEditingStation] = useState(null);
    
    // Kereta states
    const [showKeretaModal, setShowKeretaModal] = useState(false);
    const [keretaData, setKeretaData] = useState({
        nama_kereta: '',
        kelas: ''
    });
    const [keretas, setKeretas] = useState([]);
    const [loadingKeretas, setLoadingKeretas] = useState(false);
    const [editingKereta, setEditingKereta] = useState(null);
    
    // Pagination states for stations
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // 10 items per page
    const [totalItems, setTotalItems] = useState(0);
    
    // Pagination states for keretas
    const [currentKeretaPage, setCurrentKeretaPage] = useState(1);
    const [keretaItemsPerPage] = useState(10);
    const [totalKeretaItems, setTotalKeretaItems] = useState(0);
    
    // Search states for stations
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    // Search states for keretas
    const [keretaSearchQuery, setKeretaSearchQuery] = useState('');
    const [isKeretaSearching, setIsKeretaSearching] = useState(false);

    // Tiket Antar Kota states
    const [showTiketModal, setShowTiketModal] = useState(false);
    const [tiketData, setTiketData] = useState({
        nama_kereta: '',
        kelas: '',
        harga_termurah: '',
        jam: '',
        tanggal: '',
        penumpang: '',
        stasiun_asal: '',
        stasiun_tujuan: ''
    });
    const [tikets, setTikets] = useState([]);
    const [loadingTikets, setLoadingTikets] = useState(false);
    const [editingTiket, setEditingTiket] = useState(null);
    
    // Pagination states for tikets
    const [currentTiketPage, setCurrentTiketPage] = useState(1);
    const [tiketItemsPerPage] = useState(10);
    const [totalTiketItems, setTotalTiketItems] = useState(0);
    
    // Search states for tikets
    const [tiketSearchQuery, setTiketSearchQuery] = useState('');
    const [isTiketSearching, setIsTiketSearching] = useState(false);

    // Tiket Commuter states
    const [showCommuterModal, setShowCommuterModal] = useState(false);
    const [commuterData, setCommuterData] = useState({
        nama_kereta: '',
        kelas: '',
        harga_murah: '',
        harga_normal: '',
        jam_operasional: '',
        stasiun_asal: '',
        stasiun_tujuan: '',
        interval_jam: '',
        kapasitas_kursi: ''
    });
    const [commiters, setCommiters] = useState([]);
    const [loadingCommiters, setLoadingCommiters] = useState(false);
    const [editingCommuter, setEditingCommuter] = useState(null);
    
    // Pagination states for commiters
    const [currentCommuterPage, setCurrentCommuterPage] = useState(1);
    const [commuterItemsPerPage] = useState(10);
    const [totalCommuterItems, setTotalCommuterItems] = useState(0);
    
    // Search states for commiters
    const [commuterSearchQuery, setCommuterSearchQuery] = useState('');
    const [isCommuterSearching, setIsCommuterSearching] = useState(false);

    // Tiket LRT states
    const [showLrtModal, setShowLrtModal] = useState(false);
    const [lrtData, setLrtData] = useState({
        nama_kereta: '',
        harga_termurah: '',
        jam: '',
        tanggal: '',
        penumpang: '',
        stasiun_asal: '',
        stasiun_tujuan: ''
    });
    const [lrtTikets, setLrtTikets] = useState([]);
    const [loadingLrtTikets, setLoadingLrtTikets] = useState(false);
    const [editingLrtTiket, setEditingLrtTiket] = useState(null);
    
    // Pagination states for lrt tikets
    const [currentLrtPage, setCurrentLrtPage] = useState(1);
    const [lrtItemsPerPage] = useState(10);
    const [totalLrtItems, setTotalLrtItems] = useState(0);
    
    // Search states for lrt tikets
    const [lrtSearchQuery, setLrtSearchQuery] = useState('');
    const [isLrtSearching, setIsLrtSearching] = useState(false);

    // Tiket Bandara states
    const [showBandaraModal, setShowBandaraModal] = useState(false);
    const [bandaraData, setBandaraData] = useState({
        nama_kereta: '',
        harga_termurah: '',
        jam: '',
        tanggal: '',
        penumpang: '',
        stasiun_asal: '',
        stasiun_tujuan: ''
    });
    const [bandaraTikets, setBandaraTikets] = useState([]);
    const [loadingBandaraTikets, setLoadingBandaraTikets] = useState(false);
    const [editingBandaraTiket, setEditingBandaraTiket] = useState(null);
    
    // Pagination states for bandara tikets
    const [currentBandaraPage, setCurrentBandaraPage] = useState(1);
    const [bandaraItemsPerPage] = useState(10);
    const [totalBandaraItems, setTotalBandaraItems] = useState(0);
    
    // Search states for bandara tikets
    const [bandaraSearchQuery, setBandaraSearchQuery] = useState('');
    const [isBandaraSearching, setIsBandaraSearching] = useState(false);

    // Dropdown data states
    const [availableKeretas, setAvailableKeretas] = useState([]);
    const [availableStasiuns, setAvailableStasiuns] = useState([]);
    const [availableCommuterKeretas, setAvailableCommuterKeretas] = useState([]);
    const [availableCommuterStasiuns, setAvailableCommuterStasiuns] = useState([]);
    const [availableLrtKeretas, setAvailableLrtKeretas] = useState([]);
    const [availableLrtStasiuns, setAvailableLrtStasiuns] = useState([]);
    const [availableBandaraKeretas, setAvailableBandaraKeretas] = useState([]);
    const [availableBandaraStasiuns, setAvailableBandaraStasiuns] = useState([]);

    // Dictionary synonyms untuk Natural Language Search (NLS)
    const citySynonyms = {
        // Yogyakarta variations
        'jogja': ['yogyakarta', 'yogya', 'jogjakarta', 'diy'],
        'yogya': ['yogyakarta', 'jogja', 'jogjakarta', 'diy'],
        'yogyakarta': ['jogja', 'yogya', 'jogjakarta', 'diy'],
        'jogjakarta': ['jogja', 'yogya', 'yogyakarta', 'diy'],
        'diy': ['jogja', 'yogya', 'yogyakarta', 'jogjakarta'],
        
        // Jakarta variations
        'jakarta': ['dki', 'betawi', 'batavia', 'jkt'],
        'dki': ['jakarta', 'betawi', 'batavia', 'jkt'],
        'betawi': ['jakarta', 'dki', 'batavia', 'jkt'],
        'batavia': ['jakarta', 'dki', 'betawi', 'jkt'],
        'jkt': ['jakarta', 'dki', 'betawi', 'batavia'],
        
        // Bandung variations
        'bandung': ['bdg', 'kota kembang', 'paris van java'],
        'bdg': ['bandung', 'kota kembang', 'paris van java'],
        
        // Surabaya variations
        'surabaya': ['sby', 'suroboyo', 'kota pahlawan'],
        'sby': ['surabaya', 'suroboyo', 'kota pahlawan'],
        'suroboyo': ['surabaya', 'sby', 'kota pahlawan'],
        
        // Semarang variations
        'semarang': ['smg', 'kota lumpia'],
        'smg': ['semarang', 'kota lumpia'],
        
        // Medan variations
        'medan': ['mdn', 'kota medan'],
        'mdn': ['medan', 'kota medan'],
        
        // Makassar variations
        'makassar': ['ujung pandang', 'mks'],
        'ujung pandang': ['makassar', 'mks'],
        'mks': ['makassar', 'ujung pandang'],
        
        // Palembang variations
        'palembang': ['plg', 'kota pempek'],
        'plg': ['palembang', 'kota pempek'],
        
        // Malang variations
        'malang': ['mlg', 'kota apel'],
        'mlg': ['malang', 'kota apel'],
        
        // Solo variations
        'solo': ['surakarta', 'slo', 'kota batik'],
        'surakarta': ['solo', 'slo', 'kota batik'],
        'slo': ['solo', 'surakarta', 'kota batik']
    };

    // Dictionary synonyms untuk kereta dan kelas
    const keretaSynonyms = {
        // Kelas kereta
        'eksekutif': ['executive', 'exec', 'ekse', 'mewah', 'premium'],
        'executive': ['eksekutif', 'exec', 'ekse', 'mewah', 'premium'],
        'exec': ['eksekutif', 'executive', 'ekse', 'mewah', 'premium'],
        'ekse': ['eksekutif', 'executive', 'exec', 'mewah', 'premium'],
        'mewah': ['eksekutif', 'executive', 'exec', 'ekse', 'premium'],
        'premium': ['eksekutif', 'executive', 'exec', 'ekse', 'mewah'],
        
        'bisnis': ['business', 'bis', 'menengah'],
        'business': ['bisnis', 'bis', 'menengah'],
        'bis': ['bisnis', 'business', 'menengah'],
        'menengah': ['bisnis', 'business', 'bis'],
        
        'ekonomi': ['economy', 'eco', 'eko', 'murah', 'rakyat'],
        'economy': ['ekonomi', 'eco', 'eko', 'murah', 'rakyat'],
        'eco': ['ekonomi', 'economy', 'eko', 'murah', 'rakyat'],
        'eko': ['ekonomi', 'economy', 'eco', 'murah', 'rakyat'],
        'murah': ['ekonomi', 'economy', 'eco', 'eko', 'rakyat'],
        'rakyat': ['ekonomi', 'economy', 'eco', 'eko', 'murah'],
        
        // Nama kereta terkenal
        'argo': ['kereta argo', 'ka argo'],
        'taksaka': ['ka taksaka', 'kereta taksaka'],
        'gajayana': ['ka gajayana', 'kereta gajayana'],
        'bima': ['ka bima', 'kereta bima'],
        'turangga': ['ka turangga', 'kereta turangga'],
        'sancaka': ['ka sancaka', 'kereta sancaka'],
        'lodaya': ['ka lodaya', 'kereta lodaya'],
        'bengawan': ['ka bengawan', 'kereta bengawan'],
        'progo': ['ka progo', 'kereta progo'],
        'jayabaya': ['ka jayabaya', 'kereta jayabaya'],
        'harina': ['ka harina', 'kereta harina'],
        'matarmaja': ['ka matarmaja', 'kereta matarmaja'],
        
        // Jenis kereta
        'krl': ['commuter', 'commuter line', 'kereta listrik', 'kereta rel listrik'],
        'commuter': ['krl', 'commuter line', 'kereta listrik', 'kereta rel listrik'],
        'prameks': ['ka prameks', 'kereta prameks'],
        'joglosemar': ['ka joglosemar', 'kereta joglosemar']
    };

    // Fungsi untuk normalisasi text dengan synonyms (untuk stasiun)
    const normalizeTextWithSynonyms = (text) => {
        if (!text) return '';
        
        const lowerText = text.toLowerCase().trim();
        const words = lowerText.split(/\s+/);
        const expandedWords = new Set([lowerText]);
        
        // Tambahkan original words
        words.forEach(word => {
            expandedWords.add(word);
            
            // Cari synonyms untuk setiap kata
            if (citySynonyms[word]) {
                citySynonyms[word].forEach(synonym => {
                    expandedWords.add(synonym);
                    // Juga tambahkan kombinasi dengan kata lain
                    words.forEach(otherWord => {
                        if (otherWord !== word) {
                            expandedWords.add(`${synonym} ${otherWord}`);
                            expandedWords.add(`${otherWord} ${synonym}`);
                        }
                    });
                });
            }
        });
        
        return Array.from(expandedWords).join(' ');
    };

    // Fungsi untuk normalisasi text dengan synonyms (untuk kereta)
    const normalizeKeretaTextWithSynonyms = (text) => {
        if (!text) return '';
        
        const lowerText = text.toLowerCase().trim();
        const words = lowerText.split(/\s+/);
        const expandedWords = new Set([lowerText]);
        
        // Tambahkan original words
        words.forEach(word => {
            expandedWords.add(word);
            
            // Cari synonyms untuk setiap kata (gabungan city dan kereta synonyms)
            const allSynonyms = { ...citySynonyms, ...keretaSynonyms };
            if (allSynonyms[word]) {
                allSynonyms[word].forEach(synonym => {
                    expandedWords.add(synonym);
                    // Juga tambahkan kombinasi dengan kata lain
                    words.forEach(otherWord => {
                        if (otherWord !== word) {
                            expandedWords.add(`${synonym} ${otherWord}`);
                            expandedWords.add(`${otherWord} ${synonym}`);
                        }
                    });
                });
            }
        });
        
        return Array.from(expandedWords).join(' ');
    };

    // Fuse.js configuration for fuzzy search with NLS
    const fuseOptions = {
        keys: [
            {
                name: 'nama_stasiun',
                weight: 0.7,
                getFn: (obj) => normalizeTextWithSynonyms(obj.nama_stasiun)
            },
            {
                name: 'kota',
                weight: 0.3,
                getFn: (obj) => normalizeTextWithSynonyms(obj.kota)
            }
        ],
        threshold: 0.4, // Sedikit lebih tinggi karena ada banyak synonyms
        distance: 150, // Lebih besar untuk menangani synonyms yang panjang
        includeScore: true,
        minMatchCharLength: 2, // Minimal 2 karakter untuk menghindari hasil terlalu banyak
        ignoreLocation: true, // Ignore posisi kata dalam string
        findAllMatches: true, // Cari semua kemungkinan match
        useExtendedSearch: false
    };

    // Initialize Fuse instance for stations
    const fuse = useMemo(() => new Fuse(stations, fuseOptions), [stations]);

    // Fuse.js configuration for kereta search with NLS
    const keretaFuseOptions = {
        keys: [
            {
                name: 'nama_kereta',
                weight: 0.7,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.nama_kereta)
            },
            {
                name: 'kelas',
                weight: 0.3,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.kelas)
            }
        ],
        threshold: 0.4,
        distance: 150,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
        useExtendedSearch: false
    };

    // Initialize Fuse instance for keretas
    const keretaFuse = useMemo(() => new Fuse(keretas, keretaFuseOptions), [keretas]);

    // Fuse.js configuration for tiket search with NLS
    const tiketFuseOptions = {
        keys: [
            {
                name: 'nama_kereta',
                weight: 0.3,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.nama_kereta)
            },
            {
                name: 'kelas',
                weight: 0.2,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.kelas)
            },
            {
                name: 'stasiun_asal',
                weight: 0.2,
                getFn: (obj) => normalizeTextWithSynonyms(obj.stasiun_asal)
            },
            {
                name: 'stasiun_tujuan',
                weight: 0.2,
                getFn: (obj) => normalizeTextWithSynonyms(obj.stasiun_tujuan)
            },
            {
                name: 'jam',
                weight: 0.1
            }
        ],
        threshold: 0.4,
        distance: 150,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
        useExtendedSearch: false
    };

    // Initialize Fuse instance for tikets
    const tiketFuse = useMemo(() => new Fuse(tikets, tiketFuseOptions), [tikets]);

    // Fuse.js configuration for commuter search with NLS
    const commuterFuseOptions = {
        keys: [
            {
                name: 'nama_kereta',
                weight: 0.3,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.nama_kereta)
            },
            {
                name: 'kelas',
                weight: 0.2,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.kelas)
            },
            {
                name: 'stasiun_tujuan',
                weight: 0.3,
                getFn: (obj) => normalizeTextWithSynonyms(obj.stasiun_tujuan)
            },
            {
                name: 'jam_operasional',
                weight: 0.2
            }
        ],
        threshold: 0.4,
        distance: 150,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
        useExtendedSearch: false
    };

    // Initialize Fuse instance for commiters
    const commuterFuse = useMemo(() => new Fuse(commiters, commuterFuseOptions), [commiters]);

    // Fuse.js configuration for LRT tiket search with NLS
    const lrtFuseOptions = {
        keys: [
            {
                name: 'nama_kereta',
                weight: 0.3,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.nama_kereta)
            },
            {
                name: 'stasiun_asal',
                weight: 0.3,
                getFn: (obj) => normalizeTextWithSynonyms(obj.stasiun_asal)
            },
            {
                name: 'stasiun_tujuan',
                weight: 0.3,
                getFn: (obj) => normalizeTextWithSynonyms(obj.stasiun_tujuan)
            },
            {
                name: 'jam',
                weight: 0.1
            }
        ],
        threshold: 0.4,
        distance: 150,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
        useExtendedSearch: false
    };

    // Initialize Fuse instance for LRT tikets
    const lrtFuse = useMemo(() => new Fuse(lrtTikets, lrtFuseOptions), [lrtTikets]);

    // Fuse.js configuration for bandara tiket search with NLS
    const bandaraFuseOptions = {
        keys: [
            {
                name: 'nama_kereta',
                weight: 0.3,
                getFn: (obj) => normalizeKeretaTextWithSynonyms(obj.nama_kereta)
            },
            {
                name: 'stasiun_asal',
                weight: 0.3,
                getFn: (obj) => normalizeTextWithSynonyms(obj.stasiun_asal)
            },
            {
                name: 'stasiun_tujuan',
                weight: 0.3,
                getFn: (obj) => normalizeTextWithSynonyms(obj.stasiun_tujuan)
            },
            {
                name: 'jam',
                weight: 0.1
            }
        ],
        threshold: 0.4,
        distance: 150,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: true,
        useExtendedSearch: false
    };

    // Initialize Fuse instance for bandara tikets
    const bandaraFuse = useMemo(() => new Fuse(bandaraTikets, bandaraFuseOptions), [bandaraTikets]);

    // Filter stations based on search query with NLS
    const filteredStations = useMemo(() => {
        if (!searchQuery.trim()) {
            setIsSearching(false);
            return stations;
        }
        
        setIsSearching(true);
        
        // Normalisasi search query dengan synonyms
        const normalizedQuery = normalizeTextWithSynonyms(searchQuery.trim());
        
        // Search dengan query yang sudah dinormalisasi
        const results = fuse.search(normalizedQuery);
        
        // Juga coba search dengan query original untuk fallback
        const originalResults = fuse.search(searchQuery.trim());
        
        // Gabungkan hasil dan remove duplicates
        const combinedResults = [...results, ...originalResults];
        const uniqueResults = combinedResults.filter((result, index, self) => 
            index === self.findIndex(r => r.item.station_id === result.item.station_id)
        );
        
        // Sort berdasarkan score (semakin kecil semakin baik)
        uniqueResults.sort((a, b) => a.score - b.score);
        
        return uniqueResults.map(result => result.item);
    }, [searchQuery, fuse, stations]);

    // Calculate pagination based on filtered data
    const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    // Get paginated data from filtered results
    const paginatedStations = filteredStations.slice(startIndex, startIndex + itemsPerPage);
    
    // Update total items for pagination info
    const displayTotalItems = filteredStations.length;

    // Filter keretas based on search query with NLS
    const filteredKeretas = useMemo(() => {
        if (!keretaSearchQuery.trim()) {
            setIsKeretaSearching(false);
            return keretas;
        }
        
        setIsKeretaSearching(true);
        
        // Normalisasi search query dengan synonyms
        const normalizedQuery = normalizeKeretaTextWithSynonyms(keretaSearchQuery.trim());
        
        // Search dengan query yang sudah dinormalisasi
        const results = keretaFuse.search(normalizedQuery);
        
        // Juga coba search dengan query original untuk fallback
        const originalResults = keretaFuse.search(keretaSearchQuery.trim());
        
        // Gabungkan hasil dan remove duplicates
        const combinedResults = [...results, ...originalResults];
        const uniqueResults = combinedResults.filter((result, index, self) => 
            index === self.findIndex(r => r.item.train_id === result.item.train_id)
        );
        
        // Sort berdasarkan score (semakin kecil semakin baik)
        uniqueResults.sort((a, b) => a.score - b.score);
        
        return uniqueResults.map(result => result.item);
    }, [keretaSearchQuery, keretaFuse, keretas]);

    // Calculate pagination for keretas based on filtered data
    const totalKeretaPages = Math.ceil(filteredKeretas.length / keretaItemsPerPage);
    const startKeretaIndex = (currentKeretaPage - 1) * keretaItemsPerPage;
    
    // Get paginated data from filtered keretas results
    const paginatedKeretas = filteredKeretas.slice(startKeretaIndex, startKeretaIndex + keretaItemsPerPage);
    
    // Update total kereta items for pagination info
    const displayTotalKeretaItems = filteredKeretas.length;

    // Filter tikets based on search query with NLS
    const filteredTikets = useMemo(() => {
        if (!tiketSearchQuery.trim()) {
            setIsTiketSearching(false);
            return tikets;
        }
        
        setIsTiketSearching(true);
        
        // Normalisasi search query dengan synonyms
        const normalizedQuery = normalizeKeretaTextWithSynonyms(tiketSearchQuery.trim());
        
        // Search dengan query yang sudah dinormalisasi
        const results = tiketFuse.search(normalizedQuery);
        
        // Juga coba search dengan query original untuk fallback
        const originalResults = tiketFuse.search(tiketSearchQuery.trim());
        
        // Gabungkan hasil dan remove duplicates
        const combinedResults = [...results, ...originalResults];
        const uniqueResults = combinedResults.filter((result, index, self) => 
            index === self.findIndex(r => r.item.id === result.item.id)
        );
        
        // Sort berdasarkan score (semakin kecil semakin baik)
        uniqueResults.sort((a, b) => a.score - b.score);
        
        return uniqueResults.map(result => result.item);
    }, [tiketSearchQuery, tiketFuse, tikets]);

    // Calculate pagination for tikets based on filtered data
    const totalTiketPages = Math.ceil(filteredTikets.length / tiketItemsPerPage);
    const startTiketIndex = (currentTiketPage - 1) * tiketItemsPerPage;
    
    // Get paginated data from filtered tikets results
    const paginatedTikets = filteredTikets.slice(startTiketIndex, startTiketIndex + tiketItemsPerPage);
    
    // Update total tiket items for pagination info
    const displayTotalTiketItems = filteredTikets.length;

    // Filter commiters based on search query with NLS
    const filteredCommiters = useMemo(() => {
        if (!commuterSearchQuery.trim()) {
            setIsCommuterSearching(false);
            return commiters;
        }
        
        setIsCommuterSearching(true);
        
        // Normalisasi search query dengan synonyms
        const normalizedQuery = normalizeKeretaTextWithSynonyms(commuterSearchQuery.trim());
        
        // Search dengan query yang sudah dinormalisasi
        const results = commuterFuse.search(normalizedQuery);
        
        // Juga coba search dengan query original untuk fallback
        const originalResults = commuterFuse.search(commuterSearchQuery.trim());
        
        // Gabungkan hasil dan remove duplicates
        const combinedResults = [...results, ...originalResults];
        const uniqueResults = combinedResults.filter((result, index, self) => 
            index === self.findIndex(r => r.item.id === result.item.id)
        );
        
        // Sort berdasarkan score (semakin kecil semakin baik)
        uniqueResults.sort((a, b) => a.score - b.score);
        
        return uniqueResults.map(result => result.item);
    }, [commuterSearchQuery, commuterFuse, commiters]);

    // Calculate pagination for commiters based on filtered data
    const totalCommuterPages = Math.ceil(filteredCommiters.length / commuterItemsPerPage);
    const startCommuterIndex = (currentCommuterPage - 1) * commuterItemsPerPage;
    
    // Get paginated data from filtered commiters results
    const paginatedCommiters = filteredCommiters.slice(startCommuterIndex, startCommuterIndex + commuterItemsPerPage);
    
    // Update total commuter items for pagination info
    const displayTotalCommuterItems = filteredCommiters.length;

    // Filter LRT tikets based on search query with NLS
    const filteredLrtTikets = useMemo(() => {
        if (!lrtSearchQuery.trim()) {
            setIsLrtSearching(false);
            return lrtTikets;
        }
        
        setIsLrtSearching(true);
        
        // Normalisasi search query dengan synonyms
        const normalizedQuery = normalizeKeretaTextWithSynonyms(lrtSearchQuery.trim());
        
        // Search dengan query yang sudah dinormalisasi
        const results = lrtFuse.search(normalizedQuery);
        
        // Juga coba search dengan query original untuk fallback
        const originalResults = lrtFuse.search(lrtSearchQuery.trim());
        
        // Gabungkan hasil dan remove duplicates
        const combinedResults = [...results, ...originalResults];
        const uniqueResults = combinedResults.filter((result, index, self) => 
            index === self.findIndex(r => r.item.id === result.item.id)
        );
        
        // Sort berdasarkan score (semakin kecil semakin baik)
        uniqueResults.sort((a, b) => a.score - b.score);
        
        return uniqueResults.map(result => result.item);
    }, [lrtSearchQuery, lrtFuse, lrtTikets]);

    // Calculate pagination for LRT tikets based on filtered data
    const totalLrtPages = Math.ceil(filteredLrtTikets.length / lrtItemsPerPage);
    const startLrtIndex = (currentLrtPage - 1) * lrtItemsPerPage;
    
    // Get paginated data from filtered LRT tikets results
    const paginatedLrtTikets = filteredLrtTikets.slice(startLrtIndex, startLrtIndex + lrtItemsPerPage);
    
    // Update total LRT tiket items for pagination info
    const displayTotalLrtItems = filteredLrtTikets.length;

    // Filter bandara tikets based on search query with NLS
    const filteredBandaraTikets = useMemo(() => {
        if (!bandaraSearchQuery.trim()) {
            setIsBandaraSearching(false);
            return bandaraTikets;
        }
        
        setIsBandaraSearching(true);
        
        // Normalisasi search query dengan synonyms
        const normalizedQuery = normalizeKeretaTextWithSynonyms(bandaraSearchQuery.trim());
        
        // Search dengan query yang sudah dinormalisasi
        const results = bandaraFuse.search(normalizedQuery);
        
        // Juga coba search dengan query original untuk fallback
        const originalResults = bandaraFuse.search(bandaraSearchQuery.trim());
        
        // Gabungkan hasil dan remove duplicates
        const combinedResults = [...results, ...originalResults];
        const uniqueResults = combinedResults.filter((result, index, self) => 
            index === self.findIndex(r => r.item.id === result.item.id)
        );
        
        // Sort berdasarkan score (semakin kecil semakin baik)
        uniqueResults.sort((a, b) => a.score - b.score);
        
        return uniqueResults.map(result => result.item);
    }, [bandaraSearchQuery, bandaraFuse, bandaraTikets]);

    // Calculate pagination for bandara tikets based on filtered data
    const totalBandaraPages = Math.ceil(filteredBandaraTikets.length / bandaraItemsPerPage);
    const startBandaraIndex = (currentBandaraPage - 1) * bandaraItemsPerPage;
    
    // Get paginated data from filtered bandara tikets results
    const paginatedBandaraTikets = filteredBandaraTikets.slice(startBandaraIndex, startBandaraIndex + bandaraItemsPerPage);
    
    // Update total bandara tiket items for pagination info
    const displayTotalBandaraItems = filteredBandaraTikets.length;

    // Fetch stations data
    const fetchStations = async () => {
        setLoadingStations(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/stasiuns', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Sort by station_id DESC (newest first)
                const sortedStations = data.data.sort((a, b) => b.station_id - a.station_id);
                setStations(sortedStations);
                setTotalItems(sortedStations.length);
            } else {
                toast.error('❌ Gagal memuat data stasiun!');
            }
        } catch (error) {
            console.error('Error fetching stations:', error);
            toast.error('❌ Terjadi kesalahan saat memuat data!');
        } finally {
            setLoadingStations(false);
        }
    };

    // Fetch keretas data
    const fetchKeretas = async () => {
        setLoadingKeretas(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/keretas', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Sort by train_id DESC (newest first)
                const sortedKeretas = data.data.sort((a, b) => b.train_id - a.train_id);
                setKeretas(sortedKeretas);
                setTotalKeretaItems(sortedKeretas.length);
            } else {
                toast.error('❌ Gagal memuat data kereta!');
            }
        } catch (error) {
            console.error('Error fetching keretas:', error);
            toast.error('❌ Terjadi kesalahan saat memuat data kereta!');
        } finally {
            setLoadingKeretas(false);
        }
    };

    // Fetch tikets data
    const fetchTikets = async () => {
        setLoadingTikets(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/tiket-antar-kotas', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Sort by id DESC (newest first)
                const sortedTikets = data.data.sort((a, b) => b.id - a.id);
                setTikets(sortedTikets);
                setTotalTiketItems(sortedTikets.length);
            } else {
                toast.error('❌ Gagal memuat data tiket!');
            }
        } catch (error) {
            console.error('Error fetching tikets:', error);
            toast.error('❌ Terjadi kesalahan saat memuat data tiket!');
        } finally {
            setLoadingTikets(false);
        }
    };

    // Fetch dropdown data for keretas
    const fetchDropdownKeretas = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/keretas', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableKeretas(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown keretas:', error);
        }
    };

    // Fetch dropdown data for stasiuns
    const fetchDropdownStasiuns = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/stasiuns', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableStasiuns(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown stasiuns:', error);
        }
    };

    // Fetch commiters data
    const fetchCommiters = async () => {
        setLoadingCommiters(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/tiket-commuters', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Sort by id DESC (newest first)
                const sortedCommiters = data.data.sort((a, b) => b.id - a.id);
                setCommiters(sortedCommiters);
                setTotalCommuterItems(sortedCommiters.length);
            } else {
                toast.error('❌ Gagal memuat data tiket commuter!');
            }
        } catch (error) {
            console.error('Error fetching commiters:', error);
            toast.error('❌ Terjadi kesalahan saat memuat data commuter!');
        } finally {
            setLoadingCommiters(false);
        }
    };

    // Fetch dropdown data for commuter keretas
    const fetchDropdownCommuterKeretas = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/commuter-keretas', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableCommuterKeretas(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown commuter keretas:', error);
        }
    };

    // Fetch dropdown data for commuter stasiuns
    const fetchDropdownCommuterStasiuns = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/commuter-stasiuns', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableCommuterStasiuns(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown commuter stasiuns:', error);
        }
    };

    // Fetch LRT tikets data
    const fetchLrtTikets = async () => {
        setLoadingLrtTikets(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/tiket-lrt', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Sort by id DESC (newest first)
                const sortedLrtTikets = data.data.sort((a, b) => b.id - a.id);
                setLrtTikets(sortedLrtTikets);
                setTotalLrtItems(sortedLrtTikets.length);
            } else {
                toast.error('❌ Gagal memuat data tiket LRT!');
            }
        } catch (error) {
            console.error('Error fetching LRT tikets:', error);
            toast.error('❌ Terjadi kesalahan saat memuat data LRT!');
        } finally {
            setLoadingLrtTikets(false);
        }
    };

    // Fetch dropdown data for LRT keretas
    const fetchDropdownLrtKeretas = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/lrt-keretas', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableLrtKeretas(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown LRT keretas:', error);
        }
    };

    // Fetch dropdown data for LRT stasiuns
    const fetchDropdownLrtStasiuns = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/lrt-stasiuns', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableLrtStasiuns(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown LRT stasiuns:', error);
        }
    };

    // Fetch bandara tikets data
    const fetchBandaraTikets = async () => {
        setLoadingBandaraTikets(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/tiket-bandara', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Sort by id DESC (newest first)
                const sortedBandaraTikets = data.data.sort((a, b) => b.id - a.id);
                setBandaraTikets(sortedBandaraTikets);
                setTotalBandaraItems(sortedBandaraTikets.length);
            } else {
                toast.error('❌ Gagal memuat data tiket bandara!');
            }
        } catch (error) {
            console.error('Error fetching bandara tikets:', error);
            toast.error('❌ Terjadi kesalahan saat memuat data bandara!');
        } finally {
            setLoadingBandaraTikets(false);
        }
    };

    // Fetch dropdown data for bandara keretas
    const fetchDropdownBandaraKeretas = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/bandara-keretas', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableBandaraKeretas(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown bandara keretas:', error);
        }
    };

    // Fetch dropdown data for bandara stasiuns
    const fetchDropdownBandaraStasiuns = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/dropdown/bandara-stasiuns', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setAvailableBandaraStasiuns(data.data);
            }
        } catch (error) {
            console.error('Error fetching dropdown bandara stasiuns:', error);
        }
    };

    // Load stations, keretas, tikets, commiters, LRT tikets, bandara tikets, and dropdown data on component mount
    useEffect(() => {
        fetchStations();
        fetchKeretas();
 fetchTikets();
        fetchCommiters();
        fetchLrtTikets();
        fetchBandaraTikets();
        fetchDropdownKeretas();
        fetchDropdownStasiuns();
        fetchDropdownCommuterKeretas();
        fetchDropdownCommuterStasiuns();
        fetchDropdownLrtKeretas();
        fetchDropdownLrtStasiuns();
        fetchDropdownBandaraKeretas();
        fetchDropdownBandaraStasiuns();
    }, []);

    // Reset pagination when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Reset kereta pagination when kereta search query changes
    useEffect(() => {
        setCurrentKeretaPage(1);
    }, [keretaSearchQuery]);

    // Reset tiket pagination when tiket search query changes
    useEffect(() => {
        setCurrentTiketPage(1);
    }, [tiketSearchQuery]);

    // Reset commuter pagination when commuter search query changes
    useEffect(() => {
        setCurrentCommuterPage(1);
    }, [commuterSearchQuery]);

    // Reset LRT pagination when LRT search query changes
    useEffect(() => {
        setCurrentLrtPage(1);
    }, [lrtSearchQuery]);

    // Reset bandara pagination when bandara search query changes
    useEffect(() => {
        setCurrentBandaraPage(1);
    }, [bandaraSearchQuery]);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            toast.info('👋 Logging out...', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            router.post('/logout');
        }
    };

    const handleStationSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/stasiuns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(stationData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Show success toast
                toast.success('🚉 ' + data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form data but keep modal open
                setStationData({ nama_stasiun: '', kota: '' });
                setErrors({}); // Clear any previous errors
                
                // Refresh stations data and reset to first page if needed
                if (paginatedStations.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                fetchStations();
            } else {
                // Handle validation errors
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                // Show error toast
                toast.error('❌ ' + (data.message || 'Gagal menyimpan data stasiun!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menyimpan data!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    // Handle edit station
    const handleEditStation = (station) => {
        setEditingStation(station);
        setStationData({
            nama_stasiun: station.nama_stasiun,
            kota: station.kota
        });
        setShowStationModal(true);
        setErrors({});
        toast.info('✏️ Mode edit stasiun', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    // Handle update station
    const handleUpdateStation = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/stasiuns/${editingStation.station_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(stationData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('✅ Data stasiun berhasil diupdate!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form but keep modal open
                setStationData({ nama_stasiun: '', kota: '' });
                setErrors({});
                setEditingStation(null); // Exit edit mode
                
                // Refresh stations data
                fetchStations();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal mengupdate data stasiun!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat mengupdate data!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    // Handle delete station
    const handleDeleteStation = async (station) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus stasiun "${station.nama_stasiun}"?`)) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/stasiuns/${station.station_id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🗑️ Data stasiun berhasil dihapus!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
                // Refresh stations data (modal stays open) and adjust pagination if needed
                if (paginatedStations.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                fetchStations();
            } else {
                toast.error('❌ ' + (data.message || 'Gagal menghapus data stasiun!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menghapus data!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    // Pagination functions
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleStationChange = (e) => {
        const { name, value } = e.target;
        setStationData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
    };

    // Kereta handlers
    const handleKeretaSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/keretas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(keretaData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🚂 ' + data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form data but keep modal open
                setKeretaData({ nama_kereta: '', kelas: '' });
                setErrors({});
                
                // Refresh keretas data and reset to first page if needed
                if (paginatedKeretas.length === 1 && currentKeretaPage > 1) {
                    setCurrentKeretaPage(currentKeretaPage - 1);
                }
                fetchKeretas();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal menyimpan data kereta!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menyimpan data kereta!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleEditKereta = (kereta) => {
        setEditingKereta(kereta);
        setKeretaData({
            nama_kereta: kereta.nama_kereta,
            kelas: kereta.kelas
        });
        setShowKeretaModal(true);
        setErrors({});
        toast.info('✏️ Mode edit kereta', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleUpdateKereta = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/keretas/${editingKereta.train_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(keretaData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('✅ Data kereta berhasil diupdate!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form but keep modal open
                setKeretaData({ nama_kereta: '', kelas: '' });
                setErrors({});
                setEditingKereta(null);
                
                fetchKeretas();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal mengupdate data kereta!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat mengupdate data kereta!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteKereta = async (kereta) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus kereta "${kereta.nama_kereta}"?`)) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/keretas/${kereta.train_id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🗑️ Data kereta berhasil dihapus!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
                // Refresh keretas data and adjust pagination if needed
                if (paginatedKeretas.length === 1 && currentKeretaPage > 1) {
                    setCurrentKeretaPage(currentKeretaPage - 1);
                }
                fetchKeretas();
            } else {
                toast.error('❌ ' + (data.message || 'Gagal menghapus data kereta!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menghapus data kereta!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleKeretaChange = (e) => {
        const { name, value } = e.target;
        setKeretaData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleKeretaSearchChange = (e) => {
        setKeretaSearchQuery(e.target.value);
    };

    const clearKeretaSearch = () => {
        setKeretaSearchQuery('');
    };

    // Kereta pagination functions
    const goToKeretaPage = (page) => {
        if (page >= 1 && page <= totalKeretaPages) {
            setCurrentKeretaPage(page);
        }
    };

    const goToPreviousKeretaPage = () => {
        if (currentKeretaPage > 1) {
            setCurrentKeretaPage(currentKeretaPage - 1);
        }
    };

    const goToNextKeretaPage = () => {
        if (currentKeretaPage < totalKeretaPages) {
            setCurrentKeretaPage(currentKeretaPage + 1);
        }
    };

    // Tiket handlers
    const handleTiketSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/tiket-antar-kotas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(tiketData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🎫 ' + data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form data but keep modal open
                setTiketData({
                    nama_kereta: '',
                    kelas: '',
                    harga_termurah: '',
                    jam: '',
                    tanggal: '',
                    penumpang: '',
                    stasiun_asal: '',
                    stasiun_tujuan: ''
                });
                setErrors({});
                
                // Refresh tikets data and reset to first page if needed
                if (paginatedTikets.length === 1 && currentTiketPage > 1) {
                    setCurrentTiketPage(currentTiketPage - 1);
                }
                fetchTikets();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal menyimpan data tiket!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menyimpan data tiket!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleEditTiket = (tiket) => {
        setEditingTiket(tiket);
        setTiketData({
            nama_kereta: tiket.nama_kereta,
            kelas: tiket.kelas,
            harga_termurah: tiket.harga_termurah,
            jam: tiket.jam,
            tanggal: tiket.tanggal,
            penumpang: tiket.penumpang,
            stasiun_asal: tiket.stasiun_asal,
            stasiun_tujuan: tiket.stasiun_tujuan
        });
        setShowTiketModal(true);
        setErrors({});
        toast.info('✏️ Mode edit tiket', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleUpdateTiket = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-antar-kotas/${editingTiket.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(tiketData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('✅ Data tiket berhasil diupdate!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form but keep modal open
                setTiketData({
                    nama_kereta: '',
                    kelas: '',
                    harga_termurah: '',
                    jam: '',
                    tanggal: '',
                    penumpang: '',
                    stasiun_asal: '',
                    stasiun_tujuan: ''
                });
                setErrors({});
                setEditingTiket(null);
                
                fetchTikets();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal mengupdate data tiket!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat mengupdate data tiket!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteTiket = async (tiket) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus tiket "${tiket.nama_kereta}"?`)) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-antar-kotas/${tiket.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🗑️ Data tiket berhasil dihapus!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
                // Refresh tikets data and adjust pagination if needed
                if (paginatedTikets.length === 1 && currentTiketPage > 1) {
                    setCurrentTiketPage(currentTiketPage - 1);
                }
                fetchTikets();
            } else {
                toast.error('❌ ' + (data.message || 'Gagal menghapus data tiket!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menghapus data tiket!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleTiketChange = (e) => {
        const { name, value } = e.target;
        setTiketData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleTiketSearchChange = (e) => {
        setTiketSearchQuery(e.target.value);
    };

    const clearTiketSearch = () => {
        setTiketSearchQuery('');
    };

    // Tiket pagination functions
    const goToTiketPage = (page) => {
        if (page >= 1 && page <= totalTiketPages) {
            setCurrentTiketPage(page);
        }
    };

    const goToPreviousTiketPage = () => {
        if (currentTiketPage > 1) {
            setCurrentTiketPage(currentTiketPage - 1);
        }
    };

    const goToNextTiketPage = () => {
        if (currentTiketPage < totalTiketPages) {
            setCurrentTiketPage(currentTiketPage + 1);
        }
    };

    // Commuter handlers
    const handleCommuterSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/tiket-commuters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(commuterData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🚋 ' + data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form data but keep modal open
                setCommuterData({
                    nama_kereta: '',
                    kelas: '',
                    harga_murah: '',
                    harga_normal: '',
                    jam_operasional: '',
                    stasiun_asal: '',
                    stasiun_tujuan: '',
                    interval_jam: '',
                    kapasitas_kursi: ''
                });
                setErrors({});
                
                // Refresh commiters data and reset to first page if needed
                if (paginatedCommiters.length === 1 && currentCommuterPage > 1) {
                    setCurrentCommuterPage(currentCommuterPage - 1);
                }
                fetchCommiters();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal menyimpan data tiket commuter!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menyimpan data commuter!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleEditCommuter = (commuter) => {
        setEditingCommuter(commuter);
        setCommuterData({
            nama_kereta: commuter.nama_kereta,
            kelas: commuter.kelas,
            harga_murah: commuter.harga_murah,
            harga_normal: commuter.harga_normal,
            jam_operasional: commuter.jam_operasional,
            stasiun_asal: commuter.stasiun_asal,
            stasiun_tujuan: commuter.stasiun_tujuan,
            interval_jam: commuter.interval_jam,
            kapasitas_kursi: commuter.kapasitas_kursi
        });
        setShowCommuterModal(true);
        setErrors({});
        toast.info('✏️ Mode edit commuter', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleUpdateCommuter = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-commuters/${editingCommuter.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(commuterData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('✅ Data commuter berhasil diupdate!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form but keep modal open
                setCommuterData({
                    nama_kereta: '',
                    kelas: '',
                    harga_murah: '',
                    harga_normal: '',
                    jam_operasional: '',
                    stasiun_asal: '',
                    stasiun_tujuan: '',
                    interval_jam: '',
                    kapasitas_kursi: ''
                });
                setErrors({});
                setEditingCommuter(null);
                
                fetchCommiters();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal mengupdate data commuter!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat mengupdate data commuter!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteCommuter = async (commuter) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus commuter "${commuter.nama_kereta}"?`)) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-commuters/${commuter.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🗑️ Data commuter berhasil dihapus!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
                // Refresh commiters data and adjust pagination if needed
                if (paginatedCommiters.length === 1 && currentCommuterPage > 1) {
                    setCurrentCommuterPage(currentCommuterPage - 1);
                }
                fetchCommiters();
            } else {
                toast.error('❌ ' + (data.message || 'Gagal menghapus data commuter!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menghapus data!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleCommuterChange = (e) => {
        const { name, value } = e.target;
        setCommuterData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCommuterSearchChange = (e) => {
        setCommuterSearchQuery(e.target.value);
    };

    const clearCommuterSearch = () => {
        setCommuterSearchQuery('');
    };

    // Commuter pagination functions
    const goToCommuterPage = (page) => {
        if (page >= 1 && page <= totalCommuterPages) {
            setCurrentCommuterPage(page);
        }
    };

    const goToPreviousCommuterPage = () => {
        if (currentCommuterPage > 1) {
            setCurrentCommuterPage(currentCommuterPage - 1);
        }
    };

    const goToNextCommuterPage = () => {
        if (currentCommuterPage < totalCommuterPages) {
            setCurrentCommuterPage(currentCommuterPage + 1);
        }
    };

    // LRT tiket handlers
    const handleLrtSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/tiket-lrt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(lrtData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🚆 ' + data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form data but keep modal open
                setLrtData({
                    nama_kereta: '',
                    harga_termurah: '',
                    jam: '',
                    tanggal: '',
                    penumpang: '',
                    stasiun_asal: '',
                    stasiun_tujuan: ''
                });
                setErrors({});
                
                // Refresh LRT tikets data and reset to first page if needed
                if (paginatedLrtTikets.length === 1 && currentLrtPage > 1) {
                    setCurrentLrtPage(currentLrtPage - 1);
                }
                fetchLrtTikets();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal menyimpan data tiket LRT!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menyimpan data LRT!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleEditLrtTiket = (tiket) => {
        setEditingLrtTiket(tiket);
        setLrtData({
            nama_kereta: tiket.nama_kereta,
            harga_termurah: tiket.harga_termurah,
            jam: tiket.jam,
            tanggal: tiket.tanggal ? new Date(tiket.tanggal).toISOString().split('T')[0] : '',
            penumpang: tiket.penumpang.toString(),
            stasiun_asal: tiket.stasiun_asal,
            stasiun_tujuan: tiket.stasiun_tujuan
        });
        setShowLrtModal(true);
        setErrors({});
        toast.info('✏️ Mode edit tiket LRT', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleUpdateLrtTiket = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-lrt/${editingLrtTiket.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(lrtData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('✅ Data tiket LRT berhasil diupdate!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form but keep modal open
                setLrtData({
                    nama_kereta: '',
                    harga_termurah: '',
                    jam: '',
                    tanggal: '',
                    penumpang: '',
                    stasiun_asal: '',
                    stasiun_tujuan: '',
                });
                setErrors({});
                setEditingLrtTiket(null);
                
                fetchLrtTikets();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal mengupdate data tiket LRT!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat mengupdate data LRT!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteLrtTiket = async (tiket) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus tiket LRT "${tiket.nama_kereta}"?`)) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-lrt/${tiket.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🗑️ Data tiket LRT berhasil dihapus!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
                // Refresh LRT tikets data and adjust pagination if needed
                if (paginatedLrtTikets.length === 1 && currentLrtPage > 1) {
                    setCurrentLrtPage(currentLrtPage - 1);
                }
                fetchLrtTikets();
            } else {
                toast.error('❌ ' + (data.message || 'Gagal menghapus data tiket LRT!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menghapus data LRT!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleLrtChange = (e) => {
        const { name, value } = e.target;
        setLrtData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleLrtSearchChange = (e) => {
        setLrtSearchQuery(e.target.value);
    };

    const clearLrtSearch = () => {
        setLrtSearchQuery('');
    };

    // LRT pagination functions
    const goToLrtPage = (page) => {
        if (page >= 1 && page <= totalLrtPages) {
            setCurrentLrtPage(page);
        }
    };

    const goToPreviousLrtPage = () => {
        if (currentLrtPage > 1) {
            setCurrentLrtPage(currentLrtPage - 1);
        }
    };

    const goToNextLrtPage = () => {
        if (currentLrtPage < totalLrtPages) {
            setCurrentLrtPage(currentLrtPage + 1);
        }
    };

    // Bandara tiket handlers
    const handleBandaraSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/tiket-bandara', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(bandaraData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('✈️ ' + data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form data but keep modal open
                setBandaraData({
                    nama_kereta: '',
                    harga_termurah: '',
                    jam: '',
                    tanggal: '',
                    penumpang: '',
                    stasiun_asal: '',
                    stasiun_tujuan: '',
                });
                setErrors({});
                
                // Refresh bandara tikets data and reset to first page if needed
                if (paginatedBandaraTikets.length === 1 && currentBandaraPage > 1) {
                    setCurrentBandaraPage(currentBandaraPage - 1);
                }
                fetchBandaraTikets();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal menyimpan data tiket bandara!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menyimpan data bandara!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleEditBandaraTiket = (tiket) => {
        setEditingBandaraTiket(tiket);
        setBandaraData({
            nama_kereta: tiket.nama_kereta,
            harga_termurah: tiket.harga_termurah,
            jam: tiket.jam,
            tanggal: tiket.tanggal ? new Date(tiket.tanggal).toISOString().split('T')[0] : '',
            penumpang: tiket.penumpang.toString(),
            stasiun_asal: tiket.stasiun_asal,
            stasiun_tujuan: tiket.stasiun_tujuan
        });
        setShowBandaraModal(true);
        setErrors({});
        toast.info('✏️ Mode edit tiket bandara', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleUpdateBandaraTiket = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-bandara/${editingBandaraTiket.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(bandaraData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('✅ Data tiket bandara berhasil diupdate!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset form but keep modal open
                setBandaraData({
                    nama_kereta: '',
                    harga_termurah: '',
                    jam: '',
                    tanggal: '',
                    penumpang: '',
                    stasiun_asal: '',
                    stasiun_tujuan: '',
                });
                setErrors({});
                setEditingBandaraTiket(null);
                
                fetchBandaraTikets();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
                
                toast.error('❌ ' + (data.message || 'Gagal mengupdate data tiket bandara!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat mengupdate data bandara!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteBandaraTiket = async (tiket) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus tiket bandara "${tiket.nama_kereta}"?`)) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/tiket-bandara/${tiket.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('🗑️ Data tiket bandara berhasil dihapus!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
                // Refresh bandara tikets data and adjust pagination if needed
                if (paginatedBandaraTikets.length === 1 && currentBandaraPage > 1) {
                    setCurrentBandaraPage(currentBandaraPage - 1);
                }
                fetchBandaraTikets();
            } else {
                toast.error('❌ ' + (data.message || 'Gagal menghapus data tiket bandara!'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Terjadi kesalahan saat menghapus data bandara!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleBandaraChange = (e) => {
        const { name, value } = e.target;
        setBandaraData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBandaraSearchChange = (e) => {
        setBandaraSearchQuery(e.target.value);
    };

    const clearBandaraSearch = () => {
        setBandaraSearchQuery('');
    };

    // Bandara pagination functions
    const goToBandaraPage = (page) => {
        if (page >= 1 && page <= totalBandaraPages) {
            setCurrentBandaraPage(page);
        }
    };

    const goToPreviousBandaraPage = () => {
        if (currentBandaraPage > 1) {
            setCurrentBandaraPage(currentBandaraPage - 1);
        }
    };

    const goToNextBandaraPage = () => {
        if (currentBandaraPage < totalBandaraPages) {
            setCurrentBandaraPage(currentBandaraPage + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
         
            <div className="w-64 bg-white shadow-sm border-r border-gray-200">
    
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-black rounded-sm"></div>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">KAI Admin</span>
                    </div>
                </div>

                {/* Removed non-KAI Favorites section */}

            
                <div className="p-4">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Main Menu</h3>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
                            <span className="mr-3">📊</span>
                            Dashboard
                        </a>
                        <button 
                            onClick={() => {
                                setShowStationModal(true);
                                // Reset form data when opening modal
                                setStationData({ nama_stasiun: '', kota: '' });
                                setErrors({});
                                setEditingStation(null); // Ensure we're in create mode
                                // Fetch stations data when opening modal
                                fetchStations();
                                toast.info('📝 Form tambah stasiun dibuka', {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 rounded-md hover:bg-blue-50 w-full text-left"
                        >
                            <span className="mr-3">🚉</span>
                            Tambah Stasiun
                        </button>
                        <button 
                            onClick={() => {
                                setShowKeretaModal(true);
                                // Reset form data when opening modal
                                setKeretaData({ nama_kereta: '', kelas: '' });
                                setErrors({});
                                setEditingKereta(null); // Ensure we're in create mode
                                // Fetch keretas data when opening modal
                                fetchKeretas();
                                toast.info('📝 Form tambah kereta dibuka', {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }}
                            className="flex items-center px-3 py-2 text-sm font-medium text-green-700 rounded-md hover:bg-green-50 w-full text-left"
                        >
                            <span className="mr-3">🚂</span>
                            Tambah Kereta
                        </button>
                        <button 
                            onClick={() => {
                                setShowTiketModal(true);
                                // Reset form data when opening modal
                                setTiketData({
                                    nama_kereta: '',
                                    kelas: '',
                                    harga_termurah: '',
                                    jam: '',
                                    tanggal: '',
                                    penumpang: '',
                                    stasiun_asal: '',
                                    stasiun_tujuan: ''
                                });
                                setErrors({});
                                setEditingTiket(null); // Ensure we're in create mode
                                // Fetch tikets data when opening modal
                                fetchTikets();
                                fetchDropdownKeretas();
                                fetchDropdownStasiuns();
                                toast.info('📝 Form tambah tiket dibuka', {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }}
                            className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 rounded-md hover:bg-purple-50 w-full text-left"
                        >
                            <span className="mr-3">🎫</span>
                            Tiket Antar Kota
                        </button>
                        <button 
                            onClick={() => {
                                setShowCommuterModal(true);
                                // Reset form data when opening modal
                                setCommuterData({
                                    nama_kereta: '',
                                    kelas: '',
                                    harga_murah: '',
                                    harga_normal: '',
                                    jam_operasional: '',
                                    stasiun_asal: '',
                                    stasiun_tujuan: '',
                                    interval_jam: '',
                                    kapasitas_kursi: ''
                                });
                                setErrors({});
                                setEditingCommuter(null); // Ensure we're in create mode
                                // Fetch commiters data when opening modal
                                fetchCommiters();
                                fetchDropdownCommuterKeretas();
                                fetchDropdownCommuterStasiuns();
                                toast.info('📝 Form tambah commuter dibuka', {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }}
                            className="flex items-center px-3 py-2 text-sm font-medium text-orange-700 rounded-md hover:bg-orange-50 w-full text-left"
                        >
                            <span className="mr-3">🚋</span>
                            Tiket Commuter
                        </button>
                        <button 
                            onClick={() => {
                                setShowLrtModal(true);
                                // Reset form data when opening modal
                                setLrtData({
                                    nama_kereta: '',
                                    harga_termurah: '',
                                    jam: '',
                                    tanggal: '',
                                    penumpang: '',
                                    stasiun_asal: '',
                                    stasiun_tujuan: '',
                                });
                                setErrors({});
                                setEditingLrtTiket(null); // Ensure we're in create mode
                                // Fetch LRT tikets data when opening modal
                                fetchLrtTikets();
                                fetchDropdownLrtKeretas();
                                fetchDropdownLrtStasiuns();
                                toast.info('📝 Form tambah LRT dibuka', {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }}
                            className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 rounded-md hover:bg-purple-50 w-full text-left"
                        >
                            <span className="mr-3">🚆</span>
                            Tiket LRT
                        </button>
                        <button 
                            onClick={() => {
                                setShowBandaraModal(true);
                                // Reset form data when opening modal
                                setBandaraData({
                                    nama_kereta: '',
                                    harga_termurah: '',
                                    jam: '',
                                    tanggal: '',
                                    penumpang: '',
                                    stasiun_asal: '',
                                    stasiun_tujuan: '',
                                });
                                setErrors({});
                                setEditingBandaraTiket(null); // Ensure we're in create mode
                                // Fetch bandara tikets data when opening modal
                                fetchBandaraTikets();
                                fetchDropdownBandaraKeretas();
                                fetchDropdownBandaraStasiuns();
                                toast.info('📝 Form tambah bandara dibuka', {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 rounded-md hover:bg-blue-50 w-full text-left"
                        >
                            <span className="mr-3">✈️</span>
                            Tiket Bandara
                        </button>
                    </nav>
                </div>

                {/* Removed promo card */}
            </div>

 
            <div className="flex-1 overflow-hidden">
           
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin KAI</h1>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Logout
                        </button>
                    </div>
                </header>

             
                <main className="flex-1 overflow-y-auto p-6">
                    {/* KAI Dashboard Overview */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard KAI</h1>
                                <p className="text-gray-600">Kelola data stasiun, kereta, tiket antar kota, dan commuter</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Terakhir diupdate</p>
                                    <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                        </div>

                        {/* KAI Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                            {/* Total Stasiun */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Total Stasiun</h3>
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 text-lg">🚉</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{stations.length}</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-blue-600 font-medium">Aktif</span>
                                            <span className="text-gray-500 ml-1">stasiun tersedia</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 20 L16 18 L32 12 L48 8 L64 4"
                                                stroke="#3B82F6"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Kereta */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Total Kereta</h3>
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 text-lg">🚂</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{keretas.length}</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-green-600 font-medium">Beroperasi</span>
                                            <span className="text-gray-500 ml-1">kereta aktif</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 24 L16 20 L32 16 L48 12 L64 8"
                                                stroke="#10B981"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Tiket */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Total Tiket</h3>
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-purple-600 text-lg">🎫</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{tikets.length}</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-purple-600 font-medium">Tersedia</span>
                                            <span className="text-gray-500 ml-1">tiket antar kota</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 28 L16 24 L32 16 L48 12 L64 6"
                                                stroke="#8B5CF6"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Commuter */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Total Commuter</h3>
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <span className="text-orange-600 text-lg">🚋</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{commiters.length}</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-orange-600 font-medium">Aktif</span>
                                            <span className="text-gray-500 ml-1">rute commuter</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 30 L16 26 L32 18 L48 14 L64 8"
                                                stroke="#F97316"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total LRT */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Total LRT</h3>
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-purple-600 text-lg">🚆</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{lrtTikets.length}</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-purple-600 font-medium">Tersedia</span>
                                            <span className="text-gray-500 ml-1">tiket LRT</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 32 L16 28 L32 20 L48 12 L64 4"
                                                stroke="#8B5CF6"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Bandara */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Total Bandara</h3>
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 text-lg">✈️</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{bandaraTikets.length}</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-blue-600 font-medium">Tersedia</span>
                                            <span className="text-gray-500 ml-1">tiket bandara</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 28 L16 24 L32 16 L48 8 L64 0"
                                                stroke="#3B82F6"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Aksi Cepat</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            <button 
                                onClick={() => {
                                    setShowStationModal(true);
                                    setStationData({ nama_stasiun: '', kota: '' });
                                    setErrors({});
                                    setEditingStation(null);
                                    fetchStations();
                                }}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-blue-600 text-xl">🚉</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Tambah Stasiun</h3>
                                    <p className="text-sm text-gray-500">Kelola data stasiun baru</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => {
                                    setShowKeretaModal(true);
                                    setKeretaData({ nama_kereta: '', kelas: '' });
                                    setErrors({});
                                    setEditingKereta(null);
                                    fetchKeretas();
                                }}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-green-600 text-xl">🚂</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Tambah Kereta</h3>
                                    <p className="text-sm text-gray-500">Kelola data kereta baru</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => {
                                    setShowTiketModal(true);
                                    setTiketData({
                                        nama_kereta: '',
                                        kelas: '',
                                        harga_termurah: '',
                                        jam: '',
                                        tanggal: '',
                                        penumpang: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: ''
                                    });
                                    setErrors({});
                                    setEditingTiket(null);
                                    fetchTikets();
                                    fetchDropdownKeretas();
                                    fetchDropdownStasiuns();
                                }}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-purple-600 text-xl">🎫</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Tambah Tiket</h3>
                                    <p className="text-sm text-gray-500">Kelola tiket antar kota</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => {
                                    setShowCommuterModal(true);
                                    setCommuterData({
                                        nama_kereta: '',
                                        kelas: '',
                                        harga_murah: '',
                                        harga_normal: '',
                                        jam_operasional: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: '',
                                        interval_jam: '',
                                        kapasitas_kursi: ''
                                    });
                                    setErrors({});
                                    setEditingCommuter(null);
                                    fetchCommiters();
                                    fetchDropdownCommuterKeretas();
                                    fetchDropdownCommuterStasiuns();
                                }}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                            >
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-orange-600 text-xl">🚋</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Tambah Commuter</h3>
                                    <p className="text-sm text-gray-500">Kelola tiket commuter</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => {
                                    setShowLrtModal(true);
                                    setLrtData({
                                        nama_kereta: '',
                                        harga_termurah: '',
                                        jam: '',
                                        tanggal: '',
                                        penumpang: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: '',
                                    });
                                    setErrors({});
                                    setEditingLrtTiket(null);
                                    fetchLrtTikets();
                                    fetchDropdownLrtKeretas();
                                    fetchDropdownLrtStasiuns();
                                }}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-purple-600 text-xl">🚆</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Tambah LRT</h3>
                                    <p className="text-sm text-gray-500">Kelola tiket LRT</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => {
                                    setShowBandaraModal(true);
                                    setBandaraData({
                                        nama_kereta: '',
                                        harga_termurah: '',
                                        jam: '',
                                        tanggal: '',
                                        penumpang: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: '',
                                    });
                                    setErrors({});
                                    setEditingBandaraTiket(null);
                                    fetchBandaraTikets();
                                    fetchDropdownBandaraKeretas();
                                    fetchDropdownBandaraStasiuns();
                                }}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-blue-600 text-xl">✈️</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Tambah Bandara</h3>
                                    <p className="text-sm text-gray-500">Kelola tiket bandara</p>
                                </div>
                            </button>
                        </div>
                    </div>

                </main>
            </div>

            {/* Station Modal */}
            {showStationModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white m-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingStation ? 'Edit Data Stasiun' : 'Tambah Data Stasiun'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowStationModal(false);
                                    // Reset form data when closing modal
                                    setStationData({ nama_stasiun: '', kota: '' });
                                    setErrors({});
                                    setEditingStation(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={editingStation ? handleUpdateStation : handleStationSubmit} className="space-y-4">
                            {/* Nama Stasiun Field */}
                            <div>
                                <label htmlFor="nama_stasiun" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Stasiun <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-500 ml-1">(string)</span>
                                </label>
                                <input
                                    type="text"
                                    id="nama_stasiun"
                                    name="nama_stasiun"
                                    value={stationData.nama_stasiun}
                                    onChange={handleStationChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.nama_stasiun ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Contoh: Stasiun Gambir"
                                />
                                {errors.nama_stasiun && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nama_stasiun}</p>
                                )}
                            </div>

                            {/* Kota Field */}
                            <div>
                                <label htmlFor="kota" className="block text-sm font-medium text-gray-700 mb-1">
                                    Kota <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-500 ml-1">(string)</span>
                                </label>
                                <input
                                    type="text"
                                    id="kota"
                                    name="kota"
                                    value={stationData.kota}
                                    onChange={handleStationChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.kota ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Contoh: Jakarta"
                                />
                                {errors.kota && (
                                    <p className="text-red-500 text-xs mt-1">{errors.kota}</p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowStationModal(false);
                                        // Reset form data when closing modal
                                        setStationData({ nama_stasiun: '', kota: '' });
                                        setErrors({});
                                        setEditingStation(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing 
                                        ? (editingStation ? 'Mengupdate...' : 'Menyimpan...') 
                                        : (editingStation ? 'Update' : 'Simpan')
                                    }
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-200"></div>

                        {/* Stations Table Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Data Stasiun</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {isSearching ? (
                                            <>Ditemukan: {displayTotalItems} dari {totalItems} stasiun | Halaman {currentPage} dari {totalPages}</>
                                        ) : (
                                            <>Total: {displayTotalItems} stasiun | Halaman {currentPage} dari {totalPages}</>
                                        )}
                                    </span>
                                    {loadingStations && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    )}
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari stasiun atau kota..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    {searchQuery && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                onClick={clearSearch}
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                title="Hapus pencarian"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isSearching && (
                                    <div className="mt-2 flex items-center text-sm text-blue-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Menampilkan hasil pencarian untuk "{searchQuery}"
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Stasiun
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kota
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal Dibuat
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingStations ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                                                        Memuat data...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedStations.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                    Belum ada data stasiun
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedStations.map((station, index) => (
                                                <tr key={station.station_id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {station.nama_stasiun}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {station.kota}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(station.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditStation(station)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteStation(station)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                🗑️ Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>
                                            Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, displayTotalItems)} dari {displayTotalItems} data
                                            {isSearching && (
                                                <span className="text-blue-600 ml-1">(hasil pencarian)</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentPage === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            ← Sebelumnya
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                // Show first page, last page, current page, and pages around current page
                                                const showPage = 
                                                    page === 1 || 
                                                    page === totalPages || 
                                                    (page >= currentPage - 1 && page <= currentPage + 1);
                                                
                                                if (!showPage) {
                                                    // Show ellipsis
                                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                                        return (
                                                            <span key={page} className="px-2 py-1 text-sm text-gray-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                            currentPage === page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentPage === totalPages
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Kereta Modal */}
            {showKeretaModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white m-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingKereta ? 'Edit Data Kereta' : 'Tambah Data Kereta'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowKeretaModal(false);
                                    // Reset form data when closing modal
                                    setKeretaData({ nama_kereta: '', kelas: '' });
                                    setErrors({});
                                    setEditingKereta(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={editingKereta ? handleUpdateKereta : handleKeretaSubmit} className="space-y-4">
                            {/* Nama Kereta Field */}
                            <div>
                                <label htmlFor="nama_kereta" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Kereta <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-500 ml-1">(string)</span>
                                </label>
                                <input
                                    type="text"
                                    id="nama_kereta"
                                    name="nama_kereta"
                                    value={keretaData.nama_kereta}
                                    onChange={handleKeretaChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.nama_kereta ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Contoh: Argo Bromo Anggrek"
                                />
                                {errors.nama_kereta && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nama_kereta}</p>
                                )}
                            </div>

                            {/* Kelas Field */}
                            <div>
                                <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
                                    Kelas <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-500 ml-1">(string)</span>
                                </label>
                                <select
                                    id="kelas"
                                    name="kelas"
                                    value={keretaData.kelas}
                                    onChange={handleKeretaChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.kelas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Kelas</option>
                                    <option value="Eksekutif">Eksekutif</option>
                                    <option value="Bisnis">Bisnis</option>
                                    <option value="Ekonomi">Ekonomi</option>
                                </select>
                                {errors.kelas && (
                                    <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>
                                )}
                            </div>


                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowKeretaModal(false);
                                        // Reset form data when closing modal
                                        setKeretaData({ nama_kereta: '', kelas: '' });
                                        setErrors({});
                                        setEditingKereta(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing 
                                        ? (editingKereta ? 'Mengupdate...' : 'Menyimpan...') 
                                        : (editingKereta ? 'Update' : 'Simpan')
                                    }
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-200"></div>

                        {/* Keretas Table Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Data Kereta</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {isKeretaSearching ? (
                                            <>Ditemukan: {displayTotalKeretaItems} dari {totalKeretaItems} kereta | Halaman {currentKeretaPage} dari {totalKeretaPages}</>
                                        ) : (
                                            <>Total: {displayTotalKeretaItems} kereta | Halaman {currentKeretaPage} dari {totalKeretaPages}</>
                                        )}
                                    </span>
                                    {loadingKeretas && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                    )}
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari kereta atau kelas..."
                                        value={keretaSearchQuery}
                                        onChange={handleKeretaSearchChange}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    />
                                    {keretaSearchQuery && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                onClick={clearKeretaSearch}
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                title="Hapus pencarian"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isKeretaSearching && (
                                    <div className="mt-2 flex items-center text-sm text-green-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Menampilkan hasil pencarian untuk "{keretaSearchQuery}"
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Kereta
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kelas
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal Dibuat
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingKeretas ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
                                                        Memuat data...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedKeretas.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                    Belum ada data kereta
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedKeretas.map((kereta, index) => (
                                                <tr key={kereta.train_id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {startKeretaIndex + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {kereta.nama_kereta}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            kereta.kelas === 'Eksekutif' ? 'bg-purple-100 text-purple-800' :
                                                            kereta.kelas === 'Bisnis' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {kereta.kelas}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(kereta.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditKereta(kereta)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteKereta(kereta)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                🗑️ Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalKeretaPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>
                                            Menampilkan {startKeretaIndex + 1} - {Math.min(startKeretaIndex + keretaItemsPerPage, displayTotalKeretaItems)} dari {displayTotalKeretaItems} data
                                            {isKeretaSearching && (
                                                <span className="text-green-600 ml-1">(hasil pencarian)</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={goToPreviousKeretaPage}
                                            disabled={currentKeretaPage === 1}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentKeretaPage === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            ← Sebelumnya
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalKeretaPages }, (_, i) => i + 1).map((page) => {
                                                // Show first page, last page, current page, and pages around current page
                                                const showPage = 
                                                    page === 1 || 
                                                    page === totalKeretaPages || 
                                                    (page >= currentKeretaPage - 1 && page <= currentKeretaPage + 1);
                                                
                                                if (!showPage) {
                                                    // Show ellipsis
                                                    if (page === currentKeretaPage - 2 || page === currentKeretaPage + 2) {
                                                        return (
                                                            <span key={page} className="px-2 py-1 text-sm text-gray-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToKeretaPage(page)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                            currentKeretaPage === page
                                                                ? 'bg-green-600 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={goToNextKeretaPage}
                                            disabled={currentKeretaPage === totalKeretaPages}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentKeretaPage === totalKeretaPages
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tiket Antar Kota Modal */}
            {showTiketModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white m-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingTiket ? 'Edit Data Tiket Antar Kota' : 'Tambah Data Tiket Antar Kota'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowTiketModal(false);
                                    // Reset form data when closing modal
                                    setTiketData({
                                        nama_kereta: '',
                                        kelas: '',
                                        harga_termurah: '',
                                        jam: '',
                                        tanggal: '',
                                        penumpang: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: ''
                                    });
                                    setErrors({});
                                    setEditingTiket(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={editingTiket ? handleUpdateTiket : handleTiketSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nama Kereta Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="nama_kereta" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Kereta <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="nama_kereta"
                                        name="nama_kereta"
                                        value={tiketData.nama_kereta}
                                        onChange={(e) => {
                                            handleTiketChange(e);
                                            // Auto-fill kelas when kereta is selected
                                            const selectedKereta = availableKeretas.find(k => k.nama_kereta === e.target.value);
                                            if (selectedKereta) {
                                                setTiketData(prev => ({
                                                    ...prev,
                                                    kelas: selectedKereta.kelas
                                                }));
                                            }
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.nama_kereta ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Kereta</option>
                                        {availableKeretas.map((kereta, index) => (
                                            <option key={index} value={kereta.nama_kereta}>
                                                {kereta.nama_kereta} ({kereta.kelas})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.nama_kereta && (
                                        <p className="text-red-500 text-xs mt-1">{errors.nama_kereta}</p>
                                    )}
                                </div>

                                {/* Kelas Field - Auto-filled */}
                                <div>
                                    <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
                                        Kelas <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="kelas"
                                        name="kelas"
                                        value={tiketData.kelas}
                                        onChange={handleTiketChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 ${
                                            errors.kelas ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Otomatis terisi dari kereta"
                                        readOnly
                                    />
                                    {errors.kelas && (
                                        <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>
                                    )}
                                </div>

                                {/* Harga Termurah Field */}
                                <div>
                                    <label htmlFor="harga_termurah" className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga Termurah <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(decimal)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="harga_termurah"
                                        name="harga_termurah"
                                        value={tiketData.harga_termurah}
                                        onChange={handleTiketChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.harga_termurah ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 150000"
                                        min="0"
                                        step="1000"
                                    />
                                    {errors.harga_termurah && (
                                        <p className="text-red-500 text-xs mt-1">{errors.harga_termurah}</p>
                                    )}
                                </div>

                                {/* Jam Field */}
                                <div>
                                    <label htmlFor="jam" className="block text-sm font-medium text-gray-700 mb-1">
                                        Jam Keberangkatan <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="jam"
                                        name="jam"
                                        value={tiketData.jam}
                                        onChange={handleTiketChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.jam ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.jam && (
                                        <p className="text-red-500 text-xs mt-1">{errors.jam}</p>
                                    )}
                                </div>

                                {/* Tanggal Field */}
                                <div>
                                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Keberangkatan <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(datetime)</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal"
                                        name="tanggal"
                                        value={tiketData.tanggal}
                                        onChange={handleTiketChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.tanggal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.tanggal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>
                                    )}
                                </div>

                                {/* Penumpang Field */}
                                <div>
                                    <label htmlFor="penumpang" className="block text-sm font-medium text-gray-700 mb-1">
                                        Jumlah Penumpang <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(int)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="penumpang"
                                        name="penumpang"
                                        value={tiketData.penumpang}
                                        onChange={handleTiketChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.penumpang ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 2"
                                        min="1"
                                    />
                                    {errors.penumpang && (
                                        <p className="text-red-500 text-xs mt-1">{errors.penumpang}</p>
                                    )}
                                </div>

                                {/* Stasiun Asal Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_asal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Asal <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_asal"
                                        name="stasiun_asal"
                                        value={tiketData.stasiun_asal}
                                        onChange={handleTiketChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.stasiun_asal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Asal</option>
                                        {availableStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} ({stasiun.kota})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_asal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_asal}</p>
                                    )}
                                </div>

                                {/* Stasiun Tujuan Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_tujuan" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Tujuan <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_tujuan"
                                        name="stasiun_tujuan"
                                        value={tiketData.stasiun_tujuan}
                                        onChange={handleTiketChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.stasiun_tujuan ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Tujuan</option>
                                        {availableStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} ({stasiun.kota})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_tujuan && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_tujuan}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowTiketModal(false);
                                        // Reset form data when closing modal
                                        setTiketData({
                                            nama_kereta: '',
                                            kelas: '',
                                            harga_termurah: '',
                                            jam: '',
                                            tanggal: '',
                                            penumpang: '',
                                            stasiun_asal: '',
                                            stasiun_tujuan: ''
                                        });
                                        setErrors({});
                                        setEditingTiket(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing 
                                        ? (editingTiket ? 'Mengupdate...' : 'Menyimpan...') 
                                        : (editingTiket ? 'Update' : 'Simpan')
                                    }
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-200"></div>

                        {/* Tikets Table Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Data Tiket Antar Kota</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {isTiketSearching ? (
                                            <>Ditemukan: {displayTotalTiketItems} dari {totalTiketItems} tiket | Halaman {currentTiketPage} dari {totalTiketPages}</>
                                        ) : (
                                            <>Total: {displayTotalTiketItems} tiket | Halaman {currentTiketPage} dari {totalTiketPages}</>
                                        )}
                                    </span>
                                    {loadingTikets && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                    )}
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari tiket, kereta, stasiun..."
                                        value={tiketSearchQuery}
                                        onChange={handleTiketSearchChange}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    />
                                    {tiketSearchQuery && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                onClick={clearTiketSearch}
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                title="Hapus pencarian"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isTiketSearching && (
                                    <div className="mt-2 flex items-center text-sm text-purple-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Menampilkan hasil pencarian untuk "{tiketSearchQuery}"
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kereta
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kelas
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rute
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Harga
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jadwal
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Penumpang
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingTikets ? (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
                                                        Memuat data...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedTikets.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                                                    Belum ada data tiket
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedTikets.map((tiket, index) => (
                                                <tr key={tiket.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {startTiketIndex + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {tiket.nama_kereta}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            tiket.kelas === 'Eksekutif' ? 'bg-purple-100 text-purple-800' :
                                                            tiket.kelas === 'Bisnis' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {tiket.kelas}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        <div className="max-w-xs">
                                                            <div className="text-xs text-gray-500">Dari:</div>
                                                            <div className="font-medium">{tiket.stasiun_asal}</div>
                                                            <div className="text-xs text-gray-500">Ke:</div>
                                                            <div className="font-medium">{tiket.stasiun_tujuan}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <span className="font-medium text-green-600">
                                                            Rp {new Intl.NumberFormat('id-ID').format(tiket.harga_termurah)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <div>
                                                            <div className="font-medium">{new Date(tiket.tanggal).toLocaleDateString('id-ID')}</div>
                                                            <div className="text-xs text-gray-500">{tiket.jam}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                            {tiket.penumpang} orang
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditTiket(tiket)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTiket(tiket)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                🗑️ Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalTiketPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>
                                            Menampilkan {startTiketIndex + 1} - {Math.min(startTiketIndex + tiketItemsPerPage, displayTotalTiketItems)} dari {displayTotalTiketItems} data
                                            {isTiketSearching && (
                                                <span className="text-purple-600 ml-1">(hasil pencarian)</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={goToPreviousTiketPage}
                                            disabled={currentTiketPage === 1}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentTiketPage === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            ← Sebelumnya
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalTiketPages }, (_, i) => i + 1).map((page) => {
                                                // Show first page, last page, current page, and pages around current page
                                                const showPage = 
                                                    page === 1 || 
                                                    page === totalTiketPages || 
                                                    (page >= currentTiketPage - 1 && page <= currentTiketPage + 1);
                                                
                                                if (!showPage) {
                                                    // Show ellipsis
                                                    if (page === currentTiketPage - 2 || page === currentTiketPage + 2) {
                                                        return (
                                                            <span key={page} className="px-2 py-1 text-sm text-gray-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToTiketPage(page)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                            currentTiketPage === page
                                                                ? 'bg-purple-600 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={goToNextTiketPage}
                                            disabled={currentTiketPage === totalTiketPages}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentTiketPage === totalTiketPages
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tiket Commuter Modal */}
            {showCommuterModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white m-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingCommuter ? 'Edit Data Tiket Commuter' : 'Tambah Data Tiket Commuter'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowCommuterModal(false);
                                    // Reset form data when closing modal
                                    setCommuterData({
                                        nama_kereta: '',    
                                        kelas: '',
                                        harga_murah: '',
                                        harga_normal: '',
                                        jam_operasional: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: '',
                                        interval_jam: '',
                                        kapasitas_kursi: ''
                                    });
                                    setErrors({});
                                    setEditingCommuter(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={editingCommuter ? handleUpdateCommuter : handleCommuterSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nama Kereta Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="nama_kereta" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Kereta <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="nama_kereta"
                                        name="nama_kereta"
                                        value={commuterData.nama_kereta}
                                        onChange={(e) => {
                                            handleCommuterChange(e);
                                            // Auto-fill kelas when kereta is selected
                                            const selectedKereta = availableCommuterKeretas.find(k => k.nama_kereta === e.target.value);
                                            if (selectedKereta) {
                                                setCommuterData(prev => ({
                                                    ...prev,
                                                    kelas: selectedKereta.kelas
                                                }));
                                            }
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.nama_kereta ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Kereta Commuter</option>
                                        {availableCommuterKeretas.map((kereta, index) => (
                                            <option key={index} value={kereta.nama_kereta}>

                                                {kereta.nama_kereta} ({kereta.kelas})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.nama_kereta && (
                                        <p className="text-red-500 text-xs mt-1">{errors.nama_kereta}</p>
                                    )}
                                </div>

                                {/* Kelas Field - Auto-filled */}
                                <div>
                                    <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
                                        Kelas <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="kelas"
                                        name="kelas"
                                        value={commuterData.kelas}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 ${
                                            errors.kelas ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Otomatis terisi dari kereta"
                                        readOnly
                                    />
                                    {errors.kelas && (
                                        <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>
                                    )}
                                </div>

                                {/* Harga Murah Field */}
                                <div>
                                    <label htmlFor="harga_murah" className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga Murah <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(decimal)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="harga_murah"
                                        name="harga_murah"
                                        value={commuterData.harga_murah}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.harga_murah ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 3000"
                                        min="0"
                                        step="100"
                                    />
                                    {errors.harga_murah && (
                                        <p className="text-red-500 text-xs mt-1">{errors.harga_murah}</p>
                                    )}
                                </div>

                                {/* Harga Normal Field */}
                                <div>
                                    <label htmlFor="harga_normal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga Normal <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(decimal)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="harga_normal"
                                        name="harga_normal"
                                        value={commuterData.harga_normal}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.harga_normal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 5000"
                                        min="0"
                                        step="100"
                                    />
                                    {errors.harga_normal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.harga_normal}</p>
                                    )}
                                </div>

                                {/* Jam Operasional Field */}
                                <div>
                                    <label htmlFor="jam_operasional" className="block text-sm font-medium text-gray-700 mb-1">
                                        Jam Operasional <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="jam_operasional"
                                        name="jam_operasional"
                                        value={commuterData.jam_operasional}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.jam_operasional ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 06:00-22:00"
                                    />
                                    {errors.jam_operasional && (
                                        <p className="text-red-500 text-xs mt-1">{errors.jam_operasional}</p>
                                    )}
                                </div>

                                {/* Interval Jam Field */}
                                <div>
                                    <label htmlFor="interval_jam" className="block text-sm font-medium text-gray-700 mb-1">
                                        Interval Jam <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(int)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="interval_jam"
                                        name="interval_jam"
                                        value={commuterData.interval_jam}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.interval_jam ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 15 (menit)"
                                        min="1"
                                    />
                                    {errors.interval_jam && (
                                        <p className="text-red-500 text-xs mt-1">{errors.interval_jam}</p>
                                    )}
                                </div>

                                {/* Stasiun Asal Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_asal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Asal <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_asal"
                                        name="stasiun_asal"
                                        value={commuterData.stasiun_asal}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.stasiun_asal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Asal</option>
                                        {availableCommuterStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} ({stasiun.kota})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_asal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_asal}</p>
                                    )}
                                </div>

                                {/* Stasiun Tujuan Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_tujuan" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Tujuan <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_tujuan"
                                        name="stasiun_tujuan"
                                        value={commuterData.stasiun_tujuan}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.stasiun_tujuan ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Tujuan</option>
                                        {availableCommuterStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} ({stasiun.kota})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_tujuan && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_tujuan}</p>
                                    )}
                                </div>

                                {/* Kapasitas Kursi Field */}
                                <div>
                                    <label htmlFor="kapasitas_kursi" className="block text-sm font-medium text-gray-700 mb-1">
                                        Kapasitas Kursi <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(int)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="kapasitas_kursi"
                                        name="kapasitas_kursi"
                                        value={commuterData.kapasitas_kursi}
                                        onChange={handleCommuterChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                            errors.kapasitas_kursi ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 300"
                                        min="1"
                                    />
                                    {errors.kapasitas_kursi && (
                                        <p className="text-red-500 text-xs mt-1">{errors.kapasitas_kursi}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCommuterModal(false);
                                    
                                        setCommuterData({
                                            nama_kereta: '',
                                            kelas: '',
                                            harga_murah: '',
                                            harga_normal: '',
                                            jam_operasional: '',
                                            stasiun_asal: '',
                                            stasiun_tujuan: '',
                                            interval_jam: '',
                                            kapasitas_kursi: ''
                                        });
                                        setErrors({});
                                        setEditingCommuter(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing 
                                        ? (editingCommuter ? 'Mengupdate...' : 'Menyimpan...') 
                                        : (editingCommuter ? 'Update' : 'Simpan')
                                    }
                                </button>
                            </div>
                        </form>

                     
                        <div className="my-8 border-t border-gray-200"></div>

           
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Data Tiket Commuter</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {isCommuterSearching ? (
                                            <>Ditemukan: {displayTotalCommuterItems} dari {totalCommuterItems} commuter | Halaman {currentCommuterPage} dari {totalCommuterPages}</>
                                        ) : (
                                            <>Total: {displayTotalCommuterItems} commuter | Halaman {currentCommuterPage} dari {totalCommuterPages}</>
                                        )}
                                    </span>
                                    {loadingCommiters && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari commuter, kereta, stasiun..."
                                        value={commuterSearchQuery}
                                        onChange={handleCommuterSearchChange}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                    />
                                    {commuterSearchQuery && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                onClick={clearCommuterSearch}
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                title="Hapus pencarian"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isCommuterSearching && (
                                    <div className="mt-2 flex items-center text-sm text-orange-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Menampilkan hasil pencarian untuk "{commuterSearchQuery}"
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kereta
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kelas
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Harga
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Operasional
                                            </th>
                                            <th className="px-3 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Interval
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rute
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kapasitas
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">

                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingCommiters ? (
                                            <tr>
                                                <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-2"></div>
                                                        Memuat data...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedCommiters.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                                                    Belum ada data commuter
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedCommiters.map((commuter, index) => (
                                                <tr key={commuter.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {startCommuterIndex + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {commuter.nama_kereta}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            commuter.kelas === 'Eksekutif' ? 'bg-purple-100 text-purple-800' :
                                                            commuter.kelas === 'Bisnis' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {commuter.kelas}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="space-y-1">
                                                            <div className="text-green-600 font-medium text-xs">
                                                                Murah: Rp {new Intl.NumberFormat('id-ID').format(commuter.harga_murah)}
                                                            </div>
                                                            <div className="text-gray-600 font-medium text-xs">
                                                                Normal: Rp {new Intl.NumberFormat('id-ID').format(commuter.harga_normal)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="text-xs text-gray-600">
                                                            {commuter.jam_operasional}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                            {commuter.interval_jam} menit
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        <div className="max-w-xs">
                                                            <div className="text-xs text-gray-500">Dari:</div>
                                                            <div className="font-medium">{commuter.stasiun_asal}</div>
                                                            <div className="text-xs text-gray-500">Ke:</div>
                                                            <div className="font-medium">{commuter.stasiun_tujuan}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                            {commuter.kapasitas_kursi} kursi
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditCommuter(commuter)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCommuter(commuter)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                🗑️ Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalCommuterPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>
                                            Menampilkan {startCommuterIndex + 1} - {Math.min(startCommuterIndex + commuterItemsPerPage, displayTotalCommuterItems)} dari {displayTotalCommuterItems} data
                                            {isCommuterSearching && (
                                                <span className="text-orange-600 ml-1">(hasil pencarian)</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                  
                                        <button
                                            onClick={goToPreviousCommuterPage}
                                            disabled={currentCommuterPage === 1}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentCommuterPage === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            ← Sebelumnya
                                        </button>

                                    
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalCommuterPages }, (_, i) => i + 1).map((page) => {
                                          
                                                const showPage = 
                                                    page === 1 || 
                                                    page === totalCommuterPages || 
                                                    (page >= currentCommuterPage - 1 && page <= currentCommuterPage + 1);
                                                
                                                if (!showPage) {
                                              
                                                    if (page === currentCommuterPage - 2 || page === currentCommuterPage + 2) {
                                                        return (
                                                            <span key={page} className="px-2 py-1 text-sm text-gray-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToCommuterPage(page)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                            currentCommuterPage === page
                                                                ? 'bg-orange-600 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={goToNextCommuterPage}
                                            disabled={currentCommuterPage === totalCommuterPages}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentCommuterPage === totalCommuterPages
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {showLrtModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white m-4">
              
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingLrtTiket ? 'Edit Data Tiket LRT' : 'Tambah Data Tiket LRT'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowLrtModal(false);
                                    setLrtData({
                                        nama_kereta: '',
                                        harga_termurah: '',
                                        jam: '',
                                        tanggal: '',
                                        penumpang: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: '',
                                    });
                                    setErrors({});
                                    setEditingLrtTiket(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                     
                        <form onSubmit={editingLrtTiket ? handleUpdateLrtTiket : handleLrtSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         
                                <div>
                                    <label htmlFor="nama_kereta" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Kereta <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="nama_kereta"
                                        name="nama_kereta"
                                        value={lrtData.nama_kereta}
                                        onChange={handleLrtChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.nama_kereta ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Kereta</option>
                                        {availableLrtKeretas.map((kereta, index) => (
                                            <option key={index} value={kereta.nama_kereta}>
                                                {kereta.nama_kereta}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.nama_kereta && (
                                        <p className="text-red-500 text-xs mt-1">{errors.nama_kereta}</p>
                                    )}
                                </div>

                               
                                <div>
                                    <label htmlFor="harga_termurah" className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga Termurah <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="harga_termurah"
                                        name="harga_termurah"
                                        value={lrtData.harga_termurah}
                                        onChange={handleLrtChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.harga_termurah ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 8000"
                                    />
                                    {errors.harga_termurah && (
                                        <p className="text-red-500 text-xs mt-1">{errors.harga_termurah}</p>
                                    )}
                                </div>


                      
                                <div>
                                    <label htmlFor="jam" className="block text-sm font-medium text-gray-700 mb-1">
                                        Jam <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="jam"
                                        name="jam"
                                        value={lrtData.jam}
                                        onChange={handleLrtChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.jam ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.jam && (
                                        <p className="text-red-500 text-xs mt-1">{errors.jam}</p>
                                    )}
                                </div>

     
                                <div>
                                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(datetime)</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal"
                                        name="tanggal"
                                        value={lrtData.tanggal}
                                        onChange={handleLrtChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.tanggal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.tanggal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>
                                    )}
                                </div>

                                {/* Penumpang Field */}
                                <div>
                                    <label htmlFor="penumpang" className="block text-sm font-medium text-gray-700 mb-1">
                                        Penumpang <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(int)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="penumpang"
                                        name="penumpang"
                                        value={lrtData.penumpang}
                                        onChange={handleLrtChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.penumpang ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 2"
                                        min="1"
                                    />
                                    {errors.penumpang && (
                                        <p className="text-red-500 text-xs mt-1">{errors.penumpang}</p>
                                    )}
                                </div>

                                {/* Stasiun Asal Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_asal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Asal <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_asal"
                                        name="stasiun_asal"
                                        value={lrtData.stasiun_asal}
                                        onChange={handleLrtChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.stasiun_asal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Asal</option>
                                        {availableLrtStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} - {stasiun.kota}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_asal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_asal}</p>
                                    )}
                                </div>

                                {/* Stasiun Tujuan Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_tujuan" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Tujuan <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_tujuan"
                                        name="stasiun_tujuan"
                                        value={lrtData.stasiun_tujuan}
                                        onChange={handleLrtChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.stasiun_tujuan ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Tujuan</option>
                                        {availableLrtStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} - {stasiun.kota}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_tujuan && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_tujuan}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLrtModal(false);
                                        setLrtData({
                                            nama_kereta: '',
                                            harga_termurah: '',
                                            jam: '',
                                            tanggal: '',
                                            penumpang: '',
                                            stasiun_asal: '',
                                            stasiun_tujuan: '',
                                        });
                                        setErrors({});
                                        setEditingLrtTiket(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing 
                                        ? (editingLrtTiket ? 'Mengupdate...' : 'Menyimpan...') 
                                        : (editingLrtTiket ? 'Update' : 'Simpan')
                                    }
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-200"></div>

                        {/* LRT Tikets Table Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Data Tiket LRT</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {isLrtSearching ? (
                                            <>Ditemukan: {displayTotalLrtItems} dari {totalLrtItems} tiket LRT | Halaman {currentLrtPage} dari {totalLrtPages}</>
                                        ) : (
                                            <>Total: {displayTotalLrtItems} tiket LRT | Halaman {currentLrtPage} dari {totalLrtPages}</>
                                        )}
                                    </span>
                                    {loadingLrtTikets && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                    )}
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari tiket LRT, kereta, stasiun..."
                                        value={lrtSearchQuery}
                                        onChange={handleLrtSearchChange}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    />
                                    {lrtSearchQuery && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                onClick={clearLrtSearch}
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                title="Hapus pencarian"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isLrtSearching && (
                                    <div className="mt-2 flex items-center text-sm text-purple-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Menampilkan hasil pencarian untuk "{lrtSearchQuery}"
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kereta
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Harga
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jadwal
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Penumpang
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rute
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingLrtTikets ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
                                                        Memuat data...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedLrtTikets.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                                    Belum ada data tiket LRT
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedLrtTikets.map((tiket, index) => (
                                                <tr key={tiket.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {startLrtIndex + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {tiket.nama_kereta}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <span className="font-medium text-green-600">
                                                            Rp {tiket.harga_termurah}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <div>
                                                            <div className="font-medium">{new Date(tiket.tanggal).toLocaleDateString('id-ID')}</div>
                                                            <div className="text-xs text-gray-500">{tiket.jam}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                            {tiket.penumpang} orang
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        <div className="max-w-xs">
                                                            <div className="text-xs text-gray-500">Dari:</div>
                                                            <div className="font-medium">{tiket.stasiun_asal}</div>
                                                            <div className="text-xs text-gray-500">Ke:</div>
                                                            <div className="font-medium">{tiket.stasiun_tujuan}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditLrtTiket(tiket)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purplete-500"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLrtTiket(tiket)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                🗑️ Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalLrtPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>
                                            Menampilkan {startLrtIndex + 1} - {Math.min(startLrtIndex + lrtItemsPerPage, displayTotalLrtItems)} dari {displayTotalLrtItems} data
                                            {isLrtSearching && (
                                                <span className="text-purple-600 ml-1">(hasil pencarian)</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={goToPreviousLrtPage}
                                            disabled={currentLrtPage === 1}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentLrtPage === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            ← Sebelumnya
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalLrtPages }, (_, i) => i + 1).map((page) => {
                                                const showPage = 
                                                    page === 1 || 
                                                    page === totalLrtPages || 
                                                    (page >= currentLrtPage - 1 && page <= currentLrtPage + 1);
                                                
                                                if (!showPage) {
                                                    if (page === currentLrtPage - 2 || page === currentLrtPage + 2) {
                                                        return (
                                                            <span key={page} className="px-2 py-1 text-sm text-gray-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToLrtPage(page)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                            currentLrtPage === page
                                                                ? 'bg-purple-600 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={goToNextLrtPage}
                                            disabled={currentLrtPage === totalLrtPages}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentLrtPage === totalLrtPages
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tiket Bandara Modal */}
            {showBandaraModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white m-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingBandaraTiket ? 'Edit Data Tiket Bandara' : 'Tambah Data Tiket Bandara'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowBandaraModal(false);
                                    setBandaraData({
                                        nama_kereta: '',
                                        harga_termurah: '',
                                        jam: '',
                                        tanggal: '',
                                        penumpang: '',
                                        stasiun_asal: '',
                                        stasiun_tujuan: '',
                                    });
                                    setErrors({});
                                    setEditingBandaraTiket(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={editingBandaraTiket ? handleUpdateBandaraTiket : handleBandaraSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nama Kereta Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="nama_kereta" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Kereta <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="nama_kereta"
                                        name="nama_kereta"
                                        value={bandaraData.nama_kereta}
                                        onChange={handleBandaraChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.nama_kereta ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Kereta</option>
                                        {availableBandaraKeretas.map((kereta, index) => (
                                            <option key={index} value={kereta.nama_kereta}>
                                                {kereta.nama_kereta}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.nama_kereta && (
                                        <p className="text-red-500 text-xs mt-1">{errors.nama_kereta}</p>
                                    )}
                                </div>

                                {/* Harga Termurah Field */}
                                <div>
                                    <label htmlFor="harga_termurah" className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga Termurah <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="harga_termurah"
                                        name="harga_termurah"
                                        value={bandaraData.harga_termurah}
                                        onChange={handleBandaraChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.harga_termurah ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 15000"
                                    />
                                    {errors.harga_termurah && (
                                        <p className="text-red-500 text-xs mt-1">{errors.harga_termurah}</p>
                                    )}
                                </div>


                                {/* Jam Field */}
                                <div>
                                    <label htmlFor="jam" className="block text-sm font-medium text-gray-700 mb-1">
                                        Jam <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="jam"
                                        name="jam"
                                        value={bandaraData.jam}
                                        onChange={handleBandaraChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.jam ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.jam && (
                                        <p className="text-red-500 text-xs mt-1">{errors.jam}</p>
                                    )}
                                </div>

                                {/* Tanggal Field */}
                                <div>
                                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(datetime)</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal"
                                        name="tanggal"
                                        value={bandaraData.tanggal}
                                        onChange={handleBandaraChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.tanggal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.tanggal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>
                                    )}
                                </div>

                                {/* Penumpang Field */}
                                <div>
                                    <label htmlFor="penumpang" className="block text-sm font-medium text-gray-700 mb-1">
                                        Penumpang <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(int)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="penumpang"
                                        name="penumpang"
                                        value={bandaraData.penumpang}
                                        onChange={handleBandaraChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.penumpang ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: 2"
                                        min="1"
                                    />
                                    {errors.penumpang && (
                                        <p className="text-red-500 text-xs mt-1">{errors.penumpang}</p>
                                    )}
                                </div>

                                {/* Stasiun Asal Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_asal" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Asal <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_asal"
                                        name="stasiun_asal"
                                        value={bandaraData.stasiun_asal}
                                        onChange={handleBandaraChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.stasiun_asal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Asal</option>
                                        {availableBandaraStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} - {stasiun.kota}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_asal && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_asal}</p>
                                    )}
                                </div>

                                {/* Stasiun Tujuan Field - Dropdown Search */}
                                <div>
                                    <label htmlFor="stasiun_tujuan" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stasiun Tujuan <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(string)</span>
                                    </label>
                                    <select
                                        id="stasiun_tujuan"
                                        name="stasiun_tujuan"
                                        value={bandaraData.stasiun_tujuan}
                                        onChange={handleBandaraChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.stasiun_tujuan ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Stasiun Tujuan</option>
                                        {availableBandaraStasiuns.map((stasiun, index) => (
                                            <option key={index} value={stasiun.nama_stasiun}>
                                                {stasiun.nama_stasiun} - {stasiun.kota}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.stasiun_tujuan && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stasiun_tujuan}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBandaraModal(false);
                                        setBandaraData({
                                            nama_kereta: '',
                                            harga_termurah: '',
                                            jam: '',
                                            tanggal: '',
                                            penumpang: '',
                                            stasiun_asal: '',
                                            stasiun_tujuan: '',
                                        });
                                        setErrors({});
                                        setEditingBandaraTiket(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing 
                                        ? (editingBandaraTiket ? 'Mengupdate...' : 'Menyimpan...') 
                                        : (editingBandaraTiket ? 'Update' : 'Simpan')
                                    }
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-200"></div>

                        {/* Bandara Tikets Table Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Data Tiket Bandara</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {isBandaraSearching ? (
                                            <>Ditemukan: {displayTotalBandaraItems} dari {totalBandaraItems} tiket bandara | Halaman {currentBandaraPage} dari {totalBandaraPages}</>
                                        ) : (
                                            <>Total: {displayTotalBandaraItems} tiket bandara | Halaman {currentBandaraPage} dari {totalBandaraPages}</>
                                        )}
                                    </span>
                                    {loadingBandaraTikets && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    )}
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="mb-4">
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari tiket bandara, kereta, stasiun..."
                                        value={bandaraSearchQuery}
                                        onChange={handleBandaraSearchChange}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    {bandaraSearchQuery && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                onClick={clearBandaraSearch}
                                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                title="Hapus pencarian"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isBandaraSearching && (
                                    <div className="mt-2 flex items-center text-sm text-blue-600">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Menampilkan hasil pencarian untuk "{bandaraSearchQuery}"
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kereta
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Harga
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jadwal
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Penumpang
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rute
                                            </th>
                                            <th className="px-4 py-3 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingBandaraTikets ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                                                        Memuat data...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedBandaraTikets.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                                    Belum ada data tiket bandara
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedBandaraTikets.map((tiket, index) => (
                                                <tr key={tiket.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {startBandaraIndex + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {tiket.nama_kereta}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <span className="font-medium text-green-600">
                                                            Rp {tiket.harga_termurah}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        <div>
                                                            <div className="font-medium">{new Date(tiket.tanggal).toLocaleDateString('id-ID')}</div>
                                                            <div className="text-xs text-gray-500">{tiket.jam}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                            {tiket.penumpang} orang
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        <div className="max-w-xs">
                                                            <div className="text-xs text-gray-500">Dari:</div>
                                                            <div className="font-medium">{tiket.stasiun_asal}</div>
                                                            <div className="text-xs text-gray-500">Ke:</div>
                                                            <div className="font-medium">{tiket.stasiun_tujuan}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditBandaraTiket(tiket)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBandaraTiket(tiket)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                🗑️ Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalBandaraPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>
                                            Menampilkan {startBandaraIndex + 1} - {Math.min(startBandaraIndex + bandaraItemsPerPage, displayTotalBandaraItems)} dari {displayTotalBandaraItems} data
                                            {isBandaraSearching && (
                                                <span className="text-blue-600 ml-1">(hasil pencarian)</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={goToPreviousBandaraPage}
                                            disabled={currentBandaraPage === 1}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentBandaraPage === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            ← Sebelumnya
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalBandaraPages }, (_, i) => i + 1).map((page) => {
                                                const showPage = 
                                                    page === 1 || 
                                                    page === totalBandaraPages || 
                                                    (page >= currentBandaraPage - 1 && page <= currentBandaraPage + 1);
                                                
                                                if (!showPage) {
                                                    if (page === currentBandaraPage - 2 || page === currentBandaraPage + 2) {
                                                        return (
                                                            <span key={page} className="px-2 py-1 text-sm text-gray-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToBandaraPage(page)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                            currentBandaraPage === page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={goToNextBandaraPage}
                                            disabled={currentBandaraPage === totalBandaraPages}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentBandaraPage === totalBandaraPages
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}
