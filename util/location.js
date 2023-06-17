const axios = require("axios");
const  MY_APIKEY = process.env.LOCATOR_API_KEY;

async function getCoordsByAddress(add){
    const response = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${MY_APIKEY}&query=${encodeURIComponent(add)}`)
    const datas = response.data.data[0]

    console.log(datas)
    const coords = {
        lat:datas.latitude,
        lng:datas.longitude
    }
    return coords;
}

module.exports = getCoordsByAddress;