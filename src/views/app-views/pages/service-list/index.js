import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tooltip,
  Button,
  Modal,
  Input,
  Upload,
  Image,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import confirm from "antd/lib/modal/confirm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
const ServiceList = () => {
  const token = localStorage.getItem("auth_token");
  const [item, setItem] = React.useState({});
  const { t } = useTranslation();
  const [updateData, setUpdateData] = useState({});
  const [data, setData] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subSrevicesModal, setSubSrevicesModal] = useState(false);

  const handleChanges = (e) => {
    console.log(e.target.name, e.target.value);
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // console.log(e.target.value,"loginfghfh")
    if (e.target.name == "serviceImage") {
      setUpdateData((prev) => ({
        ...prev,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setUpdateData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubService = (e, index) => {
    let updatedState = item.subServices;

    updatedState[index].name = e.target.value;
    setItem((prev) => ({ ...prev, subServices: updatedState }));
  };

  const updateService = async () => {
    try {
      let form = new FormData();
      for (let i in item) {
        console.log(item[i]);
        if (i === "_id") {
          form.append("serviceId", item[i]);
        } else {
          form.append(i, item[i]);
        }
      }
      //   console.log(form.get('serviceImage'));
      let request = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/service/updateServices`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(request);
      if (request.data.data) {
        const findIndex = data.findIndex(
          (el) => el._id === request.data.data._id
        );
        data[findIndex] = request.data.data;
        setData(() => [...data]);
        toast.success("Service updated successfully !!!");
      } else {
        toast.error("Error while updating service");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addSubSrevices = async () => {
    try {
      let request = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/service/addSubService`,
        { serviceId: item._id, subServiceName: item.subServiceName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (request.data.data) {
        const findIndex = data.findIndex(
          (el) => el._id === request.data.data._id
        );
        data[findIndex].subServices = request.data.data.subServices;
        setData(() => [...data]);
        toast.success("Subservice Added successfully !!!");
      } else {
        toast.error("Error while updating service");
      }
      setSubSrevicesModal(false);
    } catch (err) {
      console.log(err);
    }
  };
  const showModal = (elm) => {
    setItem(elm);
    setIsModalOpen(true);
  };
  const props = {
    onChange(info) {
      console.log(info);
      setItem((prev) => ({
        ...prev,
        serviceImage: info.file.originFileObj,
      }));
    },
  };
  const deleteService = (elm) => {
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
            `${process.env.REACT_APP_BASE_URL}/service/deleteServices?serviceId=${elm._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
              },
            }
          );
          fetchData();
          toast.success("Service deleted successfully !!!");
        } catch (error) {
          toast.error("Error while deleting service");
          console.log(error.message, "error");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const addService = async () => {
    try {
      let form = new FormData();
      for (let i in item) {
        console.log(item[i]);
        form.append(i, item[i]);
      }
      let request = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/service/addService`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (request.data.data) {
        setData((perv) => [...perv, request.data.data]);
        toast.success("Service added successfully !!!");
      } else {
        toast.error("Error while adding service");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setItem(() => {});
  };
  const handleCancelSubSreviceModal = () => {
    setSubSrevicesModal(false);
    if (item.addSubSrevices) {
      setItem(() => {});
    }
  };
  const fetchData = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/service/getServices`; // Replace with your API endpoint URL

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
        },
      });
      const data = response.data.data.map((ele, i) => {
        return { ...ele, key: i + 1 };
      });
      setData(data); // Save the response data to state
    } catch (error) {
      console.log(error.message, "error");
      toast.error("Error while getting services");
    }
  };

  const HandleUpdateSubService = async (name, id) => {
    try {
      let request = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/service/updateSubService`,
        { serviceId: item._id, subServiceName: name, subServiceId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (request.data.data) {
        toast.success("Subservice updated successfully !!!");
      } else {
        toast.error("Error while adding service");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const HandleDeleteSubServices = async (id) => {
    try {
      let request = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/service/deleteSubService`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            serviceId: item._id,
            subServiceId: id,
          },
        }
      );
      if (request.data.data) {
        toast.success("Subservice deleted successfully !!!");
        const updatedArray = item.subServices.filter((obj) => obj._id !== id);
        setItem((prev) => ({ ...prev, subServices: updatedArray }));
      } else {
        toast.error("Error while adding service");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tableColumns = [
    {
      title: t("No."),
      dataIndex: "key",
      render: (key) => <div>{key}</div>,
    },
    {
      title: t("Service Name"),
      dataIndex: "serviceName",
      render: (serviceName) => <div>{serviceName}</div>,
      sorter: {
        compare: (a, b) => {
          a = a.serviceName.toLowerCase();
          b = b.serviceName.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: t("Sub Services Name"),
      dataIndex: "subServices",
      render: (subServices) => (
        <div>{subServices.map((ele) => ele.name + ", ")}</div>
      ),
    },
    // {
    //   title: "Image",
    //   dataIndex: "serviceImage",
    //   render: (serviceImage) => (
    //     <Image
    //       src={`${process.env.REACT_APP_BASE_URL}/${serviceImage}`}
    //       width={100}
    //       alt="Img"
    //     />
    //   ),
    // },
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
              onClick={() => showModal(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              className="mr-2"
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteService(elm);
              }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSubSrevicesModal(true);
                setItem({ ...elm, addSubSrevices: true });
              }}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <h2>{t("Service List")}</h2>
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> {t("Add Service")}
        </Button>
      </div>
      <Card bodyStyle={{ padding: "0px" }}>
        <div className="table-responsive">
          <Table columns={tableColumns} dataSource={data} rowKey="_id" />
        </div>
      </Card>
      <Modal
        title={item?._id ? t("Update Service") : t("Add Service")}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={(e) => handleCancel(e)}
        footer={[
          <Button key="back" onClick={(e) => handleCancel(e)}>
            {t("Cancel")}
          </Button>,
          item?._id ? (
            <Button key="update" type="primary" onClick={updateService}>
              {t("Update")}
            </Button>
          ) : (
            <Button key="add" type="primary" onClick={addService}>
              {t("Add")}
            </Button>
          ),
        ]}
      >
        <form action="">
          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Service Name")}</h5>
            <Input
              placeholder="Service Name"
              value={item?.serviceName}
              onChange={(e) => handleChanges(e)}
              name="serviceName"
              onPressEnter={(e) => handleChanges(e)}
            />
          </div>
          {item?.subServices?.length ? (
            <div>
              <br />
              <h5 style={{ marginBottom: "0px" }}>{t("Subservices List")}</h5>
              <div className="d-flex justify-content-between ">
                <div className="d-flex flex-wrap justify-content-start ">
                  {item?.subServices?.map((item) => (
                    <p className="border border-gray mx-1 px-2 py-1 rounded-10 rounded ">
                      {item.name}
                    </p>
                  ))}
                </div>
                <Tooltip title="Edit">
                  <Button
                    type="primary"
                    className="mr-2"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSubSrevicesModal(true);
                      setItem({ ...item, addSubSrevices: false });
                    }}
                    size="small"
                  />
                </Tooltip>
              </div>
            </div>
          ) : null}

          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Service Image")}</h5>
            {item?._id ? (
              <Image
                width={200}
                src={`${process.env.REACT_APP_BASE_URL}/${item.serviceImage}`}
              />
            ) : item?.serviceImage instanceof File ||
              item?.serviceImage instanceof Blob ? (
              <Image width={200} src={URL.createObjectURL(item.serviceImage)} />
            ) : null}
            <div style={{ display: "block" }}>
              <Upload {...props} showUploadList={false}>
                <Button icon={<UploadOutlined />}>
                  {t("Click to Upload")}
                </Button>
              </Upload>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        title={item?.addSubSrevices ? "Add Subservice" : "Update  Subservice"}
        visible={subSrevicesModal}
        onOk={handleCancelSubSreviceModal}
        onCancel={handleCancelSubSreviceModal}
        footer={[
          <Button key="back" onClick={handleCancelSubSreviceModal}>
            {t("Cancel")}
          </Button>,
          !item?.addSubSrevices ? (
            <Button key="update" type="primary">
              {t("Update")}
            </Button>
          ) : (
            <Button key="add" type="primary">
              {t("Add")}
            </Button>
          ),
        ]}
      >
        {item?.addSubSrevices ? (
          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Subservice Name")}</h5>
            <Input
              placeholder="Subservice Name"
              onChange={(e) => handleChanges(e)}
              name="subServiceName"
              onPressEnter={(e) => handleChanges(e)}
            />
          </div>
        ) : (
          <div>
            {item?.subServices?.map((subser, index) => (
              <div className="d-flex justify-content-between align-items-center my-2">
                <Input
                  placeholder="Subservice Name"
                  value={subser.name}
                  onChange={(e) => handleSubService(e, index)}
                  name="subServiceName"
                  // onPressEnter={(e) => handleSubService(e, index)}
                />
                <div className="d-flex ml-2">
                  <Tooltip title="Update">
                    <Button
                      type="primary"
                      className="mr-2"
                      icon={<SaveOutlined />}
                      onClick={() =>
                        HandleUpdateSubService(subser.name, subser._id)
                      }
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      danger
                      className=""
                      icon={<DeleteOutlined />}
                      onClick={() => HandleDeleteSubServices(subser._id)}
                      size="small"
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ServiceList;
