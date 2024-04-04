export const handleStateChange = (e, stateName) => {
  const { name, value } = e.target;
  stateName((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};

export const handleFileInputInState = (e, stateName) => {
  const { name } = e.target;
  stateName((prevState) => ({
    ...prevState,
    [name]: e.target.files[0],
  }));
};

export const defaultService = (
  servicesData,
  serviceName,
  subserviceName = ""
) => {
  const updatedArray = servicesData.filter((obj) => obj.label === serviceName);
  const updatedSubServicesArray = updatedArray[0]?.subService?.filter(
    (obj) => obj.name === subserviceName
  );
  return [updatedArray[0]?.value, updatedSubServicesArray[0]?._id || ""];
};
