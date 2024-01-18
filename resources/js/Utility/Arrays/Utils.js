export function getTopCoAuthors(data, count, parentAuthor) {
    const authorOccurrences = {};
    const authorMap = {};

    // Preprocess data to create a map of author IDs to author objects
    // eslint-disable-next-line no-undef
    const uniqueAuthors = new Set(data.flatMap(obj =>
        (obj.authors && Array.isArray(obj.authors)) ? obj.authors : []
    ).map(author => {
        const authorId = author.id;
        const authorIdentifier = `${authorId}`;

        // Count occurrences while creating the map
        authorOccurrences[authorIdentifier] = (authorOccurrences[authorIdentifier] || 0) + 1;

        // Populate the author map
        if (!authorMap[authorIdentifier]) {
            authorMap[authorIdentifier] = author;
            return authorIdentifier;
        }
    }).filter(Boolean));

    const occurrencesArray = Array.from(uniqueAuthors, authorIdentifier => {
        const authorObject = authorMap[authorIdentifier];
        const occurrences = authorOccurrences[authorIdentifier];
        return {value: authorObject, occurrences};
    });

    // Exclude authors with the same name as parentAuthor and matching occurrences
    const filteredOccurrences = occurrencesArray.filter(
        entry =>
            entry.value.name !== parentAuthor.name ||
            entry.occurrences !== data.length
    );

    return filteredOccurrences.sort((a, b) => b.occurrences - a.occurrences).slice(0, count);
}
