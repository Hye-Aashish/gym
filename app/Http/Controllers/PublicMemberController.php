<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\FormConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PublicMemberController extends Controller
{
    /**
     * Store a newly registered member from the public link.
     */
    public function store(Request $request)
    {
        // Get the expected fields
        $config = FormConfig::firstOrCreate(['name' => 'Member Registration']);
        $expectedFields = $config->fields;

        // Base validation
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'phone' => 'required|string|max:20',
        ];

        // Add dynamic validation rules if needed (simplified here)
        $validated = $request->validate($rules);

        // Extract custom fields (anything not in base columns)
        $customData = array_diff_key($request->all(), array_flip(['name', 'email', 'phone']));

        $member = Member::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'custom_fields' => $customData,
            'plan' => 'Pending Assignment',
            'status' => 'Pending',
            'join_date' => Carbon::now(),
            'expire_date' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful! Our team will contact you soon.',
            'data' => $member
        ], 201);
    }
}
