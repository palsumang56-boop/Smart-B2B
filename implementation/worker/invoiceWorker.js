// workers/invoiceWorker.js
require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // Required for actual AWS upload

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

console.log('👷 Background Worker started. Listening for invoice jobs...');

// Initialize the Worker
const worker = new Worker('Invoice-Generation-Queue', async job => {
  console.log(`\n[Job ${job.id}] Started: Generating PDF for Transaction ${job.data.transactionId}`);
  
  // 1. Generate the PDF dynamically
  const doc = new PDFDocument();
  const fileName = `Invoice_${job.data.transactionId}.pdf`;
  const filePath = path.join(__dirname, fileName);
  
  // Stream the PDF to a local file (For hackathon testing)
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Add content to the PDF
  doc.fontSize(25).text('SmartB2B Official Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Transaction ID: ${job.data.transactionId}`);
  doc.text(`Retailer ID: ${job.data.retailerId}`);
  doc.text(`Total Amount: $${job.data.amount}`);
  doc.text(`Date: ${job.data.date}`);
  doc.end();

  // Wait for the PDF to finish writing
  await new Promise((resolve) => writeStream.on('finish', resolve));
  console.log(`[Job ${job.id}] PDF Generated Successfully: ${fileName}`);

   // 2. Upload to AWS S3 (Uncomment and configure in production)
    const s3 = new S3Client({ region: 'us-east-1' });
    const fileStream = fs.createReadStream(filePath);
    await s3.send(new PutObjectCommand({
      Bucket: 'smartb2b-invoices',
      Key: fileName,
      Body: fileStream,
      ContentType: 'application/pdf'
    }));
    console.log(`[Job ${job.id}] Uploaded to secure AWS S3 cloud storage.`);

  return { status: 'success', fileName };
}, { connection });

worker.on('completed', job => {
  console.log(`✅ [Job ${job.id}] Completed successfully!`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ [Job ${job.id}] Failed with error: ${err.message}`);
});