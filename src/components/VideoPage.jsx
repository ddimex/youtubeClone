import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { valueConverter } from "../data";
import moment from "moment";
import "./VideoPage.css";

function VideoPage() {
  const [data, setData] = useState([]);
  const { categoryId, videoId } = useParams();

  const fetchData = async () => {
    try {
      const url = new URL("http://localhost:10000/api/youtube");
      if (categoryId) url.searchParams.append("category", categoryId);

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
  }, [categoryId]);

  const selectedVideo = data.find((video) => video.id === videoId);

  if (!selectedVideo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <iframe
        className="video2"
        width="1045"
        height="586"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />

      <div className="info3">
        <h1 className="videoTitle2">{selectedVideo.snippet.title}</h1>
        <div className="flexRow">
          <img
            className="videoPfp"
            src={selectedVideo.profilePicture}
            alt="Profile"
          />
          <h2 className="videoSubtitle2">
            {selectedVideo.snippet.channelTitle}
          </h2>
        </div>
        <h2>
          {valueConverter(selectedVideo.statistics?.viewCount || 0)} views
        </h2>
        <h2>{moment(selectedVideo.snippet.publishedAt).fromNow()}</h2>
      </div>
    </div>
  );
}

export default VideoPage;
