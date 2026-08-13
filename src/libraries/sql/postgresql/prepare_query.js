// Translate ? placeholders to $1, $2, etc. for PostgreSQL

/**
 * 
 * @param {string | null} sql 
 * @returns 
 */
function prepareQuery(sql)
{
    if (!sql)
        return (null);
    let result = '';
    let paramIndex = 0;

    let quote = null;
    let lineComment = false;
    let blockComment = false;

    for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];

    // Inside -- comment
    if (lineComment) {
        result += char;

        if (char === '\n') {
        lineComment = false;
        }

        continue;
    }

    // Inside /* ... */ comment
    if (blockComment) {
        result += char;

        if (char === '*' && next === '/') {
        result += '/';
        i++;
        blockComment = false;
        }

        continue;
    }

    // Inside quoted string / identifier
    if (quote) {
        result += char;

        // Backslash escape
        if (char === '\\' && next !== undefined) {
        result += next;
        i++;
        continue;
        }

        // SQL escaped quote: ''
        if (char === quote && next === quote) {
        result += next;
        i++;
        continue;
        }

        if (char === quote) {
        quote = null;
        }

        continue;
    }

    // Start quote
    if (char === "'" || char === '"' || char === '`') {
        quote = char;
        result += char;
        continue;
    }

    // Start -- comment
    if (char === '-' && next === '-') {
        lineComment = true;
        result += '--';
        i++;
        continue;
    }

    // Start /* comment */
    if (char === '/' && next === '*') {
        blockComment = true;
        result += '/*';
        i++;
        continue;
    }

    // Escaped question mark: \?
    if (char === '\\' && next === '?') {
        result += '?';
        i++;
        continue;
    }

    // Actual parameter
    if (char === '?') {
        result += `$${++paramIndex}`;
        continue;
    }

    result += char;
    }

    return (result);
}

module.exports = {
  prepareQuery
};