<?php

namespace App\Jobs;

use App\Models\Author;
use App\Models\User;
use App\Utility\SystemManager;
use App\Utility\ULog;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class InitializeDatabaseJob implements ShouldQueue, ShouldBeUnique {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $PROFESSORS = [
        ['email' => 'adamidis@ihu.gr', 'first' => 'Panagiotis', 'last' => 'Adamidis', 'id' => '0000-0003-4020-1328', 'found' => false],
        ['email' => 'amanatiadis@ihu.gr', 'first' => 'Dimitrios', 'last' => 'Amanatiadis', 'id' => 'A5048293553', 'found' => true],
        ['email' => 'zafiris', 'first' => 'Zafiris', 'last' => 'Ampatzis', 'id' => 'A5068848285', 'found' => true],
        ['email' => 'antoniou@ihu.gr', 'first' => 'Efstathios', 'last' => 'Antoniou', 'id' => 'A5082819385', 'found' => true],
        ['email' => 'asdre', 'first' => 'Katerina', 'last' => 'Asdre', 'id' => 'A5042673538', 'found' => true],
        ['email' => 'bamnios@ihu.gr', 'first' => 'Georgios', 'last' => 'Bamnios', 'id' => 'A5083200723', 'found' => true],
        ['email' => 'pchatzimisios@ihu.gr', 'first' => 'Periklis', 'last' => 'Chatzimisios', 'id' => '0000-0003-2366-1365', 'found' => true],
        ['email' => 'ignatios', 'first' => 'Ignatios', 'last' => 'Deligiannis', 'id' => 'A5070715009', 'found' => true],
        ['email' => 'dad', 'first' => 'Dimitrios', 'last' => 'Dervos', 'id' => 'A5032970498', 'found' => true],
        ['email' => 'k.diamantaras@ihu.edu.gr', 'first' => 'Konstantinos', 'last' => 'Diamantaras', 'id' => '7003525351', 'found' => true],
        ['email' => 'ang1960@ihu.gr', 'first' => 'Aggelos', 'last' => 'Giakoumis', 'id' => 'A5087310568', 'found' => true],
        ['email' => 'gouliana@it.teithe.gr', 'first' => 'Konstantinos', 'last' => 'Goulianas', 'id' => 'A5042877061', 'found' => true],
        ['email' => 'ahatz@ihu.gr', 'first' => 'Argyrios', 'last' => 'Hatzopoulos', 'id' => 'A5079366713', 'found' => true],
        ['email' => 'iliou@ihu.gr', 'first' => 'Christos', 'last' => 'Ilioudis', 'id' => '0000-0002-8084-4339', 'found' => true],
        ['email' => 'melina@ihu.gr', 'first' => 'Melina', 'last' => 'Ioannidou', 'id' => '0000-0003-3594-7678', 'found' => true],
        ['email' => 'aiosifidis@ihu.gr', 'first' => 'Athanasios', 'last' => 'Iossifides', 'id' => 'A5067731479', 'found' => true],
        ['email' => 'kazak', 'first' => 'Aristotelis', 'last' => 'Kazakopoulos', 'id' => '0000-0001-6566-6477', 'found' => true],
        ['email' => 'efkleidiskeramopoulos@gmail.com', 'first' => 'Euclid', 'last' => 'Keramopoulos', 'id' => '0000-0001-6566-6477', 'found' => true],
        ['email' => 'ikiosker@ihu.gr', 'first' => 'Iordanis', 'last' => 'Kioskeridis', 'id' => 'A5007174015', 'found' => true],
        ['email' => 'vkostoglvkostogl@ihu.gr', 'first' => 'Vasilis', 'last' => 'Kostoglou', 'id' => '55151440800', 'found' => false],
        ['email' => 'rkotsakis@gmail.com', 'first' => 'Rigas', 'last' => 'Kotsakis', 'id' => 'A5018429227', 'found' => true],
        ['email' => 'manavis', 'first' => 'Christos', 'last' => 'Manavis', 'id' => 'A5086220824', 'found' => true],
        ['email' => 'imarm@el.teithe.gr', 'first' => 'Ioannis', 'last' => 'Marmorkos', 'id' => 'A5004504481', 'found' => true],
        ['email' => 'stoug@ihu.gr', 'first' => 'Stefanos', 'last' => 'Ougiaroglou', 'id' => '0000-0003-1094-2520', 'found' => true],
        ['email' => 'dpapakos@ihu.gr', 'first' => 'Dimitrios', 'last' => 'Papakostas', 'id' => 'A5076153845', 'found' => true],
        ['email' => 'msa@ihu.gr', 'first' => 'Michalis', 'last' => 'Salampasis', 'id' => '55888047700', 'found' => true],
        ['email' => 'asidirop@gmail.com', 'first' => 'Antonis', 'last' => 'Sidiropoulos', 'id' => '55918072400', 'found' => true],
        ['email' => 'spasos', 'first' => 'Michail', 'last' => 'Spasos', 'id' => '15119791700', 'found' => false],
        ['email' => 'demos@ihu.gr', 'first' => 'Dimosthenis', 'last' => 'Stamatis', 'id' => '14720296900', 'found' => false],
        ['email' => 'ktsiak', 'first' => 'Kyriakos', 'last' => 'Tsiakmakis', 'id' => 'A5001381818', 'found' => true],
        ['email' => 'ptsekis@ihu.gr', 'first' => 'Panagiotis', 'last' => 'Tzekis', 'id' => 'A5069638558', 'found' => true],
        ['email' => 'vitsas@it.teithe.gr', 'first' => 'Vasilis', 'last' => 'Vitsas', 'id' => 'A5019486808', 'found' => true],
        ['email' => 'kokkonisgeo@gmail.com', 'first' => 'Georgios', 'last' => 'Kokkonis', 'id' => 'A5075149675', 'found' => true],
        ['email' => 'cbratsas@iee.ihu.gr', 'first' => 'Charalampos', 'last' => 'Bratsas', 'id' => 'A5021462636', 'found' => true],
        ['email' => 'mspapa@ihu.gr', 'first' => 'Maria', 'last' => 'Papadopoulou', 'id' => '0000-0002-9651-2144', 'found' => true],
    ];

    /**
     * Create a new job instance.
     */
    public function __construct() {
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        try {
            $started_time = date("H:i:s");
            ULog::log("Database Initialization started at $started_time");

            SystemManager::enableMaintenanceMode();

            DB::transaction(function () {
                foreach ($this->PROFESSORS as $professor) User::createProfessorUser($professor);

                // Retrieve all the authors that are also users.
                $User_Authors = Author::user()->get();

                // Loop through all the authors, retrieve their works and parse them.
                foreach ($User_Authors as $user_Author) {
                    $user_Author->parseWorks();
                    $user_Author->syncWithOrcId();
                }
            });

        } catch (Exception $err) {
            ULog::error("Something went wrong while updating the database," . $err->getMessage(), ULog::META);
        } finally {
            $ended_time = date("H:i:s");
            ULog::log("Database Initialization ended at $ended_time");
            SystemManager::disableMaintenanceMode();
        }
    }

}
