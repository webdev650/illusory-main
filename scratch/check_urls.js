const http = require('https');

const urls = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066170/Copy_of_ADDY_FITNESS_q4vi2a.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066100/Copy_of_annapurna_bakery_mockup_ad93tu.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066097/Copy_of_desi_funkaar_mockup_vwhzt8.png"
];

function checkUrl(url) {
  return new Promise((resolve) => {
    http.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode, headers: res.headers });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    }).end();
  });
}

Promise.all(urls.map(checkUrl)).then(console.log);
