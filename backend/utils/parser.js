/**
 * Parses the raw input data array, validates edges, and separates them
 * into valid edges, invalid entries, and duplicate edges.
 *
 * @param {Array} data - The input array of edge strings.
 * @returns {Object} { validEdges, invalidEntries, duplicateEdges }
 */
function parseEdges(data) {
    const invalidEntries = [];
    const duplicateEdges = [];
    const validEdges = [];
    
    const seenEdges = new Set();
    const addedToDuplicates = new Set();

    if (!Array.isArray(data)) {
        return { validEdges, invalidEntries, duplicateEdges };
    }

    const formatRegex = /^[A-Z]->[A-Z]$/;

    for (const edge of data) {
        if (typeof edge !== 'string') {
            invalidEntries.push(String(edge));
            continue;
        }

        const trimmed = edge.trim();

        // Check format
        if (!formatRegex.test(trimmed)) {
            invalidEntries.push(edge);
            continue;
        }

        // Check self loop
        const parent = trimmed[0];
        const child = trimmed[3];
        if (parent === child) {
            invalidEntries.push(edge);
            continue;
        }

        // Check duplicates
        if (seenEdges.has(trimmed)) {
            if (!addedToDuplicates.has(trimmed)) {
                duplicateEdges.push(trimmed);
                addedToDuplicates.add(trimmed);
            }
        } else {
            seenEdges.add(trimmed);
            validEdges.push({ parent, child, original: trimmed });
        }
    }

    return { validEdges, invalidEntries, duplicateEdges };
}

module.exports = { parseEdges };
