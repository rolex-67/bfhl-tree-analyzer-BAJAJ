const express = require('express');
const router = express.Router();
const { parseEdges } = require('../utils/parser');
const { processGraph } = require('../utils/graph');

router.post('/', (req, res) => {
    try {
        const { data, user_id, email_id, college_roll_number } = req.body;
        
        // Ensure data is present and is an array
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid request. 'data' must be an array of strings." });
        }

        // 1. Parse and validate edges
        const { validEdges, invalidEntries, duplicateEdges } = parseEdges(data);
        
        // 2. Process graph (build trees, detect cycles, generate summary)
        const { hierarchies, summary } = processGraph(validEdges);

        // 3. Construct response matching required schema
        const response = {
            user_id: user_id || "nipun_12032000",
            email_id: email_id || "nipun@college.edu",
            college_roll_number: college_roll_number || "21CS1001",
            hierarchies,
            invalid_entries: invalidEntries,
            duplicate_edges: duplicateEdges,
            summary
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error processing /bfhl request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Adding a GET route to handle browsers visiting the endpoint directly
router.get('/', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

module.exports = router;
