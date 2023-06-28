import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

const App = () => {
  const [ip, setIp] = useState("");
  const [address, setAddress] = useState({});
  const [location, setLocation] = useState([]);

  const fetchIp = async (ip) => {
    try {
      const res = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${
          import.meta.env.VITE_API_KEY
        }&ipAddress=${ip}`
      );

      setAddress(res.data);
      toast.success("IP address found", {
        duration: 3000,
        style: {
          fontSize: "12px",
        },
      });
    } catch (err) {
      console.log(err.request.responseText);
      toast.error("Invalid IPv4 or IPv6 address", {
        duration: 3000,
        style: {
          fontSize: "12px",
        },
      });
    }
  };

  useEffect(() => {
    if (address?.location) {
      setLocation([address?.location?.lat, address?.location?.lng]);
    }
  }, [address]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchIp(ip);
    setIp("");
  };

  const handleEnter = (e) => {
    e.key === "Enter" && handleSubmit(e);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click() {
        map.locate();
      },
      moveend() {
        map.flyTo(location, map.getZoom());
      },
    });

    map.flyTo(location, map.getZoom());

    return location === null ? null : (
      <Marker position={location}>
        <Popup>Popup for any custom information.</Popup>
      </Marker>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <img
        src="./pattern-bg-desktop.png"
        alt="pattern background desktop"
        className="relative hidden md:flex"
      />

      <img
        src="./pattern-bg-mobile.png"
        alt="pattern background mobile"
        className="relative md:hidden w-full"
      />

      <div className="absolute flex flex-col text-center w-full top-0 gap-8">
        <div className="mt-5 capitalize text-2xl text-gray-200 font-normal">
          IP address tracker
        </div>
        <div className="flex justify-center items-center md:mx-0 mx-4">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={handleEnter}
            className="md:w-1/4 w-full h-11 rounded-s-lg px-4 apperance-none outline-none placeholder:md:text-sm placeholder:text-xs"
            placeholder="Search for any IP address"
          />
          <div
            className="text-lg h-11 w-11 text-white flex justify-center items-center bg-black hover:bg-slate-800 rounded-r-lg cursor-pointer"
            onClick={handleSubmit}
          >
            <RiArrowRightSLine size={22} />
          </div>
        </div>
        <div className="rounded-lg md:h-32 h-full md:w-2/4 bg-white md:my-16 -my-3 shadow-md grid md:grid-cols-4 grid-cols-1 md:divide-x divide-slate-300 items-center md:text-left text-center md:mx-auto mx-4 md:py-0 py-4 md:gap-0 gap-4 z-10">
          <div className="flex flex-col gap-2 px-6">
            <div className="uppercase text-xs font-medium text-slate-500">
              IP address
            </div>
            <div className="capitalize font-semibold text-xl truncate">
              {address?.ip ? address?.ip : "XXX"}
            </div>
          </div>
          <div className="flex flex-col gap-2 px-6">
            <div className="uppercase text-xs font-medium text-slate-500">
              location
            </div>
            <div className="capitalize font-semibold text-xl truncate">
              {address?.location?.region ? address?.location?.city : "XXX"}
            </div>
          </div>
          <div className="flex flex-col gap-2 px-6">
            <div className="uppercase text-xs font-medium text-slate-500">
              timezone
            </div>
            <div className="capitalize font-semibold text-xl">
              {address?.location?.timezone
                ? address?.location?.timezone
                : "XXX"}
            </div>
          </div>
          <div className="flex flex-col gap-2 px-6">
            <div className="uppercase text-xs font-medium text-slate-500">
              isp
            </div>
            <div className="capitalize font-semibold text-xl truncate">
              {address?.isp ? address?.isp : "XXX"}
            </div>
          </div>
        </div>
      </div>

      {location.length > 0 && (
        <MapContainer
          center={location}
          zoom={13}
          scrollWheelZoom={false}
          className="md:h-screen h-[65vh]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      )}
    </div>
  );
};

export default App;
