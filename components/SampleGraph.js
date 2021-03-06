import React from 'react';
import system from 'system-components';
import { Form } from 'react-final-form';
import createDecorator from 'final-form-calculate';

import 'd3';
import functionPlot from 'function-plot';
import { Code } from './Code';
import { SettingsForm } from './SettingsForm';

const valuesUpdater = createDecorator(
  {
    field: 'mediaQueryUnits',
    isEqual: (a, b) => {
      if (typeof b === 'undefined') return true;
      return a === b;
    },
    updates: (mediaQueryUnits, fieldName, { browserFontSize, minBreakpoint, maxBreakpoint }) => {
      if (mediaQueryUnits === 'px') {
        return {
          minBreakpoint: Math.round(minBreakpoint * browserFontSize),
          maxBreakpoint: Math.round(maxBreakpoint * browserFontSize),
        };
      }
      return {
        minBreakpoint: minBreakpoint / browserFontSize,
        maxBreakpoint: maxBreakpoint / browserFontSize,
      };
    },
  },
  {
    field: 'fontSizeUnits',
    isEqual: (a, b) => {
      if (typeof b === 'undefined') return true;
      return a === b;
    },
    updates: (fontSizeUnits, fieldName, { browserFontSize, minFontSize, maxFontSize }) => {
      if (fontSizeUnits === 'px') {
        return {
          minFontSize: Math.round(minFontSize * browserFontSize),
          maxFontSize: Math.round(maxFontSize * browserFontSize),
        };
      }
      return {
        minFontSize: minFontSize / browserFontSize,
        maxFontSize: maxFontSize / browserFontSize,
      };
    },
  },
  {
    field: 'maxBreakpoint',
    updates: {
      minBreakpoint: (maxBreakpoint, { minBreakpoint, mediaQueryUnits, browserFontSize }) => {
        const onePxInEm = 1 / browserFontSize;
        const onePxDifferenceInCurrentUnits = mediaQueryUnits === 'px' ? 1 : onePxInEm;
        if (maxBreakpoint <= minBreakpoint) {
          return Math.max(maxBreakpoint - onePxDifferenceInCurrentUnits, 0);
        }
        return minBreakpoint;
      },
    },
  },
  {
    field: 'minBreakpoint',
    updates: {
      maxBreakpoint: (minBreakpoint, { maxBreakpoint, mediaQueryUnits, browserFontSize }) => {
        const onePxInEm = 1 / browserFontSize;
        const onePxDifferenceInCurrentUnits = mediaQueryUnits === 'px' ? 1 : onePxInEm;
        if (maxBreakpoint <= minBreakpoint) {
          return minBreakpoint + onePxDifferenceInCurrentUnits;
        }
        return maxBreakpoint;
      },
    },
  },
  {
    field: 'maxFontSize',
    updates: {
      minFontSize: (maxFontSize, { minFontSize, fontSizeUnits, browserFontSize }) => {
        const onePxInRem = 1 / browserFontSize;
        const onePxDifferenceInCurrentUnits = fontSizeUnits === 'px' ? 1 : onePxInRem;
        if (maxFontSize <= minFontSize) {
          return Math.max(maxFontSize - onePxDifferenceInCurrentUnits, 0);
        }
        return minFontSize;
      },
    },
  },
  {
    field: 'minFontSize',
    updates: {
      maxFontSize: (minFontSize, { maxFontSize, fontSizeUnits, browserFontSize }) => {
        const onePxInRem = 1 / browserFontSize;
        const onePxDifferenceInCurrentUnits = fontSizeUnits === 'px' ? 1 : onePxInRem;
        if (maxFontSize <= minFontSize) {
          return minFontSize + onePxDifferenceInCurrentUnits;
        }
        return maxFontSize;
      },
    },
  },
);

const DEFAULT_WIDTH = 550;
const DEFAULT_HEIGHT = 350;
const autoHeight = width => (DEFAULT_HEIGHT * width) / DEFAULT_WIDTH;
const dimensions = ({ width }) => ({
  width,
  height: autoHeight(width),
});

