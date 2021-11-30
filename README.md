const functions = require('firebase-functions')

// สำหรับการเข้าถึง Cloud Storage
const admin = require("firebase-admin");
admin.initializeApp();

// สำหรับ network requests
const axios = require('axios');

// สำหรับสร้าง public url ใน Cloud Storage
const UUID = require("uuid-v4");

// สำหรับจัดการไฟล์
const path = require("path");
const os = require("os");
const fs = require("fs");
