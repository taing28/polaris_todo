const todoRepository = require("../../database/todoRepository");
const todoRefractorRepository = require("../../database/todoRefractorRepository");

/**
 *
 * @param ctx
 * @returns {Promise<{success: boolean, data: [{id: number, title: string, completed: boolean}], message: string}|{success: boolean, message: string}>}
 */
const getTodos = async (ctx) => {
    try {
        const todos = await todoRefractorRepository.findAll();
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: todos,
            message: "Get todos successfully"
        };
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: {id: number, title: string, completed: boolean}, message: string}|{success: boolean, message: string}>}
 */
const getTodo = async (ctx) => {
    try {
        const todo = await todoRefractorRepository.findById(ctx.params.id);
        if (!todo) {
            throw new Error("Todo not found");
        }
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: todo,
            message: "Get todo successfully"
        };
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        };
    }
}
/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: {id: number, title: string, completed: boolean}, message: string}|{success: boolean, message: string}>}
 */
const addTodo = async (ctx) => {
    try {
        const newTodo = { ...ctx.request.body, completed: false };
        const responseRefractor = await todoRefractorRepository.add(newTodo);
        ctx.status = 201;
        return ctx.body = {
            success: true,
            data: responseRefractor,
            message: "Create todo successfully"
        };
    } catch (e) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: {id: number, title: string, completed: boolean}, message: string}|{success: boolean, message: string}>}
 */
const updateTodo = async (ctx) => {
    try {
        const { id } = ctx.params;
        const foundTodo = await todoRefractorRepository.findById(id);
        if (!foundTodo) {
            throw new Error("Todo not found");
        }
        const updateData = {
            ...foundTodo,
            ...ctx.request.body
        }
        const response = await todoRefractorRepository.update(updateData);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: response,
            message: "Update todo successfully"
        };
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: [{id: number, completed: boolean}], message: string}|{success: boolean, message: string}>}
 */
const updateTodos = async (ctx) => {
    try {
        let updatedData = ctx.request.body;
        updatedData.map(async (todo) => {
            if (!(await todoRefractorRepository.isExisted(todo.id))) {
                throw new Error("Todo(s) not found");
            }
        });
        const response = await todoRefractorRepository.updateMany(updatedData);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: response,
            message: "Update todos successfully"
        };
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: null, message: string}|{success: boolean, message: string}>}
 */
const deleteById = async (ctx) => {
    try {
        if (!(await todoRefractorRepository.isExisted(ctx.params.id))) {
            throw new Error("Todo not found");
        }
        await todoRefractorRepository.deleteById(ctx.params.id);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: null,
            message: "Delete todo successfully"
        };
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: null, message: string}|{success: boolean, message: string}>}
 */
const deleteTodos = async (ctx) => {
    try {
        const { ids } = ctx.request.body
        if (ids.length === 0) {
            throw new Error("Ids not found");
        }
        for (const id of ids) {
            if (!(await todoRefractorRepository.isExisted(id))) {
                throw new Error("Todo(s) not found");
            }
        }
        await todoRefractorRepository.deleteMany(ids);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: null,
            message: "Delete todos successfully"
        };
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
}

module.exports = {
    getTodos,
    getTodo,
    addTodo,
    updateTodo,
    updateTodos,
    deleteById,
    deleteTodos
};
