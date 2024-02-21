<?php

return [
    // Limits the number of works that will be fetched for each author
    'perPage' => 200,

    // An email is required for the OpenAlex api to function correctly.
    'mailTo' => 'it185302@it.teithe.gr',

    // Base URL to fire an OpenAlex getAuthorWorks api request
    'author_works_base_url' => 'https://api.openalex.org/works?filter=author.id:',

    // Base URL to fire an OpenAlex getAuthor api request
    'author_base_url' => 'https://api.openalex.org/authors/',

    // Base URL to fire an OpenAlex getAuthor ( by filtering properties ) api request
    'author_base_filter_url' => 'https://api.openalex.org/authors?filter=',

    // Base URL to fire an OpenAlex getWork api request
    'work_base_url' => 'https://api.openalex.org/works/',

    // Base URL to fire an OpenAlex getWork ( by filtering properties ) api request
    'work_base_filter_url' => 'https://api.openalex.org/works?filter=',

    'required_work_fields' => [
        'id',
        'ids',
        'title',
        'type',
        'language',
        'authorships',
        'open_access',
        'updated_date',
        'created_date',
        'counts_by_year',
        'publication_date',
        'publication_year',
        'cited_by_api_url',
        'referenced_works_count',
        'concepts'
    ],

    'required_work_update_fields' => ['id',
        'title',
        'open_access',
        'authorships',
        'updated_date',
        'counts_by_year',
        'referenced_works_count',
    ],

    'required_author_fields' => ['id',
        'ids',
        'works_count',
        'updated_date',
        'created_date',
        'display_name',
        'works_api_url',
        'counts_by_year',
        'cited_by_count',
    ],

    'required_author_update_fields' => ['id',
        'works_count',
        'updated_date',
        'counts_by_year',
        'cited_by_count',
    ],
];
