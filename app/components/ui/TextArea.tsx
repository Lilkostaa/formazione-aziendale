import React, { TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId} 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <textarea
          id={textareaId}
          ref={ref}
          className={clsx(
            "block w-full rounded-lg shadow-sm transition-all duration-200 outline-none",
            "border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 sm:text-sm py-2 px-3",
            "min-h-[100px] resize-y",
            error 
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-200" 
              : "hover:border-gray-400",
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'