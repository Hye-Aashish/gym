<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Plan::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|string',
            'price' => 'required|numeric',
            'features' => 'nullable|array',
            'recommended' => 'boolean',
        ]);

        $plan = Plan::create($validated);

        return response()->json($plan, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Plan $plan)
    {
        return response()->json($plan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'duration' => 'string',
            'price' => 'numeric',
            'features' => 'nullable|array',
            'recommended' => 'boolean',
        ]);

        $plan->update($validated);

        return response()->json($plan);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plan $plan)
    {
        $plan->delete();
        return response()->json(null, 204);
    }
}
