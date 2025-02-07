const express = require("express");
const { connect } = require("puppeteer-real-browser");


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a simple GET endpoint
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Mock HandleLogin function (replace this with your actual implementation)
async function HandleLogin(Username, Password) {
  if (Username === "admin" && Password === "password") {

    const { page } = await connect({
        headless: false, // Run in headless mode
        args: [
          "--disable-web-security",
          "--disable-blink-features=AutomationControlled", // Avoid detection of headless
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-features=IsolateOrigins,site-per-process",
        ],
      });

      await page.goto("https://gollum.ownpay.xyz/", { waitUntil: "networkidle2" });
  
    return { success: true, message: "Login successful1" };
  }
  return { error: true, message: "Invalid credentials" };
}

// Marking the '/login' route as async to use 'await'
app.post("/login", async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).json({ error: "Valid body is required" });
  }

  try {
    const result = await HandleLogin(Username, Password);
    res.status(result.error ? 400 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
