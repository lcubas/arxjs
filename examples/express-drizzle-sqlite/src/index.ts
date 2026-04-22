import express from 'express';
import { initTables } from './db';
import { router } from './routes';
import { seedData } from './seed';

async function bootstrap() {
  // 1. Initialize tables (SQLite in-memory)
  await initTables();

  // 2. Seed initial data (Roles/Permissions)
  await seedData();

  // 3. Setup Express
  const app = express();
  app.use(express.json());

  // Use the router
  app.use('/api', router);

  // 4. Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🚀 ARX Authorization Example running at http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start ARX Express example:', err);
  process.exit(1);
});
