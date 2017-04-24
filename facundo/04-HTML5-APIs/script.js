/**
 * When the window is loaded it creates a database needed for IndexedDB
 * ALso calls a function to load functions to buttons
 */
window.addEventListener("load", function () {
    createDataBase();
    buttonsfunctions();
    dragAndDrop()
})

/**
 * This method adds functionality to buttons
 * 
 */
function buttonsfunctions() {
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
}


/**
 * This method saves text in localStorage
 * 
 * @param {string} name 
 * @param {string} text 
 */
function mylocalStorage(name, text) {
    localStorage.setItem(name, text);
    alert("Text saved in localStorage ");

}
let localDatabase = {};

/**
 * This method creates a Clean IndexedDB and creates the Object Store "text"  with keyPath "id" 
 * 
 */
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

/**
 * This method opens a DB and inserts text 
 * 
 * @param {string} dbName 
 * @param {string} textArea 
 */
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


/**
 * This method opens a DB and shows the text saved previously
 * 
 * @param {text} dbName 
 */
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


/**
 * THis method clears the Object in Indexed DB
 * 
 */
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

/**
 * This method implements the Drag And drop funcionality for txt files
 * 
 */
function dragAndDrop() {

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.
        var reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById('textArea').value = event.target.result;
        }
        reader.readAsText(files[0], "UTF-8");
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the listeners.
    var dropZone = document.getElementById('textArea');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

}