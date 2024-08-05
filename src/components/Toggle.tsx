import React from 'react';

interface ToggleProps {
    isOn: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle, disabled = false }) => {
    return (
        <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={isOn}
                    onChange={onToggle}
                    disabled={disabled}
                />
                <div
                    className={`w-10 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${isOn ? 'bg-black' : 'bg-slate-400'
                        } ${disabled ? 'opacity-50' : ''}`}
                >
                    <div
                        className={`absolute w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-5 bg-white' : 'translate-x-1 bg-white'
                            }`}
                        style={{ top: '0.25rem' }}
                    ></div>
                </div>
            </div>
        </label>
    );
};

export default Toggle;