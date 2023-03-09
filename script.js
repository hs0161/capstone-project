const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".calendar-days"),
    prev = document.querySelector(".month-prev"),
    next = document.querySelector(".month-next"),
    todayBtn = document.querySelector(".today-btn"),
    goToBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventContainer = document.querySelector(".events"),
    addEventSubmit = document.querySelector(".add-event-btn"),
    form = document.querySelector('#event-form');

let today = new Date ();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER'
];

let eventsArr = [];
// getEvents();


//function to add days
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    date.innerHTML = months[month] + " " + year;

    let days = "";

    for (let x = day; x > 0; x--){
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        //check if event present on current day

        let event = false;
        eventsArr.forEach((eventObj) => {
            if(
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            )
            {
                //if event found
                event = true;
            }
        });


        if(
            i === new Date().getDate() && 
            year === new Date().getFullYear() && 
            month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);

            //if event found also add event class
            //add active on today at startup
            if(event) {
                days += `<div class="day today active event" >${i}</div>`;
            } else {
                days += `<div class="day today active" >${i}</div>`;
            }
        } else {
            if(event) {
                days += `<div class="day today event" >${i}</div>`;
            } else {
                days += `<div class="day" >${i}</div>`;
            }
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date" >${j}</div>`;
    }

    daysContainer.innerHTML = days;
    //add listenr after calendar initialized
    addEventListener();
}

initCalendar();

//previous months
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

//next months
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

//eventlisteners for prev & next months
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//go to date and today functions
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input" , (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
        dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
            dateInput.value = dateInput.valute.slice(0, 2);
        }
    }
});

goToBtn.addEventListener("click", gotoDate);

//function to go to date entered
function gotoDate() {
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    //if invalid date entered
    alert("Invalid date. Please enter in the correct format.");
    
    goToBtn.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            goToBtn.addEventListener("click", gotoDate);        
        }
    });
}

const addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventCloseBtn = document.querySelector(".close"),
    addEventTitle = document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if(e.target != addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.toggle("active");
    }
});

addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});



//time format in from & to
addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g , "");
//if 2 numbers is entered auto add
    if(addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    //don't let use enter more than 5 characters
    if(addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5)
    }
});
addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g , "");
    if(addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    if(addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5)
    }
});

//function to add listener on days after rendered
function addEventListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = Number(e.target.innerHTML);

            //call active day after click
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            //remove active from already active day

            days.forEach((day) => {
                day.classList.remove("active");
            });

            //if previous month day clicked go to previous month and add active 
            if(e.target.classList.contains("prev-date")) {
                prevMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    
                    //after going to previous month add active to clicked 
                    days.forEach((day) => {
                        if(!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
                //same thing with next month days
            } else if(e.target.classList.contains("next-date")) {
                nextMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    
                    //after going to previous month add active to clicked 
                    days.forEach((day) => {
                        if(!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                //remaining current month days 
                e.target.classList.add("active");
            }
        });
    })
}

//show active day events and date at top

function getActiveDay (date){
    const day = new Date(year , month , date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function to show events of chosen day
function updateEvents (date) {
    let events = "";
    eventsArr.forEach((event) => {
        //get events of active day only
        if(
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            //show event on document
            event.events.forEach((event) => {
                events += `
                <div class="event">
                    <div class="title">
                        <pre class="close">&#10005</pre>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>
            `;
            });
        }
    });

    //if nothing found
    if(events === "") {
        events = `<div class="no-event">
                    <h3>No Events</h3>
                  </div>`;
    }
    eventContainer.innerHTML = events;

    //save events when new one added
    saveEvents();
}

//function to add events
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    if(eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill all fields");
        return;
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if (
        timeFromArr.length != 2 || 
        timeToArr.length != 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert ("Invalid Time Format");
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    const newEvent = {
        title : eventTitle, 
        time : timeFrom + " - " + timeTo,
    };

      //check if event is already added
    let eventExist = false;
    eventsArr.forEach((event) => {
        if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
        ) {
        event.events.forEach((event) => {
            if (event.title === eventTitle) {
            eventExist = true;
            }
        });
        }
    });

    if (eventExist) {
        alert("Event already added");
    return;
    }

  console.log(newEvent);
  console.log(activeDay);
    let eventAdded = false;

    if(eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if(
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    //if event array empty or current day has no event create new one
    if(!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }
    //remove active from add event form
    addEventContainer.classList.remove("active");
    //clear the fields
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    //show current added event
    updateEvents(activeDay);

    const activeDayElem = document.querySelector(".day.active");
    if(!activeDayElem.classList.contains("event")) {
        activeDayElem.classList.add("event");
    }

});

function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}

//function to remove events on click
eventContainer.addEventListener("click" , (e) => {
    if(e.target.classList.contains("event")) {
        if(confirm("Delete Event?")) {
            const eventTitle = e.target.children[0].children[1].innerHTML;
            eventsArr.forEach((event) => {
            if (
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            ) {
                event.events.forEach((item , index) => {
                    if(item.title === eventTitle) {
                        event.events.splice(index, 1);
                    }
                });
                //if no event remains on the day remove complete day
                if(event.events.length === 0) {
                    eventsArr.splice(eventsArr.indexOf(event) , 1);
                    //after remove complete day also remove active class of that day
                    const activeDayElem = document.querySelector(".day.active")
                    if(activeDayElem.classList.contains("event")) {
                        activeDayElem.classList.remove("event");
                    }
                }
            }
        });
        //after removing from array update event
        updateEvents(activeDay);
        }
    }
});

//store events in local storage

// function saveEvents() {
//     localStorage.setItem("events" , JSON.stringify(eventsArr));
// }

// function getEvents() {
//     if(localStorage.getItem("events" === null)) {
//         return;
//     }

//     eventsArr.push(...JSON.parse(localStorage.getItem("events")));
// }

function saveEvents() {
    fetch('/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventsArr)
    });
  }
  
  async function getEvents() {
    const response = await fetch('/events');
    eventsArr = await response.json();
  }

const todayShowTime = document.querySelector('.time-format');
const todayShowDate = document.querySelector('.date-format');

const currShowDate = new Date();
const showCurrDateOption = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

const currentDateFormat = new Intl.DateTimeFormat(
    'en-US',
    showCurrDateOption
).format(currShowDate);

todayShowDate.textContent = currentDateFormat;
setInterval(() => {
    const timer = new Date();
    const option = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };

    const formatTimer = new Intl.DateTimeFormat('en-us', option).format(timer);
    let time = `${`${timer.getHours()}`.padStart(
        2,
        '0'
    )}:${`${timer.getMinutes()}`.padStart(
        2,
        '0'
    )}:${`${timer.getSeconds()}`.padStart(2, '0')}`;
    todayShowTime.textContent = formatTimer;
}, 1000);