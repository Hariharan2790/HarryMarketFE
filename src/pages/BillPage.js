import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import {GetAllBills} from '../utils/APIRoute'
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';

function BillPage() {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibility] =
    useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const dispatch = useDispatch();
  const getAllBills = () => {
    dispatch({ type: "showLoading" });
    axios
      .get(GetAllBills)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data;
        data.reverse();
        setBillsData(data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
    },
    {
      title: "tax",
      dataIndex: "tax",
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setSelectedBill(record);
              setPrintBillModalVisibility(true);
            }}
          />
        </div>
      ),
    },
  ];

  const billcolumns = [
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
      render: (id, record) => <div>{record.quantity}</div>,
    },
    {
      title: "Total Amount",
      dataIndex: "-id",
      render: (id, record) => (
        <div>
          <b>{record.quantity * record.price}</b>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  return (
    <DefaultLayout>
      <div className="d-flex">
        <h3>Bills</h3>
      </div>
      <Table columns={columns} dataSource={billsData} bordered />

      {printBillModalVisibility && (
        <Modal
          onCancel={() => {
            setPrintBillModalVisibility(false);
          }}
          visible={printBillModalVisibility}
          title="Bill Details"
          footer={false}
          width={800}
        >
          <div className="bill-modal p-4" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div>
                <h1>
                  <b>HARRY MARKET</b>
                </h1>
              </div>
              <div>
                <p>Chennai</p>
                <p>Cell : 987654321</p>
              </div>
            </div>
            <div className="bill-customer-details my-2">
              <p>
                <b>Name</b> : {selectedBill.customerName}
              </p>
              <p>
                <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
              </p>
              <p>
                <b>Date</b> :{" "}
                {selectedBill.createdAt.toString().substring(0, 10)}
              </p>
            </div>
            <Table dataSource={selectedBill.cartItems} columns={billcolumns} pagination={false}/>
            <div className="dotted-border my-2">
              <h6><b>Sub Total</b>: {selectedBill.subTotal}</h6>
              <h6><b>Tax</b>: {selectedBill.tax}</h6>
            </div>
            <div className="my-2">
              <h2><b>Grand Total : {selectedBill.grandTotal}</b></h2>
            </div>
            <div className="dotted-border"></div>
            <div className="text-center my-2">
              <p>Thank You</p>
              <p>Happy Shopping</p>
              <p>Visit Again</p>
            </div>
          </div>

          <div className="d-flex justify-content-end">
          <Button type="primary" onClick={handlePrint}>Print Bill</Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default BillPage;
