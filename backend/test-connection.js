require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection URI:', process.env.MONGODB_URI);
console.log('');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ SUCCESS! MongoDB is connected.');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('❌ Connection Failed!');
    console.log('Error Type:', err.name);
    console.log('Error Message:', err.message);
    console.log('\n⚠️  Common fixes:');
    console.log('1. Verify username and password in MongoDB Atlas');
    console.log('2. Check Network Access - add your IP address to whitelist');
    console.log('3. Make sure database user exists in MongoDB Atlas');
    console.log('4. Ensure special characters in password are URL encoded');
  });
