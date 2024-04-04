import { Button, Col, Divider, Image, Input, Modal, Row, Upload } from "antd";
import React, { useEffect, useRef } from "react";
import { handleStateChange } from "utils/helpers";
import { UploadOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import "react-intl-tel-input/dist/main.css";
import IntlTelInput from "react-intl-tel-input";
const AddViewDriverModal = ({ openModal, setOpenModal, data, setData }) => {
  console.log(data, "data_working_3233")
  const { t } = useTranslation();
  const phoneRef = useRef(null);
  const token = localStorage.getItem("auth_token");

  const handleCancel = () => {
    setOpenModal(false);
    setData((prev) => ({}));
  };
  const handleAddDriver = async () => {
    try {
      let form = new FormData();

      form.append("emailOrPhone", phoneRef?.current?.state?.value);
      form.append("Admin", true);
      let request = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/signupAsDriver`,
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
  const fileExtension = data?.driverDetails?.drivingLicense.split('.').pop();
  // console.log(data, "data>>++++")
  console.log(data, "data_>>>")
  return (
    <div>
      <Modal
        title={data?._id ? t("View Driver") : t("Add Driver")}
        visible={openModal}
        onCancel={(e) => handleCancel(e)}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("Cancel")}
          </Button>,

          !data?._id ? (
            <Button key="add" type="primary" onClick={handleAddDriver}>
              {t("Add")}
            </Button>
          ) : null,
        ]}
      >
        <form action="">
          {console.log(data, "data>>>>")}
          {data._id ? (
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <h5>{t("Name of the driver")}</h5>
                <h4>
                  {console.log(data.fullName, "fullname")}
                  {data?.fullName.replace(/[^\w\s\u0600-\u06FF]/g, '').trim()}
                </h4>

              </Col>
              <Col span={12}>
                <h5>{t("Id number")}</h5>
                {/* {console.log(data.driverdriverDetails
                  .idNumber, "id_number_123")} */}
                <h4>{data?.driverDetails
                  .idNumber.replace(/[^\w\s]/g, '').trim()}</h4>
              </Col>
              <Divider style={{ margin: "0px" }} />

              <Col span={12}>
                <h5>{t("Phone number")}</h5>
                <h4>{data?.phone || "N/A"}</h4>
              </Col>
              <Col span={12}>
                <h5>{t("Email")}</h5>
                <h4>{data?.email}</h4>
              </Col>
              <Divider style={{ margin: "0px" }} />
              <Col span={12}>
                <h5>{t("Car model")}</h5>
                <h4>{data?.driverDetails?.carModel?.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_')}</h4>
              </Col>
              <Col span={12}>
                <h5>{t("Car type")}</h5>
                {console.log(data?.driverDetails, "pppppp")}
                <h4>
                  {data?.driverDetails?.carType?.vehicleName
                  }</h4>
              </Col>
              {console.log(data, "=====>>>>>>")}
              <Divider style={{ margin: "0px" }} />
              <Col span={12}>
                <h5>{t("City")}</h5>
                <h4>{data?.driverDetails?.city}</h4>
              </Col>
              <Col span={12}>
                <h5>{t("Plate number")}
                </h5>
                {console.log(data?.driverDetails?.plateNumber, "plateNumber")}
                <h4>{data?.driverDetails?.plateNumber.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_')}
                </h4>
              </Col>
              <Divider style={{ margin: "0px" }} />
              <Col span={12}>
                <h5>{t("Driving license")}</h5>
                {console.log(data.driverDetails.drivingLicense, "driving")}
                {fileExtension == "pdf" ? <div>
                  <a href={`${process.env.REACT_APP_BASE_URL}/${data.driverDetails.drivingLicense}`} target="_blank" rel="noopener noreferrer">
                    {t("Download pdf")}
                  </a>
                </div> :
                  <img
                    style={{ margin: "10px", height: "100px", width: "100px" }}
                    // height={100}
                    // width={200}

                    src={`${process.env.REACT_APP_BASE_URL}/${data.driverDetails.drivingLicense}`}
                  // src={`${process.env.REACT_APP_IMAGE_URL}/${data.driverDetails.drivingLicense}`}
                  />}
              </Col>
              <Divider style={{ margin: "0px" }} />
              <Col span={12}>
                <h5>{t("Car images")}</h5>
                <div style={{ display: 'flex' }}>
                  {console.log(data, "dataa")}
                  {data.driverDetails.carPictures
                    ?.map((carImages) => {
                      { console.log(carImages, "carImages>>>>>======") }
                      return < img
                        style={{ width: '70px', height: '70px', marginRight: "20px" }}

                        src={`${process.env.REACT_APP_BASE_URL}/${carImages}`
                        }
                      // src={`${process.env.REACT_APP_IMAGE_URL}/${data.driverDetails.drivingLicense}`}
                      />
                    })}
                </div>
              </Col>
              <Divider style={{ margin: "0px" }} />

            </Row>
          ) : (
            <div>
              <h5 style={{ marginBottom: "0px" }}>{t("Phone Number")}</h5>
              <IntlTelInput
                containerClassName="intl-tel-input"
                inputClassName="ant-input"
                style={{ width: "100%" }}
                defaultValue={data?.emailOrPhone}
                fieldName="emailOrPhone"
                ref={phoneRef}
              />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default AddViewDriverModal;
