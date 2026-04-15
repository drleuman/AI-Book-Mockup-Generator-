import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const ButtonSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const Button: React.FC<ButtonProps> = ({ children, disabled, variant = 'primary', isLoading = false, className, ...props }) => {
    const baseClasses = 'w-full flex justify-center items-center py-4 px-6 border-0 text-[11px] font-bold tracking-[0.2em] uppercase transition-monolith focus:outline-none focus:ring-1 focus:ring-monolith-signal focus:ring-offset-0 disabled:cursor-not-allowed';
  
    const isDisabled = disabled || isLoading;

    const variantClasses = {
        primary: `${isDisabled ? 'bg-monolith-border text-monolith-text-muted' : 'bg-monolith-signal text-white hover:bg-red-800' }`,
        secondary: `${isDisabled ? 'bg-monolith-border text-monolith-text-muted' : 'bg-monolith-border text-monolith-text-primary hover:bg-monolith-signal hover:text-white border border-monolith-border transition-monolith'}`,
        danger: `${isDisabled ? 'bg-monolith-border text-monolith-text-muted' : 'bg-transparent text-monolith-signal border border-monolith-signal hover:bg-monolith-signal hover:text-white'}`,
    };

    return (
        <button
        {...props}
        disabled={isDisabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
        >
        {isLoading && <ButtonSpinner />}
        <span className="relative top-[0.5px]">{children}</span>
        </button>
    );
};

export default Button;