<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function index()
    {
        return response()->json(SystemSetting::all()->pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            SystemSetting::set($key, $value);
        }
        return response()->json(['success' => true, 'message' => 'Settings updated successfully']);
    }
}
