const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

const API_KEY = process.env.HINDSIGHT_API_KEY;
const BANK_ID = process.env.HINDSIGHT_BANK_ID;

const HINDSIGHT =
    "https://api.hindsight.vectorize.io";

// Serve frontend
app.use(express.static(process.cwd()));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
});

// Health
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        server: "CyberMemory",
        hindsightConfigured: !!API_KEY && !!BANK_ID
    });
});

// Retain
app.post("/api/retain", async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                error: "Memory content is required."
            });
        }

        const response = await fetch(
            `${HINDSIGHT}/v1/default/banks/${BANK_ID}/memories`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    items: [{
                        content,
                        context:
                            "Cybersecurity incident investigation"
                    }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error:
                    data.detail ||
                    data.message ||
                    "Hindsight retain failed."
            });
        }

        res.json({
            success: true,
            result: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Recall
app.post("/api/recall", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                error: "Query is required."
            });
        }

        const response = await fetch(
            `${HINDSIGHT}/v1/default/banks/${BANK_ID}/memories/recall`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error:
                    data.detail ||
                    data.message ||
                    "Hindsight recall failed."
            });
        }

        res.json({
            success: true,
            result: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = app;