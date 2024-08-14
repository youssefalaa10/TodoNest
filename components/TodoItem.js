import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TodoItem = ({ item, navigateToDetails, editTodo, showDeleteConfirmation, markTodoDone }) => {
    return (
        <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => navigateToDetails(item)}>
                <Text style={styles.todoTitle}>{item.title}</Text>
                <Text style={styles.todoDescription}>{item.description}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => editTodo(item.id)}>
                    <Icon name="pencil-outline" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDeleteConfirmation(item.id)}>
                    <Icon name="trash-outline" size={20} color="#dc3545" />
                </TouchableOpacity>
                {item.status === "Active" && (
                    <TouchableOpacity onPress={() => markTodoDone(item.id)}>
                        <Icon name="checkmark-done-outline" size={20} color="#28a745" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default TodoItem;
