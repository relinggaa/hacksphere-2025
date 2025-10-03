<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\TiketAntarKota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AvailabilityController extends Controller
{
    public function checkAvailability(Request $request)
    {
        try {
            $stasiunAsal = $request->input('stasiun_asal');
            $stasiunTujuan = $request->input('stasiun_tujuan');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $penumpang = $request->input('penumpang', 1);

            // Validate required parameters
            if (!$stasiunAsal || !$stasiunTujuan || !$startDate || !$endDate) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parameter pencarian tidak lengkap'
                ], 400);
            }

            // Get availability for date range
            $availability = [];
            $currentDate = new \DateTime($startDate);
            $endDateTime = new \DateTime($endDate);

            while ($currentDate <= $endDateTime) {
                $dateStr = $currentDate->format('Y-m-d');
                
                // Check if there are any tickets available for this date using query builder
                $ticketCount = DB::table('tiket_antar_kotas')
                    ->where('stasiun_asal', $stasiunAsal)
                    ->where('stasiun_tujuan', $stasiunTujuan)
                    ->where('tanggal', $dateStr)
                    ->where('penumpang', '>=', $penumpang)
                    ->count();

                $availability[$dateStr] = $ticketCount > 0;

                $currentDate->add(new \DateInterval('P1D'));
            }

            return response()->json([
                'success' => true,
                'data' => $availability,
                'message' => 'Data ketersediaan berhasil diambil'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data ketersediaan: ' . $e->getMessage()
            ], 500);
        }
    }
}
