<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Lead::orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'interest' => 'required|string',
            'status' => 'required|string',
            'follow_up_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create($validated);

        return response()->json($lead, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lead $lead)
    {
        return response()->json($lead);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'phone' => 'string|max:20',
            'email' => 'nullable|email|max:255',
            'interest' => 'string',
            'status' => 'string',
            'follow_up_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $lead->update($validated);

        return response()->json($lead);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead)
    {
        $lead->delete();
        return response()->json(null, 204);
    }
}
