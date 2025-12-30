import React, { ReactNode } from 'react';

// FIX: Extended props with React.HTMLAttributes<HTMLDivElement> to allow passing standard element attributes like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        // FIX: Spread additional props to the div element.
        <div className={`bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg dark:border dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-xl ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;