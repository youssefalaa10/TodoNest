import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

const TodoForm = ({ title, description, setTitle, setDescription, addTodo }) => {
    return (
        <View>
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
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default TodoForm;
