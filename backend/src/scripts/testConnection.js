const sequelize = require('../config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Test query
    const [results] = await sequelize.query('SELECT current_timestamp');
    console.log('Current database time:', results[0].current_timestamp);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection(); 