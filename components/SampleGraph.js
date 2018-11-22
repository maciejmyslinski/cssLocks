import React, { Component } from 'react';

import 'd3';
import functionPlot from 'function-plot';

const DEFAULT_WIDTH = 550;
const DEFAULT_HEIGHT = 350;
const autoHeight = width => (DEFAULT_HEIGHT * width) / DEFAULT_WIDTH;
const dimensions = ({ width }) => ({
  width,
  height: autoHeight(width),
});

export class SampleGraph extends Component {
  el = React.createRef();

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
        m, minWidth, maxWidth, b,
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
        m, minWidth, maxWidth, b,
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
      <React.Fragment>
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
        <div id="abc" ref={this.el} />

        <label>
          b:
          <input value={b} onChange={this.handleInputChange('b')} />
        </label>
        <div id="abc" ref={this.el} />
      </React.Fragment>
    );
  }
}
