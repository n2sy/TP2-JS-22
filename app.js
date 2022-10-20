const listTasks = document.getElementById('listTask');
const btnAdd = document.getElementById('btnAdd');
const btnCancel = document.getElementById('btnCancel');
const inputTask = document.getElementById('inputNewTask');

let tabAllTasks = [];

function getAllTasks() {
    fetch('https://ng-tasks-c6b03.firebaseio.com/Tasks.json')
        .then(res => res.json())
        .then(data => {
            tabAllTasks = [];
            listTasks.innerHTML = '';
            for (const key in data) {

                tabAllTasks.push({ id: key, ...data[key] });

            }
            taskToElement()
            console.log(tabAllTasks);
        }

        )
}

function taskToElement() {
    // console.log("We are in taskToElement", tabAllTasks);
    for (const task of tabAllTasks) {
        let newLi = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.checked;
        //checkbox.classList.add('container');
        checkbox.style.margin = '0 10px';




        checkbox.addEventListener('change', () => {
            fetch(`https://ng-tasks-c6b03.firebaseio.com/Tasks/${task.id}.json`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(
                        {
                            checked: checkbox.checked
                        }
                    ),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    getAllTasks();
                })
        })

        let newSpan = document.createElement('span');
        newSpan.textContent = `${task.text} -- ${new Date(task.date).getHours()} : ${new Date(task.date).getMinutes()}`;
        if (task.checked)
            newSpan.style.textDecoration = 'line-through';

        newLi.appendChild(checkbox);
        newLi.appendChild(newSpan);
        newLi.addEventListener('dblclick', () => {
            if (confirm('Are you sure to delete this task ? ')) {
                fetch(`https://ng-tasks-c6b03.firebaseio.com/Tasks/${task.id}.json`,
                    {
                        method: 'DELETE',
                    })
                    .then(res => {
                        getAllTasks();
                    })
            }
        })

        newLi.classList.add('list-group-item');

        listTasks.appendChild(newLi);




    }
}

getAllTasks();
taskToElement();

function toggleButton() {
    btnAdd.hidden = !btnAdd.hidden;
    btnCancel.hidden = !btnCancel.hidden;
    inputNewTask.hidden = !inputNewTask.hidden;

}

btnAdd.addEventListener('click', toggleButton);

btnCancel.addEventListener('click', toggleButton);

inputNewTask.addEventListener('change', () => {
    fetch('https://ng-tasks-c6b03.firebaseio.com/Tasks.json',
        {
            method: 'POST',
            body: JSON.stringify(
                {
                    text: inputNewTask.value,
                    date: new Date(),
                    checked: false
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            alert('Task Added');
            getAllTasks();
        })
        .catch(err => {
            console.log(err);
        })

})