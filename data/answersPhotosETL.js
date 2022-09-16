const fs = require('fs');
const {parse} = require('csv-parse');
const {setUpTables} = require('../server/db.js');
const {Client} = require('pg');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});



