import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {generateBill} from '../utils/APIRoute'

function CartPage() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState(0);
  const [billChargeModal, setBillChargeModal] = useState(false);

  const increaseQuantity = (record) => {
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "updateCart",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };
  const columns = [
    {
      title: "Items",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "-id",
      render: (id, record) => (
        <div>
          <MinusSquareOutlined
            className="mx-3"
            onClick={() => decreaseQuantity(record)}
          />
          <b>{record.quantity}</b>
          <PlusSquareOutlined
            className="mx-3"
            onClick={() => increaseQuantity(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          onClick={() => dispatch({ type: "deleteFromCart", payload: record })}
        />
      ),
    },
  ];
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;
    });

    setSubTotal(temp);
  }, [cartItems]);

  const onFinish = (values) => {
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax: Number(((subTotal / 100) * 10).toFixed(2)),
      grandTotal: Number(subTotal + Number(((subTotal / 100) * 10).toFixed(2))),
      userId: JSON.parse(localStorage.getItem("pos-user"))._id,
    };
    axios
      .post(generateBill, reqObject)
      .then(() => {
        message.success("Bill generated successfully");
        navigate('/bills')
      })
      .catch(() => {
        message.error("Something went wrong");
      });
  };

  return (
    <DefaultLayout>
      <h3>Cart</h3>
      <Table columns={columns} dataSource={cartItems} bordered />
      <hr />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          <h3>
            SUB TOTAL : <b>Rs. {subTotal} /-</b>
          </h3>
        </div>
        <Button
          type="primary"
          onClick={() => {
            setBillChargeModal(true);
          }}
        >
          GENERATE BILL
        </Button>
      </div>
      <Modal
        title="Charge Bill"
        visible={billChargeModal}
        footer={false}
        onCancel={() => {
          setBillChargeModal(false);
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="customerName" label="Customer Name">
            <Input placeholder="Customer Name" />
          </Form.Item>
          <Form.Item name="customerPhoneNumber" label="Phone Number">
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item name="paymentMode" label="Payment Mode">
            <Select placeholder="Select Your Payment Mode">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>

          <div className="charge-bill-amount">
            <h5>
              SubTotal : <b>{subTotal}</b>
            </h5>
            <h5>
              Tax : <b>{((subTotal / 100) * 10).toFixed(2)}</b>
            </h5>
            <hr />
            <h2>
              Grand Total : <b>{subTotal + (subTotal / 100) * 10}</b>
            </h2>
          </div>

          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
}

export default CartPage;
