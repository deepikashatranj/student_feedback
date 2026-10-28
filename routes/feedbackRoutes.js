const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); 

// 1. GET ALL FEEDBACK
router.get('/', async (req, res) => {
    try {
        const allFeedbacks = await Feedback.find(); 
        res.status(200).json({ 
            message: "Fetch all student feedback successfully.",
            data: allFeedbacks 
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching data from database.", error: error.message });
    }
});

// 2. CREATE NEW FEEDBACK
router.post('/', async (req, res) => {
    try {
        const { name, rating, comment } = req.body; 
        
        // 🔥 FIX: Validation check taaki koi khali data na bhej sake
        if (!name || !rating || !comment) {
            return res.status(400).json({ message: "All fields (name, rating, comment) are required." });
        }
        
        const newFeedback = new Feedback({ name, rating, comment });
        const savedFeedback = await newFeedback.save(); 
        
        // Achha hota hai agar hum saved data bhi response me bhejien
        res.status(201).json({ 
            message: "Student feedback submitted successfully.",
            data: savedFeedback 
        });
    } catch (error) {
        res.status(400).json({ message: "Error saving feedback to database.", error: error.message });
    }
});

// 3. UPDATE FEEDBACK BY ID
router.put('/:id', async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        
        // 🔥 FIX: { new: true } lagaya taaki updated data mile, aur spelling check ki
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id, 
            { name, rating, comment },
            { new: true } 
        );
        
        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback ID not found." });
        }
        
        res.status(200).json({ 
            message: `Student feedback with ID ${req.params.id} updated successfully.`,
            data: updatedFeedback
        });
    } catch (error) {
        res.status(400).json({ message: "Error updating feedback.", error: error.message });
    }
});

// 4. DELETE FEEDBACK BY ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        
        if (!deletedFeedback) {
            return res.status(404).json({ message: "Feedback ID not found." });
        }
        
        res.status(200).json({ message: `Student feedback with ID ${req.params.id} deleted successfully.` });
    } catch (error) {
        res.status(400).json({ message: "Error deleting feedback.", error: error.message });
    }
});

module.exports = router;
