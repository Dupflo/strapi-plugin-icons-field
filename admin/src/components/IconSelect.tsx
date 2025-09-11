import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Modal, SingleSelect } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../pluginId';
import Icon from './Icon';
import { useTheme } from 'styled-components';
import { Cross, CaretDown } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Field } from '@strapi/design-system';

type IconSelectProps = {
  label: string;
  hint: string;
  attribute: any;
  description: any;
  disabled: boolean;
  error: any;
  intlLabel: any;
  name: string;
  onChange: (event: { target: { name: string; value: string; type: string } }) => void;
  placeholder: any;
  required: boolean;
  value: string;
};

const IconSelect = (props: IconSelectProps) => {
  const theme = useTheme() as any;
  const intl = useIntl();

  const {
    label,
    hint,
    attribute,
    description,
    disabled,
    error,
    intlLabel,
    name,
    onChange,
    placeholder,
    required,
    value,
  } = props;

  const [icons, setIcons] = useState<
    Array<{ folder: string; icons: Array<{ name: string; svg: string }> }>
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { get } = useFetchClient();

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        let url = `/${PLUGIN_ID}/icons`;
        if (attribute?.options?.selection) {
          if (Array.isArray(attribute.options.selection)) {
            url += `?selection=${encodeURIComponent(attribute.options.selection.join(','))}`;
          } else {
            url += `?selection=${encodeURIComponent(attribute.options.selection)}`;
          }
        }
        const { data } = await get(url);
        setIcons(data || []);
      } catch (error) {
        console.error('Error fetching icons:', error);
      }
    };
    fetchIcons();
  }, [attribute?.options?.selection]);

  const handleChange = (value: string) => {
    onChange({ target: { name, value, type: attribute.type } });
  };

  const allIcons = useMemo(() => icons.flatMap((group) => group.icons), [icons]);

  const selectedIcon = useMemo(() => {
    for (const icon of allIcons) {
      if (icon.svg === value) {
        return icon.svg;
      }
    }
    return undefined;
  }, [value, allIcons]);

  const handleUnselectedIcon = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange({ target: { name, value: '', type: attribute.type } });
  };

  console.log(props);

  return (
    <Field.Root error={error} hint={hint}>
      <Field.Label>{label}</Field.Label>
      <Modal.Root
        labelledBy="icon-select-modal-title"
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <Modal.Trigger>
          <Box
            display="flex"
            style={{ alignItems: 'center', gap: '12px', position: 'relative', width: '100%' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Button
                variant="tertiary"
                disabled={disabled}
                style={{
                  gap: '8px',
                  height: '42px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {selectedIcon ? (
                    <>
                      <Icon icon={selectedIcon} style={{ height: '24px', display: 'block' }} />
                      <Typography variant="pi">
                        {(() => {
                          const found = allIcons.find((icon) => icon.svg === selectedIcon);
                          return found ? found.name : 'Unknown icon';
                        })()}
                      </Typography>
                    </>
                  ) : (
                    <Typography style={{ fontWeight: '400' }}>
                      {placeholder ??
                        intl.formatMessage({
                          id: 'icons-field.select',
                          defaultMessage: 'Select an icon',
                        })}
                    </Typography>
                  )}
                  <CaretDown
                    color={theme.colors?.neutral500}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      height: '16px',
                      width: '16px',
                    }}
                  />
                </div>
              </Button>
            </div>
            {selectedIcon && (
              <button
                type="button"
                onClick={handleUnselectedIcon}
                style={{
                  position: 'absolute',
                  right: '44px',
                  height: '16px',
                  width: '16px',
                  cursor: 'pointer',
                  zIndex: 3,
                }}
              >
                <Cross color={theme.colors?.neutral500} style={{ height: '100%', width: '100%' }} />
              </button>
            )}
          </Box>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              {intl.formatMessage({
                id: 'icons-field.modal.title',
                defaultMessage: 'Select an icon',
              })}
            </Typography>
          </Modal.Header>
          <Modal.Body>
            {icons.map((group) => (
              <Box key={group.folder} marginBottom={6}>
                <Typography
                  fontWeight="bold"
                  textColor="neutral800"
                  as="h3"
                  id="title"
                  textTransform="capitalize"
                  marginBottom={2}
                >
                  {group.folder}
                </Typography>
                <Box display="flex" marginTop={2} style={{ flexWrap: 'wrap', gap: 6 }}>
                  {group.icons.map((icon) => (
                    <Box
                      key={icon.name}
                      as="button"
                      type="button"
                      aria-label={icon.name}
                      onClick={() => {
                        handleChange(icon.svg);
                        toggleModal();
                      }}
                      style={{
                        alignItems: 'center',
                        aspectRatio: '1/1',
                        background: 'white',
                        border:
                          value === icon.svg
                            ? `2px solid ${theme.colors?.primary600}`
                            : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        height: '100%',
                        justifyContent: 'center',
                        padding: '12px',
                        width: '85px',
                      }}
                    >
                      <Icon
                        icon={icon.svg}
                        style={{
                          aspectRatio: '1/1',
                          height: '100%',
                          maxWidth: '25px',
                          width: '100%',
                        }}
                      />
                      <Typography variant="pi" fontWeight="bold" style={{ marginTop: 8 }}>
                        {icon.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary">
                {intl.formatMessage({
                  id: 'icons-field.modal.close',
                  defaultMessage: 'Close window',
                })}
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
      <Field.Hint />
    </Field.Root>
  );
};

export default IconSelect;
