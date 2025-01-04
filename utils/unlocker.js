let fs     = require ('fs'),
    config = require('../config.json'),
    preq   = require('request-promise');
//load cert
const ca = fs.readFileSync('brightdata_proxy_ca/cert/BrightData SSL certificate (port 33335).crt');

//Bright Data Access
const brd_user = 'hl_347f65bf';
const brd_zone = 'web_unlocker1';
const brd_passwd = 'yoj61qqj2xsn';
const brd_superpoxy = 'brd.superproxy.io:33335';

const brd_connectStr = config.WEB_UNLOCKER_PROXY;


//Switch between brd_test_url to get a json instead of txt response: 
// const brd_test_url = 'https://geo.brdtest.com/mygeo.json';

const brd_test_url = 'https://futa.edu.ng/asset/img/home1/team/2.jpg'||'https://geo.brdtest.com/welcome.txt';

preq({
    url: brd_test_url,
    proxy: 'http://' + brd_connectStr,
    //add cert in the request options
    ca: ca,
    })
.then(function(data){ 
    console.log(typeof data);
    fs.writeFileSync('futa.html', data)
},
    function(err){ console.error(err.message, err.reason); });
