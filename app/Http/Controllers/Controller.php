<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {
    use AuthorizesRequests, ValidatesRequests;

    public function testOrcIdAuthorRequest() {
//        return OrcIdAPI::authorRequest('0000-0003-2366-1365');
//        return Author::find(6)->syncWithOrcId();
//        return Work::find(1)->syncWithDOI();
        $Works = Work::whereNotNull('abstract')->get();
        foreach ($Works as $work) {
            $work->abstract = (string)simplexml_load_string($work->abstract, null, LIBXML_NOERROR, 'jats', true);
            $work->save();
        }

    }


}
