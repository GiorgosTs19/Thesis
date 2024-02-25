<?php

namespace App\Services;

class GroupService {
    private static GroupService $instance;

    // Private constructor to prevent instantiation from outside
    private function __construct() {
        // Initialization code if needed
    }

    // Method to get the singleton instance
    public static function getInstance(): GroupService|static {
        if (!isset(self::$instance)) {
            self::$instance = new static();
        }

        return self::$instance;
    }

    public function get() {

    }

    public function create() {

    }

    public function destroy() {

    }

    public function addMember() {

    }

    public function removeMember() {

    }

}