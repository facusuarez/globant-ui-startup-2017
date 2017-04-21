window.addEventListener("load", function () {
    createDataBase();
})
document.getElementById("saveIDB").addEventListener("click", function () {
    let text = document.getElementById("textArea").value;
    addText("text", text);
}, false);

document.getElementById("saveLS").addEventListener("click", function () {
    mylocalStorage("text", document.getElementById("textArea").value);
}, false);

document.getElementById("showIDB").addEventListener("click", function () {
    showText();
}, false);

document.getElementById("showLS").addEventListener("click", function () {
    alert("Your saved text in localStorage is: " + localStorage.getItem("text"));
}, false);

document.getElementById("clearLS").addEventListener("click", function () {
    localStorage.clear();
    alert("Text Cleared from localStorage")
}, false);

document.getElementById("clearIDB").addEventListener("click", function () {
    clearText();
}, false);

function mylocalStorage(name, text) {
    localStorage.setItem(name, text);
    alert("Text saved in localStorage ");

}
function openDatabase(dbName) {
    var openRequest = localDatabase.indexedDB.open(dbName);
    openRequest.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };
    openRequest.onsuccess = function (event) {
        localDatabase.db = openRequest.result;
        return localDatabase.db;
    };
}
let localDatabase = {};
function createDataBase() {
    let dbName = "text";
    localDatabase.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    localDatabase.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    localDatabase.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

    localDatabase.indexedDB.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };
    let deleteDbRequest = localDatabase.indexedDB.deleteDatabase(dbName);
    deleteDbRequest.onsuccess = function (event) {
        console.log('Database deleted');
        let openRequest = localDatabase.indexedDB.open(dbName, 1);

        openRequest.onerror = function (e) {
            console.log("Database error: " + e.target.errorCode);
        };
        openRequest.onsuccess = function (event) {
            console.log("Database created");
            localDatabase.db = openRequest.result;
            return localDatabase.db;


        };
        openRequest.onupgradeneeded = function (evt) {
            console.log('Creating object stores');
            let textStore = evt.currentTarget.result.createObjectStore
                ("text", { keyPath: "id" });
        };
        deleteDbRequest.onerror = function (e) {
            console.log("Database error: " + e.target.errorCode);
        };

    };
}

function addText(dbName, textArea) {
    let openRequest = localDatabase.indexedDB.open(dbName, 1);
    openRequest.onsuccess = function (event) {
        localDatabase.db = openRequest.result;
    };
    openRequest.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };
    let transaction = localDatabase.db.transaction("text", "readwrite");
    let store = transaction.objectStore("text");
    let request = store.put({
        "id": "1",
        "text": textArea
    });
    request.onsuccess = function (e) {
        alert("Text Added");
    };

}
function showText(dbName) {
    let openRequest = localDatabase.indexedDB.open(dbName, 1);
    openRequest.onsuccess = function (event) {
        console.log("Database Open");
        localDatabase.db = openRequest.result;
    };
    openRequest.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };
    let store = localDatabase.db.transaction("text").objectStore("text");
    store.get("1").onsuccess = function (event) {
        let text = event.target.result;
        if (text == null) {
            result.innerHTML = "text not found";
        }
        else {
            console.log(text);
            alert("Your text is: " + text.text);
        }
    };
}
function clearText() {
    let dbName = "text";
    let openRequest = localDatabase.indexedDB.open(dbName, 1);
    openRequest.onsuccess = function (event) {
        localDatabase.db = openRequest.result;
        var store = localDatabase.db.transaction("text", "readwrite").objectStore("text");
        var request = store.openCursor(IDBKeyRange.only("1"));

        request.onsuccess = function () {
            var cursor = request.result;

            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
            
        };
        alert("Text Cleared in Data Base");
    };
    openRequest.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };

}

