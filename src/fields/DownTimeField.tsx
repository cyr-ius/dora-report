import { Grid, TextField, Typography } from "@mui/material";
import {
  getUiOptions,
  TranslatableString,
  type FieldProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from "@rjsf/utils";

type Duration = {
  days: number;
  hours: number;
  minutes: number;
};

export default function DownTimeField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: FieldProps<T, S, F>) {
  const {
    children,
    disabled,
    required,
    readonly,
    description,
    name,
    title,
    classNames,
    style,
    id,
    formData,
    onChange,
    uiSchema,
    schema,
    registry,
  } = props;
  const { translateString } = registry;
  const options = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
  const { title: uiTitle } = options;
  const fieldTitle = uiTitle || title || name;

  let value: Duration = { days: 0, hours: 0, minutes: 0 };
  if (typeof formData === "string") {
    const [days, hours, minutes] = formData.split(":").map(Number);
    value = {
      days: days || 0,
      hours: hours || 0,
      minutes: minutes || 0,
    };
  }

  const handleChange =
    (key: keyof Duration) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseInt(e.target.value || "0", 10);
      const newValue = { ...value, [key]: Math.max(0, raw) };
      if (key === "hours") newValue.hours = Math.min(23, newValue.hours);
      if (key === "minutes") newValue.minutes = Math.min(59, newValue.minutes);

      const pad = (n: number) => n.toString().padStart(2, "0");
      const serviceDowntime = `${newValue.days}:${pad(newValue.hours)}:${pad(
        newValue.minutes
      )}`;
      onChange(serviceDowntime as T);
    };

  return (
    <Grid
      container
      key={`${id}-key`}
      alignItems="center"
      spacing={2}
      className={classNames}
      style={style}
      display={disabled ? "none" : "flex"}
    >
      <Grid size={4}>
        <TextField
          label={translateString("%1" as TranslatableString, [fieldTitle])}
          type="number"
          value={value.days}
          disabled={disabled || readonly}
          onChange={handleChange("days")}
          required={required}
          slotProps={{
            inputLabel: { style: { overflow: "unset" } },
            htmlInput: { pattern: "[0-9]{1,3}", min: 0, maxLength: 3 },
          }}
          fullWidth={true}
        />
      </Grid>
      <Grid size={4}>
        <TextField
          label=" "
          type="number"
          value={value.hours}
          disabled={disabled || readonly}
          onChange={handleChange("hours")}
          required={required}
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              pattern: "[0-3]*",
              maxLength: 2,
              min: 0,
              max: 23,
            },
          }}
          fullWidth={true}
        />
      </Grid>
      <Grid size={4}>
        <TextField
          label=" "
          type="number"
          value={value.minutes}
          disabled={disabled || readonly}
          onChange={handleChange("minutes")}
          required={required}
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              pattern: "[0-5]*",
              maxLength: 2,
              min: 0,
              max: 59,
            },
          }}
          fullWidth={true}
        />
      </Grid>
      <Grid size="auto" style={{ marginTop: "-11px" }}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          style={{ display: "block ruby" }}
        >
          {translateString("%1" as TranslatableString, [
            schema.description as string,
          ])}
        </Typography>
      </Grid>
      {description}
      {children}
    </Grid>
  );
}
