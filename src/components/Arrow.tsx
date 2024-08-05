import classNames from 'classnames';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion'
interface ArrowProps {
    // backgroundColor?: string;
    bgMode: boolean
    invertMode: boolean
    primaryColor?: string;
    secondaryColor?: string;
}

const Arrow: React.FC<ArrowProps> = ({ primaryColor, secondaryColor, bgMode, invertMode }) => {
    secondaryColor = secondaryColor || primaryColor
    // const fallbackColor = invertMode ? 'black' : 'white'
    const fallbackColor = 'transparent'

    return (
        <motion.svg
            animate={{ y: primaryColor ? 0 : "100%" }}
            initial={{ y: "100%" }}
            transition={{ ease: "easeInOut", duration: .3 }}
            className={classNames(
                "h-full w-full",
            )} viewBox="0 0 2500 2500" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <rect className='transition duration-300' width="2500" height="2500" fill={bgMode ? 'url(#gradient)' : fallbackColor} />
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={primaryColor} />
                    <stop offset="100%" stopColor={secondaryColor} />
                </linearGradient>
            </defs>
            <path
                d="M1248 651L688 1210L855.5 1375.5L1129.5 1100.5L1129.68 1850H1372.5V1100.5L1648 1375.5L1812 1210L1253 651H1248Z"
                className='transition duration-300'
                fill={!bgMode ? "url(#gradient)" : fallbackColor}
            />
        </motion.svg>
    );
};

export default Arrow;