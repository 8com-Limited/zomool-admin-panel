import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Divider, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { GoogleSVG, FacebookSVG } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import { message } from "antd";
import {
  signIn,
  showLoading,
  showAuthMessage,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
} from "redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
// import { ToastContainer } from 'react-toastify';

export const LoginForm = (props) => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});

  const {
    otherSignIn,
    showForgetPassword,
    hideAuthMessage,
    onForgetPasswordClick,
    signInWithGoogle,
    signInWithFacebook,
    extra,
    signIn,
    token,
    redirect,
    showMessage,
    message,
    allowRedirect,
    t,
  } = props;

  const initialCredential = {
    email: "user1@themenate.net",
    password: "2005ipo",
  };

  const onLogin = async () => {
    console.log(data, "loginfghfh");

    setLoading(true);
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/admin/loginAdmin`;
      const postData = {
        emailOrPhone: data.email,
        password: data.password,
      };

      const response = await axios.post(apiUrl, postData);
      console.log(response.data.token, "response");
      localStorage.setItem("auth_token", response.data.token);
      toast.success("login successfully !");
      setTimeout(() => {
        window.location.pathname = "app/pages/user-list";
        localStorage.setItem("user_data", JSON.stringify(response.data.data));
      }, 2500);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);

      // setError(error.message); // Handle any errors that occurred during the API call
    }
    // localStorage.setItem("auth_token", user.user.uid);
    //http://localhost:3000/app/dashboards/default
    // signIn(values);
  };
  const handleChanges = (e) => {
    // console.log(e.target.value,"loginfghfh")
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onGoogleLogin = () => {
    setLoading(true);
    signInWithGoogle();
    setLoading(false);
  };

  const onFacebookLogin = () => {
    setLoading(true);
    signInWithFacebook();
    setLoading(false);
  };

  useEffect(() => {
    if (token !== null && allowRedirect) {
      history.push(redirect);
    }
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage();
      }, 3000);
    }
  });

  const renderOtherSignIn = (
    <div>
      <Divider>
        <span className="text-muted font-size-base font-weight-normal">
          or connect with
        </span>
      </Divider>
      <div className="d-flex justify-content-center">
        <Button
          onClick={() => onGoogleLogin()}
          className="mr-2"
          disabled={loading}
          icon={<CustomIcon svg={GoogleSVG} />}
        >
          Google
        </Button>
        <Button
          onClick={() => onFacebookLogin()}
          icon={<CustomIcon svg={FacebookSVG} />}
          disabled={loading}
        >
          Facebook
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* <motion.div 
				initial={{ opacity: 0, marginBottom: 0 }} 
				animate={{ 
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0 
				}}> 
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div> */}

      <Form
        layout="vertical"
        name="login-form"
        // initialValues={initialCredential}
        onFinish={onLogin}
      >
        <Form.Item
          name="email"
          label={t("Email")}
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
            {
              type: "email",
              message: "Please enter a validate email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-primary" />}
            name="email"
            onChange={(e) => handleChanges(e)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={
            <div
              className={`${
                showForgetPassword
                  ? "d-flex justify-content-between w-100 align-items-center"
                  : ""
              }`}
            >
              <span>{t("Password")}</span>
              {showForgetPassword && (
                <span
                  onClick={() => onForgetPasswordClick}
                  className="cursor-pointer font-size-sm font-weight-normal text-muted"
                >
                  Forget Password?
                </span>
              )}
            </div>
          }
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-primary" />}
            name="password"
            onChange={(e) => handleChanges(e)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="button-color"
            htmlType="submit"
            block
            loading={loading}
          >
            {t("Sign In")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  signIn,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
