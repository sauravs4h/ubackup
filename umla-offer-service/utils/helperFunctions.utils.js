const getFinalTime = (time, addValue) => {
    let dateObject = new Date(time);
    dateObject.setMinutes(dateObject.getMinutes() + addValue);

    let hours = dateObject.getUTCHours();
    let minutes = dateObject.getUTCMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const time1 = hours + ":" + minutes + " " + ampm;

    // // Convert to "Asia/Kolkata" time zone
    // const options = {
    //     timeZone: "Asia/Kolkata",
    //     hour12: true,
    //     hour: "2-digit",
    //     minute: "2-digit",
    // };
    // const timeInKolkata = dateTime.toLocaleTimeString("en-US", options);

    return time1;
};

module.exports = { getFinalTime };
