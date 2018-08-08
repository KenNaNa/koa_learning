function parseQueryStr(queryStr){
	let queryData = {}
	let queryList = queryStr.split('&');
	console.log(queryList);
	for(let [index,queryStr] of queryList.entries()){
		let itemList = queryStr.split('=');
		queryData[itemList[0]] = decodeURIComponent(itemList[1]) 
	}
	return queryData
}

module.exports = parseQueryStr;


// localhost:3000?userName=111&nickName=111&email=111