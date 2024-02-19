<?php

return [
    'base_url' => 'https://pub.orcid.org/v3.0/',
    'accept_json' => 'application/vnd.orcid+json',
    'author_fields' => [
        'biography' => 'person.biography.content',
        'emails' => 'person.emails.email',
        'external_idertifiers' => 'person.external-identifiers.external-identifier',
        'works' => 'activities-summary.works.group'
    ]
];