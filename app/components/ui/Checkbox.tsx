import React, { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const checkId = id || props.name

    return (
      <div className="flex items-start gap-3">
        <div className="flex h-6 items-center">
          <input
            id={checkId}
            ref={ref}
            type="checkbox"
            className={clsx(
              "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 transition duration-150 ease-in-out cursor-pointer",
              className
            )}
            {...props}
          />
        </div>
        <div className="text-sm leading-6">
          <label htmlFor={checkId} className="font-medium text-gray-900 cursor-pointer select-none">
            {label}
          </label>
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'