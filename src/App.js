import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter as Router } from "react-router-dom";
import Views from "./views";
import { Route, Switch } from "react-router-dom";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { THEME_CONFIG } from "./configs/AppConfig";
import i18n from "i18next/i18n";
import { ToastContainer } from "react-toastify";

const themes = {
  // dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  // light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
  dark: `/css/dark-theme.css`,
  light: `/css/light-theme.css`,
};

function App() {
  const isArabic = localStorage.getItem("language") === "ar";
  useEffect(() => {
    if (i18n.language === "ar") {
      const body = document.getElementById("body");
      body.classList.add("dir-rtl");
      body.classList.remove("dir-ltr");
    }
  }, []);
  return (
    <div className={`App ${isArabic && "rtl"}`}>
      <Provider store={store}>
        <ThemeSwitcherProvider
          themeMap={themes}
          defaultTheme={THEME_CONFIG.currentTheme}
          insertionPoint="styles-insertion-point"
        >
          <Router>
            <Switch>
              <Route path="/" component={Views} />
            </Switch>
          </Router>
        </ThemeSwitcherProvider>
      </Provider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={localStorage.getItem("language") === "ar" ? true : false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
