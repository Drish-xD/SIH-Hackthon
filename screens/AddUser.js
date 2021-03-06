import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Picker,
  Image,
  ImageBackground,
} from "react-native";
import { FormBuilder } from "react-native-paper-form-builder";
import { Controller, useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const AddUser = ({ navigation }) => {
  const [hasCameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      employeename: "",
      gender: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const registerFace = async ({ employeename, gender }) => {
    await axios
      .post("http://33ae-103-255-232-154.ngrok.io/registerface", {
        company_id: 1,
        name: employeename,
        gender: gender,
        image: image,
      })
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        navigation.navigate("Admin");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.base64);
    }
  };
  if (hasCameraPermission === false) {
    return <Text>Please Allow Camera Permissions</Text>;
  }
  return (
    <View style={styles.containerStyle}>
      <ImageBackground
        source={{
          uri: "https://raw.githubusercontent.com/Drish-xD/SIH-Hackthon/master/assets/bg.png",
        }}
        resizeMode="cover"
        style={styles.containerStyle}
      >
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <Text style={styles.headingStyle}>Employee Register</Text>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              {
                name: "employeename",
                type: "text",
                rules: {
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                },
                textInputProps: {
                  label: "Employee Name",
                },
              },
            ]}
          />

          <Controller
            control={control}
            name="gender"
            rules={{
              required: { message: "Gender is required!", value: true },
            }}
            render={({ field }) => (
              <View style={{backgroundColor: "white"}}>
                <Picker
                  selectedValue={field.value}
                  style={{ height: 30, width: "100%", marginBottom: 20 }}
                  onValueChange={(value) => field.onChange(value)}
                  >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
               </View>
            )}
          />
          {image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${image}` }}
              style={{ height: 100, width: 100, alignSelf: "center" }}
            />
          )}

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Button
              icon="camera"
              mode="outlined"
              onPress={() => pickImage()}
              style={{
                paddingHorizontal: 25,
                paddingVertical: 5,
                marginBottom: 30,
                borderRadius: 50,
                width: "100%",
              }}
            >
              Image
            </Button>

            <Button
              mode="contained"
              style={{
                borderRadius: 50,
                paddingHorizontal: 25,
                paddingVertical: 5,
                width: "100%",
              }}
              onPress={handleSubmit((data) => registerFace(data))}
            >
              Submit
            </Button>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  scrollViewStyle: {
    marginTop: 200,
    padding: 15,
  },
  headingStyle: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
});
