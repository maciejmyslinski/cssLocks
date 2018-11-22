import React, { Component } from 'react';
import system from 'system-components';

import 'd3';
import functionPlot from 'function-plot';
import { Code } from './Code';

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
  gridTemplateColumns: '1fr 900px',
});
const Controls = system({
  gridArea: 'controls',
});

const Graph = system({
  gridArea: 'graph',
  justifySelf: 'end',
  alignSelf: 'center',
});

export class SampleGraph extends Component {
  state = {
    m: 0.03,
    minWidth: 320,
    maxWidth: 960,
    b: 0,
  };

  plotInstance = {};

  componentDidMount() {
    const {
      m, minWidth, maxWidth, b,
    } = this.state;
    if (m === '') return;
    if (minWidth === '') return;
    if (maxWidth === '') return;
    if (b === '') return;
    this.plotInstance = functionPlot(
      this.generateFunctionPlotOptions({
        m,
        minWidth,
        maxWidth,
        b,
      }),
    );
  }

  componentDidUpdate() {
    const {
      m, minWidth, maxWidth, b,
    } = this.state;
    if (m === '') return;
    if (minWidth === '') return;
    if (maxWidth === '') return;
    if (b === '') return;
    this.plotInstance = functionPlot(
      this.generateFunctionPlotOptions({
        m,
        minWidth,
        maxWidth,
        b,
      }),
    );
  }

  generateFunctionPlotOptions = ({
    m, minWidth, maxWidth, b,
  }) => ({
    target: '#abc',
    grid: true,
    ...dimensions({ width: 900 }),
    xAxis: {
      label: 'viewport width',
      domain: [0, 1280],
    },
    yAxis: {
      label: 'font-size',
      domain: [0, 50],
    },
    data: [
      {
        fn: '16',
        range: [0, minWidth],
      },
      {
        fn: `${m} * x + ${b}`,
        range: [minWidth, maxWidth],
      },
      {
        fn: '20',
        range: [maxWidth, 1280],
      },
    ],
  });

  handleInputChange = name => (e) => {
    const newValue = e.target.value;
    const newValueIsNaN = Number.isNaN(Number(newValue));
    if (newValueIsNaN) return;
    this.setState({ [name]: newValue });
  };

  render() {
    const {
      m, minWidth, maxWidth, b,
    } = this.state;
    return (
      <Wrapper>
        <Controls>
          <label>
            minWidth:
            <input value={minWidth} onChange={this.handleInputChange('minWidth')} />
          </label>

          <label>
            maxWidth:
            <input value={maxWidth} onChange={this.handleInputChange('maxWidth')} />
          </label>

          <label>
            m:
            <input value={m} onChange={this.handleInputChange('m')} />
          </label>

          <label>
            b:
            <input value={b} onChange={this.handleInputChange('b')} />
          </label>
        </Controls>
        <Code language="scss" code="font-size: 16px;" />
        <Graph>
          <div id="abc" />
        </Graph>
      </Wrapper>
    );
  }
}
