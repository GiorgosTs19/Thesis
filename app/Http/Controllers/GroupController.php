<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\AuthorGroup;
use App\Models\Group;
use App\Utility\Requests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller {

    protected function flattenGroups($groups) {
        $flattened = [];

        foreach ($groups as $group) {
            $flattened[] = $group;

            if ($group->children->isNotEmpty()) {
                $flattened = array_merge($flattened, $this->flattenGroups($group->children));
            }
        }

        return $flattened;
    }

    public function showGroupsPage(): Response {
        $groups = Group::with(['childrenRecursive', 'members'])->whereNull('parent_id')->get();
//        dump($groups);
//        $groups = $this->flattenGroups($groups);

        return Inertia::render('Routes/Groups/GroupsPage', ['groups' => $groups]);
    }

    /**
     * @param Request $request
     * Handles the request to create a new group.
     * @return JsonResponse - A message indicating whether the action as successful and a status code.
     */
    public function createGroup(Request $request): JsonResponse {
        $input = $request->only(['name', 'parent']);

        if (!isset($input['name'])) {
            return response()->json(Requests::clientError('The name parameter is marked as required'), 400);
        }

        $name = $input['name'];

        $Group = Group::name($name)->first();

        if ($Group) {
            return response()->json(Requests::clientError('A group with this name already exists', 200));
        }

        // Check if the parent parameter is present, if so, check whether the group with that id exists or not.
        $parent_id = null;
        if (isset($input['parent'])) {
            $parent_group = Group::find($input['parent']);
            if (!$parent_group) {
                return response()->json(Requests::clientError('The parent group was not found', 200));
            }
            $parent_id = $parent_group->id;
        }

        $new_group = new Group([
            'name' => $name,
            'parent_id' => $parent_id
        ]);

        $success = $new_group->save();

        return $success ? response()->json(Requests::success('Group created successfully')) : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteGroup(Request $request): JsonResponse {
        $input = $request->only(['id']);

        if (!isset($input['id'])) {
            return response()->json(Requests::clientError('The id parameter is marked as required'), 400);
        }
        $id = $input['id'];

        $Group = Group::find($id);

        if (!$Group) {
            return response()->json(Requests::clientError('Cannot delete a group that does not exist', 200));
        }

        $success = $Group->delete();

        return $success ? response()->json(Requests::success('Group deleted successfully')) : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    public function addMember(Request $request): JsonResponse {
        $input = $request->only(['author', 'group']);

        if (!isset($input['author']) || !isset($input['group'])) {
            return response()->json(Requests::clientError('Group and author parameters are marked as required'), 400);
        }

        $author = $input['author'];
        $group = $input['group'];


        $Group = Group::find($group);
        // Return a 404 if the group is not found
        if (!$Group) {
            return response()->json(Requests::clientError('Group not found', 200));
        }

        $existing_member = AuthorGroup::entry($group, $author)->first();
        // Return a 404 if the author is not found
        if ($existing_member) {
            return response()->json(Requests::clientError('The author is already a member of this group', 200));
        }

        $Author = Author::find($author);
        // Return a 404 if the author is not found
        if (!$Author) {
            return response()->json(Requests::clientError('Author not found', 200));
        }

        $success = $Group->addMember($author);

        return $success ? response()->json(Requests::success('Member added successfully')) : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    public function removeMember(Request $request): JsonResponse {
        $input = $request->only(['author', 'group']);

        if (!isset($input['author']) || !isset($input['group'])) {
            return response()->json(Requests::clientError('Group and author parameters are marked as required'), 400);
        }

        $author = $input['author'];
        $group = $input['group'];


        $Group = Group::find($group);
        // Return a 404 if the group is not found
        if (!$Group) {
            return response()->json(Requests::clientError('Group not found', 200));
        }

        $Author = Author::find($author);
        // Return a 404 if the author is not found
        if (!$Author) {
            return response()->json(Requests::clientError('Author not found', 200));
        }

        $existing_member = AuthorGroup::entry($Group->id, $Author->id)->first();
        // Return a 404 if the author is not found
        if (!$existing_member) {
            return response()->json(Requests::clientError('Cannot remove an author from a group they do not belong to', 200));
        }

        $success = $existing_member->delete();

        return $success ? response()->json(Requests::success('Member removed successfully')) : response()->json(Requests::clientError('Something went wrong'), 400);
    }
}
