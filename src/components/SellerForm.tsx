import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormField } from "@/components/Form/FormField";
import { Button } from "@/components";

export type SellerFormValues = {
  email: string;
  name: string;
  businessName: string;
  businessLicense: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

interface SellerFormProps {
  title?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  defaultValues?: Partial<SellerFormValues>;
  isEdit?: boolean;
  onCancel: () => void;
  onSubmit: (values: SellerFormValues) => void;
}

export function SellerForm({
  title = "Seller Details",
  submitLabel = "Save Seller",
  isSubmitting = false,
  defaultValues = {},
  isEdit = false,
  onCancel,
  onSubmit,
}: SellerFormProps) {
  const formMethods = useForm<SellerFormValues>({
    defaultValues: {
      email: "",
      name: "",
      businessName: "",
      businessLicense: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      ...defaultValues,
    },
  });

  const { handleSubmit, reset, formState } = formMethods;

  React.useEffect(() => {
    if (!formState.isDirty) {
      reset({
        email: "",
        name: "",
        businessName: "",
        businessLicense: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        ...defaultValues,
      });
    }
  }, [defaultValues, reset, formState.isDirty]);

  const onFormSubmit = (values: SellerFormValues) => {
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
            placeholder="seller@example.com"
          />
          <FormField
            label="Business Name"
            name="businessName"
            required
            placeholder="Business name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Owner Name"
            name="name"
            required
            placeholder="Full name"
          />
          <FormField
            label="Business License"
            name="businessLicense"
            required
            placeholder="Business registration number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Phone"
            name="phone"
            placeholder="Phone number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="City"
            name="city"
            placeholder="City"
          />
          <FormField
            label="State"
            name="state"
            placeholder="State"
          />
          <FormField
            label="Zip Code"
            name="zipCode"
            placeholder="Zip code"
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