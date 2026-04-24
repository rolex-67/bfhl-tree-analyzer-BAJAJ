const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./routes/bfhl');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/bfhl', bfhlRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
