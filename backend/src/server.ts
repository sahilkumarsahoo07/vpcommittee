import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`   VIGHNAHARTA PUJA COMMITTEE FULL-STACK SERVER RUNNING`);
    console.log(`   Local URL:    http://localhost:${PORT}`);
    console.log(`   IPv4 Direct:  http://127.0.0.1:${PORT}`);
    console.log(`   Swagger Docs: http://127.0.0.1:${PORT}/api/docs`);
    console.log(`=======================================================`);
  });
};

startServer();
