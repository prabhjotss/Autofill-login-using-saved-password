const express = require('express');
const path = require('path');
const app = express();
const MO=require("method-override");
app.use(MO("_method"));
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Render the index.ejs file
app.get('/', (req, res) => {
    res.render('index');
});

app.patch('/', async (req, res) => {
    const puppeteer = require('puppeteer');
    const { username, password } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: false, // Run in headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessary for serverless environments
        });
        const page = await browser.newPage();
        await page.goto('https://www.instagram.com');

        // Perform the login actions
        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation();

       // await browser.close();
        res.render('success.ejs');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
