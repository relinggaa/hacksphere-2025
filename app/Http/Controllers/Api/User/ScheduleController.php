<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\TiketAntarKota;
use App\Models\Stasiun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    public function getSchedules(Request $request)
    {
        try {
            $stasiunAsal = trim((string) $request->input('stasiun_asal'));
            $stasiunTujuan = trim((string) $request->input('stasiun_tujuan'));
            $tanggal = trim((string) $request->input('tanggal'));
            $penumpang = $request->input('penumpang', 1);

            // Debug: Log the input parameters
            \Log::info('Schedule API called with params:', [
                'stasiun_asal' => $stasiunAsal,
                'stasiun_tujuan' => $stasiunTujuan,
                'tanggal' => $tanggal,
                'penumpang' => $penumpang
            ]);

            // Validate required parameters
            if (!$stasiunAsal || !$stasiunTujuan || !$tanggal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parameter pencarian tidak lengkap'
                ], 400);
            }

            // Use query builder to get schedules (exact match first)
            $baseQuery = DB::table('tiket_antar_kotas')
                ->whereDate('tanggal', $tanggal)
                ->where('penumpang', '>=', $penumpang);

            $schedules = (clone $baseQuery)
                ->where('stasiun_asal', $stasiunAsal)
                ->where('stasiun_tujuan', $stasiunTujuan)
                ->orderBy('jam')
                ->get();

            // Fallback: try LIKE matching if exact produced no rows
            if ($schedules->isEmpty()) {
                $schedules = (clone $baseQuery)
                    ->where(function ($q) use ($stasiunAsal) {
                        $q->where('stasiun_asal', 'LIKE', $stasiunAsal)
                          ->orWhere('stasiun_asal', 'LIKE', "%$stasiunAsal%");
                    })
                    ->where(function ($q) use ($stasiunTujuan) {
                        $q->where('stasiun_tujuan', 'LIKE', $stasiunTujuan)
                          ->orWhere('stasiun_tujuan', 'LIKE', "%$stasiunTujuan%");
                    })
                    ->orderBy('jam')
                    ->get();
            }

            // Debug: Log the query results
            \Log::info('Query results count:', ['count' => $schedules->count()]);
            \Log::info('Query results:', $schedules->toArray());

            // Add additional data for display
            $schedules = $schedules->map(function ($schedule) {
                // Convert to array for easier manipulation
                $scheduleArray = (array) $schedule;
                
                // Calculate duration
                $scheduleArray['durasi'] = $this->calculateDuration($schedule->stasiun_asal, $schedule->stasiun_tujuan);
                
                // Format time for display
                $scheduleArray['jam_formatted'] = Carbon::createFromFormat('H:i', $schedule->jam)->format('H:i');
                
                // Calculate arrival time
                $scheduleArray['jam_tiba'] = $this->calculateArrivalTime($schedule->jam, $scheduleArray['durasi']);
                
                return (object) $scheduleArray;
            });

            return response()->json([
                'success' => true,
                'data' => $schedules,
                'message' => 'Jadwal berhasil ditemukan'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil jadwal: ' . $e->getMessage()
            ], 500);
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
        // Parse duration (e.g., "08j 10m" or "06j 00m")
        $durationParts = explode('j ', $duration);
        $hours = (int) $durationParts[0];
        $minutes = isset($durationParts[1]) ? (int) str_replace('m', '', $durationParts[1]) : 0;
        
        // Parse departure time
        $departure = Carbon::createFromFormat('H:i', $departureTime);
        
        // Add duration
        $arrival = $departure->addHours($hours)->addMinutes($minutes);
        
        return $arrival->format('H:i');
    }
}
