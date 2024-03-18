/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname:
                    "prod-dp-digital-lessons-authoring-backend-media.s3.amazonaws.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.digital.greatminds.org",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
