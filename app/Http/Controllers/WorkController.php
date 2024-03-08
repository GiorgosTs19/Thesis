<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkResource;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller {
    public function showWorkPage(Request $request, $id): Response {
        $work = Work::with(['authors', 'statistics'])->find($id);

        return Inertia::render('Routes/Work/WorkPage', [
            'work' => new WorkResource($work),
        ]);
    }
}
