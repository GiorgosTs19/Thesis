<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GroupPolicy {
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null {
        if ($user->isAdmin()) {
            return true;
        }
        
        if (!$user) {
            return false;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Group $group): bool {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response {
        return $user->isAdmin() ? Response::allow() : Response::deny('You are not authorized to create groups.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Group $group): Response {
        return $user->isAdmin() ? Response::allow() : Response::deny('You are not authorized to update groups.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Group $group): Response {
        return $user->isAdmin() ? Response::allow() : Response::deny('You are not authorized to delete groups.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Group $group): bool {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Group $group): bool {
        return false;
    }
}
