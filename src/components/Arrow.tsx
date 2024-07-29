import React from 'react';

interface ArrowProps {
    color: string;
    gradientColor1?: string | null;
    gradientColor2?: string | null;
}

const Arrow: React.FC<ArrowProps> = ({ color, gradientColor1, gradientColor2 }) => {
    return (
        <div className="flex justify-center items-center">
            <div className="bg-white">
                <svg width="400" height="400" viewBox="0 0 2500 2500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="2500" height="2500" fill="white" />
                    <defs>
                        {gradientColor1 && gradientColor2 && (
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={gradientColor1} />
                                <stop offset="100%" stopColor={gradientColor2} />
                            </linearGradient>
                        )}
                    </defs>
                    <path
                        d="M1248 651L688 1210L855.5 1375.5L1129.5 1100.5L1129.68 1850H1372.5V1100.5L1648 1375.5L1812 1210L1253 651H1248Z"
                        fill={gradientColor1 && gradientColor2 ? "url(#gradient)" : color}
                    />
                </svg>
            </div>
        </div>
    );
};

export default Arrow;