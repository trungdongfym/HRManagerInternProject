import { UpdateOptions } from 'sequelize';

export interface IFindAndUpdateByIdOptions extends UpdateOptions {
   newDocs?: boolean;
   where: {
      userID?: string;
      formID?: string;
   };
}
