import React from "react";
import styles from "./Content.module.css";
import Header from "../Header/Header";
import { Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
function Content() {
  return (
    <div className={styles["content"]}>
      <Container fluid>
        <Row className={styles["header"]}>
          <Header />
        </Row>
        <Row className={styles["maincontent"]}>
          <Outlet></Outlet>
        </Row>
      </Container>
    </div>
  );
}

export default Content;
