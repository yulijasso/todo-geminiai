import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import * as React from 'react';

export const Checkbox = React.forwardRef(function Checkbox(props, ref) {
  const { children, onCheckedChange, ...rest } = props;

  return (
    <ChakraCheckbox.Root
      ref={ref}
      onCheckedChange={(details) => {
        onCheckedChange?.(details.checked);
      }}
      {...rest}
    >
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control>
        <ChakraCheckbox.Indicator />
      </ChakraCheckbox.Control>
      {children && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
    </ChakraCheckbox.Root>
  );
});
