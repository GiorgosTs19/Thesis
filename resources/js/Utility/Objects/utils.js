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
