import { useSession } from "next-auth/react";
import { useState, useRef } from "react";

const {Card, Badge, Row, Col, Image, Button, ButtonToolbar, Form } = require('react-bootstrap');

export default function AccountSettings() {
    return (
        <>
            <h2>Account settings</h2>
            <Form>
                <Row className="my-2">
                    <h4>Interface</h4>
                </Row>
                <Row className="my-2 ms-2">
                    <Col xs={6}>
                        <Form.Label>Preferred language</Form.Label>
                        <Form.Select defaultValue="english">
                            <option value="english">English</option>
                            <option value="russian">Russian</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className="my-2 ms-2">
                    <Col xs={6}>
                        <Form.Label>Preferred theme</Form.Label>
                        <Form.Select defaultValue="auto">
                            <option value="auto">Auto</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </Form.Select>
                    </Col>
                </Row>
                <br />
                <Row className="my-2 justify-content-center">
                    <Col xs={1}>
                        <Button variant="success">Apply</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}