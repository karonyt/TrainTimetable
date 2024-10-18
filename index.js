const express = require(`express`);
const fs = require(`fs`);
const WebSocket = require(`ws`);
const http = require(`http`);
const { isHoliday } = require(`holiday-jp`);
const app = express();
const { config } = require(`./config`);
const port = 3000;

const timetable = JSON.parse(fs.readFileSync(config.timetableFilePath, `utf-8`));

function getTimetable(day) {
    const today = new Date();
    const holidayCheck = isHoliday(today);

    if (day === 6) {
        return {
            nobori: timetable.nobori.saturday,
            kudari: timetable.kudari.saturday,
        };
    } else if (day === 0 || holidayCheck) {
        return {
            nobori: timetable.nobori.holiday,
            kudari: timetable.kudari.holiday,
        };
    } else {
        return {
            nobori: timetable.nobori.weekdays,
            kudari: timetable.kudari.weekdays,
        };
    }
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on(`connection`, (ws) => {

    const sendUpcomingTrains = () => {
        const now = new Date();
        const currentTime = formatTime(now);

        const day = now.getDay();
        const timetables = getTimetable(day);

        const upcomingNoboriTrains = timetables.nobori.filter(train => compareTimes(`${now.getHours()}:${now.getMinutes()}`, train.time)).slice(0, 2);
        const upcomingKudariTrains = timetables.kudari.filter(train => compareTimes(`${now.getHours()}:${now.getMinutes()}`, train.time)).slice(0, 2);

        const upcomingTrainTimes = (upcomingTrains) => {
            return upcomingTrains.map(train => {
                const [hours, minutes] = train.time.split(`:`).map(Number);
                const arrivalTime = new Date(now);
                arrivalTime.setHours(hours, minutes, 0);
                return arrivalTime;
            });
        };

        ws.send(JSON.stringify({ currentTime, upcomingNoboriTrains, upcomingKudariTrains, upcomingNoboriTrainTimes: upcomingTrainTimes(upcomingNoboriTrains), upcomingKudariTrainTimes: upcomingTrainTimes(upcomingKudariTrains), stationName: config.stationName, noboriTitle: config.noboriTitle, kudariTitle: config.kudariTitle, walkLimit: config.walkLimit, runLimit: config.runLimit }));
    };

    sendUpcomingTrains();

    const intervalId = setInterval(sendUpcomingTrains, 1000);

    ws.on(`close`, () => {
        clearInterval(intervalId);
    });
});

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, `0`);
    const minutes = String(date.getMinutes()).padStart(2, `0`);
    const seconds = String(date.getSeconds()).padStart(2, `0`);
    return `${hours}時${minutes}分${seconds}秒`;
}

function compareTimes(time1, time2) {
    const toMinutes = (time) => {
        const [hours, minutes] = time.split(`:`).map(Number);
        return hours * 60 + minutes;
    };

    const minutes1 = toMinutes(time1);
    const minutes2 = toMinutes(time2);

    if (minutes1 < minutes2) {
        return true;
    } else {
        return false;
    }
};

app.use(express.static(`public`));

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});