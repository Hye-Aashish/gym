<?php

namespace App\Http\Controllers;

use App\Models\FormConfig;
use Illuminate\Http\Request;

class FormConfigController extends Controller
{
    public function index()
    {
        return FormConfig::firstOrCreate(
            ['name' => 'Member Registration'],
            ['fields' => [
                ['label' => 'Full Name', 'name' => 'name', 'type' => 'text', 'required' => true],
                ['label' => 'Email', 'name' => 'email', 'type' => 'email', 'required' => true],
                ['label' => 'Phone', 'name' => 'phone', 'type' => 'tel', 'required' => true],
            ]]
        );
    }

    public function update(Request $request)
    {
        $config = FormConfig::firstOrCreate(['name' => 'Member Registration']);
        $config->update(['fields' => $request->fields]);
        return response()->json($config);
    }
}
