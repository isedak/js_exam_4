let dataTasks = [];

$().ready(function() {

    checkAndShowLocalData();

    $('#form').on('submit', function(ev) {

        ev.preventDefault();

        checkLocalData();

        let id = setId(dataTasks);

        let obj = {};

        obj.id = id;
        obj.text = $('#task-text').val();
        obj.state = 'toDo';

        dataTasks.push(obj);

        saveDataAndCleanBoxes();

        checkAndShowLocalData();
    });

    $('#task-text').keyup(function() {

        if (this.value.length > 300) {

            this.value = this.value.substr(0, 300);
        };
    });

    $('#content').on('click', "[data-submit ='remove-it']", function(ev) {

        ev.preventDefault();

        let itemId = $(this).attr('id').substr(2);

        checkLocalData();

        let objId = dataTasks.findIndex(obj => obj.id === parseInt(itemId));

        dataTasks.splice(objId, 1);

        saveDataAndCleanBoxes();
        checkAndShowLocalData();
    });

    $('#content').on('click', "[data-submit ='change-state']", function(ev) {

        ev.preventDefault();

        let itemId = $(this).attr('id').substr(2);

        checkLocalData();

        let objId = dataTasks.findIndex(obj => obj.id === parseInt(itemId));

        switch (dataTasks[objId].state) {

            case "toDo":

                dataTasks[objId].state = "inProgress";
                saveDataAndCleanBoxes();
                checkAndShowLocalData();
                break;

            case "inProgress":

                dataTasks[objId].state = "done";
                saveDataAndCleanBoxes();
                checkAndShowLocalData();
                break;

            default:
                break;
        };
    });
});

function saveDataAndCleanBoxes() {

    localStorage.setItem('dataTasks', JSON.stringify(dataTasks));

    $('#to-do-list').html('');
    $('#progress-list').html('');
    $('#done-list').html('');
}

function setId(array) {

    if (array.length < 1) {

        return 1;

    } else {

        const ids = array.map(obj => obj.id);
        const max = Math.max.apply(Math, ids);
        return max + 1;
    };
};

function checkLocalData() {

    let savedData = localStorage.getItem('dataTasks');

    if (savedData) dataTasks = JSON.parse(savedData);
};

function checkAndShowLocalData() {

    checkLocalData();

    const toDoList = dataTasks.filter(obj => obj.state === 'toDo');
    const progressList = dataTasks.filter(obj => obj.state === 'inProgress');
    const doneList = dataTasks.filter(obj => obj.state === 'done');

    $('#to-do-list').append(buildResult(toDoList));
    $('#progress-list').append(buildResult(progressList));
    $('#done-list').append(buildResult(doneList));
};

function buildResult(array) {

    let result = $('<div class="flex-column task-column"></div>');

    for (let i = 0; i < array.length; i++) {

        result.append(createTask(array[i].id, array[i].text, array[i].state));
    };

    return result;
};

function createTask(id, text, state) {

    let taskBox = $(`<div class="flex-column task-box"></div>`);

    let buttonState;

    switch (state) {

        case "toDo":

            buttonState = `<button id="s-${id}" data-submit="change-state" class="btn-small btn-state">In Progress ></button>`;
            break;

        case "inProgress":

            buttonState = `<button id="s-${id}" data-submit="change-state" class="btn-small btn-green">Done ></button>`;
            break;

        default:

            buttonState = `<button id="d-${id}" data-submit="remove-it" class="btn-small btn-remove">Delete</button>`;
            break;
    };

    const content = $(`<div class="flex-row">` +
        `<div class="flex-column wide-column"><p class="green-text">Task <b>№${id}</b></div>` +
        `<div class="flex-column">` +
        `<button id="x-${id}" data-submit="remove-it" class="btn-small btn-remove">x</button></div>` +
        `</div>` +
        `<div class="flex-row"><p class="simple-text">${text}</p></div></div>` +
        `<div class="flex-row">` +
        `${buttonState}</div></div>`);

    taskBox.append(content);

    return taskBox;
};