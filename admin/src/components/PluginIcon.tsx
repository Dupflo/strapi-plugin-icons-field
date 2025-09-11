import { Flex } from '@strapi/design-system';
import styled from 'styled-components';
import { Rocket } from '@strapi/icons';

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
