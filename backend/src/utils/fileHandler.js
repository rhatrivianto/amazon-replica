import fs from 'fs';
import path from 'path';

export const deleteFile = (fileName) => {
  const filePath = path.join(process.cwd(), 'public/img/products', fileName);
  
  // fs.unlink bertugas menghapus file secara fisik
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Failed to delete the old file: ${fileName} (Mungkin file sudah tidak ada)`);
    } else {
      console.log(`✅ File lama berhasil dihapus: ${fileName}`);
    }
  });
};