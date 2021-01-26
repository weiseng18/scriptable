/*
	Description:
	This widget aims to fill the home screen with lots of data, that might not necessarily be useful, but just good to know.
	1. Gets coronavirus numbers from https://coronavirus-19-api.herokuapp.com/countries/singapore

	This widget's text is designed to be large, top, with text right aligned.
*/

const headerFont = Font.boldSystemFont(20);
const contentFont = Font.semiboldSystemFont(16);

const include_coronavirus = true;
const include_PSI = true;
const include_dengueClusters = true;

function getBackgroundImage(type) {
	// backgroundImage
	let FM = FileManager.local();
	let path = FM.bookmarkedPath("Images");

	// e.g. small_middle_left
	// depends on the widget's parameter
	return FM.readImage(path + "/" + type + ".png");
}

function getJSON(url) {
	let req = new Request(url);
	return req.loadJSON();
}

/* BEGIN VECTOR METHODS */
function vector_subtract(v1, v2) {
	/*
		Description:
		returns vector v2 - v1, 2 dimensions
	*/
	return {
		latitude: v2.latitude - v1.latitude,
		longitude: v2.longitude - v1.longitude
	};
}

function vector_dot(v1, v2) {
	/*
		Description:
		returns dot product of v1 and v2, 2 dimensions
	*/
	return v1.latitude * v2.latitude + v1.longitude * v2.longitude;
}

function vector_magnitude(v1) {
	/*
		Description:
		returns magnitude of v1, 2 dimensions
	*/
	return (v1.latitude ** 2 + v1.longitude ** 2) ** 0.5
}

function vector_t(t, v1, v2) {
	/*
		Description:
		returns (1-t)*v1 + t*v2, 2 dimensions
	*/
	return {
		latitude: (1-t)*v1.latitude + t*v2.latitude,
		longitude: (1-t)*v1.longitude + t*v2.longitude
	}
}
/* END VECTOR METHODS */

function closest_pointOnLineSeg_from_point(A, B, P) {
	/*
		Description:
		finds the point (C) on line segment AB, closest to P
	*/
	/*
		Math:
		Let f(t) = (1-t)A + tB - P, 0 <= t <= 1
		Let g(t) = |f(t)|^2
				 = | ( (1-t)A + tB - P ) |^2
				 = | ( t(B-A) + (A-P) ) |^2
		Let v = B-A, u = A-P,
			g(t) = (tv + u) . (tv + u)
				 = t^2 |v|^2 + 2t(v.u) + |u|^2
		g'(t) = 2t |v|^2 + 2(v.u)
			  = 2t (v.v) + 2(v.u)
		Let g'(t) = 0,
			-2 (v.u) = 2t(v.v)
			t = - (v.u) / (v.v)

		Now if 0 <= t <= 1, then this closest point C lies on the direction of AB but not on the segment.
		In this case, compare g(0) and g(1), i.e. the squared magnitude at t=0 and t=1.
		g(0) smaller => A is closest, g(1) smaller => B is closest
	*/
	let v = vector_subtract(B, A);
	let u = vector_subtract(A, P);
	let v_dot_u = vector_dot(v, u);
	let v_dot_v = vector_dot(v, v);
	let t = - v_dot_u / v_dot_v;

	if (0 < t && t < 1)
		return vector_t(t, A, B);
	else {
		let g0 = vector_magnitude(vector_t(0, A, B));
		let g1 = vector_magnitude(vector_t(1, A, B));
		return g0 <= g1 ? A : B;
	}
}

function deg2rad(deg) {
	/*
		Description:
		converts degree to radian
	*/
	return deg * (Math.PI / 180);
}

function haversine(A, B) {
	/*
		Description:
		returns distance between two latitude/longitude defined points A and B, in KM
	*/

	// radius of earth in KM
	let R = 6371;
	let dLat = deg2rad(B.latitude - A.latitude);
	let dLong = deg2rad(B.longitude - A.longitude);
	let h = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(A.latitude)) * Math.cos(deg2rad(B.latitude)) * (Math.sin(dLong / 2) ** 2);
	// distance
	let d = 2 * Math.asin(h ** 0.5);	
	// distance in km
	let dKM = R * d;
	return dKM;
}

function distance_polygon_point(polygonPoints, point) {
	/*
		Description:
		returns shortest distance from polygon to point
	*/
	// to make the points loop nicely
	polygonPoints.push(polygonPoints[0]);

	let minDistance = 1e9;

	for (let i=0; i<polygonPoints.length - 1; i++) {
		// extract points
		let A = polygonPoints[i];
		let B = polygonPoints[i+1];
		// closest point (C) from line segment AB to point
		let closestPoint = closest_pointOnLineSeg_from_point(A, B, point);
		// distance from C to point
		let distance = haversine(closestPoint, point);
		minDistance = Math.min(minDistance, distance);
	}
	return minDistance;
}

