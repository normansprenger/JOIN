let nextUrgentTask = [];

async function initSummary() {
    checkUserSummary();
    await includeHTML();
    await loadTasks();
    fillUserInitials();
    fillSummaryInfos();
    showGreetingMobile();
    saveCurrentPage();
}


function checkUserSummary() {
    let storedUserString = sessionStorage.getItem('currentUser');
    if (storedUserString) {
        currentUser = JSON.parse(storedUserString);
        if (currentUser['name'] == 'Guest') {
            updateGreetingGuest();
        }
        else {
            updateGreetingUser();
        }
    }
    else {
        window.location.href = '../index.html';
    }
}


function updateGreetingGuest() {
    // Holt das aktuelle Datum und die Uhrzeit
    let now = new Date();
    let hours = now.getHours();

    // Initialisiert eine Variable für die Begrüßung
    let greeting;

    // Bestimmt die Begrüßung basierend auf der Uhrzeit
    if (hours < 12) {
        greeting = "Good morning!";
    } else if (hours < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }

    // Findet das span-Element mit der ID 'daytimeGreeting'
    document.getElementById("daytimeGreeting").innerHTML = greeting;
    document.getElementById("daytimeGreetingDesktop").innerHTML = greeting;
}

function updateGreetingUser() {
    // Holt das aktuelle Datum und die Uhrzeit
    let now = new Date();
    let hours = now.getHours();

    // Initialisiert eine Variable für die Begrüßung
    let greeting;

    // Bestimmt die Begrüßung basierend auf der Uhrzeit
    if (hours < 12) {
        greeting = "Good morning,";
    } else if (hours < 18) {
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }

    // Findet das span-Element mit der ID 'daytimeGreeting'
    document.getElementById("daytimeGreeting").innerHTML = greeting;
    document.getElementById("daytimeGreetingDesktop").innerHTML = greeting;
    document.getElementById("userName").innerHTML = currentUser['name'];
    document.getElementById("userNameDesktop").innerHTML = currentUser['name'];

}

function showGreetingMobile() {
    let lastPage = sessionStorage.getItem('currentPage');
    if (window.innerWidth < 1000 && lastPage === 'index.html') {
        let startAnimationMobile = document.getElementById('startAnimationMobile');
        let mainElement = document.getElementById('main');
        startAnimationMobile.classList.add('opacityZero');
        setTimeout(() => {
            startAnimationMobile.classList.add('dnone');
            mainElement.classList.remove('dnone');
            mainElement.classList.add('opacityFull');
        }, 1000);
    } else {
        document.getElementById('startAnimationMobile').classList.add('dnone');
        document.getElementById('main').classList.remove('dnone');
        document.getElementById('main').classList.add('opacityFull');
    }
}


function changeTodoImgHover() {
    document.getElementById('todoImg').src = "../assets/img/todoHover.svg"
}

function changeTodoImgNormal() {
    document.getElementById('todoImg').src = "../assets/img/todoNormal.svg"
}

function changeDoneImgHover() {
    document.getElementById('doneImg').src = "../assets/img/doneHover.svg"
}

function changeDoneImgNormal() {
    document.getElementById('doneImg').src = "../assets/img/doneNormal.svg"
}

function openBoardSite() {
    window.location.href = './board.html';
}

function fillSummaryInfos() {
    document.getElementById('statTodoCounter').innerHTML = tasks.filter(task => task.status === 'toDo').length;
    document.getElementById('statDoneCounter').innerHTML = tasks.filter(task => task.status === 'done').length;
    document.getElementById('statUrgentCounter').innerHTML = tasks.filter(task => task.priority === 'urgent').length;
    document.getElementById('statTasksInBoardCounter').innerHTML = tasks.length;
    document.getElementById('statTasksInProgressCounter').innerHTML = tasks.filter(task => task.status === 'inProgress').length;
    document.getElementById('statAwaitFeedbackCounter').innerHTML = tasks.filter(task => task.status === 'awaitingFeedback').length;
    fillTaskMiddleText();
}


function fillTaskMiddleText() {
    let urgentTasks = tasks.filter(task => task.priority === 'urgent');

    if (urgentTasks.length === 0) {
        document.getElementById('urgentTaskDate').innerHTML = `no urgent tasks`;
        return;
    }

    // Aktuelles Datum
    let today = new Date();

    // Finde den dringendsten Task
    let nearestTask = urgentTasks[0];
    let nearestDate = new Date(nearestTask.dueDate);

    urgentTasks.forEach(task => {
        const taskDueDate = new Date(task.dueDate);
        if (taskDueDate < nearestDate) {
            nearestTask = task;
            nearestDate = taskDueDate;
        }
    });

    // Speichere den dringendsten Task in der globalen Variable
    nextUrgentTask = [{ ...nearestTask, dueDate: formatDate(nearestTask.dueDate) }];
    document.getElementById('urgentTaskDate').innerHTML = nextUrgentTask[0]['dueDate'];

}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
