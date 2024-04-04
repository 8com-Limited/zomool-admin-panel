import React from "react";
import LoginForm from "../../components/LoginForm";
import { Row, Col } from "antd";
import { connect, useSelector } from "react-redux";
import { useTranslation, withTranslation } from "react-i18next"; // Step 1: Import withTranslation
import { Select } from "antd";

const { Option } = Select;
const backgroundURL = "/img/others/img-22.png";
const backgroundStyle = {
  backgroundImage: `url(${backgroundURL})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const LoginTwo = (props) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const { t, i18n } = useTranslation(); // Step 2: Access t and i18n objects from props
  console.log(t, i18n, "nnnnnnn");
  // Step 3: Check if the current language is Arabic ('ar')
  const isArabic = i18n.language === "ar";
  const rootClassName = `h-100 ${theme === "light" ? "bg-white" : ""} ${
    isArabic ? "rtl" : ""
  }`;
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
  ];

  const handleLanguageChange = (value) => {
    localStorage.setItem("language", value);
    i18n.changeLanguage(value);
  };
  return (
    <div className={rootClassName}>
      <Row justify="center" className="align-items-stretch h-100">
        <Col xs={20} sm={20} md={24} lg={16}>
          <div className="container d-flex flex-column justify-content-center h-100">
            <Row justify="center">
              <Col xs={24} sm={24} md={20} lg={12} xl={8}>
                <h1>{t("Sign In")}</h1>
                <p>
                  {t("Don't have an account yet?")}{" "}
                  <a href="/auth/register-2">{t("Sign Up")}</a>
                </p>
                <div className="mt-4">
                  <LoginForm {...props} />
                </div>
                <Select
                  defaultValue={i18n.language}
                  onChange={handleLanguageChange}
                  style={{ width: 120 }}
                  aria-label="Language Dropdown"
                >
                  {languageOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={8}>
          <div
            className="d-flex flex-column justify-content-between h-100 px-4"
            style={backgroundStyle}
          ></div>
        </Col>
      </Row>
    </div>
  );
};

export default connect()(withTranslation()(LoginTwo));
