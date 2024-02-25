<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupRequests\CreateGroupRequest;
use App\Http\Requests\GroupRequests\DeleteGroupRequest;
use App\Http\Resources\GroupResource;
use App\Http\Resources\WorkCollection;
use App\Models\Author;
use App\Models\AuthorGroup;
use App\Models\Group;
use App\Models\Work;
use App\Utility\Requests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller {
    private function getAllGroups(): AnonymousResourceCollection {
        return GroupResource::collection(Group::all());
    }

    public function show(): Response {
        $groups = self::getAllGroups();
        return Inertia::render('Routes/Groups/GroupsPage', ['groups' => GroupResource::collection($groups)]);
    }

    public function getGroup(Request $request, $id): JsonResponse {
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
        return $success ? response()->json(Requests::success('Group retrieved successfully', ['group' => new GroupResource($Group), 'works' => new WorkCollection($uniqueWorks)]))
            : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     * @param CreateGroupRequest $request
     * Handles the request to create a new group.
     * @return JsonResponse - A message indicating whether the action as successful and a status code.
     */
    public function create(CreateGroupRequest $request): JsonResponse {
        $new_group = new Group([
            'name' => $request->safe()->only(['name'])['name'],
            'parent_id' => $request->safe()->only(['parent'])['parent'],
            'description' => $request->safe()->only(['description'])['description']
        ]);

        $success = $new_group->save();
        return $success ? response()->json(Requests::success('Group created successfully', ['groups' => self::getAllGroups(), 'newGroup' => new GroupResource($new_group->load(['members', 'parent']))]))
            : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy(DeleteGroupRequest $request): JsonResponse {
        $Group = Group::find($request->safe()->only(['id'])['id']);

        $success = $Group->delete();
        return $success ? response()->json(Requests::success('Group deleted successfully'))
            : response()->json(Requests::serverError("Something went wrong"), 500);
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

            if ($existing_member) {
                return response()->json(Requests::clientError('The author is already a member of this group', 200));
            }

            $Author = Author::find($author);

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

        if (!$Group) {
            return response()->json(Requests::clientError('Group not found', 200));
        }

        $Author = Author::find($author);
        // Return a 404 if the author is not found
        if (!$Author) {
            return response()->json(Requests::clientError('Author not found', 200));
        }

        $existing_member = AuthorGroup::entry($Group->id, $Author->id)->first();

        if (!$existing_member) {
            return response()->json(Requests::clientError('Cannot remove an author from a group they do not belong to', 200));
        }

        $success = $existing_member->delete();
        return $success ? response()->json(Requests::success('Member removed successfully', ['group' => new GroupResource(Group::with('members.works', 'parent')->find($group))])) : response()->json(Requests::clientError('Something went wrong'), 400);
    }
}
