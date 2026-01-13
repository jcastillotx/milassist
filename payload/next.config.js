import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: false,
  },
  images: {
    domains: [
      'localhost',
      's3.amazonaws.com',
      // Add your S3 bucket domain here
    ],
  },
}

export default withPayload(nextConfig)
