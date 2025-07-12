export const publicRoutes = [
    "/",
    "/auth/new-verification"
]

export const authRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/reset',
    '/auth/new-password'
]
//prefix for api auth routes
//routes with these prefix are used for API
export const apiAuthPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT  = '/dashboard'