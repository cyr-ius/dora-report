import Typography from '@mui/material/Typography';
import { RichDescription } from '@rjsf/core';
import type { DescriptionFieldProps, FormContextType, RJSFSchema, StrictRJSFSchema, TranslatableString } from '@rjsf/utils';

/** The `DescriptionField` is the template to use to render the description of a field
 *
 * @param props - The `DescriptionFieldProps` for this component
 */
export default function DescriptionFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: DescriptionFieldProps<T, S, F>) {
  const { id, description, registry, uiSchema } = props;
  const { translateString } = registry;
  if (description) {
    return (
      <Typography id={id} variant='subtitle2' style={{ marginTop: '5px' }}>
        <RichDescription description={translateString('%1' as TranslatableString , [description as string])} registry={registry} uiSchema={uiSchema} />
      </Typography>
    );
  }
  return null;
}
