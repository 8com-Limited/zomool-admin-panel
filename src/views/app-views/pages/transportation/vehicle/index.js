import { Button, Card, Image, Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import confirm from "antd/lib/modal/confirm";
import AddEditVehicleModal from "./Modals/AddEditVehicleModal";


const Vehicle = () => {

  const [vehicleData, setVehicleData] = useState([]);
  const token = localStorage.getItem("auth_token");
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState({});

  const fetchData = async () => {

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/transport/getVehicleList`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
          },
        }
      );
      const data = response.data.data.map((ele, i) => {
        return { ...ele, key: i + 1 };
      });
      setVehicleData(data); // Save the response data to state
    } catch (error) {
      console.log(error.message, "error");
      toast.error("Error while getting vehicle");
    }
  };

  const deleteVehicle = async (elm) => {
    confirm({
      centered: true,
      title: "Are you sure you want to proceed with the deletion?",
      icon: <DeleteOutlined />,
      content: `Deleting the selected item will permanently remove it from the system. This action cannot be undone.`,
      okText: "Yes",
      cancelText: "No",
      async onOk() {
        try {
          const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/transport/deleteVehicle?vehicleId=${elm._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
              },
            }
          );
          fetchData();
          toast.success("Vehicle deleted successfully !!!");
        } catch (error) {
          toast.error("Error while deleting Vehicle");
          console.log(error.message, "error");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [openModal]);

  const tableColumns = [
    {
      title: t("No."),
      dataIndex: "key",
      render: (key) => <div>{key}</div>,
    },
    {
      title: t("Vehicle Name"),
      dataIndex: "vehicleName",
      render: (vehicleName) => <div>{vehicleName}</div>,
      sorter: {
        compare: (a, b) => {
          a = a.vehicleName.toLowerCase();
          b = b.vehicleName.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: t("Image"),
      dataIndex: "vehicleImage",
      render: (vehicleImage) => (
        <Image
          src={`${process.env.REACT_APP_BASE_URL}/${vehicleImage}`}
          width={100}
          alt="Img"
        />
      ),
    },
    {
      title: t("Date"),
      dataIndex: "createdAt",
      render: (createdAt) => (
        <div>{new Date(createdAt).toLocaleDateString()}</div>
      ),
    },

    {
      title: t("Action"),
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="">
          <Tooltip title="Edit">
            <Button
              type="primary"
              className="mr-2"
              icon={<EditOutlined />}
              onClick={() => {
                setOpenModal(true);
                setData({ ...elm, updateOnce: true });
              }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteVehicle(elm);
              }}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>{t("Vehicle List")}</h2>
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <Button type="primary" onClick={() => {
          setOpenModal(true);
         
        }}>
          <PlusOutlined /> {t("Add Vehicle")}
        </Button>
      </div>
      <Card bodyStyle={{ padding: "0px" }}>
        <div className="table-responsive">
          <Table columns={tableColumns} dataSource={vehicleData} rowKey="_id" />
        </div>
      </Card>
      <AddEditVehicleModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        data={data}
        setData={setData}
      />
    </div>
  );
};

export default Vehicle;
