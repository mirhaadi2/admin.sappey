import React from 'react';
import { useFormContext, Controller, FieldPath, RegisterOptions } from 'react-hook-form';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';

type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';

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
}: FormFieldProps<T>) {
  const { control, formState: { errors } } = useFormContext();
  const error = (errors as any)[name];

  return (
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
  );
}
