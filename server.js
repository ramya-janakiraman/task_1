const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/save-segment", async (req, res) => {
  const segment = req.body;

  if (!segment.segment_name || !segment.schema) {
    return res.status(400).json({ error: "segment_name and schema are required" });
  }

  console.log("✅ Received segment:", segment);

  try {
    const response = await fetch(
      "https://webhook.site/f18dd5dc-e919-41d3-951f-8edb4bacec8a",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(segment),
      }
    );

    if (!response.ok) {
      console.error("❌ Failed to send to webhook:", response.statusText);
      return res.status(500).json({ error: "Failed to send to webhook" });
    }

    const data = await response.text();
    console.log("📤 Successfully sent to webhook:", data);

    res.status(200).json({ success: true, message: "Segment sent!" });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Error sending segment" });
  }
});

app.listen(port, () =>
  console.log(`🚀 Backend server running at http://localhost:${port}`)
);
