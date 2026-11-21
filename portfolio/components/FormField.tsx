import type { ChangeEvent } from "react";

export const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/25";

type FormFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: "text" | "email" | "date";
  rows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
};

export default function FormField({
  id,
  label,
  name,
  type = "text",
  rows,
  value,
  defaultValue,
  onChange,
  error,
}: FormFieldProps) {
  const sharedProps = {
    id,
    name,
    className: inputClasses,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {rows ? (
        <textarea
          {...sharedProps}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
