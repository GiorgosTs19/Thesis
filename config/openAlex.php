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

    'required_work_fields' => ['ids','open_access','title','publication_date','publication_year','referenced_works_count',
        'language','type','updated_date','created_date','cited_by_api_url','authorships','counts_by_year'],

    'required_work_update_fields' => ['open_access','title','referenced_works_count','updated_date','authorships','counts_by_year'],

    'required_author_fields' => ['ids','display_name','cited_by_count',
        'works_count','counts_by_year','works_api_url','updated_date','created_date'],

    'required_author_update_fields' => ['cited_by_count','works_count','counts_by_year','updated_date'],
];