const Wrapper = system({
  height: '100vh',
  width: '100vw',
  display: 'grid',
  gridTemplateAreas: '"controls graph" "code graph"',
  gridTemplateColumns: '50% 900px',
});
const Controls = system({
  gridArea: 'controls',
});

const Graph = system({
  gridArea: 'graph',
  justifySelf: 'end',
  alignSelf: 'center',
});

const emToPx = ({ value, units, browserFontSize }) => {
  if (units === 'px') return value;
  return value * browserFontSize;
};

const calculateM = ({
  minFontSize, maxFontSize, minBreakpoint, maxBreakpoint, mediaQueryUnits, fontSizeUnits,
}) => {
  const minFontSizeInPx = emToPx({ value: minFontSize, units: fontSizeUnits, browserFontSize: 16 });
  const maxFontSizeInPx = emToPx({ value: maxFontSize, units: fontSizeUnits, browserFontSize: 16 });
  const minBreakpointInPx = emToPx({ value: minBreakpoint, units: mediaQueryUnits, browserFontSize: 16 });
  const maxBreakpointInPx = emToPx({ value: maxBreakpoint, units: mediaQueryUnits, browserFontSize: 16 });

  const fontSizeIncrease = maxFontSizeInPx - minFontSizeInPx;
  const viewportIncrease = maxBreakpointInPx - minBreakpointInPx;

  return fontSizeIncrease / viewportIncrease;
};

const calculateB = ({
  m, minBreakpoint, minFontSize, browserFontSize, fontSizeUnits, mediaQueryUnits,
}) => {
  const browserFontIncrease = browserFontSize / 16;
  const minBreakpointInPx = emToPx({ value: minBreakpoint, units: mediaQueryUnits, browserFontSize: 16 });
  const minFontSizeInPx = emToPx({ value: minFontSize, units: fontSizeUnits, browserFontSize: 16 });
  const bInPx = minFontSizeInPx - m * minBreakpointInPx;

  if (fontSizeUnits === 'px') return bInPx;
  return bInPx * browserFontIncrease;
};
const calculateMinFontSizeInPx = ({ fontSizeUnits, minFontSize, browserFontSize }) => (fontSizeUnits === 'px' ? minFontSize : minFontSize * browserFontSize);
const calculateMaxFontSizeInPx = ({ fontSizeUnits, maxFontSize, browserFontSize }) => (fontSizeUnits === 'px' ? maxFontSize : maxFontSize * browserFontSize);
const calculateMinBreakpointInPx = ({ mediaQueryUnits, minBreakpoint, browserFontSize }) => (mediaQueryUnits === 'px' ? minBreakpoint : minBreakpoint * browserFontSize);
const calculateMaxBreakpointInPx = ({ mediaQueryUnits, maxBreakpoint, browserFontSize }) => (mediaQueryUnits === 'px' ? maxBreakpoint : maxBreakpoint * browserFontSize);

