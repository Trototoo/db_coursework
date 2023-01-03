const express = require('express');
const userRouter = require('./routes/userRoutes.js');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use('/api', userRouter);

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));