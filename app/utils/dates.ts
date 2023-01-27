export function isMultiDay(startDate: Date, endDate: Date){
    return new Date(startDate).getDay() !== new Date(endDate).getDay()
}

export function getDuration(startTime: Date, endTime: Date){
   return  (new Date(endTime).getTime() - new Date(startTime).getTime())/1000/60/60
}

export function getLocalTimeString(eventDate: Date){
    return new Date(eventDate).toLocaleTimeString([], {hour: 'numeric', minute: "numeric"})
}