import { RequestHandler, Router } from 'express';
import { OptionsRoutes } from '../../commons/interfaces/optionsRoutes';
import Auth from '../../middlewares/auth.middleware';
import { rolesArray } from '../../models/roles.model';

const router = Router();

enum requestMethodEnum {
   get = 'get',
   post = 'post',
   put = 'put',
   patch = 'patch',
   delete = 'delete',
   use = 'use',
}

type requestOptions = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'use';

class CustomRouter {
   /**
    *
    * @param path
    * @param arrayFn
    * @param routesOptions requireAuth default is true
    */
   public static get(path: string, arrayFn: Array<RequestHandler>, routesOptions?: OptionsRoutes) {
      CustomRouter.routerHandle(requestMethodEnum.get, path, arrayFn, routesOptions);
   }
   /**
    *
    * @param path
    * @param arrayFn
    * @param routesOptions requireAuth default is true
    */
   public static post(path: string, arrayFn: Array<RequestHandler>, routesOptions?: OptionsRoutes) {
      CustomRouter.routerHandle(requestMethodEnum.post, path, arrayFn, routesOptions);
   }
   /**
    *
    * @param path
    * @param arrayFn
    * @param routesOptions requireAuth default is true
    */
   public static put(path: string, arrayFn: Array<RequestHandler>, routesOptions?: OptionsRoutes) {
      CustomRouter.routerHandle(requestMethodEnum.put, path, arrayFn, routesOptions);
   }
   /**
    *
    * @param path
    * @param arrayFn
    * @param routesOptions requireAuth default is true
    */
   public static patch(path: string, arrayFn: Array<RequestHandler>, routesOptions?: OptionsRoutes) {
      CustomRouter.routerHandle(requestMethodEnum.patch, path, arrayFn, routesOptions);
   }
   /**
    *
    * @param path
    * @param arrayFn
    * @param routesOptions requireAuth default is true
    */
   public static delete(path: string, arrayFn: Array<RequestHandler>, routesOptions?: OptionsRoutes) {
      CustomRouter.routerHandle(requestMethodEnum.delete, path, arrayFn, routesOptions);
   }
   /**
    *
    * @param path
    * @param arrayFn
    * @param routesOptions requireAuth default is true
    */
   public static use(
      path: string | null,
      arrayFn: Array<RequestHandler> | RequestHandler,
      routesOptions: OptionsRoutes
   ) {
      CustomRouter.routerHandle(requestMethodEnum.use, path, arrayFn, routesOptions);
   }

   /**
    *
    * @param method get | post | patch | put | delete | use
    * @param path path string
    * @param arrayFn An array of function RequestHandler, the last element of the array is the endpoint
    * @param routesOptions Default value roles: Pass all roles, requireAuth: true -> Required accesstoken
    *
    * @returns void
    * @note If routesOptions have requireAuth: false then all other options have no effect
    *
    */
   private static routerHandle(
      method: requestOptions,
      path: string,
      arrayFn: Array<RequestHandler> | RequestHandler,
      routesOptions: OptionsRoutes
   ) {
      if (!Array.isArray(arrayFn)) {
         arrayFn = [arrayFn];
      }
      const optionsApply = {
         //default options value
         roles: rolesArray,
         requireAuth: true,
         ...routesOptions,
      };
      if (optionsApply.requireAuth) {
         if (optionsApply.roles || optionsApply.preventRoles) {
            const authMiddle = Auth.verifyRoles(optionsApply.roles, optionsApply.preventRoles);
            arrayFn.unshift(authMiddle);
         }
         //First check
         arrayFn.unshift(Auth.verifyAccessToken);
      }
      if (!path && method === requestMethodEnum.use) {
         router[method](arrayFn);
         return;
      }
      if (path) {
         router[method](path, arrayFn);
         return;
      }
   }
}

export { CustomRouter, router };
