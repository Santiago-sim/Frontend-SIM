import React from 'react';

const Virgula = ({ color = 'gray' }) => {
    return (
        <div className="relative flex items-center justify-center max-w-4xl mx-auto my-0 px-4">
            {/* Left Line */}
            <div className="flex-grow h-px bg-gray-200"></div>

            {/* Icon Container */}
            <div className="mx-2 sm:mx-3">
                <img
                    src="/virgula.svg"
                    alt="Decorative Icon"
                    style={{ filter: `opacity(0.5) grayscale(100%) brightness(0) invert(${color === 'gray' ? '0' : '1'})`, color: color }}
                    className="w-6 sm:w-8 h-auto"
                />
            </div>

            {/* Right Line */}
            <div className="flex-grow h-px bg-gray-200"></div>
        </div>
    );
};

export default Virgula;