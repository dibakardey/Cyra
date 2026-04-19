import Fastify from 'fastify';
import websocket from '@fastify/websocket';

const fastify = Fastify({
    logger: true
});

fastify.register(websocket);

// In-memory storage for PoC
const eventHistory: any[] = [];

fastify.register(async (fastify) => {
        fastify.get('/ws', { websocket: true }, (connection, req) => {
            console.log('New client connected via WebSocket');

            connection.socket.on('message', (message: Buffer | string) => {
                try {
                    const event = JSON.parse(message.toString());
                console.log('Received event:', event.type, event.payload);
                
                // Store event
                eventHistory.push(event);
                
                // Keep history manageable
                if (eventHistory.length > 100) {
                    eventHistory.shift();
                }

                // Broadcast to all other connections (if we had a way to track them)
                // For PoC, we'll just log it.
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        });

        connection.socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
});

// API endpoint to get history
fastify.get('/events', async (request, reply) => {
    return eventHistory;
});

const start = async () => {
    try {
        await fastify.listen({ port: 8080, host: '0.0.0.0' });
        console.log('Backend server listening on http://localhost:8080');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();