import * as fs from 'fs';

class FileLib {
   public static async removeFile(filePath: string) {
      return new Promise((resolve, reject) => {
         fs.unlink(filePath, (err) => {
            if (err) {
               reject(err);
            }
            resolve(filePath);
         });
      });
   }
}

export default FileLib;
