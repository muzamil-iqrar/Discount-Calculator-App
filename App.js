import React, { useState, useEffect } from "react";
import {StyleSheet,Text,View,TextInput,TouchableOpacity,Alert,SafeAreaView,ScrollView,} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";

const HomeScreen = ({ navigation, route }) => {
  const [Or_price, setOr_price] = useState("");
  const [Disc_Percent, setDisc_Percent] = useState("");
  const [Save_Btn_disable, setSave_Btn_disable] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(route.params !== undefined ? Object.values(route.params) : []);
  }, [route.params]);

  useEffect(() => {
    console.log("useffect");
    if (Or_price !== "") {
      setSave_Btn_disable(false);
    } else {
      setSave_Btn_disable(true);
    }
  }, [Or_price]);

  const Or_priceHandler = (price) => {
    if (price >= 0) {
      setOr_price(price);
      setSave_Btn_disable(false);
    }
  };

  const Disc_PercentHandler = (percent) => {
    if (percent <= 100) {
      setDisc_Percent(percent);
    }
  };

  const saved_Price = () => {
    let disc_Price = Or_price * (Disc_Percent / 100);
    return disc_Price.toFixed(2);
  };
  const new_Price = () => {
    let final_Price = Or_price - saved_Price();
    return final_Price.toFixed(2);
  };

  const clearInputData = () => {
    setOr_price("");
    setDisc_Percent("");
    setSave_Btn_disable(true);
  };

  const saveDataHandler = () => {
    if (Save_Btn_disable === false) {
      const newData = {
        id: Math.random(),
        Original_Price: Or_price,
        DiscountPercentage: Disc_Percent == "" ? 0 : Disc_Percent,
        new_PriceAfterDiscount: new_Price(),
      };
      setData([...data, newData]);
  
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate("HISTORY", data)}
        >
          <FontAwesome name="history" size={26} color="white" />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        
        <Text style={styles.input_price}>Original Price:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={Or_priceHandler}
          value={Or_price}
        />
        <Text style={styles.input_price}>Discount Percentage:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={Disc_PercentHandler}
          value={Disc_Percent}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.Disc_Text}>
          {Or_price !== 0 && Disc_Percent !== 0
            ? "You Save : $" + saved_Price()
            : ""}
        </Text>
        <Text style={styles.Disc_Text}>
          {Or_price !== 0 && Disc_Percent !== 0
            ? "Discounted Price : $" + new_Price()
            : ""}
        </Text>
      </View>

      <View style={styles.calcBtn}>
        <TouchableOpacity onPress={saveDataHandler}>
          <Text
            style={
              Save_Btn_disable === false ? styles.saveBtn : styles.Save_Btn_disable
            }
          >
            <FontAwesome name="save" size={22} color="white" />
            {"  "} SAVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearInputData}>
          <Text style={styles.clearBtn}>
            <FontAwesome name="close" size={22} color="white" />
            {"  "} CLEAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HistoryScreen = ({ navigation, route }) => {
  const [list, setList] = useState(route.params);

  const deleteItem = (id) => {
    let tempList = list.filter((el) => el.id != id);
    console.log(tempList);
    setList([...tempList]);
  };
// Android Alert
  const clearList = () => {
    if (list.length > 0) {
      Alert.alert(
        "Clear History",
        "Are you really want to clear history?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => setList([]),
          },
        ],
        { cancelable: true }
      );
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.historyBtn} onPress={clearList}>
          <FontAwesome name="minus-square" size={20} color="red" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate("HOME", list)}
        >
          <FontAwesome name="chevron-left" size={20} color="red" />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title numeric>Original Price</DataTable.Title>
          <DataTable.Title numeric>Discount</DataTable.Title>
          <DataTable.Title numeric>Final Price</DataTable.Title>
          <DataTable.Title numeric>Delete</DataTable.Title>
        </DataTable.Header>

        <SafeAreaView>
          <ScrollView>
            {list.map((el) => (
              <DataTable.Row key={el.id}>
                <DataTable.Cell numeric>
                  {"e" + el.Original_Price}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {el.DiscountPercentage + " %"}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {"$" + el.new_PriceAfterDiscount}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteItem(el.id)}
                  >
                    <FontAwesome name="trash" size={22} color="#8e44ad" />
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </SafeAreaView>
      </DataTable>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HOME">
        <Stack.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
          }}
        />
        <Stack.Screen
          name="HISTORY"
          component={HistoryScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007575",
    alignItems: "center",
    margin: 10,
  },
  inputContainer: {
    marginTop: 15,
  },
  historyBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 30,
  },
  textInput: {
    borderRadius: 5,
    width: 300,
    height: 50,
    fontSize: 20,
    paddingLeft: 15,
    marginBottom: 40,
    backgroundColor: "#ecf0f1",
  },
  resultContainer: {
    marginTop: 20,
  },
  input_price: {
    fontSize: 16,
    fontWeight:'bold',
    marginBottom: 8,
    color: "black",
  },
  Disc_Text: {
    fontSize: 20,
    fontWeight:'bold',
    color: "black",
    margin: 2,
    textAlign: "center",
  },
  calcBtn: {
    marginTop: 50,
    flexDirection: "column",
  },
  saveBtn: {
    fontSize: 18,
    color: "white",
    fontWeight:'bold',
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  Save_Btn_disable: {
    fontSize: 18,
    fontWeight:'bold',
    color: "white",
    backgroundColor: "#e1e1e1",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  clearBtn: {
    marginTop:10,
    fontSize: 18,
    fontWeight:'bold',
    color: "white",
    backgroundColor: "blue",
    paddingVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
  },
  deleteBtn: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default App;