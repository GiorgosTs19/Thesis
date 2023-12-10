<?php

namespace Database\Seeders;

use App\Jobs\UpdateDatabaseJob;
use App\Models\Author;
use App\Models\User;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use function App\Providers\rocketDump;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    protected array $Professors = [
        // Κεραμόπουλος
        ['first'=>'Ευκλείδης',
        'last'=>'Κεραμόπουλος',
        'id'=>'0000-0001-6566-6477',
        'email'=>'efkleidiskeramopoulos@gmail.com'],
        // Διαμαντάρας
//        ['first'=>'Κωνσταντίνος',
//        'last'=>'Διαμαντάρας',
//        'id'=>'0000-0003-1373-4022',
//        'email'=>'k.diamantaras@ihu.edu.gr'],
        // Ηλιούδης
        ['first'=>'Χρήστος',
        'last'=>'Ηλιούδης',
        'id'=>'0000-0002-8084-4339',
        'email'=>'iliou@ihu.gr'],
        // Σιδηρόπουλος
//        ['first'=>'Αντώνης',
//        'last'=>'Σιδηρόπουλος',
//        'id'=>'0000-0002-3352-0868',
//        'email'=>'asidirop@gmail.com'],
        // Ουγιάρογλου
//        ['first'=>'Στέφανος',
//        'last'=>'Ουγιάρογλου',
//        'id'=>'0000-0003-1094-2520',
//        'email'=>'stoug@ihu.gr'],
        // Χατζημίσιος
//        ['first'=>'Περικλής',
//        'last'=>'Χατζημίσιος',
//        'id'=>'0000-0003-2366-1365',
//        'email'=>'pchatzimisios@ihu.gr'],
        // Αντωνίου
//        ['first'=>'Ευστάθιος',
//        'last'=>'Αντωνίου',
//        'id'=>'0000-0001-6177-6169',
//        'email'=>'antoniou@ihu.gr'],
        // Χατζημίσιος
//        ['first'=>'Παναγιώτης',
//        'last'=>'Αδαμίδης',
//        'id'=>'0000-0003-4020-1328',
//        'email'=>'adamidis@ihu.gr'],
        // Ιωαννίδου
//        ['first'=>'Μελίνα',
//        'last'=>'Ιωαννίδου',
//        'id'=>'0000-0003-3594-7678',
//        'email'=>'melina@ihu.gr'],
        // Κωτσάκης
//        ['first'=>'Ρήγας',
//        'last'=>'Κωτσάκης',
//        'id'=>'0000-0003-1587-2015',
//        'email'=>'rkotsakis@gmail.gr'],
        // Κωτσάκης
//        ['first'=>'Ρήγας',
//        'last'=>'Κωτσάκης',
//        'id'=>'0000-0003-1587-2015',
//        'email'=>'rkotsakis@gmail.gr'],
        // Παπαδοπούλου
//        ['first'=>'Μαρία',
//        'last'=>'Παπαδοπούλου',
//        'id'=>'0000-0002-9651-2144',
//        'email'=>'mspapa@ihu.gr'],
    ];

    public function run(): void {
        // Using a single transaction closure for all actions that will be performed, inserts, updates, deletes etc.
        // If anything goes wrong the transaction will be not be committed and the db will be rolled back.\
        DB::transaction(function () {
            foreach ($this->Professors as $professor) User::createFromOrcId($professor);

            // Retrieve all the authors that are also users.
            $User_Authors = Author::user()->get();
            // Loop through all the authors, retrieve their works and parse them.
            foreach ($User_Authors as $user_Author) {
                    // Loop through all the given professors and create a user for each one.
                    // This function will also create an author out of each user.
                        $user_Author->parseWorks();
            }
        });
        dispatch(new UpdateDatabaseJob());
    }

}
