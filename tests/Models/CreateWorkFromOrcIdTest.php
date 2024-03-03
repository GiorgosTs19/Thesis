<?php

namespace Tests\Models;

use App\Models\Work;
use App\Utility\OrcId;
use App\Utility\Requests;
use Tests\TestCase;

class CreateWorkFromOrcIdTest extends TestCase {
    public static function workRequest($url): mixed {
        return Requests::getResponseBody(Requests::get($url, ['Accept' => 'application/vnd.orcid+json']));
    }

    public function testCreateNewOIWork() {
        $request_work = Requests::getResponseBody(Requests::get('https://pub.orcid.org/v3.0/0000-0003-2366-1365/work/145119252', ['Accept' => 'application/vnd.orcid+json']));
        $work = Work::createNewOIWork($request_work, OrcId::extractWorkDoi($request_work), true);
        $this->assertIsInt($work->id);
        $this->assertIsString($work->doi);
        $this->assertIsString($work->type);
        $this->assertIsString($work->title);
        $this->assertIsBool($work->is_oa);
        $this->assertIsString($work->language);
        $this->assertNull($work->cites_url);
        $this->assertIsString($work->created_date);
        $this->assertIsString($work->publication_year);
        $this->assertNull($work->open_alex_id);
        $this->assertNull($work->open_alex_url);
        $this->assertIsString($work->publication_date);
        $this->assertNull($work->last_updated_date);
        $this->assertIsInt($work->referenced_works_count);
        $this->assertIsString($work->source_title);
        $this->assertIsString($work->subtype);
        $this->assertNull($work->event);
        $this->assertNull($work->abstract);
        $this->assertIsInt($work->is_referenced_by_count);
        $this->assertIsString($work->source);
        $this->assertIsInt($work->orc_id_put_code);
        $this->assertIsString($work->orc_id_url);
        $work->delete();
    }
}
