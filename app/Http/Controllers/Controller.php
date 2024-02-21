<?php

namespace App\Http\Controllers;

use App\Models\Concept;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {
    use AuthorizesRequests, ValidatesRequests;

    public function testOrcIdAuthorRequest() {
//        return OrcIdAPI::authorRequest('0000-0003-2366-1365');
//        return Author::find(6)->syncWithOrcId();
//        return Work::find(1)->syncWithDOI();
//        return new WorkResource(Work::find(1)->with(['concepts'])->first());
        return Concept::getDynamicConceptsList();
//        return ConceptResource::collection(Concept::all());
    }


}
