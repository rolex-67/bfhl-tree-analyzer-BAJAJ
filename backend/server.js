const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./routes/bfhl');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root endpoint for health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: "Active",
        message: "SRM Full Stack Engineering Challenge API is running.",
        endpoint: "Please send POST requests to /bfhl"
    });
});

// Routes
app.use('/bfhl', bfhlRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
