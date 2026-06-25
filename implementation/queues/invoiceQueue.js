// queues/invoiceQueue.js
const { Queue } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

// BullMQ requires an ioredis connection instance
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null // Required by BullMQ
});

// Create the Queue
const invoiceQueue = new Queue('Invoice-Generation-Queue', { connection });

module.exports = invoiceQueue;