<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JadwalKeretaController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Ambil data dari request
            $stasiunAsal = trim($request->input('keberangkatan', ''));
            $stasiunTujuan = trim($request->input('tujuan', ''));
            $tanggal = trim($request->input('tanggal', ''));
            $dewasa = (int) $request->input('dewasa', 1);
            $bayi = (int) $request->input('bayi', 0);
            $penumpang = $dewasa + $bayi;

            // Prepare search parameters
            $searchData = [
                'keberangkatan' => $stasiunAsal,
                'tujuan' => $stasiunTujuan,
                'tanggal' => $tanggal,
                'dewasa' => $dewasa,
                'bayi' => $bayi,
                'penumpang' => $penumpang
            ];

            $schedules = [];

            // Validate required parameters
            if ($stasiunAsal && $stasiunTujuan && $tanggal) {
                // Debug: Check what data exists for this date
                $allDataForDate = DB::table('tiket_antar_kotas')
                    ->whereDate('tanggal', $tanggal)
                    ->get(['id', 'nama_kereta', 'stasiun_asal', 'stasiun_tujuan', 'tanggal', 'penumpang']);
                
                \Log::info('Debug JadwalKereta: All data for date ' . $tanggal, $allDataForDate->toArray());
                \Log::info('Debug JadwalKereta: Search params', [
                    'stasiun_asal' => $stasiunAsal,
                    'stasiun_tujuan' => $stasiunTujuan,
                    'tanggal' => $tanggal,
                    'penumpang' => $penumpang
                ]);

                // Query database for schedules using Query Builder
                $baseQuery = DB::table('tiket_antar_kotas')
                    ->whereDate('tanggal', $tanggal)
                    ->where('penumpang', '>=', $penumpang);

                // Try exact match first
                $schedules = (clone $baseQuery)
                    ->where('stasiun_asal', $stasiunAsal)
                    ->where('stasiun_tujuan', $stasiunTujuan)
                    ->orderBy('jam')
                    ->get();

                // Fallback: try LIKE matching if exact produced no rows
                if ($schedules->isEmpty()) {
                    $schedules = (clone $baseQuery)
                        ->where('stasiun_asal', 'LIKE', '%' . $stasiunAsal . '%')
                        ->where('stasiun_tujuan', 'LIKE', '%' . $stasiunTujuan . '%')
                        ->orderBy('jam')
                        ->get();
                }

                // Process schedules data
                $schedules = $schedules->map(function ($schedule) {
                    // Convert to array for easier manipulation
                    $scheduleArray = (array) $schedule;
                    
                    // Calculate duration
                    $scheduleArray['durasi'] = $this->calculateDuration($schedule->stasiun_asal, $schedule->stasiun_tujuan);
                    
                    // Format time for display
                    $scheduleArray['jam_formatted'] = \Carbon\Carbon::createFromFormat('H:i', $schedule->jam)->format('H:i');
                    
                    // Calculate arrival time
                    $scheduleArray['jam_tiba'] = $this->calculateArrivalTime($schedule->jam, $scheduleArray['durasi']);
                    
                    return (object) $scheduleArray;
                });
            }

            return Inertia::render('User/JadwalKereta', [
                'searchData' => $searchData,
                'schedules' => $schedules,
                'hasResults' => !$schedules->isEmpty(),
                'totalResults' => $schedules->count()
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in JadwedKeretaController: ' . $e->getMessage());
            
            return Inertia::render('User/JadwalKereta', [
                'searchData' => $request->all(),
                'schedules' => [],
                'hasResults' => false,
                'totalResults' => 0,
                'error' => 'Terjadi kesalahan saat mencari jadwal kereta'
            ]);
        }
    }

    private function calculateDuration($stasiunAsal, $stasiunTujuan)
    {
        // Duration calculation based on simplified station names
        $durations = [
            'Pasar Senen' => [
                'Bandung' => '03j 15m',
                'Yogyakarta' => '07j 30m',
                'Surabaya Gubeng' => '12j 45m',
                'Semarang Tawang' => '06j 20m',
                'Cirebon' => '02j 30m'
            ],
            'Gambir' => [
                'Bandung' => '03h 30m',
                'Yogyakarta' => '07j 00m',
                'Surabaya Gubeng' => '10j 45m',
                'Semarang Tawang' => '05j 30m',
                'Cirebon' => '02j 00m'
            ],
            'Bandung' => [
                'Pasar Senen' => '03j 15m',
                'Gambir' => '03h 30m'
            ],
            'Yogyakarta' => [
                'Gambir' => '07j 00m',
                'Pasar Senen' => '07j 30m'
            ],
            'Surabaya Gubeng' => [
                'Gambir' => '10j 45m',
                'Pasar Senen' => '12j 45m'
            ],
            'Semarang Tawang' => [
                'Gambir' => '05j 30m',
                'Pasar Senen' => '06j 20m'
            ],
            'Cirebon' => [
                'Gambir' => '02j 00m',
                'Pasar Senen' => '02j 30m'
            ]
        ];

        if (isset($durations[$stasiunAsal][$stasiunTujuan])) {
            return $durations[$stasiunAsal][$stasiunTujuan];
        }

        // Default duration if not found
        return '06j 00m';
    }

    private function calculateArrivalTime($departureTime, $duration)
    {
        $durationParts = explode('j ', $duration);
        $hours = (int) $durationParts[0];
        $minutes = isset($durationParts[1]) ? (int) str_replace('m', '', $durationParts[1]) : 0;

        $departure = \Carbon\Carbon::createFromFormat('H:i', $departureTime);
        $arrival = $departure->addHours($hours)->addMinutes($minutes);

        return $arrival->format('H:i');
    }
}
