import { AutoComplete, Select } from "antd";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";    

const LocationSearch = ({ setData, data }) => {
  const { t } = useTranslation();
  const [options, setoptions] = useState([]);
  const onSearch = (value) => {
    setData((prev) => ({ ...prev, locationName: value }));
  };

  const onSelect = (value, option) => {
    setData((prev) => ({
      ...prev,
      locationName: value,
      long: option.location.long,
      lat: option.location.lat,
    }));
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/search/getSearchData?searchText=${data.locationName}`
      )
      .then((response) => {
        console.log(response);
        let optioArray = [];
        response?.data?.message?.map((ele) => {
          optioArray.push({
            label: ele.formatted_address,
            value: ele.formatted_address,
            location: {
              long: ele.geometry.location.lng,
              lat: ele.geometry.location.lng,
            },
          });
        });
        setoptions(optioArray);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data.locationName]);

  return (
    <div>
      <h5 style={{ marginBottom: "0px" }}>{t("Location Name")}</h5>
      <AutoComplete
        options={options}
        value={data.locationName}
        style={{
          width: "100%",
          border: "1px solid gray !important",
        }}
        onSelect={onSelect}
        onSearch={(text) => onSearch(text)}
        placeholder="input here"
        bordered={true}
      />
    </div>
  );
};

export default LocationSearch;