const generateFunctionPlotOptions = ({
  browserFontSize,
  minFontSize,
  maxFontSize,
  minBreakpoint,
  mediaQueryUnits,
  maxBreakpoint,
  fontSizeUnits,
  equation,
}) => {
  const minFontSizeInPx = emToPx({ value: minFontSize, units: fontSizeUnits, browserFontSize });
  let maxFontSizeInPx = calculateMaxFontSizeInPx({ fontSizeUnits, maxFontSize, browserFontSize });
  const minBreakpointInPx = calculateMinBreakpointInPx({ mediaQueryUnits, minBreakpoint, browserFontSize });
  const maxBreakpointInPx = calculateMaxBreakpointInPx({ mediaQueryUnits, maxBreakpoint, browserFontSize });
  const m = calculateM({
    minFontSize,
    maxFontSize,
    minBreakpoint,
    maxBreakpoint,
    mediaQueryUnits,
    fontSizeUnits,
  });
  const b = calculateB({
    m,
    minBreakpoint,
    minFontSize,
    browserFontSize,
    fontSizeUnits,
    mediaQueryUnits,
  });
  const bInRem = b / browserFontSize;
  const formattedB = fontSizeUnits === 'px' ? `${b}${fontSizeUnits}` : `${bInRem}${fontSizeUnits}`;
  let baselineInPx;
  let fn = `${m} * x + ${b}`;
  let formattedFn = 'm * x + b';
  let formattedMaxFn = `${maxFontSize}${fontSizeUnits}`;
  let b2;
  let formattedVariables = `// m = ${m}
    // b = ${formattedB}`;

  if (equation === 'remFontSize') {
    const bWithDefaultFontSize = calculateB({
      m,
      minBreakpoint,
      minFontSize,
      browserFontSize: 16,
      fontSizeUnits,
      mediaQueryUnits,
    });
    const baselineWithDefaultFontSize = emToPx({ value: minFontSize, units: fontSizeUnits, browserFontSize: 16 });
    baselineInPx = emToPx({ value: minFontSize, units: fontSizeUnits, browserFontSize });

    b2 = bWithDefaultFontSize - baselineWithDefaultFontSize;
    fn = `${baselineInPx} + ${m} * x + ${b2}`;
    formattedFn = 'baseline + m * x + b2';
    const maxFontSizeWithDefaultFontSizeInPx = emToPx({
      value: maxFontSize,
      units: fontSizeUnits,
      browserFontSize: 16,
    });
    maxFontSizeInPx = baselineInPx + maxFontSizeWithDefaultFontSizeInPx - baselineWithDefaultFontSize;
    const fontDiffInPx = maxFontSizeInPx - minFontSizeInPx;
    formattedMaxFn = `${minFontSize}rem + ${fontDiffInPx}px`;
    formattedVariables = `// baseline = ${minFontSize}rem
    // b2 = ${b2}px`;
  }

  return {
    formattedFn,
    formattedMaxFn,
    formattedVariables,
    config: {
      target: '#abc',
      grid: true,
      ...dimensions({ width: 900 }),
      xAxis: {
        label: 'viewport width',
        domain: [0, 1280],
      },
      yAxis: {
        label: 'font-size',
        domain: [0, 65],
      },
      data: [
        {
          fn: String(minFontSizeInPx),
          range: [0, minBreakpointInPx],
        },
        {
          fn,
          range: [minBreakpointInPx, maxBreakpointInPx],
        },
        {
          fn: String(maxFontSizeInPx),
          range: [maxBreakpointInPx, 1280],
        },
      ],
    },
  };
};

const generateCode = (values) => {
  const {
    browserFontSize,
    minFontSize,
    minBreakpoint,
    mediaQueryUnits,
    maxBreakpoint,
    fontSizeUnits,
  } = values;

  const { formattedFn, formattedVariables, formattedMaxFn } = generateFunctionPlotOptions(values);
  return `// 1rem = ${browserFontSize}px

p {
  font-size: ${minFontSize}${fontSizeUnits};

  @media (min-width: ${minBreakpoint}${mediaQueryUnits}) {
    font-size: calc(${formattedFn});
    ${formattedVariables}
  }

  @media (min-width: ${maxBreakpoint}${mediaQueryUnits}) {
    font-size: ${formattedMaxFn};
  }
}
  `;
};

const rerenderGraph = (values) => {
  const options = generateFunctionPlotOptions(values).config;
  functionPlot(options);
};

export const SampleGraph = () => (
  <Form
    onSubmit={() => {}}
    initialValues={{
      browserFontSize: 16,
      minFontSize: 20,
      maxFontSize: 40,
      minBreakpoint: 320,
      maxBreakpoint: 960,
      mediaQueryUnits: 'px',
      fontSizeUnits: 'px',
      equation: 'pxEverywhere',
    }}
    decorators={[valuesUpdater]}
    render={({ values }) => {
      const code = generateCode(values);
      rerenderGraph(values);
      return (
        <Wrapper>
          <Controls>
            <SettingsForm values={values} />
          </Controls>
          <Code language="scss" code={code} />
          <Graph>
            <div id="abc" />
          </Graph>
        </Wrapper>
      );
    }}
  />
);
