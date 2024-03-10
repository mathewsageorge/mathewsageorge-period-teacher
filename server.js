const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({ origin: "*" }));

const port = process.env.PORT || 3000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://mathewsgeorge202:ansu@cluster0.ylyaonw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Create a schema for the check-in and check-out records
const recordSchema = new mongoose.Schema({
    serialNumber: String,
    logData: String,
    time: String,
    teacher: String,
    period: String,
}, { collection: 'ansu' }); // Specify collection name here


// Create a model based on the schema
const Record = mongoose.model('Record', recordSchema);

// Endpoint to receive check-in and check-out data
app.post('/record', async (req, res) => {
    const { serialNumber, logData, time, teacher, period } = req.body;
    try {
        // Save the record to the MongoDB database
        const record = new Record({
            serialNumber,
            logData,
            time,
            teacher,
            period,
        });
        await record.save();

        res.status(201).send('Record saved successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
