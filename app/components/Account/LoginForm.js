import React, { useState } from "react";
import { StyleSheet, View, Platform, Image } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { validateEmail } from "../../utils/validations";
import UserLogged from "../../screens/Account/UserLogged";
import { API_HOST } from "../../utils/constants";

export default function LoginForm(props) {
  const { toastRef } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [token, setToken] = useState("");

  const navigation = useNavigation();

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    if (isEmpty(formData.user) || isEmpty(formData.pass)) {
      toastRef.current.show("All fields must be completed");
    } else if (!validateEmail(formData.user)) {
      toastRef.current.show("Please, enter a valid email address");
    } else {
      var axios = require("axios");
      var qs = require("qs");
      var data = qs.stringify({
        user: formData.user,
        pass: formData.pass,
        device: formData.device,
      });
      var config = {
        method: "post",
        url: `${API_HOST}?user=${formData.user}&pass=${formData.pass}&device=${formData.device}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          navigation.navigate("user-logged");
          setToken(response.data.token);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <>
      <View style={styles.formContainer}>
        <Input
          placeholder="User/Email"
          containerStyle={styles.inputForm}
          onChange={(e) => onChange(e, "user")}
          rightIcon={
            <Icon
              type="material-community"
              name="at"
              iconStyle={styles.icoRight}
            />
          }
        />
        <Input
          placeholder="Password"
          containerStyle={styles.inputForm}
          onChange={(e) => onChange(e, "pass")}
          password={true}
          secureTextEntry={showPassword ? false : true}
          rightIcon={
            <Icon
              type="material-community"
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              iconStyle={styles.icoRight}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <Button
          title="Sign In"
          containerStyle={styles.btnContainerLogin}
          buttonStyle={styles.btnLogin}
          onPress={onSubmit}
        />
        <View style={styles.noView}>
          <UserLogged token={token}/>
        </View>
      </View>
    </>
  );
}

function defaultFormValue() {
  let platform = Platform.OS;

  return {
    user: "",
    pass: "",
    device: platform === "ios" ? "ios" : "android",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "95%",
  },
  btnContainerLogin: {
    marginTop: 10,
    width: "90%",
  },
  btnLogin: {
    backgroundColor: "#00a680",
  },
  icoRight: {
    color: "#c2c2c2",
  },
  noView: {
    display: "none",
  },
});