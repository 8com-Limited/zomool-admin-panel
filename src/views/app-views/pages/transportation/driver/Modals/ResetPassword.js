import { Button, Divider, Form, Input, Modal } from 'antd';
import axios from 'axios';
import { t } from 'i18next';

import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

const ResetPassword = ({ openReset, setOpenReset, data, setData }) => {
    const history = useHistory()
    const [resetData, setResetData] = useState()
    const handleCancel = () => {
        setOpenReset(false);
        setResetData({

        })
    };
    const token = localStorage.getItem("auth_token")
    console.log(data, "dataa...>>>>")

    const handleSave = async () => {
        try {
            const object = {
                newPassword: resetData.newPassword,
                driverId: data._id
            }
            console.log(object, "objecttt>>>>>")
            // let form = new FormData();
            // form.append('Admin', true)
            // form.append("newPassword", resetData?.newPassword)
            // form.append("driverId", data._id)
            // console.log(form, "form")
            console.log(resetData, "resetdataa....")
            let request = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/auth/resetPasswordOfDriver`,
                object,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (request.status == 201) {
                toast.success(t("Password updated successfully"));
                history.push("/app/pages/driver")
                setResetData({})
            } else if (request.status == 404) {
                toast.error("Driver not found")
            }
            else {
                toast.error(t("Error while adding Data"));
            }
        } catch (err) {
            console.log(err);
        }
    }
    const handleStateChange = (e) => {
        // console.log({ name: name, value: value }, "ppppp")
        const { name, value } = e.target;
        setResetData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    return (
        <div>
            <Modal onCancel={(e) => handleCancel(e)}
                title={(t("Reset password"))}
                visible={openReset}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        {t("Cancel")}
                    </Button>,
                    <Button type="primary" onClick={handleSave}>{t("Update")}</Button>
                ]}>
                <Form>
                    <Input
                        type="text"
                        placeholder="Enter your new password"
                        value={resetData?.newPassword}
                        onChange={(e) => handleStateChange(e)}
                        name="newPassword"
                    />
                </Form>

            </Modal>
        </div>
    )
}

export default ResetPassword