function find_centroid(polygonPoints) {
	/*
		Description:
		returns centroid of polygon
	*/
	let N = polygonPoints.length;
	let sumLat = 0;
	let sumLong = 0;
	for (let i=0; i<N; i++) {
		sumLat += polygonPoints[i].latitude;
		sumLong += polygonPoints[i].longitude;
	}
	return {
		latitude: sumLat / N,
		longitude: sumLong / N
	};
}

async function run() {
	let widget = new ListWidget();
	widget.backgroundImage = getBackgroundImage(args.widgetParameter);

	// adds active coronavirus cases
	if (include_coronavirus) {
		const url = "https://coronavirus-19-api.herokuapp.com/countries/singapore";
		const data = await getJSON(url);

		const activeCases = data["active"].toString();

		let description = widget.addText("Active cases:");
		description.rightAlignText();
		description.textColor = Color.white();
		description.font = headerFont;
		widget.addSpacer(5);

		let amount = widget.addText(activeCases);
		amount.rightAlignText();
		amount.textColor = Color.white();
		amount.font = contentFont;
		widget.addSpacer(5);
	}

	// adds national PSI
	if (include_PSI) {
		const url = "https://api.data.gov.sg/v1/environment/psi";
		const data = await getJSON(url);

		const nationalPSI = data.items[0].readings["psi_twenty_four_hourly"].national.toString();
		const lastUpdate = new Date(data.items[0].update_timestamp).toLocaleTimeString();

		let description = widget.addText("National PSI:");
		description.rightAlignText();
		description.textColor = Color.white();
		description.font = headerFont;
		widget.addSpacer(5);

		let value = widget.addText("(" + lastUpdate + ") " + nationalPSI);
		value.rightAlignText();
		value.textColor = Color.white();
		value.font = contentFont;
		widget.addSpacer(5);
	}
	
	// adds nearby dengue clusters
	if (include_dengueClusters) {
		// get last modified info
		const metadataURL = "https://data.gov.sg/api/action/resource_show?id=1ab83e5a-fd51-4a48-a796-8d7906f52a26";
		const metadata = await getJSON(metadataURL);
		const lastModified = new Date(metadata.result["last_modified"]).toLocaleDateString();

		// get data
		const url = "https://geo.data.gov.sg/denguecase-northeast-area/2021/01/21/geojson/denguecase-northeast-area.geojson";
		const data = await getJSON(url);
		const clusters = data.features;

		const currLocation = await Location.current();

		let closestCluster = {
			distance: 1e9,
			centroid: null
		};

		for (let c=0; c<clusters.length; c++) {
			// polygonPoints is an array of vertices that make up the polygon
			let points = clusters[c].geometry.coordinates[0];
			let polygonPoints = [];
			for (let p=0; p<points.length; p++) {
				let point = points[p];
				let long = point[0];
				let lat = point[1];
				polygonPoints.push({longitude: long, latitude: lat});
			}
			// min distance from currLocation to polygon in KM
			let minDistance = distance_polygon_point(polygonPoints, currLocation);
			if (minDistance < closestCluster.distance) {
				closestCluster.distance = minDistance;
				closestCluster.centroid = find_centroid(polygonPoints);
			}
		}

		let description = widget.addText("Closest dengue cluster:");
		description.rightAlignText();
		description.textColor = Color.white();
		description.font = headerFont;
		widget.addSpacer(5);

		// last modified
		let lastModifiedText = widget.addText(lastModified);
		lastModifiedText.rightAlignText();
		lastModifiedText.textColor = Color.white();
		lastModifiedText.font = contentFont;
		widget.addSpacer(5);

		let locationInfo = await Location.reverseGeocode(closestCluster.centroid.latitude, closestCluster.centroid.longitude);
		// latitude and longitude
		let locLatLong = locationInfo[0].location.latitude.toFixed(5) + ", " + locationInfo[0].location.longitude.toFixed(5);
		let latLong = widget.addText(locLatLong);
		latLong.rightAlignText();
		latLong.textColor = Color.white();
		latLong.font = contentFont;
		widget.addSpacer(5);

		// e.g. Sengkang, Compassvale Drive
		let locationText = locationInfo[0].locality + ", " + locationInfo[0].name;
		let location = widget.addText(locationText);
		location.rightAlignText();
		location.textColor = Color.white();
		location.font = contentFont;
		widget.addSpacer(5);

		// e.g. 1.13 km
		let roundDistance = closestCluster.distance.toFixed(2).toString();
		let distance = widget.addText(roundDistance + " km");
		distance.rightAlignText();
		distance.textColor = Color.white();
		distance.font = contentFont;
		widget.addSpacer(5);
	}

	widget.addSpacer();

	Script.setWidget(widget);
	Script.complete();
}

await run();