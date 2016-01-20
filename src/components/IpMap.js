import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import L from 'leaflet';
import { Panel } from 'react-bootstrap';

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

const popupString = (ip) => (
  [
      `<h2>${ip.owner}<h2>`,
      `<h3>${ip.ip}<h3>`,
      `<h4>Virus Total: ${ip.totalViruses}<h4>`,
      `<h4>Web Servers: ${ip.servers.web}<h4>`,
      `<h4>Ftp Servers: ${ip.servers.ftp}<h4>`,
      `<h4>Mail Servers: ${ip.servers.mail}<h4>`
  ].join('')
)

export default class Livemap extends Component {

  componentDidMount() {
    var map = this.map = L.map( this.refs['map'], {
        minZoom: 2,
        maxZoom: 8,
        layers: [
            L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
        ],
        attributionControl: false,
    });

    map.fitWorld();
  }

  componentWillUnmount() {
      this.map = null;
  }

  componentWillReceiveProps(nextProps) {
    if ( this.markerGroup ) {
      this.map.removeLayer(this.markerGroup);
    }

    const markers = nextProps.markers.map( (marker) => {
      const options = _.isEqual(nextProps.center, marker.position) ? {color:'red', radius:12} : {color:'#03f', radius:6}
      return L.circleMarker( marker.position, { ...options, ip:marker.ip } );
    });

    const openPopup = (e) => {
      L.popup()
      .setLatLng(e.latlng)
      .setContent(popupString(e.layer.options.ip))
      .openOn(this.map);
    }

    //handling popups this way so they don't disappear when I remove the marker layer
    this.markerGroup = L.featureGroup(markers).on('click', openPopup).addTo(this.map);

    this.layerGroup = L.featureGroup(this.markerGroup)
      .addTo(this.map);;
    //this.layerGroup.addTo(this.map);

    this.popupLayerGroup = L.layerGroup();

    if (this.props.center !== nextProps.center) {
      this.map.setView(nextProps.center, 3);
    }
  }

  render() {
    return (

    <Panel header={<span><strong>IP Map:</strong> {this.props.ips.length} ips</span>}>
      <div style={{marginBottom:10}}>Click a dot to view details.</div>
      <div className='map' ref='map'></div>
    </Panel>
  )
  }
}
