<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\AuthorWork;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthorController extends Controller {

    public function getAuthor(Request $request) {
        $author_response = Http::withOptions(['verify' => false])->get('https://api.openalex.org/authors/orcid:0000-0002-3352-0868&mailto=it185302@it.teithe.gr');

        if($author_response->successful()) {
            $author = json_decode($author_response->body());
            // Create a new author and save the instance to the database, if it doesn't already exist.
            [$Author, $parsed_orc_id, $parsed_id, $parsed_scopus_id] = $this->createAuthor($author);

            // Retrieve Author's works and parse them, save them in the database if they don't exist already!
            $works = $this->parseWorks($Author, $parsed_id);
            // Return the Author view to display the Author's details and their works!
            return view('author', compact('author','parsed_orc_id','parsed_id','parsed_scopus_id', 'works'));
        }
    }

    // A function to create a new Author and save it to the database if it doesn't exist already.
    protected function createAuthor ($author) {
        $orc_id = explode('/', parse_url($author->orcid, PHP_URL_PATH));
        $parsed_orc_id = end($orc_id);
        $id = explode('/', parse_url($author->id, PHP_URL_PATH));
        $parsed_id = end($id);
        $parsed_scopus_id = explode('=', explode('&',$author->ids->scopus)[0])[1];

        $Author_Query = Author::where('OrcId',$parsed_orc_id)->orWhere('OpenAlexId',$parsed_id)->
        orWhere('ScopusId',$parsed_scopus_id);

        if(!$Author_Query->exists()) {
            $newAuthor = new Author;
            $newAuthor->Name = $author->display_name;
            $newAuthor->OrcId = $parsed_orc_id;
            $newAuthor->OpenAlexId = $parsed_id;
            $newAuthor->Cited_By_Count =$author->cited_by_count;
            $newAuthor->ScopusId = $parsed_scopus_id;
            $newAuthor->save();
            return [$newAuthor, $parsed_orc_id, $parsed_id, $parsed_scopus_id];
        }

        return [$Author_Query->first(), $parsed_orc_id, $parsed_id, $parsed_scopus_id];
    }

    // A function to parse the Author's works
    protected function parseWorks ($Author, $parsed_id) {
        $works_response = Http::withOptions(['verify' => false])->get("https://api.openalex.org/works?filter=author.id:".$parsed_id."&mailto=it185302@it.teithe.gr");
        $works = json_decode($works_response->body())->results;
        foreach ($works as $work) {
            $work_open_access = $work->open_access;
            $work_url = $work->doi ?? $work->open_access->oa_url ?? 'Empty';
//            var_dump($work);
            // Check if a work with this title already exists in the database, if so proceed to the next one
            if(Work::where('Title',$work->title)->exists())
                continue;
//            var_dump(explode('/',$work->ids->openalex)[2]);
            // If not, create a new Work and save it to the database
            $newWork = new Work;
            $newWork->Doi = $work_url;
            $newWork->Title = $work->title;
            $newWork->Publication_Date = $work->publication_date;
            $newWork->Language = $work->language;
            $newWork->Type = $work->type;
            $newWork->Is_OA = $work_open_access->is_oa;
            $newWork->Open_Alex_URL = explode('/',$work->ids->openalex)[3];
            $newWork->save();

            // Create an entry to the intermediate table to connect the author to their works
            $newAuthorWork = new AuthorWork;
            $newAuthorWork->Author_Id = $Author->id;
            $newAuthorWork->Work_Id = $newWork->id;
            $newAuthorWork->save();
        }
        return $works;
    }
}

//            var_dump($Author->works()->where('Title','Generalized Hirsch h-index for disclosing latent facts in citation networks')->get());
//            $parsedWork = ['URl'=>$work_url, 'title'=>$work->title, 'ids'=>$work->ids, 'type'=>$work->type,
//                'language'=>$work->language, 'open_access'=>$work_open_access->is_oa, 'publication_date'=>$work->publication_date,
//            ];
