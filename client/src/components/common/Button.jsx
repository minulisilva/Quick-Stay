import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';

const Button = ({ children, onClick, className, variant = 'primary', to, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 uppercase tracking-widest text-sm font-medium transition-all duration-300 ease-in-out border";

    const variants = {
        primary: "bg-primary border-primary text-white hover:bg-white hover:text-primary",
        secondary: "bg-transparent border-white text-white hover:bg-white hover:text-primary",
        outline: "bg-transparent border-primary text-primary hover:bg-primary hover:text-white",
        dark: "bg-secondary border-secondary text-white hover:bg-primary hover:border-primary",
    };

    const combinedClassName = twMerge(baseStyles, variants[variant], className);

    if (to) {
        return (
            <Link to={to} className={combinedClassName} {...props}>
                {children}
            </Link>
        )
    }

    return (
        <button
            className={combinedClassName}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
