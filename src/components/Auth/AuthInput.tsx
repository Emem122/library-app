import { ChangeEvent } from 'react';

type InputFieldsProps = {
  label: string;
  type: string;
  required: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function AuthInput({
  label,
  type,
  required,
  value,
  onChange,
}: InputFieldsProps) {
  return (
    <>
      <label className="text-sm mb-1 text-slate-500" htmlFor={label}>
        {label}
      </label>
      <input
        type={type}
        required={required ? true : false}
        id={label}
        name={label}
        className="mb-4 border rounded-sm w-full p-1"
        value={value}
        onChange={onChange}
      />
    </>
  );
}
