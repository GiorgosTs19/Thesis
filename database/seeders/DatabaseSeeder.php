<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use function App\Providers\getResponseBody;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    protected string $email_to = '&mailto=it185302@it.teithe.gr';
    protected string $author_base_url = 'https://api.openalex.org/authors/orcid:';
    protected array $Professors = [
        // Κεραμόπουλος
        ['first'=>'Ευκλείδης',
            'last'=>'Κεραμόπουλος',
            'id'=>'0000-0001-6566-6477',
            'email'=>'efkleidiskeramopoulos@gmail.com'],
        // Διαμαντάρας
        ['first'=>'Κωνσταντίνος',
            'last'=>'Διαμαντάρας',
            'id'=>'0000-0003-1373-4022',
            'email'=>'k.diamantaras@ihu.edu.gr']
        ,
        // Ηλιούδης
        ['first'=>'Χρήστος',
            'last'=>'Ηλιούδης',
            'id'=>'0000-0002-8084-4339',
            'email'=>'iliou@ihu.gr'],
        // Σιδηρόπουλος
        ['first'=>'Αντώνης',
            'last'=>'Σιδηρόπουλος',
            'id'=>'0000-0002-3352-0868',
            'email'=>'asidirop@gmail.com'],
        // Ουγιάρογλου
        ['first'=>'Στέφανος',
            'last'=>'Ουγιάρογλου',
            'id'=>'0000-0003-1094-2520',
            'email'=>'stoug@ihu.gr'],
        // Χατζημίσιος
        ['first'=>'Περικλής',
            'last'=>'Χατζημίσιος',
            'id'=>'0000-0003-2366-1365',
            'email'=>'pchatzimisios@ihu.gr']
    ];

    public function run(): void {
        // Using a single transaction closure for all actions that will be performed, inserts, updates, deletes etc.
        // If anything goes wrong the transaction will be not be committed and the db will be rolled back.
        DB::transaction(function () {
            // Loop through all the given professors and create a user for each one.
            // This function will also create an author out of each user.
            foreach ($this->Professors as $professor) {
                $this->createUserFromOrcId($professor);
            }

            // Retrieve all the authors that are also users.
            $User_Authors = Author::user()->get();

            // Loop through all the authors, retrieve their works and parse them.
            foreach ($User_Authors as $user_Author) {
                $user_Author->parseWorks();
            }
        });
    }

    protected function createUserFromOrcId($professor): void {
        // Retrieve all the author's data from the OpenAlex api
        $url = $this->author_base_url.$professor['id'].$this->email_to;
        $author_response = Http::withOptions(['verify' => false])->get($url);
        $author = getResponseBody($author_response);

        // Parse the ids of the author
        $orc_id = Author::parseOrcId('',$author);
        $scopus_id = Author::parseScopusId('',$author);
        $open_alex_id = Author::parseOpenAlexId('',$author);

        // Add all the parsed ids in an array
        $ids = ['scopus_id'=>$scopus_id,'orc_id'=>$orc_id, 'open_alex_id'=>$open_alex_id];

        // If no orc_id is present, return
        if($orc_id === '' || User::orcId($orc_id)->exists())
            return;

        // Else create a new user.
        User::createNewUser($professor,$ids);

        // If an author already exists for that user then return.
        if(Author::authorExistsByOpenAlexId($open_alex_id)['exists'])
            return;

        // Else create a new author.
        Author::createAuthor($author,$ids, true);
    }
}
