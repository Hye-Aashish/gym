<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function getStats()
    {
        try {
            $today = Carbon::today();
            $startOfMonth = Carbon::now()->startOfMonth();

            $stats = [
                'total_members' => Member::count(),
                'active_members' => Member::where('status', 'Active')->count(),
                'monthly_revenue' => (float)Invoice::where('status', 'Paid')
                    ->where('created_at', '>=', $startOfMonth)
                    ->sum('amount'),
                'today_attendance' => Attendance::whereDate('created_at', $today)->count(),
                'total_leads' => Lead::count(),
            ];

            $revenue_chart = Invoice::where('status', 'Paid')
                ->select(
                    DB::raw('sum(amount) as total'),
                    DB::raw("DATE_FORMAT(created_at,'%b') as month"),
                    DB::raw("MAX(created_at) as date")
                )
                ->groupBy('month')
                ->orderBy('date', 'asc')
                ->take(6)
                ->get();

            $attendance_chart = Attendance::select(
                    DB::raw('count(*) as count'),
                    DB::raw("DATE_FORMAT(created_at,'%a') as day"),
                    DB::raw("DATE(created_at) as date")
                )
                ->where('created_at', '>=', Carbon::now()->subDays(6))
                ->groupBy('day', 'date')
                ->orderBy('date', 'asc')
                ->get();

            return response()->json([
                'stats' => $stats,
                'revenue_chart' => $revenue_chart,
                'attendance_chart' => $attendance_chart,
                'recent_members' => Member::orderBy('created_at', 'desc')->take(5)->get(),
                'expiring_soon' => Member::whereBetween('expire_date', [Carbon::now(), Carbon::now()->addDays(7)])->count()
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Dashboard Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
