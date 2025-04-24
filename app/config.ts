

const buildConfig = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
        baseUrl
    }
}

export const config = buildConfig();