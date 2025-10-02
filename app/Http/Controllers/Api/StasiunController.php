<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stasiun;
use Illuminate\Http\Request;

class StasiunController extends Controller
{
    /**
     * Get all stations
     */
    public function index(Request $request)
    {
        try {
            $query = Stasiun::query();

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nama_stasiun', 'LIKE', "%{$search}%")
                      ->orWhere('kota', 'LIKE', "%{$search}%");
                });
            }

            $stations = $query->orderBy('nama_stasiun', 'asc')->get();

            // Transform data to match frontend format
            $transformedStations = $stations->map(function($station) {
                return [
                    'id' => $station->station_id,
                    'name' => $station->nama_stasiun,
                    'code' => $this->generateStationCode($station->nama_stasiun),
                    'city' => $station->kota
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedStations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all stations (no popular filter)
     */
    public function all()
    {
        try {
            $stations = Stasiun::orderBy('nama_stasiun', 'asc')->get();

            $transformedStations = $stations->map(function($station) {
                return [
                    'id' => $station->station_id,
                    'name' => $station->nama_stasiun,
                    'code' => $this->generateStationCode($station->nama_stasiun),
                    'city' => $station->kota
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedStations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch all stations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate station code from station name
     */
    private function generateStationCode($stationName)
    {
        $codes = [
            'Gambir' => 'GMR',
            'Pasar Senen' => 'PSE',
            'Bandung' => 'BD',
            'Yogyakarta Tugu' => 'YK',
            'Solo Balapan' => 'SLO',
            'Surabaya Gubeng' => 'SGU',
            'Surabaya Pasar Turi' => 'SPT',
            'Malang' => 'MLG',
            'Semarang Tawang' => 'SMT',
            'Semarang Poncol' => 'SMP',
            'Cirebon' => 'CN',
            'Purwokerto' => 'PWT',
            'Jember' => 'JMR',
            'Probolinggo' => 'PB',
            'Kediri' => 'KD',
            'Madiun' => 'MDN',
            'Jakarta' => 'JKT',
            'Bogor' => 'BGR',
            'Bekasi' => 'BKS',
            'Tanah Abang' => 'THB',
            'Manggarai' => 'MGR',
            'Kiaracondong' => 'KAC',
            'Cimahi' => 'CMH',
            'Tasikmalaya' => 'TSM',
            'Garut' => 'GRT',
            'Sukabumi' => 'SKB',
            'Cianjur' => 'CJR',
            'Klaten' => 'KLT',
            'Purwosari' => 'PWS',
            'Lempuyangan' => 'LPN',
            'Wojo' => 'WJ',
            'Maguwo' => 'MGW',
            'Blitar' => 'BLT',
            'Tulungagung' => 'TLG',
            'Nganjuk' => 'NGK',
            'Caruban' => 'CRB',
            'Ngawi' => 'NGW',
            'Magetan' => 'MGT',
            'Ponorogo' => 'PNR',
            'Pasuruan' => 'PSR',
            'Bangil' => 'BGL',
            'Mojokerto' => 'MJK',
            'Lamongan' => 'LMG',
            'Bojonegoro' => 'BJN',
            'Tuban' => 'TBN',
            'Cepu' => 'CPU',
            'Banyuwangi Baru' => 'BWI'
        ];

        return $codes[$stationName] ?? strtoupper(substr($stationName, 0, 3));
    }

}