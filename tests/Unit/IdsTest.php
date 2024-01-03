<?php

use App\Utility\Ids;

it('returns the correct ID type for different IDs', function () {
    expect(Ids::getIdType('A5048293553'))->toBe(Ids::OPEN_ALEX)
        ->and(Ids::getIdType('W2090125204'))->toBe(Ids::OPEN_ALEX)
        ->and(Ids::getIdType('0000-0003-2366-1365'))->toBe(Ids::ORC_ID)
        ->and(Ids::getIdType('7003525351'))->toBe(Ids::SCOPUS);
});

it('returns the correctly parsed id from the url', function () {
    expect(Ids::parseOpenAlexId('https://openalex.org/W2090125204'))->toBe('W2090125204')
        ->and(Ids::parseOpenAlexId('https://openalex.org/A5048293553'))->toBe('A5048293553')
        ->and(Ids::parseScopusId('https://www.scopus.com/inward/authorDetails.url?authorID=55890905400&partnerID=MN8TOARS'))
            ->toBe('55890905400')
        ->and(Ids::parseOrcId("https://orcid.org/0000-0002-5719-2125"))->toBe('0000-0002-5719-2125');
});
