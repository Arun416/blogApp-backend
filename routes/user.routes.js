const router = require('express').Router();
const controller = require('./../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })

  const upload = multer({ storage: storage ,limits: { fileSize: 5000000 }, // limit file size to 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }});

  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

router.post('/signup',controller.signUpUsers);
router.post('/login',controller.loginUser);
router.patch('/profile/edit/:id',upload.single('profile_picture'),verifyToken,controller.updateUserProfile);
router.get('/profile/:id',verifyToken,controller.getUserProfile);


module.exports =  router;