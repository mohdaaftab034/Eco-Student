import mongoose from "mongoose";
import Challenge from "../models/challenge.js"


export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().sort({ createdAt: -1 });
        res.json({ success: true, list: challenges });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

export const createChallenge = async (req, res) => {
    try {
        const challenge = new Challenge(req.body);

        await challenge.save();
        res.json({ success: true, challenge });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



export const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const { student_id } = req.body;

        // Challenge find karo
        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        // Check if already joined
        const alreadyJoined = challenge.participants.some(
            (p) => p.student_id.toString() === student_id
        );
        if (alreadyJoined) {
            return res.status(400).json({
                success: false,
                message: "You have already joined this challenge!"
            });
        }

        // Naya participant push karo
        challenge.participants.push({
            student_id,
            joined_at: new Date(),
            completed: false
        });

        await challenge.save();

        res.json({
            success: true,
            message: "Joined successfully",
            challenge
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
