import { Button, Card, Image, Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  LockOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import confirm from "antd/lib/modal/confirm";

import { useHistory } from "react-router-dom";
import AddViewDriverModal from "./Modals/AddViewDriverModal";
import AddEditDriverModal from "./Modals/AddEditDriverModal";
import ResetPassword from "./Modals/ResetPassword";



const DiverList = () => {
  let history = useHistory();
  const [driverData, setDriverData] = useState([]);
  const token = localStorage.getItem("auth_token");
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false)
  const [openReset, setOpenReset] = useState(false)
  const [data, setData] = useState({});
  const [isArabic, setisArabic] = useState(
    localStorage.getItem("language") === "ar"
  );

  const fetchData = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/admin/getAllUser?driver=true`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data.map((ele, i) => {
        return { ...ele, key: i + 1 };
      });
      console.log(data);
      setDriverData(data); // Save the response data to state
    } catch (error) {
      console.log(error.message, "error");
      //   toast.error("Error while getting vehicle");
    }
  };

  const deleteDriver = async (elm) => {
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
            `${process.env.REACT_APP_BASE_URL}/auth/deleteDriver?driverId=${elm._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
              },
            }
          );
          fetchData();
          toast.success("Driver deleted successfully !!!");
        } catch (error) {
          toast.error("Error while deleting Driver");
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
      title: t("User"),
      dataIndex: "fullName",
      align: isArabic ? "right" : "left",
      render: (fullName) => (
        <div className="d-flex">
          {/* <AvatarStatus src={record.img} name={record.name} subTitle={record.email}/>
           */}
          {fullName}
        </div>
      ),
      sorter: {
        compare: (a, b) => {
          a = a.fullName.toLowerCase();
          b = b.fullName.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    // {
    //   title: t("Role"),
    //   dataIndex: "role",
    //   align: isArabic ? "right" : "left",
    //   sorter: {
    //     compare: (a, b) => a.role.length - b.role.length,
    //   },
    // },
    {
      title: t("email"),
      dataIndex: "email",
      align: isArabic ? "right" : "left",
      render: (email) => <>{email ? email : "-"}</>,
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      align: isArabic ? "right" : "left",
      render: (phone) => <>{phone ? isArabic ? phone.split('+')[1] + '+' : phone : "-"}</>,
    },

    {
      title: t("auth"),
      dataIndex: "auth",
      align: isArabic ? "right" : "left",
      render: (auth) => <>{auth == true ? "True" : "False"}</>,
      // sorter: {
      // 	compare: (a, b) => a.status.length - b.status.length,
      // },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, elm) => (
        <>
          <div className="">
            <Tooltip title="View">
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                onClick={() => {
                  setOpenModal(true);
                  setData({ ...elm, updateOnce: true });
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Reset-password">
              <Button
                type="primary"
                className="mr-2"
                icon={<LockOutlined />}
                onClick={() => {
                  setData({ ...elm, updateOnce: true });
                  setOpenReset(true)
                  console.log("cliked the reset-password")
                }}
                // onClick={() => {
                //   setOpenModal(true);
                //   setData({ ...elm, updateOnce: true });
                // }}
                size="small"
              />
            </Tooltip>

            <Tooltip title="Edit">
              <Button
                type="primary"
                className="mr-2"
                icon={<EditOutlined />}
                onClick={() => {
                  setOpenEdit(true)
                  // setOpenModal(true);
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
                  deleteDriver(elm);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        </>
      ),
    }

  ];

  return (
    <div>
      <h2>{t("Driver List")}</h2>
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <Button type="primary" onClick={() => {
          setOpenModal(true);
          history.push("/app/pages/add-driver")
        }
        }>
          <PlusOutlined /> {t("Add Driver")}
        </Button>
      </div>
      <Card bodyStyle={{ padding: "0px" }}>
        <div className="table-responsive">
          <Table columns={tableColumns} dataSource={driverData} rowKey="_id" />
        </div>
      </Card>
      <AddViewDriverModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        data={data}
        setData={setData}
      />
      <AddEditDriverModal
        setOpenEdit={setOpenEdit}
        openEdit={openEdit}
        // setOpenModal={setOpenModal}
        // openModal={openModal}
        data={data}
        setData={setData} />
      <ResetPassword
        setOpenReset={setOpenReset}
        openReset={openReset}
        data={data}
        setData={setData}
      />
    </div>
  );
};

export default DiverList;
