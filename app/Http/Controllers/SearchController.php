<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use function App\Providers\rocketDump;

class SearchController extends Controller {
    /**
     * @param Request $request
     * @return Response
     */

    public function checkAuthorExists(Request $request): Response {
//        $input = $request->only(['asset_id','id_type', 'asset_type']);
//        $asset_type = (int)$input['asset_type'] === 1 ? Author::class : Work::class;
//        $prefix = $asset_type === Author::class ? 'A' : 'W';
//        $id_type = $input['id_type'];
//        $asset_id = $id_type === 'open_alex' ? $prefix.$input['asset_id'] : $input['asset_id'];
//        if($asset_type === Author::class)
//            $asset = APIController::authorRequest($asset_id, $id_type);
//        else
//            $asset = APIController::workRequest($asset_id);
//        $asset_exists = !is_null($asset);
//        return Inertia::render('Search/Search',['asset' => $asset_exists ? $asset : null,
//            'exists' => $asset_exists, 'asset_type'=>'Author']);
    }
}
