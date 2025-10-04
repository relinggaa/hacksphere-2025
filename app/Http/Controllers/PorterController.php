<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Porter;
use App\Models\PorterOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PorterController extends Controller
{
    public function index()
    {
        $porters = Porter::orderByDesc('id')
            ->get(['id','name','email','status','keylogin','no_telepon','no_identitas','photo_url','created_at']);

        return response()->json([
            'success' => true,
            'data' => $porters,
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Porter store request received', [
            'request_data' => $request->all(),
            'csrf_token' => $request->header('X-CSRF-TOKEN'),
            'user_authenticated' => auth()->check(),
            'user_role' => auth()->user()?->role ?? 'not authenticated'
        ]);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'status' => 'required|in:ONLINE,OFFLINE',
            'keylogin' => 'required|string|min:8',
            'no_telepon' => 'nullable|string|max:50',
            'no_identitas' => 'nullable|string|max:100',
        ]);

        $porter = Porter::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
            'keylogin' => $validated['keylogin'],
            'no_telepon' => $validated['no_telepon'] ?? null,
            'no_identitas' => $validated['no_identitas'] ?? null,
            'password' => Hash::make($validated['keylogin']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Akun porter berhasil dibuat',
            'data' => $porter,
        ], 201);
    }

    public function getOnlinePorters()
    {
        $allPorters = Porter::all(['id', 'name', 'email', 'status', 'photo_url', 'no_telepon', 'no_identitas']);
        \Log::info('All porters in database:', $allPorters->toArray());
        
        $porters = Porter::where('status', 'ONLINE')
            ->get(['id', 'name', 'email', 'photo_url', 'no_telepon', 'no_identitas']);

        \Log::info('Online porters query result:', $porters->toArray());
        \Log::info('Online porters count: ' . $porters->count());

        return Inertia::render('User/BookingPorter', [
            'success' => true,
            'data' => $porters,
            'count' => $porters->count(),
            'all_porters' => $allPorters->toArray()
        ]);
    }

    public function updateStatus(Request $request)
    {
        \Log::info('Porter status update request', [
            'request_data' => $request->all(),
            'user_authenticated' => auth('porter')->check(),
            'user_id' => auth('porter')->id(),
        ]);

        if (!auth('porter')->check()) {
            \Log::warning('Porter not authenticated for status update');
            return redirect('/porter/login')->with('error', 'Anda harus login terlebih dahulu.');
        }

        try {
            $validated = $request->validate([
                'status' => 'required|in:ONLINE,OFFLINE',
            ]);

            $porter = Porter::where('id', auth('porter')->id())->first();
            
            if (!$porter) {
                \Log::warning('Porter not found', ['porter_id' => auth('porter')->id()]);
                return redirect()->back()->with('error', 'Porter tidak ditemukan.');
            }

            $porter->update(['status' => $validated['status']]);

            \Log::info('Porter status updated successfully', [
                'porter_id' => $porter->id,
                'new_status' => $validated['status']
            ]);

            return redirect()->back()->with('success', 'Status berhasil diubah menjadi ' . $validated['status']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in updateStatus', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return redirect()->back()->withErrors($e->errors())->withInput();

        } catch (\Exception $e) {
            \Log::error('Status update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengubah status: ' . $e->getMessage());
        }
    }

    /**
     * Handle porter order actions (accept, reject, complete).
     */
    public function orderAction(Request $request)
    {
        \Log::info('Porter order action request received', [
            'request_data' => $request->all(),
            'user_authenticated' => auth('porter')->check(),
            'user_id' => auth('porter')->id(),
            'session_id' => session()->getId(),
            'all_guards' => [
                'web' => auth('web')->check(),
                'porter' => auth('porter')->check()
            ]
        ]);

        if (!auth('porter')->check()) {
            \Log::warning('Porter not authenticated for order action', [
                'session_id' => session()->getId(),
                'all_session_data' => session()->all()
            ]);
            return redirect('/porter/login')->with('error', 'Anda harus login terlebih dahulu.');
        }

        try {
            $validated = $request->validate([
                'order_id' => 'required|integer|exists:porter_orders,id',
                'action' => 'required|in:accept,reject,complete',
            ]);

            $order = PorterOrder::where('id', $validated['order_id'])
                ->where('porter_id', auth('porter')->id())
                ->first();

            if (!$order) {
                \Log::warning('Order not found or not owned by porter', [
                    'order_id' => $validated['order_id'],
                    'porter_id' => auth('porter')->id()
                ]);
                return redirect()->back()->with('error', 'Order tidak ditemukan atau bukan milik Anda.');
            }

            $newStatus = '';
            $message = '';

            switch ($validated['action']) {
                case 'accept':
                    if ($order->status !== 'pending') {
                        return redirect()->back()->with('error', 'Order tidak dapat diterima.');
                    }
                    $newStatus = 'accepted';
                    $message = 'Order berhasil diterima';
                    break;
                
                case 'reject':
                    if ($order->status !== 'pending') {
                        return redirect()->back()->with('error', 'Order tidak dapat ditolak.');
                    }
                    $newStatus = 'cancelled';
                    $message = 'Order berhasil ditolak';
                    break;
                
                case 'complete':
                    if (!in_array($order->status, ['accepted', 'in_progress'])) {
                        return redirect()->back()->with('error', 'Order tidak dapat diselesaikan.');
                    }
                    $newStatus = 'completed';
                    $message = 'Order berhasil diselesaikan';
                    break;
            }

            $order->update(['status' => $newStatus]);

            \Log::info('Order action completed successfully', [
                'order_id' => $order->id,
                'action' => $validated['action'],
                'new_status' => $newStatus
            ]);

            return redirect()->back()->with('success', $message);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in orderAction', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return redirect()->back()->withErrors($e->errors())->withInput();

        } catch (\Exception $e) {
            \Log::error('Order action failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses order: ' . $e->getMessage());
        }
    }

    /**
     * Create a porter order.
     */
    public function createOrder(Request $request)
    {
        \Log::info('Porter order request received', [
            'request_data' => $request->all(),
            'user_authenticated' => auth()->check(),
            'user_id' => auth()->id(),
        ]);

        try {
            if (!auth()->check()) {
                \Log::warning('User not authenticated for porter order');
                return redirect()->back()->with('error', 'Anda harus login terlebih dahulu untuk melakukan booking porter.');
            }

            $validated = $request->validate([
                'porter_id' => 'required|integer|exists:porters,id',
                'user_id' => 'nullable|integer|exists:users,id',
                'pickup_location' => 'required|string|max:255',
                'destination' => 'required|string|max:255',
                'service_type' => 'required|string|in:baggage,luggage,assistance',
                'notes' => 'nullable|string|max:500',
                'scheduled_time' => 'nullable|date',
                'price' => 'nullable|numeric|min:0',
            ]);

            $validated['user_id'] = $validated['user_id'] ?? auth()->id();

            \Log::info('Validation passed', ['validated_data' => $validated]);

            $porter = Porter::where('id', $validated['porter_id'])
                ->where('status', 'ONLINE')
                ->first();

            if (!$porter) {
                \Log::warning('Porter not found or offline', [
                    'porter_id' => $validated['porter_id'],
                    'porter_status' => $porter ? $porter->status : 'not_found'
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Porter tidak tersedia atau offline',
                ], 400);
            }

            \Log::info('Porter found and online', ['porter' => $porter->toArray()]);

            $order = PorterOrder::create([
                'porter_id' => $validated['porter_id'],
                'user_id' => $validated['user_id'],
                'pickup_location' => $validated['pickup_location'],
                'destination' => $validated['destination'],
                'service_type' => $validated['service_type'],
                'notes' => $validated['notes'],
                'scheduled_time' => $validated['scheduled_time'],
                'price' => $validated['price'] ?? null,
                'status' => 'pending',
            ]);

            \Log::info('Order created successfully', ['order' => $order->toArray()]);

            return redirect()->back()->with('success', 'Booking porter berhasil dibuat! Porter akan menghubungi Anda.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return redirect()->back()->withErrors($e->errors())->withInput();

        } catch (\Exception $e) {
            \Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return redirect()->back()->with('error', 'Terjadi kesalahan saat membuat order: ' . $e->getMessage());
        }
    }
}