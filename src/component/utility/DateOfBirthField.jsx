import { DatePicker } from "@mui/x-date-pickers/DatePicker";

/**
 * Converts a Date object to the "YYYY-MM-DD" string format used by the backend.
 * Returns "" for null/invalid input so the API receives a clean value.
 */
const formatToApi = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const DateOfBirthField = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  name = "dateOfBirth",
}) => {
  const dateValue = value ? new Date(value) : null;

  return (
    <DatePicker
      label="Date of Birth"
      value={dateValue}
      onChange={(newValue) => onChange(name, formatToApi(newValue))}
      slotProps={{
        textField: {
          fullWidth: true,
          margin: "normal",
          name,
          error,
          helperText,
          onBlur: onBlur ? (e) => onBlur(e) : undefined,
          sx: {
            "& .MuiInputBase-input": { fontSize: 18 },
            "& .MuiInputLabel-root": { fontSize: 16 },
            "& .MuiFormHelperText-root": { fontSize: 15 },
          },
        },
      }}
    />
  );
};

export default DateOfBirthField;