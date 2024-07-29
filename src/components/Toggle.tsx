// components/Toggle.tsx
import React from 'react';

interface ToggleProps {
    isOn: boolean;
    onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={isOn} onChange={onToggle} />
                <div className={`w-10 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${isOn ? 'bg-white' : 'bg-gray-600'}`}>
                    <div
                        className={`absolute w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-5 bg-black' : 'translate-x-1 bg-white'
                            }`}
                        style={{ top: '0.25rem' }}
                    ></div>
                </div>
            </div>
        </label>
    );
};

export default Toggle;