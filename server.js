const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Load or create users.json
let users = [];
if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

// ====================================================
//               ⭐ SIGNUP ROUTE ⭐
// ====================================================
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    console.log("SIGNUP RECEIVED:", req.body);

    // 1. Check empty fields
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return res.json({
            ok: false,
            msg: "Account Not Created! Please fill all fields."
        });
    }

    // 2. Check if email already exists
    const exists = users.find(u => u.email === email);
    if (exists) {
        return res.json({
            ok: false,
            msg: "Email is already registered!"
        });
    }

    // 3. Save user to JSON DB
    try {
        users.push({ name, email, password });
        fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

        return res.json({
            ok: true,
            msg: "Account Created Successfully!"
        });
    }
    catch (err) {
        console.log("ERROR saving user:", err);
        return res.json({
            ok: false,
            msg: "Account Not Created! Server Error."
        });
    }
});

// ====================================================
//               ⭐ LOGIN ROUTE (FIXED) ⭐
// ====================================================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // 1. Input empty check
    if (!email?.trim() || !password?.trim()) {
        return res.json({
            ok: false,
            msg: "Please fill all fields."
        });
    }

    // 2. Check if account exists
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.json({
            ok: false,
            msg: "Account not created! Please sign up first."
        });
    }

    // 3. Check if password correct
    if (user.password !== password) {
        return res.json({
            ok: false,
            msg: "Invalid email or password"
        });
    }

    // 4. LOGIN SUCCESS
    return res.json({
        ok: true,
        msg: "Login Successful!"
    });
});

// ====================================================
//               ⭐ START SERVER ⭐
// ====================================================
app.listen(5000, () => {
    console.log("Backend running on https://backendofse.onrender.com");
});
