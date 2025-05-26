import { useState, useEffect } from "react";
import "./Videos.css";
import { valueConverter } from "../data";
import moment from "moment";
import { useNavigate } from "react-router-dom";

moment().format();

const Videos = ({ category, onVideoSelect }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const url = new URL("http://localhost:10000/api/youtube");
      if (category) url.searchParams.append("category", category);

      const response = await fetch(url);
      const json = await response.json();

      const videoItems = json.items;

      const updatedItems = await Promise.all(
        videoItems.map(async (item) => {
          const channelId = item.snippet.channelId;
          const profileUrl = await fetchProfile(channelId);
          return { ...item, profilePicture: profileUrl };
        })
      );

      setData(updatedItems);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    }
  };

  const fetchProfile = async (channelId) => {
    try {
      const response = await fetch(
        `http://localhost:10000/api/youtube/channel?id=${channelId}`
      );
      const data = await response.json();
      return data.items[0].snippet.thumbnails.default.url;
    } catch (error) {
      console.error("Failed to fetch profile picture", error);
      return "";
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const handleVideoClick = (videoId) => {
    navigate(`/VideoPage/${category}/${videoId}`);
    onVideoSelect(videoId);
  };

  return (
    <div className="videosContainer">
      {data.map((item, index) => (
        <div
          className="video"
          key={index}
          onClick={() => handleVideoClick(item.id)}
        >
          <img
            src={item.snippet.thumbnails.medium.url}
            alt={item.snippet.title}
          />
          <div className="flex info">
            <img className="pfp" src={item.profilePicture} alt="" />
            <div className="infoText flexCol">
              <h1 className="videoTitle">{item.snippet.title}</h1>
              <div className="info2">
                <h1 className="videoSubtitle">{item.snippet.channelTitle}</h1>
                <div className="flex">
                  <h4 className="videoSubtitle">
                    {valueConverter(item.statistics?.viewCount || 0)} views •{" "}
                    {moment(item.snippet.publishedAt).fromNow()}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Videos;
