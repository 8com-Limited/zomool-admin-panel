import React, { Component, useEffect, useRef, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Tooltip,
  message,
  Button,
  Modal,
  Row,
  Col,
  Input,
  Switch,
} from "antd";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "react-intl-tel-input/dist/main.css";
import axios from "axios";
import IntlTelInput from "react-intl-tel-input";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const { confirm } = Modal;
const UserList = () => {
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const { t, i18n } = useTranslation();
  const theme = useSelector((state) => state.theme.currentTheme);
  const isAdminViewer = userData.role === "adminViewer";
  console.log(isAdminViewer, userData);
  const [data, setData] = React.useState([]);
  const [item, setItem] = React.useState({});
  const [isEmail, setIsEmail] = useState(true);
  const token = localStorage.getItem("auth_token");
  const [isArabic, setisArabic] = useState(
    localStorage.getItem("language") === "ar"
  );
  // const isArabic = localStorage.getItem("language") === "ar";
  console.log(i18n.language);
  const rootClassName = `h-100 ${theme === "light" ? "bg-white" : ""} ${isArabic ? "rtl" : ""
    }`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const phoneRef = useRef(null);
  const showModal = (elm) => {
    setItem(elm);
    setIsModalOpen(true);
  };
  const deleteUser = (elm) => {
    confirm({
      centered: true,
      title: "Are you sure you want to proceed with the deletion?",
      icon: <DeleteOutlined />,
      content: `Deleting the selected item will permanently remove it from the system. This action cannot be undone.`,
      okText: "Yes",
      cancelText: "No",

      async onOk() {
        try {
          const apiUrl = `${process.env.REACT_APP_BASE_URL}/admin/deleteUser?userId=${elm._id}`; // Replace with your API endpoint URL

          const response = await axios.delete(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
            },
          });
          fetchData();
        } catch (error) {
          console.log(error, "error");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleChanges = (e) => {
    console.log(e);
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleOk = async () => {
    if (!isEmail) {
      item.emailOrPhone = phoneRef.current.state.value;
    }
    if (!item?._id) {
      await axios
        .post(`${process.env.REACT_APP_BASE_URL}/admin/addUser`, item, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          setIsModalOpen(false);
          setItem({});
          fetchData();
          setIsModalOpen(false);
          toast.success("Customer Added Successfully !");
        })
        .catch((err) => {
          toast.error(err.response.data.messageEnglish);
          setIsModalOpen(false);
        });
    }

    // setItem({});
  };
  const renderNumbers = (phoneNo) => {
    if (!phoneNo.includes('+')) {
      phoneNo = '+' + phoneNo
    }
    return isArabic ? phoneNo.split('+')[1] + '+' : phoneNo
  }

  const handleCancel = () => {
    setItem({});
    setIsModalOpen(false);
  };
  const fetchData = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/admin/getAllUser`; // Replace with your API endpoint URL

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
        },
      });
      console.log(response.data.data, "dataRes");
      setData(response.data.data); // Save the response data to state
    } catch (error) {
      console.log(error.message, "error");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", "ar");
      window.location.reload();
    }
    fetchData();
    // i18n.changeLanguage(localStorage.getItem("language") || "ar");
  }, []);

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
    {
      title: t("Role"),
      dataIndex: "role",
      align: isArabic ? "right" : "left",
      sorter: {
        compare: (a, b) => a.role.length - b.role.length,
      },
    },
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
      render: (phone) => <>{phone ? renderNumbers(phone) : "-"}</>,
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
                onClick={() => showModal(elm)}
                size="small"
              />
            </Tooltip>
            {!isAdminViewer && (
              <Tooltip title="Delete">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    deleteUser(elm);
                  }}
                  size="small"
                />
              </Tooltip>
            )}
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <div className={rootClassName}>
        <h2>{t("User list")}</h2>
        {!isAdminViewer && (
          <div
            style={{ textAlign: isArabic ? "left" : "right", margin: "10px 0" }}
          >
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              <PlusOutlined />
              {t("Add User")}
            </Button>
          </div>
        )}
        <Card bodyStyle={{ padding: "0px" }}>
          {data && (
            <div className="table-responsive">
              <Table columns={tableColumns} dataSource={data} rowKey="_id" />
            </div>
          )}
        </Card>

        <Modal
          centered
          title="User Detail"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {/* <div>User :{item?.fullName}</div>
        <div>Role :{item?.role}</div>
        <div>Email Or Phone: {item.emailOrPhone}</div>
        <div>Auth:{item.auth == true ? 'True' : 'False'}</div> */}
          {item?._id ? (
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <h5>User Name</h5>
                <h4>{item?.fullName}</h4>
              </Col>
              <Col span={12}>
                <h5>Role</h5>
                <h4>{item?.role}</h4>
              </Col>
              <Col span={12}>
                <h5>Email Or Phone</h5>
                <h4>{item?.emailOrPhone || "N/A"}</h4>
              </Col>
              <Col span={12}>
                <h5>Auth</h5>
                <h4>{item?.auth === true ? "True" : "False"}</h4>
              </Col>
            </Row>
          ) : (
            <form action="">
              <Switch
                checkedChildren="Email"
                unCheckedChildren="Phone"
                onChange={(e) => {
                  setIsEmail(!isEmail);
                }}
                defaultChecked
              />
              <div>
                <h5 style={{ marginBottom: "0px" }}>Full Name</h5>
                <Input
                  placeholder="full name"
                  value={item?.fullName}
                  onChange={(e) => handleChanges(e)}
                  name="fullName"
                  onPressEnter={(e) => handleChanges(e)}
                />
              </div>
              {isEmail ? (
                <div>
                  <h5 style={{ marginBottom: "0px" }}>Email</h5>
                  <Input
                    placeholder="Email"
                    status={"error"}
                    type="email"
                    value={item?.emailOrPhone}
                    onChange={(e) => handleChanges(e)}
                    name="emailOrPhone"
                    onPressEnter={(e) => handleChanges(e)}
                  />
                </div>
              ) : (
                <div>
                  <h5 style={{ marginBottom: "0px" }}>Phone</h5>
                  <IntlTelInput
                    containerClassName="intl-tel-input"
                    inputClassName="ant-input"
                    style={{ width: "100%" }}
                    placeholder="+9717412589630"
                    fieldName="emailOrPhone"
                    ref={phoneRef}
                  />
                </div>
              )}

              <div>
                <h5 style={{ marginBottom: "0px" }}>Password</h5>
                {/* <Input
                placeholder='password'
                value={item?.password}
                type='password'
                onChange={(e) => handleChanges(e)}
                name='password'
                onPressEnter={(e) => handleChanges(e)}
              /> */}
                <Input.Password
                  placeholder="password"
                  value={item?.password}
                  name="password"
                  onChange={(e) => handleChanges(e)}
                  onPressEnter={(e) => handleChanges(e)}
                />
              </div>
            </form>
          )}
        </Modal>
      </div>
    </>
  );
};

export default UserList;
