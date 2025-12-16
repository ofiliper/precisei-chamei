/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
const nextConfig = {
    reactStrictMode: false,
};

export default withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
})(nextConfig);