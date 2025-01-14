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
app.patch('/unk', async (req, res) => {
    let r = req.body
    const { Builder, By, until, Button } = require('selenium-webdriver');
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get("https://www.instagram.com");
        let input = await driver.wait(until.elementLocated(By.name('username')), 10000);
        await input.sendKeys(r.username);
        let password = await driver.findElement(By.name('password'));
        await password.sendKeys(r.password);
        let loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await driver.wait(until.elementIsVisible(loginButton), 5000);
        await loginButton.click();
    } catch (error) {
        console.error("Error encountered:", error);
        res.status(500).send("An error occurred!");
    }
    
});

app.patch('/', async (req, res) => {
    const { username, password } = req.body;
    const puppeteer = require('puppeteer');
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

const PORT = process.env.PORT || 1122;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
