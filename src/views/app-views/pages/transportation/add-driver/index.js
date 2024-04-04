import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Divider,
    Form,
    Image,
    Input,
    Modal,
    PageHeader,
    Radio,
    Select,
    Switch,
    Upload,
    message,
} from "antd";
// import { defaultService, handleStateChange } from "utils/helpers";
import { UploadOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";
// import axios from "axios";
import "react-intl-tel-input/dist/main.css";
import { useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { Header } from "antd/lib/layout/layout";
import logo from "../../../../../assets/countrylogo.svg"
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

const AddDriver = () => {
    const [data, setData] = useState({});
    const [vehicleName, setVehicleName] = useState([])
    const [loading, isLoading] = useState(false)
    const token = localStorage.getItem('auth_token')
    const [isEmail, setIsEmail] = useState(true);
    const [OptionalPhone, setOptionalPhone] = useState(false);
    const [licenceUpload, setLicenceUpload] = useState(false);
    const [carImageUpload, setCarImageUpload] = useState(false)
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const history = useHistory()
    useEffect(() => { });
    const hanldeUploadLicence = (info, imageTypes) => {
        if (imageTypes === 'licenseImage') {
            setData((prevState) => ({
                ...prevState,
                [imageTypes]: info.file.originFileObj,
            }));
        } else {
            setData((prevState) => ({
                ...prevState,
                [imageTypes]: info.fileList,
            }));
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        isLoading(true)
        // console.log(data, "dataAdded");
        if (!data.name) {
            toast.error(t('Name is required !'))
            isLoading(false)
            return
        } else if (!data.emailOrPhone) {
            toast.error(t('Phone number is required  !'))
            isLoading(false)
            return
        } else if (!data.idNumber) {
            toast.error(t("National Id number required !"))
            isLoading(false)
            return
        } else if (!data.city) {
            toast.error(t("City is required !"))
            isLoading(false)
            return
        } else if (!data.carType) {
            toast.error(t("Car type is required !"))
            isLoading(false)
            return
        } else if (!data.carModel) {
            toast.error(t("Car model is required !"))
            isLoading(false)
            return
        } else if (!data.plateNumber) {
            toast.error(t("Plate number is required !"))
            isLoading(false)
            return
        } else if (!licenceUpload) {
            toast.error(t("Driving licence is required !"))
            isLoading(false)
            return
        } else if (!carImageUpload) {
            toast.error(t("Car Image are required !"))
            isLoading(false)
            return
        }
        try {
            let form = new FormData();
            form.append('Admin', true)
            for (let i in data) {
                if (i == "carImage") {
                    console.log(data[i], "====kkk");
                    for (const file of data[i]) {
                        form.append('carImage', file?.originFileObj);
                    }
                }
                else if (i == "city") {
                    form.append('city', data?.city);
                }
                else {
                    form.append(i, data[i]);
                }
            }
            let request = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/auth/signupAsDriver`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (request.status === 201) {
                isLoading(false)
                toast.success(t("Driver registered successfully !!!!"));
                history.push("/app/pages/driver")
            } else {
                toast.error(t("Error while adding Data"));
            }
        } catch (err) {
            console.log(err);
        }
    };
    const phoneRef = useRef(null);
    const handleStateChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const { Option } = Select;
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

    const handleCityChange = (selectedCities) => {
        console.log("Selected Cities:", selectedCities);
        setData((prevState) => ({
            ...prevState,
            "city": [selectedCities],
        }));
    };
    const handleCarTypeChange = (selectedCarType) => {
        console.log("Selected Car Type:", selectedCarType);
        setData((prevState) => ({
            ...prevState,
            "carType": selectedCarType,
        }));
    };
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/transport/getVehicleList`)
            .then((res) => {
                setVehicleName(res.data.data)
                console.log(res.data.data, "ress...")
            })
    }, [])
    // console.log(vehicleName, "vehicleName")
    const handleCancel = () => {
        history.push("/app/pages/driver");
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title={t("Add Driver")}
                style={{ padding: "0px" }}
            />
            <Divider />
            <Form form={form} onFinish={handleSubmit}>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("Name of the Driver")} <span style={{ color: 'red' }}>  *</span>
                    </h5>
                    <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={data?.name}
                        onChange={(e) => handleStateChange(e)}
                        name="name"
                        onPressEnter={(e) => handleStateChange(e)}
                    />
                </div>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("National Id number")} <span style={{ color: 'red' }}>  *</span>
                    </h5>
                    <Input
                        placeholder="National Id number"
                        value={data?.idNumber}
                        onChange={(e) => handleStateChange(e)}
                        name="idNumber"
                        onPressEnter={(e) => handleStateChange(e)}
                        required
                    />
                </div>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("Phone Number")}<span style={{ color: 'red' }}>  *</span>
                    </h5>

                    {/* {console.log(data, "dataaa========>>>>")}
                    <IntlTelInput
                        type="number"
                        containerClassName="intl-tel-input"
                        inputClassName="ant-input"
                        style={{ width: "100%" }}
                        value={data?.emailOrPhone}
                        fieldName="phone"
                        ref={phoneRef}
                        onlyCountries={["sa", ""]}
                        defaultCountry="SA"
                    // separateDialCode={false}
                    // onPhoneNumberFocus={handleStateChange}
                    /> */}

                    {/* {console.log(data?.emailOrPhone, "dataEmail")} */}
                    <Input
                        prefix={<img src={logo} />}
                        placeholder="Enter your phone number"
                        value={`${data?.emailOrPhone}`}
                        type="number"
                        onChange={(e) => handleStateChange(e)}
                        name="emailOrPhone"
                        onPressEnter={(e) => handleStateChange(e)}
                    />
                </div>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("Email")}
                    </h5>

                    <Input
                        placeholder="Email"
                        status={"error"}
                        type="email"
                        value={data?.email}
                        onChange={(e) => handleStateChange(e)}
                        name="email"
                        onPressEnter={(e) => handleStateChange(e)}
                        required
                    />
                </div>

                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>   {t("City")} <span style={{ color: 'red' }}>  *</span></h5>
                    <Select
                        // Enable multiple selections
                        style={{
                            width: "100%",
                        }}
                        name="city"
                        value={data.city}
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
                </div>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>   {t("Car Type")} <span style={{ color: 'red' }}>  *</span></h5>
                    <Select
                        onChange={handleCarTypeChange}
                        // defaultValue={carTypeOptions[0]}
                        style={{ width: "100%" }}
                        name="carType"
                        placeholder="Select car type"
                        value={data.carType}
                    >
                        {vehicleName?.map((carType) => (

                            <Option value={carType._id} >
                                {carType.vehicleName}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("Car Model")} <span style={{ color: 'red' }}>  *</span>
                    </h5>
                    <Input
                        placeholder="Enter your Car Model"
                        value={data?.carModel}
                        onChange={(e) => handleStateChange(e)}
                        name="carModel"
                        onPressEnter={(e) => handleStateChange(e)}
                        required
                    />
                </div>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("Car plate number")} <span style={{ color: 'red' }}>  *</span>
                    </h5>
                    <Input
                        placeholder="Enter your Car plate number"
                        value={data?.plateNumber}
                        onChange={(e) => handleStateChange(e)}
                        name="plateNumber"
                        onPressEnter={(e) => handleStateChange(e)}
                    />
                </div>
                <div>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("Driving licence")} <span style={{ color: 'red' }}>  *</span>
                    </h5>
                    <Upload
                        maxCount={1}
                        listType="picture"
                        beforeUpload={() => true}
                        onChange={(e) => {
                            hanldeUploadLicence(e, "licenseImage");
                            setLicenceUpload(true);
                        }}
                    //accept=".jpg, .jpeg, .png, .pdf" // Specify accepted file types (images and PDFs)

                    >
                        <Button icon={<UploadOutlined />}>
                            {t("Uploading Image of licence")}
                        </Button>
                    </Upload>
                </div>
                <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                    <h5 style={{ marginBottom: "10px", marginTop: "10px" }}>
                        {t("Car Images")}<span style={{ color: 'red' }}>  *</span>
                    </h5>
                    <Upload
                        // listType="picture"
                        onChange={(e) => {
                            hanldeUploadLicence(e, "carImage");
                            setCarImageUpload(true)
                        }}
                        listType="picture-card"
                        maxCount={3}
                        style={{ width: "100%" }}
                    >
                        <div>
                            <PlusOutlined />
                            <div
                                style={{
                                    marginTop: 8,
                                }}
                            >
                                {t("Upload")}
                            </div>
                        </div>
                    </Upload>
                </div>
                <div className="d-flex " style={{ marginTop: "20px", gap: "30px" }}>
                    <Button type="primary" htmlType="submit" loading={loading} onClick={handleSubmit}>
                        {t("Submit")}
                    </Button>
                    <Button key="back" onClick={handleCancel}>
                        {t("Cancel")}
                    </Button>,
                </div>
            </Form>
        </div>
    );
};

export default AddDriver;
