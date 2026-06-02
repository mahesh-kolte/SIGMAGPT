import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/opneai.js";

const router = express.Router();

//test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});
 // Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.error("THREAD FETCH ERROR:", err);

        res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    }
});

// Get single thread
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.json(thread.messages);
    } catch (err) {
        console.error("THREAD CHAT ERROR:", err);

        res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    }
});

// Chat Route
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "missing required fields"
        });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            });
        } else {
            thread.messages.push({
                role: "user",
                content: message
            });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        res.json({
            reply: assistantReply
        });

    } catch (err) {
        console.error("CHAT ERROR:", err);

        res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    }
});

export default router;