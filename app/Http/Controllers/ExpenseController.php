<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Expense::orderBy('date', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'category' => 'required|string',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    /**
     * Display current month summary.
     */
    public function summary()
    {
        $total = Expense::whereYear('date', now()->year)
            ->whereMonth('date', now()->month)
            ->sum('amount');
            
        return response()->json([
            'monthly_total' => $total
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'amount' => 'numeric',
            'category' => 'string',
            'date' => 'date',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);

        return response()->json($expense);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(null, 204);
    }
}
