const { connectMongo } = require('./dist/db');
const { seedAll } = require('./dist/seed');

async function runSeed() {
  try {
    console.log('Connecting to database...');
    await connectMongo();
    
    console.log('Running database seed...');
    await seedAll();
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();
