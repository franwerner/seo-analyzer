/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        console.log(process.env.BACKEND_URL)
        const backendUrl = process.env.BACKEND_URL;
        if (!backendUrl) throw new Error("BACKEND_URL no está definida");

        return [
            {
                source: "/backend/:path*",
                destination: `${backendUrl}/:path*`,
                basePath: false
            },
        ];
    },
};

export default nextConfig;