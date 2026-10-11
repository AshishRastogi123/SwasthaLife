import "bootstrap/dist/css/bootstrap.min.css";
import "./VideoSection.css";

function VideoSection() {
  return (
    <section className="video-section">
      <div className="video-section__inner">
        <h2 className="video-section__heading">
          Problems We Try To Solve
        </h2>
        <div className="ratio ratio-16x9 video-section__frame">
          <iframe
            src="https://www.youtube.com/embed/wkf-WxMZVP8?mute=1"
            title="YouTube video"
            allow="encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
