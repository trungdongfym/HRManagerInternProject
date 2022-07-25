/**
 * @description Select the specified property in an object
 * @param dataObject  Target object
 * @param pickFieldArray Array field
 * @return An object
 */
export function pickField(dataObject: object, pickFieldArray: Array<string>) {
   const objectKeys = Object.keys(dataObject);
   const resObject = {};
   for (const keyPick of pickFieldArray) {
      if (objectKeys.includes(keyPick)) {
         resObject[keyPick] = dataObject[keyPick];
      }
   }
   return resObject;
}
