import multer from "multer";

const imageStorage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, "./uploads/images/");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    },
  });
  
  const videoStorage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, "./uploads/videos/");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    },
  });
  
  const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png,jpg and jpeg format
      return cb(new Error("Please upload a Image"));
    }
    cb(null, true);
  };
  
  const videoFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      // upload only mp4,mpeg-4,mkv format
      return cb(new Error("Please upload a Video"));
    }
    cb(null, true);
  };
  
  export let uploadPicture = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1024 * 1024 * 5, //File can't be greater than 5mb
    },
    fileFilter: imageFilter,
  });
  
  export let uploadVideo = multer({
    storage: videoStorage,
    limits: {
      fileSize: 1024 * 1024 * 30, //File can't be greater than 30mb
    },
    fileFilter: videoFilter,
  });