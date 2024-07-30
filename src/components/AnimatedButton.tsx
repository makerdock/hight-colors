import React, { ReactNode } from 'react';

interface AnimatedButtonProps {
    children: ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children }) => {
    return (
        <button className="relative w-full inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xl font-semibold text-black rounded-full group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 rounded-full"></span>
            <span className="absolute animate-spin-slow inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 rounded-full"></span>
            <span className="relative font-semibold tracking-wider w-full px-5 py-2 transition-all ease-in duration-75 bg-white rounded-full group-hover:bg-opacity-0 group-hover:text-white">
                {children}
            </span>
        </button>
    );
};

export default AnimatedButton;