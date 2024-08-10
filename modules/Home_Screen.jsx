import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  Modal,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const storedTodos = await AsyncStorage.getItem("todos");
    const storedCompletedTodos = await AsyncStorage.getItem("completedTodos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    if (storedCompletedTodos) {
      setCompletedTodos(JSON.parse(storedCompletedTodos));
    }
  };

  const saveTodos = async (newTodos, newCompletedTodos = completedTodos) => {
    await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
    await AsyncStorage.setItem(
      "completedTodos",
      JSON.stringify(newCompletedTodos)
    );
  };

  const addTodo = () => {
    if (title && description) {
      const newTodo = { id: Date.now(), title, description, status: "Active" };
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      saveTodos(newTodos);
      setTitle("");
      setDescription("");
    }
  };

  const editTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      removeTodo(id);
    }
  };

  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
    setTodoToDelete(null);
  };

  const markTodoDone = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const newTodos = todos.filter((todo) => todo.id !== id);
      const newCompletedTodos = [
        ...completedTodos,
        { ...todo, status: "Done" },
      ];
      setTodos(newTodos);
      setCompletedTodos(newCompletedTodos);
      saveTodos(newTodos, newCompletedTodos);
    }
  };

  const navigateToDetails = (todo) => {
    navigation.navigate("TodoDetails", { todo });
  };

  const showDeleteConfirmation = (id) => {
    setTodoToDelete(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (todoToDelete !== null) {
      removeTodo(todoToDelete);
    }
    setModalVisible(false);
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setTodoToDelete(null);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRkoMuFUneOoSpINw6FJan7yppHzyN3rY2ow&s",
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>TODO APP</Text>
        <TextInput
          style={styles.input}
          placeholder="Todo Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Todo Description"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Submit</Text>
        </TouchableOpacity>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <TouchableOpacity onPress={() => navigateToDetails(item)}>
                <Text style={styles.todoTitle}>{item.title}</Text>
                <Text style={styles.todoDescription}>{item.description}</Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => editTodo(item.id)}>
                  <Icon name="pencil-outline" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showDeleteConfirmation(item.id)}
                >
                  <Icon name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
                {item.status === "Active" && (
                  <TouchableOpacity onPress={() => markTodoDone(item.id)}>
                    <Icon
                      name="checkmark-done-outline"
                      size={20}
                      color="#28a745"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Deletion</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete this todo item?
              </Text>
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={cancelDelete} />
                <Button
                  title="Delete"
                  onPress={confirmDelete}
                  color="#dc3545"
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const CompletedTasksScreen = () => {
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    loadCompletedTodos();
  }, []);

  const loadCompletedTodos = async () => {
    const storedCompletedTodos = await AsyncStorage.getItem("completedTodos");
    if (storedCompletedTodos) {
      setCompletedTodos(JSON.parse(storedCompletedTodos));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <FlatList
        data={completedTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoTitle}>{item.title}</Text>
            <Text style={styles.todoDescription}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Completed") {
              iconName = "checkmark-done-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#007bff",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Completed" component={CompletedTasksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 8,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  todoDescription: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default App;
