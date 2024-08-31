const socket = io();//calls to the backend

if(navigator.geolocation){  //will be available for coordinates
    navigator.geolocation.watchPosition(
        (position)=>{
        const {latitude,longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude})
    },
    (error)=>{
        console.error(error);
    },
    {
      enableHighAccuracy:true,
      timeout:5000,
      maximumAge:0,//no saved data no cache data
    }
);
}
const map = L.map("map").setView([0,0],16);

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"KIIT UNIVERSITY"
}).addTo(map)//giving the map 

const markers={};

socket.on("receive-location",(data)=>{
    const{id,latitude,longitude}=data;
    map.setView([latitude,longitude]);//setting the id to the map
if(markers[id]){
     markers[id].setLatLng([latitude,longitude]);
}
else{
    markers[id]=L.marker([latitude,longitude]).addTo(map)
}
if (!Object.keys(markers).length) {
    map.setView([latitude, longitude]);
}
});
socket.on("user-disconnected",(id)=>{
  if(markers[id]){
     map.removeLayer(markers[id]);
    delete markers[id]
  }
})