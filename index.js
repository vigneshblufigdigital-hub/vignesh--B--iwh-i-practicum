const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage: fetch contacts and render them in a table
app.get('/', async (req, res) => {
const contactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts?properties=names,bio,favorite_color';    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(contactsUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', {
            title: 'Contacts Homepage | Integrating With HubSpot I Practicum',
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching contacts');
    }
});

// ROUTE 2 - Render the form to create a new contact
app.get('/update-cobj', async (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3 - Handle form submission, create the contact, redirect home
app.post('/update-cobj', async (req, res) => {
    const createContactUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newContact = {
        properties: {
            email: req.body.email,
            names: req.body.name,
            bio: req.body.bio,
            favorite_color: req.body.favorite_color
        }
    };

    try {
        await axios.post(createContactUrl, newContact, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).send('Error creating contact');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));