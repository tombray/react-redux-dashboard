import React from 'react';
import { connect } from 'react-redux';
import IpMap from '../components/IpMap';
import _ from 'lodash';

const defaultCenter = [37.33067,-101.6464826];

function ipToMarker(ip) {
  return {key: ip.ip, position: [ip.location.lat, ip.location.long], ip:ip}
}

const selectedPosition = ( ips, selectedIp ) => {
  const location = ips[ selectedIp ].location;
  return [location.lat, location.long];
}

function mapStateToProps(state) {
  console.log(state.entities.ips);
  const markers = state.ips.length > 0 ? _.map(state.entities.ips, ipToMarker) : [];
  const selected = markers.length > 0 && state.selectedIp ? selectedPosition(state.entities.ips, state.selectedIp) : null;
  console.log('selected position', selected);
  const center = selected ? selected : defaultCenter;

  return {
    markers,
    center,
    ips: state.ips
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onMarkerClick: () => dispatch({type:'MARKER_CLICK'})
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IpMap);
