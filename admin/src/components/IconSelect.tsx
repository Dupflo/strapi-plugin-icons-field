import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Modal, Searchbar } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../pluginId';
import Icon from './Icon';
import { useTheme } from 'styled-components';
import styled from 'styled-components';
import { Cross, CaretDown } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Field } from '@strapi/design-system';

const ThemeableIcon = styled.span<{ $color: string }>`
  display: contents;
  & > svg {
    fill: ${(p) => p.$color};
  }
  & > svg *[stroke]:not([stroke='none']) {
    stroke: ${(p) => p.$color};
  }
`;

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

  const { label, hint, attribute, disabled, error, name, onChange, placeholder, required, value } =
    props;

  const [icons, setIcons] = useState<
    Array<{ folder: string; icons: Array<{ name: string; svg: string }> }>
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const outputFormat: 'svg' | 'name' = attribute?.options?.outputFormat || 'svg';

  const handleChange = (icon: { name: string; svg: string }) => {
    const storedValue = outputFormat === 'name' ? icon.name : icon.svg;
    onChange({ target: { name, value: storedValue, type: attribute.type } });
  };

  const allIcons = useMemo(() => icons.flatMap((group) => group.icons), [icons]);

  const selectedIconData = useMemo(() => {
    if (!value) return undefined;
    if (outputFormat === 'name') {
      return allIcons.find((icon) => icon.name === value);
    }
    return allIcons.find((icon) => icon.svg === value);
  }, [value, allIcons, outputFormat]);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return icons;
    const query = searchQuery.toLowerCase();
    return icons
      .map((group) => ({
        ...group,
        icons: group.icons.filter((icon) => icon.name.toLowerCase().includes(query)),
      }))
      .filter((group) => group.icons.length > 0);
  }, [icons, searchQuery]);

  const handleUnselectedIcon = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange({ target: { name, value: '', type: attribute.type } });
  };

  return (
    <Field.Root error={error} hint={hint} required={required}>
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
                  {selectedIconData ? (
                    <>
                      <ThemeableIcon $color={theme.colors?.neutral800 || 'currentColor'}>
                        <Icon icon={selectedIconData.svg} style={{ height: '24px', display: 'block' }} />
                      </ThemeableIcon>
                      <Typography variant="pi">{selectedIconData.name}</Typography>
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
            {selectedIconData && (
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
            <Box marginBottom={4}>
              <Searchbar
                name="icon-search"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                clearLabel={intl.formatMessage({
                  id: 'icons-field.modal.search.clear',
                  defaultMessage: 'Clear search',
                })}
                placeholder={intl.formatMessage({
                  id: 'icons-field.modal.search.placeholder',
                  defaultMessage: 'Search icons...',
                })}
              >
                {intl.formatMessage({
                  id: 'icons-field.modal.search.placeholder',
                  defaultMessage: 'Search icons...',
                })}
              </Searchbar>
            </Box>
            {filteredIcons.length === 0 && (
              <Typography textColor="neutral500">
                {intl.formatMessage({
                  id: 'icons-field.modal.search.empty',
                  defaultMessage: 'No icons found.',
                })}
              </Typography>
            )}
            {filteredIcons.map((group) => (
              <Box key={group.folder} marginBottom={6}>
                <Typography
                  fontWeight="bold"
                  textColor="neutral800"
                  as="h3"
                  id="title"
                  marginBottom={2}
                >
                  {group.folder}
                </Typography>
                <Box display="flex" marginTop={2} style={{ flexWrap: 'wrap', gap: 6 }}>
                  {group.icons.map((icon) => {
                    const isSelected = outputFormat === 'name' ? value === icon.name : value === icon.svg;
                    return (
                      <Box
                        key={icon.name}
                        as="button"
                        type="button"
                        aria-label={icon.name}
                        onClick={() => {
                          handleChange(icon);
                          toggleModal();
                        }}
                        style={{
                          alignItems: 'center',
                          aspectRatio: '1/1',
                          background: theme.colors?.neutral0,
                          border: isSelected
                            ? `2px solid ${theme.colors?.primary600}`
                            : `1px solid ${theme.colors?.neutral200}`,
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
                        <ThemeableIcon $color={theme.colors?.neutral800 || 'currentColor'}>
                          <Icon
                            icon={icon.svg}
                            style={{
                              aspectRatio: '1/1',
                              height: '100%',
                              maxWidth: '25px',
                              width: '100%',
                            }}
                          />
                        </ThemeableIcon>
                        {attribute?.options?.showIconLabel && (
                          <Typography variant="pi" fontWeight="bold" textColor="neutral800" style={{ marginTop: 8}}>
                            {icon.name}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
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
