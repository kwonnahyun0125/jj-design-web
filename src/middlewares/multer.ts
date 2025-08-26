import multer from 'multer';

// 메모리에 저장
const uploadToMemory = multer({
  storage: multer.memoryStorage(),
});
export default uploadToMemory;
