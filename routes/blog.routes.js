const router = require('express').Router();
const controller = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/verifyToken');


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/blogs/images/' )
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

router.post('/create',verifyToken,upload.single('image'),controller.createBlog);
router.get('/all',verifyToken,controller.getAllBlogs);
router.get('/:id',verifyToken,controller.getBlogDetail);
router.get('/myblogs/:id',verifyToken,controller.getUsersBlogs);
router.patch('/edit/:id',verifyToken,upload.single('image'),controller.updatePost);
router.delete('/delete/:id',verifyToken,controller.deletePost);

module.exports = router;