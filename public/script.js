const noboriTrainList = document.getElementById(`nobori-train-list`);
const kudariTrainList = document.getElementById(`kudari-train-list`);
const noboriTitle = document.getElementById(`nobori-title`);
const kudariTitle = document.getElementById(`kudari-title`);
const stationTitle = document.getElementById(`station-title`);
const stationName = document.getElementById(`station-name`);
const currentTimeDisplay = document.getElementById(`current-time`);
const socket = new WebSocket(`ws://localhost:3000`);

socket.addEventListener(`message`, (event) => {
    const data = JSON.parse(event.data);
    currentTimeDisplay.textContent = data.currentTime;
    stationTitle.innerHTML = data.stationName;
    stationName.innerHTML = data.stationName;
    noboriTitle.innerHTML = data.noboriTitle;
    kudariTitle.innerHTML = data.kudariTitle;
    noboriTrainList.innerHTML = ``;
    kudariTrainList.innerHTML = ``;

    const now = new Date();

    /**
     * 
     * @param {number} remainingMinutes 
     * @param {number} walkL 
     * @param {number} runL 
     * @returns 
     */
    const getRemainingTimeMessage = (remainingMinutes, walkL, runL) => {
        if (remainingMinutes < runL) {
            return { message: `間に合うのは難しいです`, class: `difficult` };
        } else if (remainingMinutes >= runL && remainingMinutes <= walkL) {
            return { message: `走れば間に合います`, class: `run` };
        } else {
            return { message: `歩いても間に合います`, class: `walk` };
        }
    };

    data.upcomingNoboriTrains.forEach((train) => {
        const listItem = document.createElement(`li`);
        const [hours, minutes] = train.time.split(`:`).map(Number);

        const arrivalTime = new Date();
        arrivalTime.setHours(hours, minutes, 0);

        const timeDiff = arrivalTime - now;
        const totalSecondsUntilArrival = Math.ceil(timeDiff / 1000);
        const remainingMinutes = Math.floor(totalSecondsUntilArrival / 60);
        const remainingSeconds = totalSecondsUntilArrival % 60;

        const remainingTimeText = remainingMinutes > 0 ? `${remainingMinutes}分${remainingSeconds}秒` : `${remainingSeconds}秒`;
        const timeMessageInfo = getRemainingTimeMessage(remainingMinutes, data.walkLimit, data.runLimit);

        const messageSpan = document.createElement(`p`);
        messageSpan.textContent = ` \nあと${remainingTimeText} ${timeMessageInfo.message}`;
        messageSpan.classList.add(`time-message`, timeMessageInfo.class);

        listItem.textContent = `${train.time} 発 ${train.type} ${train.destination}`;
        listItem.appendChild(messageSpan);
        noboriTrainList.appendChild(listItem);
    });
    if(data.upcomingNoboriTrains.length == 0) {
        const listItem = document.createElement(`li`);
        const messageSpan = document.createElement(`p`);
        listItem.textContent = `本日の運行は終了しました`;
        listItem.appendChild(messageSpan);
        noboriTrainList.appendChild(listItem);
    };


    data.upcomingKudariTrains.forEach((train) => {
        const listItem = document.createElement(`li`);
        const [hours, minutes] = train.time.split(`:`).map(Number);

        const arrivalTime = new Date();
        arrivalTime.setHours(hours, minutes, 0);

        const timeDiff = arrivalTime - now;
        const totalSecondsUntilArrival = Math.ceil(timeDiff / 1000);
        const remainingMinutes = Math.floor(totalSecondsUntilArrival / 60);
        const remainingSeconds = totalSecondsUntilArrival % 60;

        const remainingTimeText = remainingMinutes > 0 ? `${remainingMinutes}分${remainingSeconds}秒` : `${remainingSeconds}秒`;
        const timeMessageInfo = getRemainingTimeMessage(remainingMinutes, data.walkLimit, data.runLimit);

        const messageSpan = document.createElement(`p`);
        messageSpan.textContent = ` \nあと${remainingTimeText} ${timeMessageInfo.message}`;
        messageSpan.classList.add(`time-message`, timeMessageInfo.class);

        listItem.textContent = `${train.time} 発 ${train.type} ${train.destination}`;
        listItem.appendChild(messageSpan);
        kudariTrainList.appendChild(listItem);
    });
    if(data.upcomingKudariTrains.length == 0) {
        const listItem = document.createElement(`li`);
        const messageSpan = document.createElement(`p`);
        listItem.textContent = `本日の運行は終了しました`;
        listItem.appendChild(messageSpan);
        kudariTrainList.appendChild(listItem);
    };
});