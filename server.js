require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectdb = require('./config/db');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Routes
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;

// 🔥 FIX: Database connect hone ke BAAD hi server start hoga
const startServer = async () => {
    try {
        // Pehle DB connect karo
        await connectdb(); 
        
        // Agar DB connect ho gaya, tabhi server ko listen karo
        app.listen(PORT, () => {
            console.log(`💻 Server is running smoothly on port: ${PORT}`);
            console.log(`🔗 Click here to test: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server start nahi ho paya kyunki DB fail ho gaya:", error.message);
        process.exit(1); // Server ko band kar do agar DB hi nahi mila
    }
};

// Function ko call kiya
startServer();
