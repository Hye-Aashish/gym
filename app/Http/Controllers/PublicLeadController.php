<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class PublicLeadController extends Controller
{
    /**
     * Store a newly created lead from the public form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'interest' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'interest' => $validated['interest'] ?? 'General Fitness',
            'status' => 'New',
            'notes' => $validated['notes'] ?? 'Submitted via public form',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your interest has been recorded. Our team will contact you soon!',
            'data' => $lead
        ], 201);
    }
}
