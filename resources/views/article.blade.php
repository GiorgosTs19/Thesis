<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <!-- Include your CSS and JS files here if needed -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 p-8">

<div class="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">

    <h1 class="text-3xl font-bold mb-4">{{ $title }}</h1>

    <div class="grid grid-cols-3 gap-4 mb-4">
        <!-- DOI Section -->
        <div class="col-span-2">
            <strong class="block mb-2">DOI</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md overflow-x-hidden ">
                <a href="{{ $doi }}" class="text-blue-500">{{ $doi }}</a>
            </div>
        </div>

        <!-- Publication Date Section -->
        <div class="">
            <strong class="block mb-2">Publication Date</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $publication_date }}
            </div>
        </div>
    </div>

    <!-- Article Name Section -->
    <div class="mb-4">
        <strong class="block mb-2">Article Name</strong>
        <div class="bg-gray-50 p-4 rounded-md shadow-md">
            {{ $display_name }}
        </div>
    </div>

    <!-- Open Access URL Section -->
    <div class="mb-4">
        <strong class="block mb-2">Open Access URL</strong>
        <div class="bg-gray-50 p-4 rounded-md shadow-md">
            @if($oa_url !== 'Empty Field')
                <a href="{{ $oa_url }}" class="text-blue-500">{{ $oa_url }}</a>
            @else
                <div>Empty Field</div>
            @endif
        </div>
    </div>

    <!-- Journal Information Section -->
    <div class="mb-4">
        <strong class="block mb-2">Journal Information</strong>
        <div class="bg-gray-50 p-4 rounded-md shadow-md grid grid-cols-2 gap-4">
            <ul>
                <li><strong>ID : </strong> {{ $journal_id }}</li>
                <li><strong>Name : </strong> {{ $journal_name }}</li>
            </ul>
            <ul>
                <li><strong>Host Organization : </strong> {{ $host_organization_name }}</li>
                <li><strong>Journal Open Access : </strong> {{ $is_journal_oa ? 'Yes' : 'No' }}</li>
            </ul>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Article Type Section -->
        <div class="">
            <strong class="block mb-2">Article Type</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ ucfirst($type) }}
            </div>
        </div>

        <!-- Language Section -->
        <div class="">
            <strong class="block mb-2">Article Language</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $language === 'en' ? 'English' : $language}}
            </div>
        </div>
    </div>

    <div class="grid grid-cols-3 gap-4 ">
        <!-- License Section -->
        <div class="">
            <strong class="block mb-2">License</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $license }}
            </div>
        </div>

        <!-- Is Published Section -->
        <div class="">
            <strong class="block mb-2">Published</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $is_published ? 'Yes' : 'No' }}
            </div>
        </div>

        <!-- Is Open Access Section -->
        <div class="">
            <strong class="block mb-2">Open Access</strong>
            <div class="bg-gray-50 p-4 rounded-md shadow-md">
                {{ $is_oa ? 'Yes' : 'No' }}
            </div>
        </div>
    </div>

</div>

</body>
