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

export type dataType = 'Null' | 'Date' | 'Undefined' | 'Object' | 'String' | 'Number' | 'Symbol';
export function checkData(data: any): dataType {
   let res = Object.prototype.toString.apply(data);
   res = res.slice(8, -1);
   return res;
}

/**
 *
 * @param objectCheck Object check
 * @param fieldsCheck Field check
 * @returns true if Field check exists in Object check, otherwise false
 */
export function checkFieldContaint(objectCheck: object, fieldsCheck: string[] | string) {
   if (!Array.isArray(fieldsCheck)) fieldsCheck = [fieldsCheck];
   for (const field of fieldsCheck) {
      if (Object.prototype.hasOwnProperty.call(objectCheck, field)) {
         return true;
      }
   }
   return false;
}
