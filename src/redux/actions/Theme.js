import {
  TOGGLE_COLLAPSED_NAV,
  SIDE_NAV_STYLE_CHANGE,
  CHANGE_LOCALE,
  NAV_TYPE_CHANGE,
  TOP_NAV_COLOR_CHANGE,
  HEADER_NAV_COLOR_CHANGE,
  TOGGLE_MOBILE_NAV,
  SWITCH_THEME,
  DIRECTION_CHANGE,
} from "../constants/Theme";

export function toggleCollapsedNav(navCollapsed) {
  return {
    type: TOGGLE_COLLAPSED_NAV,
    navCollapsed,
  };
}

export function onNavStyleChange(sideNavTheme) {
  return {
    type: SIDE_NAV_STYLE_CHANGE,
    sideNavTheme,
  };
}

export function onLocaleChange(locale) {
  localStorage.setItem("language", locale);
  const body = document.getElementById("body");
  window.location.reload();
  //   console.log('object');
  body.classList.toggle("dir-rtl");
  body.classList.toggle("dir-ltr");
  if (locale === "ar") {
    onDirectionChange("rtl");
  }
  return {
    type: CHANGE_LOCALE,
    locale,
  };
}

export function onNavTypeChange(navType) {
  return {
    type: NAV_TYPE_CHANGE,
    navType,
  };
}

export function onTopNavColorChange(topNavColor) {
  return {
    type: TOP_NAV_COLOR_CHANGE,
    topNavColor,
  };
}

export function onHeaderNavColorChange(headerNavColor) {
  return {
    type: HEADER_NAV_COLOR_CHANGE,
    headerNavColor,
  };
}

export function onMobileNavToggle(mobileNav) {
  return {
    type: TOGGLE_MOBILE_NAV,
    mobileNav,
  };
}

export function onSwitchTheme(currentTheme) {
  return {
    type: SWITCH_THEME,
    currentTheme,
  };
}

export function onDirectionChange(direction) {
  console.log("direction");
  return {
    type: DIRECTION_CHANGE,
    direction,
  };
}
