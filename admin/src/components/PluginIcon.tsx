import { Flex } from '@strapi/design-system';
import { Rocket } from '@strapi/icons';
import { styled } from 'styled-components';

const IconBox = styled(Flex)`
  background-color: #ddfaf2;
  border: 1px solid #87cec5;

  svg > path {
    fill: #19a796;
  }
`;

export const PluginIcon = () => {
  return (
    <IconBox justifyContent="center" alignItems="center" width={7} height={6} hasRadius aria-hidden>
      <Rocket />
    </IconBox>
  );
};
