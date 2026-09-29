// CyberMemory frontend
// Hindsight credentials are NOT stored here.

async function storeMemory(content) {
    const response = await fetch("/api/retain", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: content
        })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to store memory");
    }

    return data;
}


async function recallMemory(query) {
    const response = await fetch("/api/recall", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query
        })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to recall memory");
    }

    return data;
}