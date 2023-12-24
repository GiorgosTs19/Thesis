<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Author;
use Illuminate\Database\Seeder;
use App\Jobs\UpdateDatabaseJob;
use Illuminate\Support\Facades\DB;
use function App\Providers\rocketDump;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    protected array $Professors = [
        ['email' => 'adamidis@ihu.gr', 'first' => 'Panagiotis', 'last' => 'Adamidis', 'id' => '0000-0003-4020-1328'],
        ['email' => 'zafiris', 'first' => 'Zafiris', 'last' => 'Ampatzis', 'id' => '26664379600'],
        ['email' => 'antoniou@ihu.gr', 'first' => 'Efstathios', 'last' => 'Antoniou', 'id' => '0000-0001-6177-6169'],
        ['email' => 'asdre', 'first' => 'Katerina', 'last' => 'Asdre', 'id' => '12238972600'],
        ['email' => 'bamnios@ihu.gr', 'first' => 'Georgios', 'last' => 'Bamnios', 'id' => '6506305726'],
        ['email' => 'pchatzimisios@ihu.gr', 'first' => 'Periklis', 'last' => 'Chatzimisios', 'id' => '0000-0003-2366-1365'],
        ['email' => 'ignatios', 'first' => 'Ignatios', 'last' => 'Deligiannis', 'id' => '6506578406'],
        ['email' => 'dad', 'first' => 'Dimitrios', 'last' => 'Dervos', 'id' => '0000-0002-5441-0086'],
        ['email' => 'k.diamantaras@ihu.edu.gr', 'first' => 'Konstantinos', 'last' => 'Diamantaras', 'id' => '7003525351'],
        ['email' => 'ang1960@ihu.gr', 'first' => 'Aggelos', 'last' => 'Giakoumis', 'id' => '57188561623'],
        ['email' => 'gouliana@it.teithe.gr', 'first' => 'Konstantinos', 'last' => 'Goulianas', 'id' => '9633984300'],
        ['email' => 'ahatz@ihu.gr', 'first' => 'Argyrios', 'last' => 'Hatzopoulos', 'id' => '35596554500'],
        ['email' => 'iliou@ihu.gr', 'first' => 'Christos', 'last' => 'Ilioudis', 'id' => '0000-0002-8084-4339'],
        ['email' => 'melina@ihu.gr', 'first' => 'Melina', 'last' => 'Ioannidou', 'id' => '0000-0003-3594-7678'],
        ['email' => 'aiosifidis@ihu.gr', 'first' => 'Athanasios', 'last' => 'Iossifides', 'id' => '0000-0002-0270-5026'],
        ['email' => 'kazak', 'first' => 'Aristotelis', 'last' => 'Kazakopoulos', 'id' => '0000-0001-6566-6477'],
        ['email' => 'efkleidiskeramopoulos@gmail.com', 'first' => 'Euclid', 'last' => 'Keramopoulos', 'id' => '6507122554'],
        ['email' => 'ikiosker@ihu.gr', 'first' => 'Iordanis', 'last' => 'Kioskeridis', 'id' => '56193582400'],
        ['email' => 'vkostoglvkostogl@ihu.gr', 'first' => 'Vasilis', 'last' => 'Kostoglou', 'id' => '55151440800'],
        ['email' => 'rkotsakis@gmail.com', 'first' => 'Rigas', 'last' => 'Kotsakis', 'id' => '0000-0003-1587-2015'],
        ['email' => 'manavis', 'first' => 'Christos', 'last' => 'Manavis', 'id' => '50661573500'],
        ['email' => 'imarm@el.teithe.gr', 'first' => 'Ioannis', 'last' => 'Marmorkos', 'id' => '6507728837'],
        ['email' => 'stoug@ihu.gr', 'first' => 'Stefanos', 'last' => 'Ougiaroglou', 'id' => '0000-0003-1094-2520'],
        ['email' => 'dpapakos@ihu.gr', 'first' => 'Dimitrios', 'last' => 'Papakostas', 'id' => '6602211032'],
        ['email' => 'msa@ihu.gr', 'first' => 'Michalis', 'last' => 'Salampasis', 'id' => '55888047700'],
        ['email' => 'asidirop@gmail.com', 'first' => 'Antonis', 'last' => 'Sidiropoulos', 'id' => '55918072400'],
        ['email' => 'spasos', 'first' => 'Michail', 'last' => 'Spasos', 'id' => '15119791700'],
        ['email' => 'demos@ihu.gr', 'first' => 'Dimosthenis', 'last' => 'Stamatis', 'id' => '14720296900'],
        ['email' => 'ktsiak', 'first' => 'Kyriakos', 'last' => 'Tsiakmakis', 'id' => '21935322700'],
        ['email' => 'ptsekis@ihu.gr', 'first' => 'Panagiotis', 'last' => 'Tzekis', 'id' => '6507506177'],
        ['email' => 'vitsas@it.teithe.gr', 'first' => 'Vasilis', 'last' => 'Vitsas', 'id' => '35619083600'],
        ['email' => 'kokkonisgeo@gmail.com', 'first' => 'Georgios', 'last' => 'Kokkonis', 'id' => '0000-0002-9359-3604'],
        ['email' => 'cbratsas@iee.ihu.gr', 'first' => 'Charalampos', 'last' => 'Bratsas', 'id' => '0000-0001-6400-3233'],
        ['email' => 'mspapa@ihu.gr', 'first' => 'Maria', 'last' => 'Papadopoulou', 'id' => '0000-0002-9651-2144'],
    ];

    public function run(): void {
        // Using a single transaction closure for all actions that will be performed, inserts, updates, deletes etc.
        // If anything goes wrong the transaction will be not be committed and the db will be rolled back.
        DB::transaction(function () {
            foreach ($this->Professors as $professor) User::createUserFromId($professor);

            // Retrieve all the authors that are also users.
            $User_Authors = Author::user()->get();

            // Loop through all the authors, retrieve their works and parse them.
            foreach ($User_Authors as $user_Author) $user_Author->parseWorks();

//            try {
//                UpdateDatabaseJob::dispatchSync();
//            } catch (Exception $exception) {
//                rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
//            }
        });
    }

}
