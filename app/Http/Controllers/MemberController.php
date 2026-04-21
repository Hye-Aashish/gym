<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Member::orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members',
            'phone' => 'nullable|string|max:20',
            'plan' => 'required|string',
            'status' => 'required|string',
            'join_date' => 'required|date',
            'expire_date' => 'required|date',
        ]);

        $member = Member::create($validated);

        return response()->json($member, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:members,email,' . $member->id,
            'phone' => 'nullable|string|max:20',
            'plan' => 'string',
            'status' => 'string',
            'join_date' => 'date',
            'expire_date' => 'date',
        ]);

        $member->update($validated);

        return response()->json($member);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(null, 204);
    }
}
