<?php

namespace App\Utility;

class Citations {
    const JOURNAL_ARTICLE_FIELDS = [
        'author',
        'title',
        'container-title',
        'volume',
        'issue',
        'page',
        'published-online',
        'DOI',
        'URL',
    ];

    protected static function extractReferenceInfo($doi): array {
        $referenceInfo = [];

        $response = json_decode(Requests::get(Ids::toDxDoiUrl($doi))->body());
        foreach (self::JOURNAL_ARTICLE_FIELDS as $field) {
            if (isset($response[$field])) {
                $referenceInfo[$field] = $response[$field];
            } else {
                $referenceInfo[$field] = null; // Handle cases where the field is not present in the response
            }
        }
        return $referenceInfo;
    }

    public static function generateReferenceStringForJournalArticle($doi): string {
        // Extract relevant information using the extractReferenceInfo function
        $data = self::extractReferenceInfo($doi);

        // Further processing if needed
        $authors = array_map(function ($author) {
            return $author['given'] . ' ' . $author['family'];
        }, $data['author']);

        // Creating the reference string
        return implode('. ', [
            implode(', ', $authors),
            '"' . $data['title'] . '"',
            $data['container-title'],
            $data['volume'] . '(' . $data['issue'] . ')',
            'pp. ' . $data['page'],
            '(' . $data['published-online']['date-parts'][0][0] . ')',
            'DOI: ' . $data['DOI'],
        ]);
    }
}
