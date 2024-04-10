export function isDefined(value) {
    if (value === null) {
        return false;
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    if (typeof value === 'string') {
        return value.trim() !== '';
    }
    if (typeof value === 'object') {
        for (let key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                if (!isDefined(value[key])) {
                    return false;
                }
            }
        }
        return true;
    }
    return true;
}

/**
 * @param {Array | Object } haystack - The object or the array to check for the given key.
 * @param {string} key - The key to check in the given haystack
 * @param {boolean} shouldBeDefined - A boolean indicating whether the key should also be defined and not only exist. Defaults to false.
 * Usable only when the haystack is an object.
 * @returns {*|boolean}
 */
export function containsKey(haystack, key, shouldBeDefined = false) {
    if (typeof haystack === 'object') {
        return shouldBeDefined ? Object.prototype.hasOwnProperty.call(haystack, key) && haystack[key] : Object.prototype.hasOwnProperty.call(haystack, key);
    }
    if (Array.isArray(haystack)) {
        return haystack.includes(key);
    }
    return false;
}
