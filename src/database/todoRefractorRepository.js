const db = require('./db');
const todosRef = db.collection('todos');

/**
 * 
 * @returns {Promise<[{title: string, completed: boolean, id: string}]>}
 */
const findAll = async () => {
    const snapshot = await todosRef.get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<{title: string, completed: boolean, id: string}>}
 */
const findById = async (id) => {
    const snapshot = await todosRef.doc(id).get();
    if (!snapshot.data()) {
        return null;
    }
    return { id, ...snapshot.data() };
}

/**
 * 
 * @param {{title: string, completed: boolean}} data 
 * @returns {Promise<{title: string, completed: boolean, id: string}>}
 */
const add = async (data) => {
    const response = await todosRef.add(data);
    return { id: response.id, ...data };
}

/**
 * 
 * @param {{title: string, completed: boolean, id: string}} data
 * @returns {Promise<{title: string, completed: boolean, id: string}>}
 */
const update = async (data) => {
    const { id, ...updateData } = data;
    const snapshot = todosRef.doc(id);
    await snapshot.update(updateData);
    const updatedData = await snapshot.get();
    return { id, ...updatedData.data() };
}

/**
 * 
 * @param {string} id 
 */
const deleteById = async (id) => {
    await todosRef.doc(id).delete();
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
const isExisted = async (id) => {
    const snapshot = await todosRef.doc(id).get();
    return snapshot.exists;
}

/**
 * 
 * @param {[{title: string, completed: boolean, id: string}, {title: string, completed: boolean, id: string}]} data 
 * @returns {Promise<[{title: string, completed: boolean, id: string}, {title: string, completed: boolean, id: string}]>}
 */
const updateMany = async (data) => {
    let updatedDocs = [];

    await db.runTransaction(async (transaction) => {
        // Read
        const operations = await Promise.all(
            data.map(async ({ id }) => {
                const docRef = todosRef.doc(id);
                const docSnapshot = await transaction.get(docRef);
                return { docRef, docSnapshot };
            })
        );

        // Write
        operations.forEach(({ docRef }, index) => {
            const { id, ...updateData } = data[index];
            transaction.update(docRef, updateData);
        });

        // Prepare updated documents
        updatedDocs = operations.map(({ docSnapshot }, index) => ({
            id: data[index].id,
            ...docSnapshot.data(),
            ...data[index]
        }));
    })

    // Return updated docs
    return updatedDocs;
}

/**
 * 
 * @param {string[]} data 
 * @returns {Promise<void>}
 */
const deleteMany = async (data) => {
    if (!data || data.length === 0) {
        return; 
    }
    
    const batch = db.batch();

    data.forEach(id => {
        const docRef = todosRef.doc(id);
        batch.delete(docRef);
    });

    await batch.commit();
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