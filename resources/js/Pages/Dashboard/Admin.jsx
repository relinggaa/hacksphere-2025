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

    // Load stations and keretas on component mount
    useEffect(() => {
        fetchStations();
        fetchKeretas();
    }, []);

    // Reset pagination when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Reset kereta pagination when kereta search query changes
    useEffect(() => {
        setCurrentKeretaPage(1);
    }, [keretaSearchQuery]);

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

                <div className="p-4">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Favorites</h3>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">📚</span>
                            Technical Docs
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">📋</span>
                            Campaign Guidelines
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">⚠️</span>
                            Important Rules
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">🎯</span>
                            Onboarding
                        </a>
                    </nav>
                </div>

            
                <div className="p-4">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Main Menu</h3>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
                            <span className="mr-3">📊</span>
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">📢</span>
                            Campaigns
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">💬</span>
                            Chat
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">🛠️</span>
                            Support Center
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">👥</span>
                            Leads
                        </a>
                        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                            <span className="mr-3">📁</span>
                            Archive
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
                    </nav>
                </div>

                <div className="p-4 mt-auto">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm">🔧</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-800">Get the extension</p>
                                <p className="text-xs text-green-600">Install Now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

 
            <div className="flex-1 overflow-hidden">
           
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <nav className="flex space-x-8">
                                <a href="#" className="text-gray-500 hover:text-gray-700">Campaigns</a>
                                <a href="#" className="text-gray-900 font-medium border-b-2 border-purple-500 pb-4">Analytics</a>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <span className="text-xs text-gray-400">⌘ /</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

             
                <main className="flex-1 overflow-y-auto p-6">
       
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your total revenue</h1>
                                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                                    $90,239.00
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Select Dates
                                </button>
                                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filt
                                </button>
                            </div>
                        </div>

                    
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">New subscriptions</h3>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">22</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-green-600 font-medium">↗ 15%</span>
                                            <span className="text-gray-500 ml-1">compared to last week</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 20 L16 18 L32 12 L48 8 L64 4"
                                                stroke="#8B5CF6"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">New orders</h3>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">320</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-green-600 font-medium">↗ 4%</span>
                                            <span className="text-gray-500 ml-1">compared to last week</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-8">
                                        <svg viewBox="0 0 64 32" className="w-full h-full">
                                            <path
                                                d="M0 24 L16 20 L32 16 L48 12 L64 8"
                                                stroke="#F59E0B"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600">Avg. order revenue</h3>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">$1,080</div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-green-600 font-medium">↗ 8%</span>
                                            <span className="text-gray-500 ml-1">compared to last week</span>
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
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Recent campaigns</h2>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">View</a>
                            </div>
                        </div>

                        {/* Campaign Tabs */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex space-x-8">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">Draft</span>
                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">2</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">In Progress</span>
                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">2</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">Archived</span>
                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">1</span>
                                </div>
                            </div>
                        </div>

      
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">10 Simple steps to revolutionise workflows with our product</h3>
                                    <div className="text-xs text-gray-500 mb-3">
                                        <span className="font-medium">Start:</span> Not Started
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-medium">Last updated:</span> Apr 10, 2023
                                    </div>
                                </div>

                 
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">Boost your performance: start using our amazing product</h3>
                                    <div className="text-xs text-gray-500 mb-2">
                                        <span className="font-medium">Start:</span> Jun 1, 2023 
                                        <span className="ml-4 font-medium">Ends:</span> Aug 1, 2023
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                                        <div className="bg-green-500 h-1 rounded-full" style={{width: '60%'}}></div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-medium">Last updated:</span> July 10, 2023
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">The power of our product: A new era in SaaS</h3>
                                    <div className="text-xs text-gray-500 mb-3">
                                        <span className="font-medium">Ended:</span> Jun 11, 2023
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-medium">Last updated:</span> Apr 10, 2023
                                    </div>
                                </div>
                            </div>

                         
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                          
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.132-1.551l3.132-5.432l3.132 5.432c-.684.94-1.835 1.551-3.132 1.551z"/>
                                            </svg>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">Beyond Boundaries: Explore our new product</h3>
                                    <div className="text-xs text-gray-500 mb-3">
                                        <span className="font-medium">Start:</span> Not Started
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">Skyrocket your productivity: our product is revealed</h3>
                                    <div className="text-xs text-gray-500 mb-2">
                                        <span className="font-medium">Start:</span> Jul 1, 2023 
                                        <span className="ml-4 font-medium">Ends:</span> Sep 30, 2023
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                                        <div className="bg-green-500 h-1 rounded-full" style={{width: '25%'}}></div>
                                    </div>
                                </div>
                            </div>

                         
                            <div className="mt-6">
                                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add campaign
                                </button>
                            </div>
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
