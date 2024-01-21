import React from "react";

// Function to highlight the matching characters
export function highlightMatchingCharacters(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) =>
        regex.test(part) ? <span key={index} className="text-sky-600">{part}</span> : part
    );
}
