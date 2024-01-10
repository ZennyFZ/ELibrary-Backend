const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/images/uploads')
//     },
//     filename: (req, file, cb) => {
//       console.log(file);
//       cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`)
//     }
// });
// const upload = multer({ storage });

module.exports = upload;