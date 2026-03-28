import React from 'react';
import { useFormContext, Controller, FieldPath, RegisterOptions } from 'react-hook-form';
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
  className?: string; // Added className prop
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
  className = '', // Default to empty string
}: FormFieldProps<T>) {
  const { control, formState: { errors } } = useFormContext();

  /**
   * Professional Tip: Using a helper to find errors in nested paths.
   * This ensures 'product.details.price' returns the correct error object.
   */
  const getNestedError = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const error = getNestedError(errors, name as string);

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