import React, { useEffect } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import '../resources/Authentication.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {LoginUsers} from '../utils/APIRoute';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch({type: "showLoading"})
    axios.post(LoginUsers, values).then((res)=>{
        dispatch({type: "hideLoading"})
        message.success('Login successfull')
        localStorage.setItem('pos-user', JSON.stringify(res.data))
        navigate('/home')
    }).catch(() => {
        dispatch({type: "hideLoading"})
        message.error('something went wrong, please try again')
    })
  };

  
  useEffect(() => {
    if(localStorage.getItem('pos-user'))
    navigate('/home')
  },[])
  return (
    <div className="authentication">
      <Row>
        <Col lg={8} xs={22}>
          <Form layout="vertical" onFinish={onFinish}>
              <h1 className="text-center"><b>Harry Market</b></h1>
              <h2 className="text-center">POS</h2>
              <hr />
              <h3>Login</h3>
           
            <Form.Item name="userId" label="User ID">
              <Input type="text" placeholder="Enter your user ID or Email" required/>
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type="password" placeholder="Enter Password" required/>
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
                <Link to='/register'> Not Yet Registered ? Register</Link>
              <Button htmlType="submit" type="primary">
              LOGIN
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
