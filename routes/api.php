<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\InvoiceController;

use App\Http\Controllers\AuthController;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/form-config', [\App\Http\Controllers\FormConfigController::class, 'index']);
Route::post('/public/register-member', [\App\Http\Controllers\PublicMemberController::class, 'store']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/v1/dashboard-pulse', [\App\Http\Controllers\AdminDashboardController::class, 'getStats']);
    
    Route::apiResource('members', MemberController::class);
    
    Route::get('/attendances/summary', [AttendanceController::class, 'summary']);
    Route::apiResource('attendances', AttendanceController::class);
    
    Route::apiResource('leads', LeadController::class);
    
    Route::apiResource('plans', PlanController::class);
    
    Route::get('/expenses/summary', [ExpenseController::class, 'summary']);
    Route::apiResource('expenses', ExpenseController::class);
    
    Route::apiResource('invoices', InvoiceController::class);
    
    Route::post('/form-config', [\App\Http\Controllers\FormConfigController::class, 'update']);
});
