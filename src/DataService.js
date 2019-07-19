export const getTodoList = ()=>{
    return new Promise((resolve, reject)=>{
        chrome.storage.local.get(['todoList'], (result)=>{
            const todoList = result ? result.todoList : [];
            resolve(todoList);
        });
    })

};

export const setTodoList = (todoList)=>{
    chrome.storage.local.set({todoList});
};
