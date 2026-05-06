const http = require('http');
const fs = require('fs');
const path = require('path');

let tasks = [];

const server = http.createServer((req, res) => {

    // ===== API ROUTES =====

    // GET tasks
    if (req.url === '/api/tasks' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(tasks));
    }

    // ADD task
    if (req.url === '/api/tasks' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            try {
                const { task, status } = JSON.parse(body);

                tasks.push({
                    task: task,
                    status: status || "pending"
                });

                res.writeHead(200);
                res.end("Task added");

            } catch (err) {
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });

        return;
    }

    // DELETE task
    if (req.url.startsWith('/api/tasks/') && req.method === 'DELETE') {
        const index = parseInt(req.url.split('/')[3]);

        if (!isNaN(index) && tasks[index]) {
            tasks.splice(index, 1);
        }

        res.writeHead(200);
        return res.end("Deleted");
    }

    // TOGGLE status
    if (req.url.startsWith('/api/tasks/') && req.method === 'PUT') {
        const index = parseInt(req.url.split('/')[3]);

        if (!isNaN(index) && tasks[index]) {
            tasks[index].status =
                tasks[index].status === "pending" ? "completed" : "pending";
        }

        res.writeHead(200);
        return res.end("Status updated");
    }

    // EDIT task
    if (req.url.startsWith('/api/tasks/') && req.method === 'PATCH') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            try {
                const index = parseInt(req.url.split('/')[3]);
                const { task } = JSON.parse(body);

                if (!isNaN(index) && tasks[index]) {
                    tasks[index].task = task;
                }

                res.writeHead(200);
                res.end("Task updated");

            } catch (err) {
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });

        return;
    }

    // ===== STATIC FILES =====

    let filePath = '';

    if (req.url === '/') filePath = 'index.html';
    else if (req.url === '/dashboard') filePath = 'dashboard.html';
    else if (req.url === '/tasks') filePath = 'tasks.html';
    else if (req.url === '/style.css') filePath = 'style.css';
    else if (req.url === '/script.js') filePath = 'script.js';
    else {
        res.writeHead(404);
        return res.end("Page not found");
    }

    const fullPath = path.join(__dirname, 'public', filePath);

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end("Error loading file");
        }

        let contentType = 'text/html';
        if (filePath.endsWith('.css')) contentType = 'text/css';
        if (filePath.endsWith('.js')) contentType = 'application/javascript';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(3000, '0.0.0.0',() => {
    console.log("Server running at http://localhost:3000");
});