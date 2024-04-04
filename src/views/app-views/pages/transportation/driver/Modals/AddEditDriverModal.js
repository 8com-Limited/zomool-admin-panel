import { Button, Col, Divider, Image, Input, Modal, InputNumber, Row, Select, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from 'react'
import { UploadOutlined } from "@ant-design/icons";
import { PlusOutlined, DeleteOutlined, } from '@ant-design/icons';
import Profile from "views/app-views/pages/profile";
import { toast } from "react-toastify";
import logo from "../../../../../../assets/countrylogo.svg"
import EditableCard from "views/app-views/components/data-display/tabs/EditableCard";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddEditDriverModal = ({ openEdit, setOpenEdit, data, setData }) => {
    const token = localStorage.getItem("auth_token")
    const { t } = useTranslation();
    const [editedData, setEditedData] = useState({
    });
    const [updateData, setUpdateData] = useState({
        // carImage: []
    });
    const [vehicleName, setVehicleName] = useState([])
    const [licenceUpload, setLicenceUpload] = useState(false);
    // const [carImageUpload, setCarImageUpload] = useState(false)
    const [loading, isLoading] = useState(false)
    const history = useHistory()
    const { Option } = Select;
    // console.log(data, "dataaaaaa=======")
    useEffect(() => {
        setEditedData(data);
        // setInitialData(data);
    }, [data]);
    // console.log(updatedArray, "updatedArray....")
    useEffect(() => {
        axios.get("https://zomool.com/api/transport/getVehicleList")
            .then((res) => {
                setVehicleName(res.data.data)
                // console.log(res.data.data, "ress...")
            })
    }, [])
    console.log(editedData?.driverDetails?.carPictures, "carPictureeessss")
    const cityOptions = [
        "طبرجل",
        "ميقوع",
        "مكة المكرمة",
        "تبوك",
        "حائل",
        "وادى الدواسر",
        "بسيطا",
        "القصيم",
        "الطائف",
        "الرياض",
        "حرض",
        "الأضارع",
        "النبك ابوقصر",
        "المدينة المنورة",
        "أبو عجرم- طبرجل",
        "تيماء",
        "ساجر",
        "جدة",
        "الخرج",
        "دومة الجندل",
        "الدمام",
        "القرية العليا",
        "حفر الباطن",
        "رفحاء",
        "عرعر",
        "طريف",
        "القريات",
        "سكاكا",
        "ينبع",
        "تخابيل",
        "نجران",
        "المذنب",
        "الجوف",
        "بيشه",
        "الشيحيه",
        "الكهفه",
        "الدوامى",
        "الناصفه",
        "بريدة",
        "عنيزة",
        "العيساوية",
        "الوجه",
        "أملج",
        "رابغ",
        "تربه",
        "رنيه",
        "القيصومه",
        "الرس",
        "الغاط",
        "عفيف",
        "رماح",
        "المزاحمية",
        "حرض",
        "الرين",
        "السليل",
        "الأفلاج",
        "شقراء",
        "القرنه",
        "القويعيه"
    ];
    const handleCancel = () => {
        setOpenEdit(false);
        setData((prev) => ({}));
    };
    const handleChange = (e,) => {
        const { name, value } = e.target;
        setUpdateData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    // console.log(editedData?.phone, "phone_editDataaaa")
    // console.log(updateData?.email, editedData?.email, "carimageeee")

    // console.log(updateData?.licenseImage, "driving....", editedData?.licenseImage)

    const handleSave = async () => {
        isLoading(true)
        try {
            let form = new FormData();
            form.append('Admin', true)
            if (updateData?.name) {
                form.append("name", updateData?.name)
            } else {
                form.append("name", editedData?.fullName)
            }
            if (updateData?.email) {
                form.append("email", updateData.email)
            } else {
                form.append("email", editedData?.email)
            }
            //
            if (updateData?.carModel) {
                form.append("carModel", updateData.carModel)
            } else {
                form.append('carModel', editedData?.driverDetails?.carModel)
            }
            //
            if (updateData?.emailOrPhone) {
                form.append("emailOrPhone", updateData.emailOrPhone)
            } else {
                form.append("phone", editedData?.phone)
            }
            //
            if (updateData?.idNumber) {
                form.append("idNumber", updateData?.idNumber)
            } else {
                form.append("idNumber", editedData?.driverDetails?.idNumber)
            }
            //
            if (updateData?.carType) {
                form.append("carType", updateData?.carType)
            } else {
                form.append("carType", editedData?.driverDetails?.carType?._id)
            }
            if (updateData?.plateNumber) {
                form.append("plateNumber", updateData?.plateNumber)
            } else {
                form.append("plateNumber", editedData?.driverDetails?.plateNumber)
            }
            //
            if (updateData?.city) {

                form.append('city', [updateData?.city]);
            }
            else {
                form.append("city", editedData?.driverDetails?.city)
            }
            ///

            if (updateData?.licenseImage) {
                form.append('licenseImage', updateData?.licenseImage);
            } else {
                form.append("licenseImage", editedData?.driverDetails?.drivingLicense)
            }
            ///
            if (updateData?.carImage) {
                let arr = []
                for (const file of updateData?.carImage) {
                    form.append('carImage', file?.originFileObj);
                }
                if (editedData?.driverDetails?.carPictures?.length == 0) {
                    form.append('carImagesArray', arr);
                } else {

                    if (editedData?.driverDetails?.carPictures.length == 1) {
                        form.append('carImagesArray[]', editedData?.driverDetails?.carPictures[0])
                    } else {
                        for (const file of editedData?.driverDetails?.carPictures) {
                            form.append('carImagesArray', file);
                        }
                    }

                }
            }
            else {
                let arr = []
                if (editedData?.driverDetails?.carPictures?.length == 0) {
                    form.append('carImagesArray', arr);
                } else {
                    for (const file of editedData?.driverDetails?.carPictures) {
                        form.append('carImagesArray', file);
                    }
                }
            }

            // if (updateData?.carImage) {
            //     for (const file of updateData?.carImage) {
            //         form.append('carImage', file.originFileObj);
            //     }
            // }

            // if (editedData?.driverDetails?.carPictures.length === 0) {
            //     form.append('carImagesArray', []);
            // } else {
            //     for (const file of editedData?.driverDetails?.carPictures) {
            //         form.append('carImagesArray', file);
            //     }
            // }
            // console.log(editedData.driverDetails.carPictures, "????????")

            let request = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/auth/updateDriverDetails?userId=${editedData?._id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (request.status == 201) {
                toast.success(t("Driver updated successfully !!!"));
                isLoading(false)
                history.push("/app/pages/driver")
            } else {
                toast.error(t("Error while updating Driver"));
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleCarTypeChange = (selectedCarType) => {
        console.log("Selected Car Type:", selectedCarType);
        setUpdateData((prevState) => ({
            ...prevState,
            "carType": selectedCarType,
        }));
    };
    const handleCityChange = (selectedCities) => {
        console.log("Selected Cities:", selectedCities);
        setUpdateData((prevState) => ({
            ...prevState,
            "city": [selectedCities],
        }));
    };
    const fileExtension = data.driverDetails?.drivingLicense.split('.').pop();
    // console.log(editedData?.driverDetails?.carPictures, "finalEditTable")

    const hanldeUploadLicence = (info, imageTypes) => {
        console.log(info, "info", imageTypes)
        if (imageTypes === 'licenseImage') {
            setUpdateData((prevState) => ({
                ...prevState,
                [imageTypes]: info.file,
            }));

        } else {
            setUpdateData((prevState) => ({
                ...prevState,
                [imageTypes]: info.fileList,
            }))
        }
    }
    console.log(updateData, "update")
    const handleremove = (index) => {
        // console.log(index, "indexxx")
        const updatedData = { ...editedData };
        updatedData?.driverDetails?.carPictures.splice(index, 1);
        setUpdateData(updatedData);
    }
    // console.log(editedData?.driverDetails?.carPictures, "Datatttttt>>>>>>")
    return (
        <div>
            <Modal
                title={data?._id ? t("Edit Driver") : t("Add Driver")}
                visible={openEdit}
                onCancel={(e) => handleCancel(e)}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        {t("Cancel")}
                    </Button>,
                    <Button type="primary" loading={loading} onClick={handleSave}>{t("Update")}</Button>
                ]}
            >
                <form>
                    <Row gutter={[24, 16]}>
                        <Col span={12}>
                            <h5>{t("Name of the driver")}</h5>
                            {console.log(editedData?.fullName, "fullnameeeee")}
                            {editedData?.fullName && <Input
                                placeholder="Enter Driver name"
                                defaultValue={editedData?.fullName}
                                onChange={(e) => handleChange(e)}
                                name="name"
                            />}
                        </Col>
                        <Col span={12}>
                            <h5>{t("Id number")}</h5>
                            {/* {console.log(editedData?.driverDetails?.idNumber, "jkghujghguyhhjg")} */}
                            {editedData?.driverDetails?.idNumber && <Input
                                placeholder="National Id number"
                                defaultValue={editedData?.driverDetails?.idNumber}
                                onChange={(e) => handleChange(e)}
                                name="idNumber"
                            />}

                        </Col>
                        <Divider style={{ margin: "0px" }} />
                        <Col span={12}>
                            {console.log(editedData?.phone, "phoneeee")}
                            <h5>{t("Phone number")}</h5>
                            {
                                editedData?.phone &&
                                <Input
                                    prefix={<img src={logo} />}
                                    placeholder="Enter your phone number"
                                    // type="number"
                                    // defaultValue="+966"
                                    defaultValue={editedData?.phone}
                                    // value={editedData?.phone}
                                    onChange={(e) => handleChange(e)}
                                    name="emailOrPhone"
                                />
                            }
                        </Col>
                        <Col span={12}>
                            <h5>{t("Email")}</h5>
                            {
                                editedData?.email && <Input
                                    placeholder="Email"
                                    status={"error"}
                                    type="email"
                                    defaultValue={editedData?.email}
                                    onChange={(e) => handleChange(e)}
                                    name="email"
                                />
                            }
                        </Col>
                        <Divider style={{ margin: "0px" }} />
                        <Col span={12}>
                            <h5>{t("Car model")}</h5>
                            {/* {console.log(editedData?.driverDetails?.carModel, "editTabledata===")} */}
                            {
                                editedData?.driverDetails?.carModel &&
                                <Input
                                    placeholder="Enter your Car Model"
                                    defaultValue={editedData?.driverDetails?.carModel}
                                    onChange={(e) => handleChange(e)}
                                    name="carModel"
                                />
                            }
                        </Col>
                        {/*  */}
                        <Col span={12}>
                            <h5>{t("Car type")}</h5>
                            {console.log(editedData?.driverDetails?.carType?.vehicleName, "ooooo")}

                            {editedData?.driverDetails?.carType &&
                                <Select
                                    onChange={handleCarTypeChange}
                                    style={{ width: "100%" }}
                                    name="carType"
                                    placeholder="Select car type"
                                    defaultValue={editedData?.driverDetails?.carType?.vehicleName}
                                >
                                    {vehicleName?.map((carType) => (
                                        <Option value={carType._id}>
                                            {carType?.vehicleName}
                                        </Option>
                                    ))}
                                </Select>
                            }
                        </Col>
                        <Divider style={{ margin: "0px" }} />
                        <Col span={12}>
                            <h5>{t("Plate number")}
                            </h5>
                            {
                                editedData?.driverDetails?.plateNumber && <Input
                                    placeholder="Enter your Car plate number"
                                    defaultValue={editedData?.driverDetails?.plateNumber}
                                    onChange={(e) => handleChange(e)}
                                    name="plateNumber"
                                />
                            }
                        </Col>
                        <Col span={12}>
                            <h5>{t("City")}</h5>
                            {
                                editedData?.driverDetails?.city &&
                                <Select
                                    // Enable multiple selections
                                    style={{
                                        width: "100%",
                                    }}
                                    name="city"
                                    defaultValue={editedData?.driverDetails?.city[0]}
                                    placeholder="Select cities"
                                    onChange={handleCityChange}
                                    showArrow
                                    // optionLabelProp="label"
                                    // optionFilterProp="value"
                                    dropdownMatchSelectWidth={false}
                                    dropdownStyle={{ minWidth: "200px" }}
                                >
                                    {cityOptions.map((city) => (
                                        <Option value={city} label={t(city)}>
                                            {t(city)}
                                        </Option>
                                    ))}
                                </Select>
                            }
                        </Col>
                        <Divider style={{ margin: "0px" }} />
                        <Col span={12}>
                            <h5>{t("Driving license")}</h5>
                            <Upload
                                beforeUpload={() => {
                                    return false;
                                }}
                                maxCount={1}
                                listType="picture"
                                onChange={(e) => {
                                    hanldeUploadLicence(e, "licenseImage");
                                    setLicenceUpload(true);
                                }}
                            >
                                <Button icon={<UploadOutlined />}>  {t("Upload")}</Button>

                            </Upload>
                            {licenceUpload ? null : (
                                <div>
                                    <Image
                                        style={{ margin: "10px", height: "100px", width: "100px" }}
                                        src={`${process.env.REACT_APP_BASE_URL}/${editedData?.driverDetails?.drivingLicense}`}
                                    />
                                </div>
                            )}
                        </Col>
                        <Divider style={{ margin: "0px" }} />
                        {/* {console.log(editedData?.driverDetails?.carPictures, "newfhfghfh")} */}
                        {editedData?.driverDetails?.carPictures?.map((carImages, index) => {
                            if (index < 3) {
                                return (
                                    <div key={index}>
                                        {/* {updatedArray.push(carImages)} */}
                                        <Image
                                            style={{ width: '70px', height: '70px', marginRight: '20px' }}
                                            src={`${process.env.REACT_APP_BASE_URL}/${carImages}`}
                                        // alt={`Car Image ${index}`}
                                        >
                                        </Image>
                                        <Button onClick={() => handleremove(index)}><DeleteOutlined /></Button>
                                    </div>
                                );
                            }
                            else {
                                return null;
                            }

                        })}
                        {/* {console.log(editedData?.driverDetails?.carPictures.length + (updateData?.carImage?.length == undefined ? 0 : updateData?.carImage?.length), "uuuuuu")} */}
                        {/* {console.log(editedData?.driverDetails?.carPictures, editedData?.carImage, "uuuuuuAftert")} */}

                        <Upload onChange={(e) => hanldeUploadLicence(e, "carImage")}
                            listType="picture-card"
                        >
                            {editedData?.driverDetails?.carPictures.length + (updateData?.carImage?.length == undefined ? 0 : updateData?.carImage?.length) < 3 && (<div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    {t("Upload")}
                                </div>
                            </div>)}
                        </Upload>
                    </Row>
                </form>
            </Modal>

        </div >
    )
}

export default AddEditDriverModal
