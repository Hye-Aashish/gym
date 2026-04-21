<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Invoice::with('member')->orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric',
            'status' => 'required|string',
            'due_date' => 'required|date',
        ]);

        // Generate unique invoice number based on max ID to avoid collisions
        $lastId = Invoice::max('id') ?? 0;
        $validated['invoice_number'] = 'INV-' . date('Y') . '-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);

        $invoice = Invoice::create($validated);

        return response()->json($invoice->load('member'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return response()->json($invoice->load('member'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'string',
            'paid_at' => 'nullable|date',
            'amount' => 'numeric',
            'due_date' => 'date',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'Paid' && empty($invoice->paid_at)) {
            $validated['paid_at'] = now();
        }

        $invoice->update($validated);

        return response()->json($invoice->load('member'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(null, 204);
    }
}
