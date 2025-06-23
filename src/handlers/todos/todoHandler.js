const todoRepository = require("../../database/todoRepository");

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
const getTodos = async (ctx) => {
    try {
        const todos = todoRepository.findAll();

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: todos,
            message: "Get todos successfully"
        };
    } catch (e) {
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

const getTodo = async (ctx) => {
    try {
        const todo = todoRepository.findById(ctx.params.id);
        if (!todo) {
            throw new Error("Todo not found");
        }
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: todo,
            message: "Get todo successfully"
        };
    } catch (e) {
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

const addTodo = async (ctx) => {
    try {
        if (todoRepository.isExisted(ctx.request.body.id)) {
            throw new Error("Todo id already exists");
        }
        const todo = todoRepository.save(ctx.request.body);
        ctx.status = 201;
        ctx.body = {
            success: true,
            data: ctx.request.body,
            message: "Create todo successfully"
        };
    } catch (e) {
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

const updateTodo = async (ctx) => {
    try {
        let foundTodo = todoRepository.findById(ctx.params.id);
        if (!foundTodo) {
            throw new Error("Todo not found");
        }
        foundTodo = {
            ...foundTodo,
            ...ctx.request.body
        }
        const todo = todoRepository.save(foundTodo);
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: foundTodo,
            message: "Update todo successfully"
        };
    } catch (e) {
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

const updateTodos = async (ctx) => {
    try {
        let updatedData = ctx.request.body;
        updatedData = updatedData.map(t => {
            let tempTodo = todoRepository.findById(t.id);
            if (!tempTodo) {
                throw new Error("Todo not found");
            }
            return {
                ...tempTodo,
                ...t
            }
        });
        await todoRepository.saveMany(updatedData);
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: ctx.request.body,
            message: "Update todos successfully"
        };
    } catch (e) {
        ctx.body = {
            success: false,
            error: e.message
        }
    }
}

const deleteById = async (ctx) => {
    try {
        if (!todoRepository.isExisted(ctx.params.id)) {
            throw new Error("Todo not found");
        }
        await todoRepository.deleteById(ctx.params.id);
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: null,
            message: "Delete todo successfully"
        };
    } catch (e) {
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

const deleteTodos = async (ctx) => {
    try {
        const {ids} = ctx.request.body
        if (ids.length === 0) {
            throw new Error("Ids not found");
        }
        await todoRepository.deleteMany(ids);
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: null,
            message: "Delete todos successfully"
        };
    } catch (e) {
        ctx.body = {
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
