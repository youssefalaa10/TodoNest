import React from "react";
import { FlatList } from "react-native";
import TodoItem from "./TodoItem";

const Todos = ({ todos, navigateToDetails, editTodo, showDeleteConfirmation, markTodoDone }) => {
    return (
        <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TodoItem
                    item={item}
                    navigateToDetails={navigateToDetails}
                    editTodo={editTodo}
                    showDeleteConfirmation={showDeleteConfirmation}
                    markTodoDone={markTodoDone}
                />
            )}
        />
    );
};

export default Todos;
