<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupRequests\AddGroupMemberRequest;
use App\Http\Requests\GroupRequests\CreateGroupRequest;
use App\Http\Requests\GroupRequests\DeleteGroupRequest;
use App\Http\Requests\GroupRequests\RemoveGroupMemberRequest;
use App\Http\Resources\GroupResource;
use App\Http\Resources\WorkCollection;
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

    /**
     *  Handles the request to show the groups page.
     * Retrieves all the groups ( with minimal info for each of them and no relationships loaded )
     * @return Response - Renders the groups page.
     */
    public function show(): Response {
        $groups = self::getAllGroups();
        return Inertia::render('Routes/Groups/GroupsPage', ['groups' => GroupResource::collection($groups)]);
    }

    /**
     *  Handles the request to retrieve a group's information.
     *  Since the request's input ( id ) is part of the url and not passed as form-data in the request's body,
     * a FormRequest class cannot be used to properly validate the input and in-controller validation is used instead.
     * @param Request $request - Just passing the request, without actually using it ( dependency injection )
     * so that the route can point to this controller action.
     * @return JsonResponse - A message indicating whether the action was successful, the information of the requested group and a status code.
     */
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

        $uniqueWorks = Work::with(['authors'])->whereIn('id', $uniqueWorkIds)->paginate(10);
        return $success ? response()->json(Requests::success('Group retrieved successfully', ['group' => new GroupResource($Group), 'works' => new WorkCollection($uniqueWorks)]))
            : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     *  Handles the request to create a new group.
     *  The CreateGroupRequest class is responsible for :
     *  1.Checking if the name, description fields are present and valid ( also checks for the uniqueness of the name provided in the Groups table ),
     *  2.the parent ( if provided, corresponds to a valid group in the Groups table ),
     * @param CreateGroupRequest $request - An action-specific request used for validating the request's input.
     * @return JsonResponse - A message indicating whether the action was successful, the newly created group and a status code.
     */
    public function create(CreateGroupRequest $request): JsonResponse {
        $new_group = new Group([
            'name' => $request->safe()->only(['name'])['name'],
            'parent_id' => $request->safe()->only(['parent'])['parent'],
            'description' => $request->safe()->only(['description'])['description']
        ]);

        $success = $new_group->save();
        return $success ? response()->json(Requests::success('Group created successfully', ['group' => new GroupResource($new_group->load(['members', 'parent']))]))
            : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     *  Handles the request to delete an existing group.
     *  The DeleteGroupRequest class is responsible for checking if the id corresponds to a valid group in the Groups table.
     * @param DeleteGroupRequest $request - An action-specific request used for validating the request's input.
     * @return JsonResponse - A message indicating whether the action was successful and a status code.
     */
    public function destroy(DeleteGroupRequest $request): JsonResponse {
        $Group = Group::find($request->safe()->only(['id'])['id']);

        $success = $Group->delete();

        return $success ? response()->json(Requests::success('Group deleted successfully'))
            : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     * Handles the request  to add a new member/s to a group.
     * The AddGroupMemberRequest class is responsible for :
     * 1.Checking if the group_id corresponds to a valid group in the Groups table,
     * 2.the authors is an array of valid author ids in the Authors table,
     * 3.each author is a registered user, and isn't already a member of that group.
     * @param AddGroupMemberRequest $request - An action-specific request used for validating the request's input.
     * @return JsonResponse - A message indicating whether the action was successful and a status code.
     */
    public function addMember(AddGroupMemberRequest $request): JsonResponse {
        $authors = $request->safe()->only(['authors'])['authors'];
        $group = $request->safe()->only(['group_id'])['group_id'];

        $Group = Group::find($group);

        // Initialize the success variable as false, if all the database entries are successfully added, it should then be true;
        $success = false;

        // At this point the authors array should only contain authors are valid in the Authors table, do not already belong to that group,
        // and are users.
        foreach ($authors as $author) {
            $success = $Group->addMember($author);
        }

        return $success ? response()->json(Requests::success((sizeof($authors) === 1 ? 'Member' : 'Members') . ' added successfully'))
            : response()->json(Requests::serverError("Something went wrong"), 500);
    }

    /**
     * Handles the request to remove an existing member from a group.
     * The RemoveGroupMemberRequest class is responsible for :
     * 1.Checking if the group_id corresponds to a valid group in the Groups table,
     * 2.the author_id corresponds to a valid author in the Authors table,
     * 3.the author is a member of that group.
     * @param RemoveGroupMemberRequest $request - An action-specific request used for validating the request's input.
     * @return JsonResponse - A message indicating whether the action was successful and a status code.
     */
    public function removeMember(RemoveGroupMemberRequest $request): JsonResponse {
        $existing_member = AuthorGroup::entry($request->safe()->only(['group_id'])['group_id'], $request->safe()->only(['author_id'])['author_id'])->first();

        $success = $existing_member->delete();
        return $success ? response()->json(Requests::success('Member removed successfully')) : response()->json(Requests::clientError('Something went wrong'), 400);
    }
}
