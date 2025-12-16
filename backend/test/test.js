const autocannon = require('autocannon');

const opts = {
  url: 'http://localhost:3000',
  duration: 30,
  connections: 10,
  pipelining: 1,
  requests: [
    {
      path: '/',
      method: 'GET'
    }
  ]
};

autocannon(opts, (err, result) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Autocannon Results:');
  console.log(JSON.stringify(result, null, 2));
});
