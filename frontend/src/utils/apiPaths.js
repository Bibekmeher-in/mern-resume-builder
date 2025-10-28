export const API_BASE_URL = "http://localhost:4000";

// Routes used in frontend
export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        GET_PROFILE: '/api/auth/profile',
    },
    RESUME: {
        CREATE: '/api/resume',
        GET_ALL: '/api/resume',
        GET_BY_ID: (id) => `/api/resume/${id}`,
        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload.images`,
    },
    IMAGE: {
        UPLOAD_IMAGE: '/api/auth/upload-image',
    },
};

export default API_PATHS;
