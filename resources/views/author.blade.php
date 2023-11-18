<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $author->display_name }}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body class="bg-gray-100 px-8 py-5">

<div class="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">

    <h1 class="text-3xl font-bold mb-4">{{ $author->display_name }}</h1>

    <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="mb-4">
            <strong class="block mb-2">OpenAlex </strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $parsed_id }}
            </div>
        </div>

        <div class="mb-4">
            <strong class="block mb-2">ORCID</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                <a href="{{ $author->orcid }}" class="text-blue-500">{{ $parsed_orc_id }}</a>
            </div>
        </div>
        <div class="mb-4">
            <strong class="block mb-2">Scopus</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                <a href="{{ $author->ids->scopus }}" class="text-blue-500">{{ $parsed_scopus_id }}</a>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="mb-4">
            <strong class="block mb-2">Works Count</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $author->works_count }}
            </div>
        </div>

        <div class="mb-4">
            <strong class="block mb-2">Cited By Count</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $author->cited_by_count }}
            </div>
        </div>
    </div>

    <div class="mb-7">
        <strong class="block mb-2">Last Known Institution</strong>
        <div class="bg-gray-50 p-4 rounded-md shadow-md">
            <ul>
                <li><strong>Display Name : </strong> {{ $author->last_known_institution->display_name }}</li>
                <li><strong>Country Code : </strong> {{ $author->last_known_institution->country_code }}</li>
                <li><strong>Type : </strong> {{ ucfirst($author->last_known_institution->type) }}</li>
{{--                <li><strong>ID : </strong> {{ $author->last_known_institution->id }}</li>--}}
{{--                <li><strong>ROR : </strong> {{ $author->last_known_institution->ror }}</li>--}}
            </ul>
        </div>
    </div>

    <div class="">
        <strong class="block mb-2">Works</strong>
        <div class="bg-gray-50 p-4 rounded-md shadow-md overflow-y-auto h-80">
            <ul class="">
                @foreach ($works as $index=>$work)
                    <li>
                        <div class="bg-gray-50 p-4 rounded-lg shadow-lg mb-3">
                            @if($work->doi ?? $work->open_access->oa_url)
                                {{ $index+1 }}. <a href="{{ 'http://127.0.0.1:8000/Article/'.explode('/',$work->ids->openalex)[3] }}" class="text-blue-500">{{ $work->title }}</a>
                            @else
                                <span>{{ $index+1 }}. {{ $work->title }}</span>
                            @endif
                        </div>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>

</div>

</body>
</html>
