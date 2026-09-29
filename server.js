const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

const HINDSIGHT_API_KEY = process.env.HINDSIGHT_API_KEY;
const HINDSIGHT_BANK_ID = process.env.HINDSIGHT_BANK_ID;

const HINDSIGHT_BASE_URL =
    "https://api.hindsight.vectorize.io";

app.use(express.json());
app.use(express.static(__dirname));


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        server: "CyberMemory",
        hindsightConfigured:
            !!HINDSIGHT_API_KEY &&
            !!HINDSIGHT_BANK_ID
    });
});


// ===============================
// STORE MEMORY
// ===============================

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
            `${HINDSIGHT_BASE_URL}/v1/default/banks/${HINDSIGHT_BANK_ID}/memories`,
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${HINDSIGHT_API_KEY}`,
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    items: [
                        {
                            content: content,
                            context:
                                "Cybersecurity incident investigation"
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Hindsight retain error:",
                data
            );

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

        console.error(
            "Retain error:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// ===============================
// RECALL MEMORY
// ===============================

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
            `${HINDSIGHT_BASE_URL}/v1/default/banks/${HINDSIGHT_BANK_ID}/memories/recall`,
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${HINDSIGHT_API_KEY}`,
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    query: query
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Hindsight recall error:",
                data
            );

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

        console.error(
            "Recall error:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("       CYBERMEMORY IS RUNNING");
    console.log("======================================");
    console.log("");
    console.log(
        `Open: http://localhost:${PORT}`
    );
    console.log("");

});