import { RequestHandler, Router } from 'express';
import { OptionsRoutes } from '../../commons/interfaces/optionsRoutes';
import Auth from '../../middlewares/auth.middleware';

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
    * @param routesOptions
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
   public static put(path: string, arrayFn: Array<RequestHandler>, routesOptions?: OptionsRoutes) {
      CustomRouter.routerHandle(requestMethodEnum.put, path, arrayFn, routesOptions);
   }
   public static patch(
      path: string,
      arrayFn: Array<RequestHandler>,
      routesOptions?: OptionsRoutes
   ) {
      CustomRouter.routerHandle(requestMethodEnum.patch, path, arrayFn, routesOptions);
   }
   public static delete(
      path: string,
      arrayFn: Array<RequestHandler>,
      routesOptions?: OptionsRoutes
   ) {
      CustomRouter.routerHandle(requestMethodEnum.delete, path, arrayFn, routesOptions);
   }

   public static use(
      path: string | null,
      arrayFn: Array<RequestHandler> | RequestHandler,
      routesOptions: OptionsRoutes
   ) {
      CustomRouter.routerHandle(requestMethodEnum.use, path, arrayFn, routesOptions);
   }

   private static routerHandle(
      method: requestOptions,
      path: string,
      arrayFn: Array<RequestHandler> | RequestHandler,
      routesOptions: OptionsRoutes
   ) {
      if (!Array.isArray(arrayFn)) {
         arrayFn = [arrayFn];
      }
      if (!routesOptions) {
         routesOptions = {
            requireAuth: true,
         };
      }
      if (routesOptions.requireAuth) {
         //First check
         if (routesOptions.roles || routesOptions.preventRoles) {
            const authMiddle = Auth.verifyRoles(routesOptions.roles, routesOptions.preventRoles);
            arrayFn.unshift(authMiddle);
         }
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
