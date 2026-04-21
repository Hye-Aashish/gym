<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $today = now()->startOfDay();
        return response()->json(
            Attendance::with('member')
                ->where('created_at', '>=', $today)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'status' => 'nullable|string',
        ]);

        $attendance = Attendance::create([
            'member_id' => $validated['member_id'],
            'status' => $validated['status'] ?? 'Success',
        ]);

        return response()->json($attendance->load('member'), 201);
    }

    /**
     * Get summary stats for today.
     */
    public function summary()
    {
        $today = now()->startOfDay();
        $count = Attendance::where('created_at', '>=', $today)->count();
        
        return response()->json([
            'total_checkins' => $count,
            'currently_active' => floor($count * 0.4), // Mocked for now, but dynamic based on count
            'peak_hour' => '17:00 - 18:00',
        ]);
    }
}
