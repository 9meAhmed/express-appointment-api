import * as multer from "multer";
import { existsSync, mkdirSync, unlink } from "node:fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./uploads/${file.fieldname}`;

    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
