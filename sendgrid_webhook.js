var localtunnel = require('localtunnel');
localtunnel(
  5000,
  {
    subdomain: 'uniquesubdomain535'
  },
  function(err, tunnel) {
    console.log('LT running');
  }
);
