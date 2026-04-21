<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $today = Carbon::today();
            $startOfMonth = Carbon::now()->startOfMonth();

            return response()->json([
                'stats' => [
                    'total_members' => Member::count(),
                    'active_members' => Member::where('status', 'Active')->count(),
                    'monthly_revenue' => (float)Invoice::where('status', 'Paid')
                        ->where('created_at', '>=', $startOfMonth)
                        ->sum('amount'),
                    'today_attendance' => Attendance::whereDate('created_at', $today)->count(),
                    'total_leads' => Lead::count(),
                ],
                'revenue_chart' => [],
                'attendance_chart' => [],
                'recent_members' => Member::orderBy('created_at', 'desc')->take(5)->get(),
                'expiring_soon' => Member::whereBetween('expire_date', [Carbon::now(), Carbon::now()->addDays(7)])->count()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
