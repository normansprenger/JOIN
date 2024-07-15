async function initSummary() {
    checkUserSummary();
    await includeHTML();
    await loadTasks();
    fillUserInitials();
    fillSummaryInfos();
    showGreetingMobile();
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
    document.getElementById("userName").innerHTML = currentUser['name'];

}

function showGreetingMobile() {
    if (window.innerWidth < 1000) {
        var startAnimationMobile = document.getElementById('startAnimationMobile');
        var mainElement = document.getElementById('main');
        startAnimationMobile.classList.add('opacityZero');
        setTimeout(() => {
            startAnimationMobile.classList.add('dnone');
            mainElement.classList.remove('dnone');
            mainElement.classList.add('opacityFull');
        }, 1000);


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
}

//let tasks =[
//   {
//     "assignedTo": [
//       0,
//       5,
//       6
//     ],
//     "category": "User Story",
//     "description": "Build start page with recipe recommendation.",
//     "dueDate": "2024-07-31",
//     "id": 0,
//     "priority": "medium",
//     "status": "toDo",
//     "subTasks": [
//       {
//         "completet": true,
//         "content": "Implement Recipe Recommendation",
//         "id": 0
//       },
//       {
//         "completet": false,
//         "content": "Start Page Layout",
//         "id": 1
//       }
//     ],
//     "title": "Kochwelt Page & Recipe Recommender"
//   },
//   {
//     "assignedTo": [
//       2,
//       7
//     ],
//     "category": "Technical Tasks",
//     "description": "Define CSS naming conventions and structure",
//     "dueDate": "2024-07-31",
//     "id": 1,
//     "priority": "urgent",
//     "status": "inProgress",
//     "subTasks": [
//       {
//         "completet": true,
//         "content": "Establish CSS Methodology",
//         "id": 0
//       },
//       {
//         "completet": true,
//         "content": "Setup Base Styles",
//         "id": 1
//       }
//     ],
//     "title": "CSS Architecture Planning"
//   },
//   {
//     "assignedTo": [
//       2,
//       3,
//       8
//     ],
//     "category": "Technical Tasks",
//     "description": "Create reusable HTML base templates",
//     "dueDate": "2024-07-31",
//     "id": 2,
//     "priority": "low",
//     "status": "awaitingFeedback",
//     "title": "HTML Base Template Creation"
//   },
//   {
//     "assignedTo": [
//       1,
//       4,
//       8
//     ],
//     "category": "User Story",
//     "description": "Implement daily recipe and portion calculator",
//     "dueDate": "2024-07-31",
//     "id": 3,
//     "priority": "medium",
//     "status": "awaitingFeedback",
//     "title": "Daily Kochwelt Recipe"
//   },
//   {
//     "assignedTo": [
//       3,
//       4,
//       8
//     ],
//     "category": "User Story",
//     "description": "Create a contac form and imprint page",
//     "dueDate": "2024-07-31",
//     "id": 4,
//     "priority": "medium",
//     "status": "done",
//     "subTasks": [
//       {
//         "completet": false,
//         "content": "Create contact form",
//         "id": 0
//       },
//       {
//         "completet": false,
//         "content": "set up imprint page",
//         "id": 1
//       }
//     ],
//     "title": "Contact Form & Imprint"
//   }
// ];