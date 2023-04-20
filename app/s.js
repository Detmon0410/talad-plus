const bcrypt = require('bcrypt');

const plaintextPassword = '123';
const storedHash = '$2b$10$8gWFeC2ImXKyOiad4xk6PuhSDu7Uoz0CxEFQkuqgqWtvTd2v/3cRO';

bcrypt.compare(plaintextPassword, storedHash, function(err, result) {
  if (err) {
    // Handle error
  } else if (result) {
    console.log('Password match!');
  } else {
    console.log('Password does not match.');
  }
});