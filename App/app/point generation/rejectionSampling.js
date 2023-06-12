function rejectionSampling(radius) {
    while (true) {
        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;
        if (x * x + y * y < 1) {
            return [x * radius, y * radius];
        }
    }
}

function convertPointsToLatLng(pointsArray, radius) {
    let tempArray = [];
    for (let i = 0; i < pointsArray.length; i++) {
        let point = pointsArray[i];
        let x = Number(point[0]);
        let y = Number(point[1]);
        let angle = Math.atan2(y, x);
        let lat = radius * Math.sin(angle);
        let lng = radius * Math.cos(angle);
        tempArray.push([lat, lng]);
    }
    return tempArray;
}

export {
    rejectionSampling,
    convertPointsToLatLng,
}