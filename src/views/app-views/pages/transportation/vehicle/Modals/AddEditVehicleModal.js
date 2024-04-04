import { Button, Image, Input, Modal, Upload } from "antd";
import React from "react";
import { handleStateChange } from "utils/helpers";
import { UploadOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

import "react-intl-tel-input/dist/main.css";

const AddEditVehicleModal = ({ openModal, setOpenModal, data, setData }) => {
  const { t } = useTranslation();

  const token = localStorage.getItem("auth_token");

  const handleCancel = () => {
    setOpenModal(false);
    setData((prev) => ({}));
  };

  const handleAddVehicle = async () => {
    try {
      let form = new FormData();
      for (let i in data) {
        form.append(i, data[i]);
      }
      let request = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/transport/addVehicle`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (request.data.data) {
        toast.success("Data added successfully !!!");
      } else {
        toast.error("Error while adding Data");
      }
      handleCancel();
    } catch (err) {
      console.log(err);
    }
  };

  const UpdateVehicle = async () => {
    try {
      let form = new FormData();
      for (let i in data) {
        if (i !== "location" && i !== "addedBy" && i !== "phone") {
          form.append(i, data[i]);
        }
      }
      form.append("vehicleId", data._id);
      let request = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/transport/updateVehicle`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (request.data.data) {
        toast.success("Data updated successfully !!!");
      } else {
        toast.error("Error while updateing Data");
      }
      handleCancel();
    } catch (err) {
      console.log(err);
      toast.error("Error while updateing Data");
    }
  };

  const props = {
    onChange(info) {
      setData((prev) => ({
        ...prev,
        vehicleImage: info.file.originFileObj,
      }));
    },
  };

  return (
    <div>
      <Modal
        title={data?._id ? t("Update Vehicle") : t("Add Vehicle")}
        visible={openModal}
        onCancel={(e) => handleCancel(e)}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("Cancel")}
          </Button>,
          data?._id ? (
            <Button key="update" type="primary" onClick={UpdateVehicle}>
              {t("Update")}
            </Button>
          ) : (
            <Button key="add" type="primary" onClick={handleAddVehicle}>
              {t("Add")}
            </Button>
          ),
        ]}
      >
        <form action="">
          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Vehicle Name")}</h5>
            <Input
              placeholder="Vehicle Name"
              value={data?.vehicleName}
              onChange={(e) => handleStateChange(e, setData)}
              name="vehicleName"
              onPressEnter={(e) => handleStateChange(e, setData)}
            />
          </div>

          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Vehicle Image")}</h5>
            {data?._id ? (
              <Image
                width={200}
                src={`${process.env.REACT_APP_BASE_URL}/${data.vehicleImage}`}
              />
            ) : data?.vehicleImage instanceof File ||
              data?.vehicleImage instanceof Blob ? (
              <Image width={200} src={URL.createObjectURL(data.vehicleImage)} />
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
    </div>
  );
};

export default AddEditVehicleModal;
