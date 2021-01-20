import React, { Component } from 'react'
import { Card, Row } from 'antd';
import { Link } from 'react-router-dom';


const { Meta } = Card;


export default class Home extends Component {
  render() {
    return (
      <Row type="flex" justify="center" align="middle" style={{minHeight:'80vh'}}>
        <Link to={'/eth'}>
          <Card
            hoverable
            style={{ width: 160 }}
            cover={<img alt="example" src="images/ethereum.png" />}
          >
            
            <Meta title="以太坊" style={{textAlign: 'center'}} />
          </Card>
        </Link>
        <Link to={'/trx'}>
          <Card
            hoverable
            style={{ width: 160 }}
            cover={<img alt="example" src="images/tron.png" />}
          >
            <Meta title="波场" style={{textAlign: 'center'}} />
          </Card>
        </Link>
      </Row>
    )
  }
}