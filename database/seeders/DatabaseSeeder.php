<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Author;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    protected string $email_to = '&mailto=it185302@it.teithe.gr';

    public function run(): void {
        $Professors = [
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

        foreach ($Professors as $professor) {
            DB::transaction(function () use ($professor){
            $this->createUserFromOrcId($professor);
            });
        }
    }

    protected function createUserFromOrcId($professor) {
        $url = 'https://api.openalex.org/authors/orcid:'.$professor['id'].$this->email_to;
        $author_response = Http::withOptions(['verify' => false])->get($url);
        $author = json_decode($author_response->body());
        $orc_id = Author::parseOrcId('',$author);
        $scopus_id = Author::parseScopusId('',$author);
        $open_alex_id = Author::parseOpenAlexId('',$author);
        $ids = ['scopus_id'=>$scopus_id,'orc_id'=>$orc_id, 'open_alex_id'=>$open_alex_id];
        if($orc_id === '' || User::orcId($orc_id)->exists())
            return;

        User::createNewUser($professor,$ids);

        if(Author::authorExistsByOrcId($orc_id))
            return;

        $newAuthor = Author::createAuthor($author,$ids, true);
        $newAuthor->parseWorks();
    }
}
