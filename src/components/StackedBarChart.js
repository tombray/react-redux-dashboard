import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Panel } from 'react-bootstrap';
import d3 from 'd3';

const xMax = (data) => d3.max(data, group => d3.max(group, (d) => d.x + d.x0));
const xScale = (data, max, width) => d3.scale.linear()
  .domain([0, max])
  .range([0, width]);

const yDomain = (data) => data[0].map( (d) => d.y );
const yScale = (data, height, padding=0.1) => d3.scale.ordinal()
    .domain(yDomain(data))
    .rangeRoundBands([0, height], padding)

const colors = d3.scale.category10();

const bars = (tg, xScale, yScale, onIpClick) =>
  tg.map( (d, i) =>
    <rect onClick={ () => onIpClick(d.y) } key={i} x={xScale(d.x0)} y={yScale(d.y)} width={xScale(d.x)} height={yScale.rangeBand()}/> );

const threatGroups = (data, xScale, yScale, onIpClick) => data.map( (tg, i) => (
  <g key={i} style={{fill: colors(i)}} transform="translate(120,0)">
    {bars(tg, xScale, yScale, onIpClick)}
  </g>
));

export default class StackedBarChart extends Component {
    render() {
      const { data, onIpClick, width, height } = this.props;
      const mX = xMax(data);
      const x = xScale(data, mX, width - 120);
      const y = yScale(data, height);
      const ips = data[0].map( (d) => d.y );

      const yAxis = (
        <g transform="translate(120,0)">
          {ips.map( (ip, i) => (
            <g transform={`translate(0,${y(ip) + (y.rangeBand() / 2)})`} style={{opacity: 1}} key={i}>
              <line x2="-6" y2="0"></line>
              <text dy=".32em" x="-9" y="0" style={{textAnchor: 'end'}}>{ip}</text>
            </g>
          ))}

        </g>
      )

      return (
        <Panel header={<span><strong>Top 25 IPs</strong></span>}>
          <div>Click a bar to center the map on the associated IP</div>
          <svg width="500" height="800">
            <g >
              {threatGroups(data, x, y, onIpClick)}
              {yAxis}
            </g>
          </svg>
        </Panel>
      )
    }
}
