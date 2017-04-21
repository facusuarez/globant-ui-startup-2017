document.getElementById("save").addEventListener("click", function () {
    let textArea = document.getElementById("textArea").value;
    //mylocalStorage("textArea", textArea);
    addTextToDatabase(textArea);
}, false);

function mylocalStorage(name, text) {
    localStorage.setItem(name, text);
    alert("El texto guardado en Local Storage es: " + localStorage.textArea);
}
function openDatabase() {
    var openRequest = localDatabase.indexedDB.open(dbName);
    openRequest.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };
    openRequest.onsuccess = function (event) {
        localDatabase.db = openRequest.result;
    };
}

function addTextToDatabase(textArea) {
    var localDatabase = {};
    var dbName = "text";
    localDatabase.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    localDatabase.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    localDatabase.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

    localDatabase.indexedDB.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };
    var deleteDbRequest = localDatabase.indexedDB.deleteDatabase(dbName);
    deleteDbRequest.onsuccess = function (event) {
        console.log('Database deleted');
        var openRequest = localDatabase.indexedDB.open(dbName, 1);

        openRequest.onerror = function (e) {
            console.log("Database error: " + e.target.errorCode);
        };
        openRequest.onsuccess = function (event) {
            console.log("Database created");
            localDatabase.db = openRequest.result;
            var transaction = localDatabase.db.transaction("text", "readwrite");
            var store = transaction.objectStore("text");
            var request = store.put({
                "id": "1",
                "text": textArea
            });
            request.onsuccess = function (e) {
                alert("Text Added");
            };
            try {
                if (localDatabase != null && localDatabase.db != null) {
                    var store = localDatabase.db.transaction("text").objectStore("text");
                    store.get("1").onsuccess = function (event) {
                        var text = event.target.result;
                        if (text == null) {
                            result.innerHTML = "text not found";
                        }
                        else {
                            console.log(text);
                            alert("Your text is: " + text.text);
                        }
                    };
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        openRequest.onupgradeneeded = function (evt) {
            console.log('Creating object stores');
            var textStore = evt.currentTarget.result.createObjectStore
                ("text", { keyPath: "id" });
        };
        deleteDbRequest.onerror = function (e) {
            console.log("Database error: " + e.target.errorCode);
        };

    };

}

