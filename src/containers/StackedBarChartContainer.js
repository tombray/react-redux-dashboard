import * as transformers from '../utils/transformers';
import { connect } from 'react-redux';
import StackedBarChart from '../components/StackedBarChart';
import _ from 'lodash';

const sortIps = (ips) => {
  const sorted = _.sortBy( _.values(ips), (ip) => -ip.totalViruses );
  const sliced = sorted.slice(0,25);
  return sliced;
}

function mapStateToProps(state) {
  const data = state.ips.length > 0 ? transformers.stackAndInvert( transformers.ipsToThreats( sortIps(state.entities.ips), ['trojan','bot','spam']) ) : [[]];
  return { data }
}

function mapDispatchToProps(dispatch) {
  return {
    onIpClick: (ip) => dispatch( {type:'IP_SELECTED', ip})
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StackedBarChart);
