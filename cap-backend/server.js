'use strict';

const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const cds = require('@sap/cds');

const webAppRoot = path.join(__dirname, 'app', 'dist');
const webAppIndex = path.join(webAppRoot, 'index.html');

cds.on('bootstrap', (app) => {
	if (fs.existsSync(webAppIndex)) {
		app.use(express.static(webAppRoot));
	}
});

cds.on('served', () => {
	if (!fs.existsSync(webAppIndex) || !cds.app) return;

	cds.app.use((req, res, next) => {
		if (req.method !== 'GET' && req.method !== 'HEAD') return next();
		if (req.path.startsWith('/odata/v4') || req.path.startsWith('/-/')) return next();
		if (path.extname(req.path)) return next();

		res.sendFile(webAppIndex);
	});
});

module.exports = cds.server;
