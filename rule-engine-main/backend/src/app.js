const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ruleRoutes = require('./routes/ruleRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', ruleRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rule-engine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});