import React, { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              "block w-full rounded-lg shadow-sm transition-all duration-200 outline-none",
              "border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 sm:text-sm py-2 px-3",
              "disabled:bg-gray-50 disabled:text-gray-500",
              error 
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-200" 
                : "hover:border-gray-400",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'