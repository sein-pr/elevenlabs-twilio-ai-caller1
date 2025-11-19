import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import { registerInboundRoutes } from './inbound-calls.js';
import { registerOutboundRoutes } from './outbound-calls.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Fastify server
const fastify = Fastify({
  logger: true // Enable logging
});

const PORT = parseInt(process.env.PORT) || 8000;

// Start the Fastify server
const start = async () => {
  try {
    // Register route handlers BEFORE defining routes
    await fastify.register(fastifyFormBody);
    await fastify.register(fastifyWs);
    await registerInboundRoutes(fastify);
    await registerOutboundRoutes(fastify);

    // Root route for health check
    fastify.get("/", async (_, reply) => {
      reply.send({ message: "Server is running" });
    });

    // Start listening
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[Server] Listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

start();