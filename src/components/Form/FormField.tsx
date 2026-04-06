import React from 'react';
import { useFormContext, Controller, FieldPath, RegisterOptions, FieldError } from 'react-hook-form';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';

type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormFieldProps<T extends FieldPath<any>> {
  name: T;
  label: string;
  type?: FieldType;
  placeholder?: string;
  helperText?: string;
  rules?: RegisterOptions;
  options?: SelectOption[];
  charLimit?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function FormField<T extends FieldPath<any>>({
  name,
  label,
  type = 'text',
  placeholder,
  helperText,
  rules,
  options = [],
  charLimit,
  icon,
  disabled = false,
  required = false,
  className = '',
}: FormFieldProps<T>) {
  const { control, formState: { errors } } = useFormContext();

  // Helper to find errors in nested paths (e.g., variants.0.price)
  const getNestedError = (obj: unknown, path: string): FieldError | undefined => {
    const result = path.split('.').reduce((acc: unknown, part) => (acc instanceof Object ? (acc as Record<string, unknown>)[part] : undefined), obj);
    return (result as FieldError) || undefined;
  };

  const error: FieldError | undefined = getNestedError(errors, name as string);

  return (
    <div className={className}>
      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? `${label} is required` : false,
          ...rules,
        }}
        render={({ field }) => {
          // CASE 1: Dropdown Select
          if (type === 'select') {
            return (
              <Select
                {...field}
                label={label}
                error={error}
                helperText={helperText}
                options={options}
                disabled={disabled}
                required={required}
              />
            );
          }

          // CASE 2: Multi-line Text
          if (type === 'textarea') {
            return (
              <TextArea
                {...field}
                label={label}
                error={error}
                helperText={helperText}
                charLimit={charLimit}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
              />
            );
          }

          // CASE 3: Checkbox (The specific fix for your issue)
          if (type === 'checkbox') {
            return (
              <div className="space-y-1">
                <div className="flex items-start gap-3 py-2">
                  <div className="flex h-5 items-center">
                    <input
                      id={name}
                      type="checkbox"
                      // Use 'checked' instead of 'value' for booleans
                      checked={!!field.value}
                      // Pass the boolean state to React Hook Form
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                    />
                  </div>
                  <div className="text-sm leading-5">
                    <label htmlFor={name} className="font-medium text-slate-700 cursor-pointer">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {helperText && (
                      <p className="text-slate-500 text-xs mt-0.5">{helperText}</p>
                    )}
                  </div>
                </div>
                {error && (
                  <p className="text-xs text-red-500 font-medium">{(error as any)?.message}</p>
                )}
              </div>
            );
          }

          // CASE 4: Standard Inputs (text, email, password, number)
          return (
            <Input
              {...field}
              type={type}
              label={label}
              error={error}
              helperText={helperText}
              placeholder={placeholder}
              icon={icon}
              disabled={disabled}
              required={required}
            />
          );
        }}
      />
    </div>
  );
}