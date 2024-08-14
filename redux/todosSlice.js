// redux/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        completedTodos: [],
    },
    reducers: {
        addTodo: (state, action) => {
            state.todos.push(action.payload);
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
        },
        markTodoDone: (state, action) => {
            const todo = state.todos.find(todo => todo.id === action.payload);
            if (todo) {
                state.todos = state.todos.filter(todo => todo.id !== action.payload);
                state.completedTodos.push({ ...todo, status: "Done" });
            }
        },
        loadTodos: (state, action) => {
            state.todos = action.payload.todos || [];
            state.completedTodos = action.payload.completedTodos || [];
        },
    },
});

export const { addTodo, removeTodo, markTodoDone, loadTodos } = todosSlice.actions;
export default todosSlice.reducer;
