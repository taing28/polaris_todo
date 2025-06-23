const fs = require('fs/promises');
const { data: todos } = require('./todos.json');
const path = './src/database/todos.json';


/**
 *
 * @returns {[{title: string, completed: boolean, id: number}, {title: string, completed: boolean, id: number}]}
 */
const findAll = () => {
    return todos
}

/**
 * 
 * @param {number} id 
 * @returns {{title: string, completed: boolean, id: number}}
 */
const findById = (id) => {
    return todos.find(todo => todo.id === parseInt(id));
}

/**
 * 
 * @param {object} data
 * @returns {object}
 */
const save = async (data) => {
    if (todos.find(todo => todo.id === data.id)) {
        const updatedTodos = todos.map(todo => (todo.id !== data.id ? todo : data));
        return fs.writeFile(path, JSON.stringify({ data: [...updatedTodos] }));
    } else { // Create if not existed
        return fs.writeFile(path, JSON.stringify({ data: [...todos, data] }));
    }
}

/**
 * 
 * @param {number} id 
 */
const deleteById = async (id) => {
   return fs.writeFile(path, JSON.stringify({ data: todos.filter(todo => todo.id !== parseInt(id)) }));
}

/**
 * 
 * @param {number} id 
 * @returns true || false
 */
const isExisted = (id) => {
    return todos.some(todo => todo.id === parseInt(id));
}

/**
 * 
 * @param {[{title: string, completed: boolean, id: number}, {title: string, completed: boolean, id: number}]} data 
 * @returns
 */
const saveMany = async (data) => {
    const updatedTodos = todos.map(t => data.find(d => d.id === t.id) || t);

    return fs.writeFile(path, JSON.stringify({ data: [...updatedTodos] }));
}

/**
 * 
 * @param {[number]} data 
 * @returns 
 */
const deleteMany = async (data) => {
    console.log(data);
    
    const updatedTodos = todos.filter(t => !data?.includes(parseInt(t.id)));

    return fs.writeFile(path, JSON.stringify({ data: [...updatedTodos] }));
}

module.exports = {
    findAll,
    findById,
    save,
    deleteById,
    isExisted,
    saveMany,
    deleteMany
};
