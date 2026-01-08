const http = require('http');

const ports = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010];

function checkPort(port) {
	return new Promise((resolve) => {
		const req = http.get(`http://localhost:${port}/health`, (res) => {
			resolve(res.statusCode === 200);
		});
		req.on('error', () => resolve(false));
		req.setTimeout(2000, () => {
			req.destroy();
			resolve(false);
		});
	});
}

(async () => {
	for (const port of ports) {
		if (await checkPort(port)) {
			process.exit(0);
		}
	}
	process.exit(1);
})();
