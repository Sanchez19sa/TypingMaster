import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'icon';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
    return (
        <button className={`btn btn--${variant} ${className}`} {...props} />
    );
};

export default Button;

