import React, { Component } from 'react';
import IpMapContainer from './containers/IpMapContainer';
import StackedBarChartContainer from './containers/StackedBarChartContainer';
import { Row, Col, ButtonGroup, Button, Panel } from 'react-bootstrap';
import { reset } from './actions/actions';

export default class DashboardApp extends Component {
  render() {
    const { dispatch } = this.props;

    return (
      <div style={{margin:10}}>
        <ButtonGroup bsSize='lg' style={{marginBottom:10}}>
          <Button bsStyle='danger' onClick={() => dispatch(reset()) }>Reset</Button>
        </ButtonGroup>

        <Row >
          <Col xs={8}>
              <IpMapContainer />
          </Col>
          <Col xs={4}>
            <StackedBarChartContainer width="500" height="600"/>
          </Col>
        </Row>
      </div>
    );
  }
}
