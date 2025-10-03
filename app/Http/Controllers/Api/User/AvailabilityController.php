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

            // Get availability and price data for date range
            $availability = [];
            $priceData = [];
            $currentDate = new \DateTime($startDate);
            $endDateTime = new \DateTime($endDate);

            while ($currentDate <= $endDateTime) {
                $dateStr = $currentDate->format('Y-m-d');
                
                // Get ticket data for this date using query builder
                $tickets = DB::table('tiket_antar_kotas')
                    ->where('stasiun_asal', $stasiunAsal)
                    ->where('stasiun_tujuan', $stasiunTujuan)
                    ->where('tanggal', $dateStr)
                    ->where('penumpang', '>=', $penumpang)
                    ->get(['harga_termurah']);
                
                // Check availability
                $hasTickets = $tickets->count() > 0;
                $availability[$dateStr] = $hasTickets;
                
                // Calculate price range if tickets exist
                if ($hasTickets) {
                    $prices = $tickets->pluck('harga_termurah')->toArray();
                    $minPrice = min($prices);
                    $maxPrice = max($prices);
                    
                    // Convert to thousands for display (divide by 1000)
                    $priceData[$dateStr] = [
                        'min' => round($minPrice / 1000),
                        'max' => round($maxPrice / 1000)
                    ];
                }

                $currentDate->add(new \DateInterval('P1D'));
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'availability' => $availability,
                    'priceData' => $priceData
                ],
                'message' => 'Data ketersediaan dan harga berhasil diambil'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data ketersediaan: ' . $e->getMessage()
            ], 500);
        }
    }
}
