import { TranslatableString, englishStringTranslator, replaceStringParameters } from '@rjsf/utils';
import { useTranslation } from 'react-i18next';

export const translateString = (stringToTranslate: TranslatableString, params?: string[]): string => {
    const {t} = useTranslation()
    switch (stringToTranslate) {
        case TranslatableString.NewStringDefault:
            return ''; // Use an empty string for the new additionalProperties string default value
        case TranslatableString.KeyLabel:
            params = params?.map((item)=> t(item))
            return t(replaceStringParameters('%1 Key', params)); // Add "Name" onto the end of the WrapIfAdditionalTemplate key label
        default:
            return t(englishStringTranslator(stringToTranslate, params));
    }
}
