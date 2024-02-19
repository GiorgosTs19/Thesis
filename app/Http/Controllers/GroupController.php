<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupResource;
use App\Http\Resources\WorkCollection;
use App\Models\Author;
use App\Models\AuthorGroup;
use App\Models\Group;
use App\Models\Work;
use App\Utility\Requests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller {
    private function getAllGroups() {
        return GroupResource::collection(Group::with(['childrenRecursive', 'parent'])->orderBy('name')->get());
    }

    public function show(): Response {
        $groups = self::getAllGroups();

        return Inertia::render('Routes/Groups/GroupsPage', ['groups' => GroupResource::collection($groups)]);
    }

    public function getGroup(Request $request, $id) {
        if (!isset($id)) {
            return response()->json(Requests::clientError('The id parameter is marked as required'), 400);
        }

        $Group = Group::with('members.works', 'parent')->find($id);

        if (!$Group) {
            return response()->json(Requests::clientError('A group with this id does not exist', 200));
        }

        $success = !!$Group;

        $works = collect();

        foreach ($Group->members as $member) {
            $works = $works->merge($member->works);
        }

        $uniqueWorkIds = $works->unique('id')->pluck('id');

        $uniqueWorks = Work::with(['authors'])->whereIn('id', $uniqueWorkIds)->paginate(9);
        return $success ? response()->json(Requests::success('Group retrieved successfully', ['group' => new GroupResource($Group), 'works' => new WorkCollection($uniqueWorks)])) : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     * @param Request $request
     * Handles the request to create a new group.
     * @return JsonResponse - A message indicating whether the action as successful and a status code.
     */
    public function create(Request $request): JsonResponse {
        $input = $request->only(['name', 'description', 'parent']);

        if (!isset($input['name']) || !isset($input['description'])) {
            return response()->json(Requests::clientError('The name and description parameters are  marked as required'), 400);
        }

        $name = $input['name'];
        $description = $input['description'];

        if ($name === '' || $description === '') {
            return response()->json(Requests::clientError('The name and description parameters cannot be empty'), 400);
        }

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
            'parent_id' => $parent_id,
            'description' => $description
        ]);

        $success = $new_group->save();
        return $success ? response()->json(Requests::success('Group created successfully', ['groups' => self::getAllGroups(), 'newGroup' => new GroupResource($new_group->load('members'))])) : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse {
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
        return $success ? response()->json(Requests::success('Group deleted successfully', ['groups' => self::getAllGroups()])) : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    public function addMember(Request $request): JsonResponse {
        $input = $request->only(['authors', 'group']);

        if (!isset($input['authors']) || !isset($input['group'])) {
            return response()->json(Requests::clientError('Group and author parameters are marked as required'), 400);
        }

        $authors = $input['authors'];
        $group = $input['group'];

        $Group = Group::find($group);
        // Return a 404 if the group is not found
        if (!$Group) {
            return response()->json(Requests::clientError('Group not found', 200));
        }

        foreach ($authors as $author) {
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
        }

        return $success ? response()->json(Requests::success('Member added successfully', ['group' => new GroupResource(Group::with('members.works', 'parent')->find($group))])) : response()->json(Requests::serverError("Something went wrong"), 500);
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
        return $success ? response()->json(Requests::success('Member removed successfully', ['group' => new GroupResource(Group::with('members.works', 'parent')->find($group))])) : response()->json(Requests::clientError('Something went wrong'), 400);
    }
}
