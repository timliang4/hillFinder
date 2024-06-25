export async function getSegmentData(strava, bounds, activity='running', minCat=0, maxCat=4) {
    const opts = {
        bounds: bounds,
        activityType: activity,
        minCat: minCat,
        maxCat: maxCat
    };

    try {
        const data = await strava.segments.exploreSegments(opts);
        const segments = [];
        for (let segment of data.segments) {
            const {id, name, avg_grade, elev_difference, distance, elevation_profile} = segment
            segments.push({id: id, name: name, avg_grade: avg_grade, elev_difference: elev_difference, distance: distance, elev_profile: elevation_profile});
        }
        return segments;
    } catch (error) {
        throw error;
    }
}

export function filterHills(segments, max_distance = 800, min_elevation = 10) {
    return segments.filter(segment => segment.distance <= max_distance && segment.elev_difference >= min_elevation);
}

export async function addParams(strava, segments) {
    const newSegments = [];
    try {
        for (let segment of segments) {
            const opts = {
                id: segment.id
            };
            const segmentInfo = await strava.segments.getSegmentById(opts);
            const newSegment = {...segment, effort_count: segmentInfo.effort_count, athlete_count: segmentInfo.athlete_count, max_grade: segmentInfo.maximum_grade, polyline: segmentInfo.map.polyline};
            newSegments.push(newSegment);
        }
        return newSegments;   
    } catch (error) {
        throw error;
    }
}
