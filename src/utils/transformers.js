import _ from 'lodash';
import d3 from 'd3';

const transformIpsToThreatGroup = (ips, threat) => _.reduce(ips, (acc, ip) => [...acc, { x:ip.ip, y: ip.viruses[threat] } ], []);

export const ipsToThreats = (ips, threatTypes) => (
  _.reduce(threatTypes, (acc, threat) => [...acc, transformIpsToThreatGroup(ips, threat)], [] )
);

export const stack = threatGroups => d3.layout.stack()(threatGroups);

export const invert = threatGroups =>
  threatGroups.map(
    group =>
      group.map(
        item => (Object.assign({x: item.y, y: item.x}, _.isUndefined(item.y0) ? {} : {x0: item.y0}))
    )
  );

export const stackAndInvert = threatGroups => invert(stack(threatGroups));
