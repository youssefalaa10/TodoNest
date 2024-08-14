import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const CompletedTasksScreen = () => {
    const completedTodos = useSelector((state) => state.todos.completedTodos);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Completed Tasks</Text>
            <FlatList
                data={completedTodos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.completedTodoItem}>
                        <Text style={styles.todoTitle}>{item.title}</Text>
                        <Text style={styles.todoDescription}>{item.description}</Text>
                    </View>
                )}
            />
        </View>
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
        marginBottom: 16,
    },
    completedTodoItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        marginBottom: 8,
    },
    todoTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    todoDescription: {
        fontSize: 14,
        color: "#666",
    },
});

export default CompletedTasksScreen;



