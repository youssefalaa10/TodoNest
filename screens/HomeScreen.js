
import React, { useEffect } from "react";
import { View, ImageBackground, Modal, Text, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoForm from "../components/TodoForm";
import Todos from "../components/Todos";
import { addTodo, removeTodo, markTodoDone, loadTodos } from "../redux/todosSlice";

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos.todos);
    const completedTodos = useSelector((state) => state.todos.completedTodos);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [modalVisible, setModalVisible] = React.useState(false);
    const [todoToDelete, setTodoToDelete] = React.useState(null);

    useEffect(() => {
        loadTodosFromStorage();
    }, []);

    const loadTodosFromStorage = async () => {
        const storedTodos = await AsyncStorage.getItem("todos");
        const storedCompletedTodos = await AsyncStorage.getItem("completedTodos");
        dispatch(loadTodos({
            todos: JSON.parse(storedTodos) || [],
            completedTodos: JSON.parse(storedCompletedTodos) || []
        }));
    };

    const saveTodosToStorage = async () => {
        await AsyncStorage.setItem("todos", JSON.stringify(todos));
        await AsyncStorage.setItem("completedTodos", JSON.stringify(completedTodos));
    };

    const addNewTodo = () => {
        if (title && description) {
            const newTodo = { id: Date.now(), title, description, status: "Active" };
            dispatch(addTodo(newTodo));
            saveTodosToStorage();
            setTitle("");
            setDescription("");
        }
    };

    const editTodo = (id) => {
        const todo = todos.find((todo) => todo.id === id);
        if (todo) {
            setTitle(todo.title);
            setDescription(todo.description);
            dispatch(removeTodo(id));
            saveTodosToStorage();
        }
    };

    const handleMarkTodoDone = (id) => {
        dispatch(markTodoDone(id));
        saveTodosToStorage();
    };

    const showDeleteConfirmation = (id) => {
        setTodoToDelete(id);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (todoToDelete !== null) {
            dispatch(removeTodo(todoToDelete));
            saveTodosToStorage();
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
                <Text style={styles.header}>Todo App</Text>
                <TodoForm
                    title={title}
                    description={description}
                    setTitle={setTitle}
                    setDescription={setDescription}
                    addTodo={addNewTodo}
                />
                <Todos
                    todos={todos}
                    navigateToDetails={(todo) => navigation.navigate("TodoDetails", { todo })}
                    editTodo={editTodo}
                    showDeleteConfirmation={showDeleteConfirmation}
                    markTodoDone={handleMarkTodoDone}
                />
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Delete Todo</Text>
                            <Text style={styles.modalText}>
                                Are you sure you want to delete this todo?
                            </Text>
                            <View style={styles.modalButtons}>
                                <Button title="Yes" onPress={confirmDelete} color="#dc3545" />
                                <Button title="No" onPress={cancelDelete} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        marginBottom: 16,
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
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default HomeScreen;
