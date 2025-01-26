import { APP_ROLES } from "./AppRoles";
/** 
 * Contains the base of the route for many routes. 
 * */
const BASE_ROUTES = {
    auth: 'auth',
    user: 'user'
};
/**
 * 
 * @param route Route to be followed.
 * @param roles Roles needed to be able to see the route.
 * @returns A route object that will be used in the APP_ROUTES object.
 */
const createRoute = (route: string, roles: string[] = []) => {
    return {
        route,
        roles,
    };
};
/**
 * Contains routes to be used throughout the web application.
 */
export const APP_ROUTES: any = {
    main: {
        home: createRoute(``, [APP_ROLES.admin, APP_ROLES.manager, APP_ROLES.user]),
        notFound: createRoute(`not-found`), 
    },
    auth: {
        login: createRoute(`${BASE_ROUTES.auth}/login`),
        recoverPassword: createRoute(`${BASE_ROUTES.auth}/recover-password`),
        signup: createRoute(`${BASE_ROUTES.auth}/signup`),
        search: createRoute(`${BASE_ROUTES.auth}/search`, [APP_ROLES.admin]),
        update: createRoute(`${BASE_ROUTES.auth}/update`, [APP_ROLES.admin, APP_ROLES.user, APP_ROLES.manager]),
        updateAny: createRoute(`${BASE_ROUTES.auth}/update/:id`, [APP_ROLES.admin]),
        view: createRoute(`${BASE_ROUTES.auth}/view/:id`, [APP_ROLES.admin]),
        confirmEmail: createRoute(`${BASE_ROUTES.auth}/confirm/:code`),
    },
    user: {
        me: createRoute(`${BASE_ROUTES.user}/me`, [APP_ROLES.admin, APP_ROLES.manager, APP_ROLES.user]),
    },
};
/**
 * Object with the links to be used in router-link
 */
export const APP_HYPERLINKS = {
    main:{
        home: '',
        notFound: 'not-found',
    },
    auth: {
        update: (id?: string) => `/${BASE_ROUTES.auth}/update${id ? `/${id}` : ''}`,
        signup: `/${BASE_ROUTES.auth}/signup`,
        login: `/${BASE_ROUTES.auth}/login`,
        search: `/${BASE_ROUTES.auth}/search`,
        view: (id: string) => `/${BASE_ROUTES.auth}/view/${id}`,
    },
}
