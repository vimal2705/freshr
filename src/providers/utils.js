import { showMessage } from "react-native-flash-message";
import * as SecureStore from "expo-secure-store";

export const getError = (e) => {
  let res = {}
  try {
    if (e.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res = { message: e.response.data.message };
    } else {
      res = { message: e.message };
    }
  } catch (err) {
    res = {message: `${e}`}
  }
  return res

};

export const flashMessageStyle = {
  hideStatusBar: false,
  duration: 10000,
  style: {
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 65,
  },
};

export const sendMessage = (title, description, status, duration, color) => console.log("message show");
  // showMessage({
  //   message: title,
  //   description,
  //   type: status,
  //   backgroundColor: color,
  //   ...flashMessageStyle,
  //   duration,
  // });


export const getTokenAndCreateAuthorizationHeader = async (isJson=false) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    if (isJson) {
      console.log("ssss",config);
      return config
    } else {
      
      return {
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        }
      }
    }
  } catch (e) {
    throw new Error("Something wrong happened please login again.")
  }
}

export const handleError = (e, setLoading, setError, theme) => {
  setLoading(false);
  setError(e);
  console.log(e, getError(e));

  sendMessage(
    "Failure",
    getError(e).message,
    "warning",
    2500,
    theme.colors.ui.warning
  );
}

export const handleSuccess = (res, setLoading, theme) => {
  setLoading(false);
  sendMessage(
    "Updated",
    res.data.message,
    "success",
    1000,
    theme.colors.brand.primary
  );
}
