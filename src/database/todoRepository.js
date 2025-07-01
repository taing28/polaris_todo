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
    return todos.find(todo => todo.id.toString() === id);
}

/**
 * 
 * @param {{title: string, completed: boolean}} data 
 * @returns {Promise<{title: string, completed: boolean, id: number}>}
 */
const add = async (data) => {
    const lastElementId = todos[todos.length - 1].id || 0;
    const newData = {...data, id: lastElementId + 1};
    await fs.writeFile(path, JSON.stringify({ data: [...todos, newData] }));
    return newData;
}

/**
 * 
 * @param {{title: string, completed: boolean, id: number}} data 
 * @returns {Promise<{title: string, completed: boolean, id: number}>}
 */
const update = async (data) => {
    const updatedTodos = todos.map(todo => (todo.id !== data.id ? todo : data));
    await fs.writeFile(path, JSON.stringify({ data: [...updatedTodos] }));
    return data;
}

/**
 * 
 * @param {number} id 
 */
const deleteById = async (id) => {
    await fs.writeFile(path, JSON.stringify({ data: todos.filter(todo => todo.id !== parseInt(id)) }));
}

/**
 * 
 * @param {number} id 
 * @returns {true | false}
 */
const isExisted = (id) => {
    return todos.some(todo => todo.id === parseInt(id));
}

/**
 * 
 * @param {[{title: string, completed: boolean, id: number}, {title: string, completed: boolean, id: number}]} data 
 * @returns {Promise<[{title: string, completed: boolean, id: number}, {title: string, completed: boolean, id: number}]>}
 */
const updateMany = async (data) => {
    const dataMap = new Map(data.map(todo => [todo.id, todo]))
    const updatedTodos = todos.map(todo => dataMap.get(todo.id) || todo);
    await fs.writeFile(path, JSON.stringify({ data: [...updatedTodos] }));
    return updatedTodos;
}

/**
 * 
 * @param {[number]} data 
 */
const deleteMany = async (data) => {
    const updatedTodos = todos.filter(t => !data?.includes(parseInt(t.id)));
    fs.writeFile(path, JSON.stringify({ data: [...updatedTodos] }));
}

module.exports = {
    findAll,
    findById,
    add,
    update,
    deleteById,
    isExisted,
    updateMany,
    deleteMany
};
