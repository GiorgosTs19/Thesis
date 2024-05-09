<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupRequests\AddGroupMemberRequest;
use App\Http\Requests\GroupRequests\CreateGroupRequest;
use App\Http\Requests\GroupRequests\DeleteGroupRequest;
use App\Http\Requests\GroupRequests\RemoveGroupMemberRequest;
use App\Http\Resources\GroupResource;
use App\Models\Author;
use App\Models\AuthorGroup;
use App\Models\Group;
use App\Models\Type;
use App\Models\Work;
use App\Utility\Requests;
use App\Utility\ULog;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;
use stdClass;

class GroupController extends Controller {
    private function retrieveAllGroups(): AnonymousResourceCollection {
        return GroupResource::collection(Group::all());
    }

    public function getGroupMinInfo(Request $request): Collection {
        return Group::all(['id', 'name']);
    }

    public function getAllGroups(Request $request): AnonymousResourceCollection {
        return GroupResource::collection(Group::noParent()->noMembers()->with(['childrenRecursive'])->get());
    }

    /**
     *  Handles the request to show the groups page.
     * Retrieves all the groups ( with minimal info for each of them and no relationships loaded )
     * @return Response - Renders the groups page.
     */
    public function index(): Response {
        return Inertia::render('Routes/Groups/GroupsPage');
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
            return Requests::missingParameterError('id');
        }

        $group = Group::with('members', 'parent', 'members.statistics')->withCount('members')->find($id);

        if (!$group) {
            return Requests::clientError('A group with this id does not exist', 200);
        }

        $success = !!$group;

        $authors_ids = $group->members->map(function (Author $author) {
            return $author->id;
        });

        $orc_id_works = Work::whereHas('authors', function ($query) use ($authors_ids) {
            $query->whereIn('author_id', $authors_ids);
        })->source(Work::$orcIdSource)->count();

        $open_alex_works = Work::whereHas('authors', function ($query) use ($authors_ids) {
            $query->whereIn('author_id', $authors_ids);
        })->source(Work::$openAlexSource)->count();

        $crossref_works = Work::whereHas('authors', function ($query) use ($authors_ids) {
            $query->whereIn('author_id', $authors_ids);
        })->source(Work::$crossRefSource)->count();


        return $success ? Requests::success('Group retrieved successfully',
            ['group' => new GroupResource($group, [
                'orcid_works' => $orc_id_works,
                'open_alex_works' => $open_alex_works,
                'crossref_works' => $crossref_works
            ])])
            : Requests::serverError("Something went wrong");
    }

    public function getOmeaAuthorStats(Request $request, $id): JsonResponse {
        if (!isset($id)) {
            return Requests::missingParameterError('id');
        }

        $group = Group::with('members', 'parent', 'members.statistics')->withCount('members')->find($id);

        if (!$group) {
            return Requests::clientError('A group with this id does not exist', 200);
        }

        $success = false;
        $source_counts = new stdClass();

        try {
            $source_counts = $group->members->map(function (Author $author) {
                return ['name' => $author->display_name, 'counts' => Work::whereHas('authors', function ($query) use ($author) {
                    $query->whereIn('author_id', [$author->id]);
                })->whereNotIn('source', [Work::$aggregateSource])
                    ->selectRaw('source, COUNT(*) as source_count')
                    ->groupBy('source')
                    ->pluck('source_count', 'source')
                    ->toArray()];
            });
            $success = true;
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }

        return $success ? Requests::success('Group author stats retrieved successfully',
            ['countsPerAuthor' => $source_counts])
            : Requests::serverError("Something went wrong");
    }

    public function getOmeaTypeStats(Request $request, $id, $min = null, $max = null): JsonResponse {
        if (!isset($id)) {
            return Requests::clientError('The id parameter is marked as required');
        }

        $group = Group::with('members', 'parent', 'members.statistics')->withCount('members')->find($id);

        if (!$group) {
            return Requests::clientError('A group with this id does not exist', 200);
        }

        $type_counts = new stdClass();

        try {
            $authors_ids = $group->members->map(function (Author $author) {
                return $author->id;
            });

            $max_allowed = Work::max('publication_year');
            $min_allowed = $max_allowed - 5;

            $min_pub_year = !is_null($min) ? max($min, $min_allowed) : $min_allowed;
            $max_pub_year = !is_null($max) ? min($max, $max_allowed) : $max_allowed;

            // Retrieve types with works filtered by authors and source
            $type_counts = Type::with(['works' => function ($query) use ($authors_ids) {
                $query->whereHas('authors', function ($query) use ($authors_ids) {
                    $query->whereIn('author_id', $authors_ids);
                })->where('source', Work::$aggregateSource);
            }])->get()->map(function ($type) use ($min_pub_year, $max_pub_year) {
                $works_per_year = $type->works->groupBy('publication_year')->map->count();

                // Generate counts for all years within the range
                $counts = [];
                for ($year = $min_pub_year; $year <= $max_pub_year; $year++) {
                    $counts[$year] = $works_per_year[$year] ?? 0;
                }

                return [
                    'name' => $type->name,
                    'worksPerYear' => $counts,
                ];
            })->toArray();

            $success = true;
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            $success = false;
        }

        return $success ? Requests::success('Group type stats retrieved successfully',
            ['typeStatistics' => $type_counts, 'minAllowedYear' => $min_allowed, 'maxAllowedYear' => $max_allowed, 'requestedMin' => $min_pub_year,
                'requestedMax' => $max_pub_year])
            : Requests::serverError("Something went wrong");
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
        return $success ? Requests::success('Group created successfully', ['group' => new GroupResource($new_group->load(['members', 'parent']))])
            : Requests::serverError("Something went wrong");
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

        return $success ? Requests::success('Group deleted successfully')
            : Requests::serverError("Something went wrong");
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

        return $success ? Requests::success((sizeof($authors) === 1 ? 'Member' : 'Members') . ' added successfully')
            : Requests::serverError("Something went wrong");
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
        return $success ? Requests::success('Member removed successfully') : Requests::clientError('Something went wrong');
    }
}
