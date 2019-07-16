const app = require('express')();
const server = require('http').createServer(app);
const net = require('net');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res) => {
    res.json({ foo: 'bar' });
});

app.post('/message', (req, res) => {
    const { deviceHOST, devicePORT } = req.body;

    if (deviceHOST === undefined || devicePORT === undefined) {
        return res.end('No Device Host or Device Port specified!');
    }

    const client = net.createConnection({ port: devicePORT, host: deviceHOST }, () => {
        console.log('Connected');

        client.write('!M1\r ', 'utf8', () => {
            console.log('wrote status to server');
        });

        res.json({ deviceHOST, devicePORT, connected: true });
    });

    let str = '';

    client.on('data', data => {
        str += data;
    });

    client.on('error', e => {
        console.error(e);
    });

    setTimeout(() => {// Can console.log result with the 'done' event, though for demo purposes
        console.log(str);
        client.end();
    }, 10000)
});

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
