import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Homepage.module.css';
import { Outlet } from 'react-router-dom';

function Homepage() {
  return (
    <div>
      <Container fluid>
        <Row>
        <Col md='2' className={`position-fixed ${styles['sidebar']} ${styles['hideSidebar']}`}>
            <Sidebar />
          </Col>
          <Col md={{ span: 10, offset: 2 }} className={styles['content']}>
            <Outlet></Outlet>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;
