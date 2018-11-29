import React from 'react';
import { Field } from 'react-final-form';
import system from 'system-components';

const Label = system({
  is: 'label',
  display: 'block',
  textAlign: 'left',
});

export const SettingsForm = ({ values: { mediaQueryUnits, fontSizeUnits, browserFontSize } }) => {
  const onePxInRem = 1 / browserFontSize;
  const mediaQueryMin = mediaQueryUnits === 'px' ? '320' : '1';
  const mediaQueryMax = mediaQueryUnits === 'px' ? '1200' : '100';
  const fontSizeMax = fontSizeUnits === 'px' ? '50' : String(50 / 16);
  const fontSizeStep = fontSizeUnits === 'px' ? '1' : String(onePxInRem);
  return (
    <React.Fragment>
      <Label>
        cssLocks equation
        <Field name="equation" component="select">
          <option value="pxEverywhere">pixels everywhere! 🕺</option>
        </Field>
      </Label>
      <Label>
        Browser font size
        <Field
          name="browserFontSize"
          type="range"
          component="input"
          parse={value => Number(value)}
          format={value => String(value)}
        />
      </Label>
      <Label>
        Media query units
        <Field name="mediaQueryUnits" component="select">
          <option value="px">px</option>
          <option value="em">em</option>
        </Field>
      </Label>
      <Label>
        Font size units
        <Field name="fontSizeUnits" component="select">
          <option value="px">px</option>
          <option value="rem">rem</option>
        </Field>
      </Label>
      <Label>
        min font size
        <Field
          name="minFontSize"
          type="range"
          component="input"
          parse={value => Number(value)}
          format={value => String(value)}
          min="1"
          max={fontSizeMax}
          step={fontSizeStep}
        />
      </Label>
      <Label>
        min breakpoint
        <Field
          name="minBreakpoint"
          type="range"
          component="input"
          parse={value => Number(value)}
          format={value => String(value)}
          min={mediaQueryMin}
          max={mediaQueryMax}
        />
      </Label>
      <Label>
        max font size
        <Field
          name="maxFontSize"
          type="range"
          component="input"
          parse={value => Number(value)}
          format={value => String(value)}
          min="1"
          max={fontSizeMax}
          step={fontSizeStep}
        />
      </Label>
      <Label>
        max breakpoint
        <Field
          name="maxBreakpoint"
          type="range"
          component="input"
          parse={value => Number(value)}
          format={value => String(value)}
          min={mediaQueryMin}
          max={mediaQueryMax}
        />
      </Label>
    </React.Fragment>
  );
};
