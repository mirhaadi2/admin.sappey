import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormField } from "@/components/Form/FormField";
import { Button } from "@/components";

export type UserFormValues = {
  email: string;
  name: string;
  phone?: string;
  status?: "active" | "banned";
};

interface UserFormProps {
  title?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  defaultValues?: Partial<UserFormValues>;
  isEdit?: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => void;
}

export function UserForm({
  title = "User Details",
  submitLabel = "Save User",
  isSubmitting = false,
  defaultValues = {},
  isEdit = false,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const formMethods = useForm<UserFormValues>({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      status: "active",
      ...defaultValues,
    },
    shouldUnregister: true,
  });

  const { handleSubmit, reset, formState } = formMethods;

  React.useEffect(() => {
    if (formState.isDirty) return;

    const mergedValues = {
      email: "",
      name: "",
      phone: "",
      status: "active",
      ...defaultValues,
    } as UserFormValues;

    reset(mergedValues);
  }, [defaultValues, reset, formState.isDirty]);

  const onFormSubmit = (values: UserFormValues) => {
    onSubmit(values);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            required
            disabled={isEdit}
            placeholder="user@example.com"
          />
          <FormField
            label="Name"
            name="name"
            required
            placeholder="Full name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Phone"
            name="phone"
            placeholder="Phone number"
          />
          <FormField
            label="Status"
            name="status"
            type="select"
            options={[
              { label: "Active", value: "active" },
              { label: "Banned", value: "banned" },
            ]}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}