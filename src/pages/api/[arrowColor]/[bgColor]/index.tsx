import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: NextRequest) {
    const { pathname } = new URL(req.url);

    // Extract color parameters from the URL path
    const [, , arrowColor, bgColor] = pathname.split('/');

    // Decode the color values (they might be URL-encoded)
    const decodedArrowColor = decodeURIComponent(arrowColor || '000000');
    const decodedBgColor = decodeURIComponent(bgColor || 'FFFFFF');

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `#${decodedBgColor}`,
                }}
            >
                <svg width="500" height="500" viewBox="0 0 2500 2500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="2500" height="2500" fill={`#${decodedBgColor}`} />
                    <path
                        d="M1248 651L688 1210L855.5 1375.5L1129.5 1100.5L1129.68 1850H1372.5V1100.5L1648 1375.5L1812 1210L1253 651H1248Z"
                        fill={`#${decodedArrowColor}`}
                    />
                </svg>
            </div>
        ) as React.ReactElement,
        {
            width: 1200,
            height: 630,
        }
    );
}