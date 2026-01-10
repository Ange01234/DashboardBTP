import React from 'react';

export default function Spinner({ className = "" }: { className?: string }) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200/50 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent shadow-lg shadow-primary-600/20 backdrop-blur-sm"></div>
            </div>
        </div>
    );
}
