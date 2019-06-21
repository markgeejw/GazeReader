require('now-env');

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
  // env variables provide security tokens
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRETACCESS_KEY,
  region: "eu-west-2",
  // use transfer acceleration
  useAccelerateEndpoint: true,
});

// Initialize multer-s3 with s3 config and other options
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'private',
    metadata(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    }
  })
})

var bucketParams = {
  Bucket : process.env.AWS_BUCKET,
};

// Expose the /upload endpoint
const app = require('express')();
const http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(200, 'Hi');
})

app.get('/items', (req, res) => {
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      res.send("Error", err);
    } else {
      res.send(data['Contents'].length);
    }
  });
})

app.post('/generatepresignedurl', function(req,res){
  var fileurls = [];
  /*setting the presigned url expiry time in seconds */
  const signedUrlExpireSeconds = 60 * 60;
  const params = {Bucket: process.env.AWS_BUCKET, Key: req.body.key, Expires: signedUrlExpireSeconds, ACL: 'private', ContentType: req.body.type};
  s3.getSignedUrl('putObject', params, function (err, url){
    if(err){
      console.log('Error getting presigned url from AWS S3');
      res.json({ success : false, message : 'Pre-Signed URL error', urls : fileurls});
    }
    else{
      fileurls[0] = url;
      console.log('Presigned URL: ', fileurls[0]);
      res.json({ success : true, message :'AWS SDK S3 Pre-signed urls generated successfully.', urls : fileurls});
    }
  });
});

app.post('/createpresignedpost', function(req,res){
  var response = [];
  /*setting the presigned url expiry time in seconds */
  const signedUrlExpireSeconds = 60 * 60;
  const params = {
    Bucket: process.env.AWS_BUCKET, 
    Fields: {
      key: req.body.key
    }, 
    Expires: signedUrlExpireSeconds, 
    ACL: 'private', 
    ContentType: req.body.type
  };
  s3.createPresignedPost(params, function (err, data){
    if(err){
      console.log('Error getting presigned url from AWS S3');
      res.json({ success : false, message : 'Pre-Signed post error', response : response});
    }
    else{
      response[0] = data;
      console.log('URL: ', response[0].url);
      console.log('Fields: ', response[0].fields);
      res.json({ success : true, message :'AWS SDK S3 pre-signed post generated successfully.', response : response});
    }
  });
});

// POST handler for upload endpoint to upload videos
// Uploading is handled simply by upload.single('video')
// ('video' is the name of the key in the multipart formdata)
app.post('/upload', upload.single('video'), (req, res, next) => {
  res.json(req.file);
})

app.post('/upload-json', (req, res) => {
  // res.send(req.body);
  var uploadParams = { Bucket: process.env.AWS_BUCKET, Key: req.body.name + '.json', Body: JSON.stringify(req.body), ContentType: 'application/json' };
  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } if (data) {
      res.status(200).send(req.body);
    }
  });
})

module.exports = app;