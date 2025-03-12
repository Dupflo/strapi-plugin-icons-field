import { Box, Field, SingleSelect, SingleSelectOption, Typography } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { PLUGIN_ID } from '../pluginId';
import Icon from './Icon';

interface Icon {
  name: string;
  svg: string;
}

type Output = 'name' | 'svg';

interface IconSelectProps {
  label: string;
  placeholder: string;
  unique: boolean;
  type: 'text';
  initialValue: null;
  attribute: {
    type: 'text';
    options: {
      output: Output;
      selection: string[];
    };
  };
  customField: 'plugin::icons-field.icon';
  disabled?: boolean;
  error?: string;
  intlLabel: { id: string; defaultMessage: string };
  labelAction?: React.ReactNode;
  name: string;
  onChange: (event: { target: { name: string; value: string; type: string } }) => void;
  required?: boolean;
  value?: string;
  hint?: string;
}

const IconSelect: React.FC<IconSelectProps> = (props) => {
  const { label, attribute, placeholder, disabled, error, name, hint, onChange, required, value } =
    props;

  const { formatMessage } = useIntl();
  const [icons, setIcons] = useState<Icon[]>([]);

  const { get } = useFetchClient();

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const { data } = await get(`/${PLUGIN_ID}/icons`);
        if (!data) return;

        if (!attribute?.options?.selection) {
          setIcons(data);
          return;
        }

        const { selection } = attribute.options;

        if (Array.isArray(selection) && selection.length > 0 && selection[0] !== '') {
          setIcons(data.filter((icon: Icon) => selection.includes(icon.name)));
        } else {
          setIcons(data);
        }
      } catch (error) {
        console.error('Error fetching icons:', error);
      }
    };

    fetchIcons();
  }, []);

  const handleChange = (value: string) => {
    onChange({ target: { name, value, type: attribute.type } });
  };

  const icon = useMemo(
    () => icons.find((i) => i[attribute.options.output] === value)?.svg,
    [value, icons]
  );

  return (
    <Field.Root error={error} hint={hint}>
      <Field.Label>{label}</Field.Label>
      <SingleSelect
        aria-label={label}
        startIcon={<Icon icon={icon} style={{ height: '24px' }} />}
        required={required}
        placeholder={placeholder}
        clearLabel={formatMessage({ id: 'clearLabel', defaultMessage: 'Clear' })}
        disabled={disabled}
        error={error}
        onClear={() => handleChange('')}
        onChange={(value: any) => {
          handleChange(value);
        }}
        value={value}
      >
        {icons.map((icon) => (
          <SingleSelectOption
            key={icon.name}
            startIcon={<Icon icon={icon.svg} style={{ height: '24px' }} />}
            value={icon[attribute.options.output]}
          >
            <Box paddingLeft={2} paddingRight={2}>
              <Typography>{icon.name}</Typography>
            </Box>
          </SingleSelectOption>
        ))}
      </SingleSelect>
      <Field.Hint />
    </Field.Root>
  );
};

export default IconSelect;
