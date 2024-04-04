import { Button, Image, Input, Modal, Select, Upload } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { defaultService, handleStateChange } from "utils/helpers";
import { UploadOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import LocationSearch from "components/layout-components/LocationSearch/LocationSearch";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

const AddEditHospitalModal = ({ openModal, setOpenModal, data, setData }) => {
  //   const [data, setData] = useState({
  //     type: "Hospitals",
  //   });
  const phoneRef = useRef(null);
  const [location, setlocation] = useState({});
  const { t } = useTranslation();
  const [servicesData, setServicesData] = useState([
    { value: "default", label: "select" },
  ]);
  const [subServiceData, setSubServiceData] = useState([
    { value: "default", label: "select" },
  ]);
  const token = localStorage.getItem("auth_token");

  const handleCancel = () => {
    setOpenModal(false);
    setData((prev) => ({
      type: "Hospitals",
      service: defaultService(servicesData, "Medical", "Hospitals")[0],
      subService: defaultService(servicesData, "Medical", "Hospitals")[1],
    }));
  };

  const handleAddHospital = async () => {
    try {
      let form = new FormData();
      for (let i in data) {
        form.append(i, data[i]);
      }
      form.append("phone", phoneRef?.current?.state?.value);
      let request = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/medical/addHospitalsData`,
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

  const fetchData = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/service/getServices`; // Replace with your API endpoint URL

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Use Bearer authentication with the access token
        },
      });

      const data = response.data.data.map((ele, i) => {
        return {
          value: ele._id,
          label: ele.serviceName,
          subService: ele.subServices,
        };
      });
      setServicesData(data); // Save the response data to state
      setData((prev) => ({
        ...prev,
        service: defaultService(data, "Medical", "Hospitals")[0],
        subService: defaultService(data, "Medical", "Hospitals")[1],
      }));
    } catch (error) {
      console.log(error.message, "error");
      toast.error("Error while getting services");
    }
  };

  const UpdateHospital = async () => {
    try {
      let form = new FormData();
      for (let i in data) {
        if (i !== "location" && i !== "addedBy" && i !== "phone") {
          form.append(i, data[i]);
        }
      }
      form.append("phone", phoneRef?.current?.state?.value);
      form.append("hospitalId", data._id);
      let request = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/medical/updateHospitalData`,
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
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(async () => {
    const updatedArray = servicesData.filter(
      (obj) => obj.value === data.service
    );

    if (updatedArray.length && updatedArray[0].subService.length) {
      const tempSubService = updatedArray[0].subService.map((ele) => ({
        value: ele._id,
        label: ele.name,
      }));
      setSubServiceData(tempSubService);
    } else {
      setSubServiceData([]);
    }
  }, [data?.service]);

  const props = {
    onChange(info) {
      setData((prev) => ({
        ...prev,
        medicalImage: info.file.originFileObj,
      }));
    },
  };

  useEffect(() => {
    if (data?.updateOnce) {
      for (let i in data?.location) {
        setData((prev) => ({ ...prev, [i]: data?.location[i] }));
      }
      setData((prev) => ({ ...prev, updateOnce: false }));
    }
  }, [data]);

  return (
    <div>
      <Modal
        title={data?._id ? t("Update Hospital") : t("Add Hospital")}
        visible={openModal}
        onCancel={(e) => handleCancel(e)}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("Cancel")}
          </Button>,
          data?._id ? (
            <Button key="update" type="primary" onClick={UpdateHospital}>
              {t("Update")}
            </Button>
          ) : (
            <Button key="add" type="primary" onClick={handleAddHospital}>
              {t("Add")}
            </Button>
          ),
        ]}
      >
        <form action="">
          <div className="d-flex ">
            <div>
              <h5 style={{ marginBottom: "0px" }}>{t("Services Name")}</h5>
              <Select
                defaultValue="default"
                style={{
                  width: 120,
                }}
                value={data?.service}
                onChange={(value) => {
                  setData((prev) => ({
                    ...prev,
                    service: value,
                    subService: "",
                  }));
                }}
                disabled={true}
                options={servicesData}
              />
            </div>
            {subServiceData.length ? (
              <div className="ml-3">
                <h5 style={{ marginBottom: "0px" }}>{t("Subservices Name")}</h5>
                <Select
                  defaultValue="default"
                  style={{
                    width: 120,
                  }}
                  value={data?.subService}
                  onChange={(value) => {
                    setData((prev) => ({ ...prev, subService: value }));
                  }}
                  options={subServiceData}
                  disabled={true}
                />
              </div>
            ) : null}
          </div>
          <LocationSearch setData={setData} data={data} />

          <div className="d-flex ">
            <div>
              <h5 style={{ marginBottom: "0px" }}>{t("Longitude")}</h5>
              <Input
                type="number"
                placeholder="longitude"
                value={data?.long}
                onChange={(e) => handleStateChange(e, setData)}
                name="long"
                readOnly={true}
                onPressEnter={(e) => handleStateChange(e, setData)}
              />
            </div>
            <div className="ml-3">
              <h5 style={{ marginBottom: "0px" }}>{t("Latitude")}</h5>
              <Input
                type="number"
                placeholder="latitude"
                value={data?.lat}
                onChange={(e) => handleStateChange(e, setData)}
                name="lat"
                readOnly={true}
                onPressEnter={(e) => handleStateChange(e, setData)}
              />
            </div>
          </div>
          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Hospital Name")}</h5>
            <Input
              placeholder="Hospital Name"
              value={data?.name}
              onChange={(e) => handleStateChange(e, setData)}
              name="name"
              onPressEnter={(e) => handleStateChange(e, setData)}
            />
          </div>
          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Phone Number")}</h5>
            <IntlTelInput
              containerClassName="intl-tel-input"
              inputClassName="ant-input"
              style={{ width: "100%" }}
              defaultValue={data?.phone}
              fieldName="phone"
              ref={phoneRef}
            />
            {/* <Input
              placeholder="Phone Number"
              value={data?.phone}
              onChange={(e) => handleStateChange(e, setData)}
              name="phone"
              onPressEnter={(e) => handleStateChange(e, setData)}
            /> */}
          </div>

          <div>
            <h5 style={{ marginBottom: "0px" }}>{t("Medical Image")}</h5>
            {data?._id ? (
              <Image
                width={200}
                src={`${process.env.REACT_APP_BASE_URL}/${data.image}`}
              />
            ) : data?.medicalImage instanceof File ||
              data?.medicalImage instanceof Blob ? (
              <Image width={200} src={URL.createObjectURL(data.medicalImage)} />
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

export default AddEditHospitalModal;
