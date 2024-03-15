const Downloader = () => {
  return (
    <div className="grouper">
      <label htmlFor="lessonID">Enter GlobalID:</label>
      <input id="lessonID" type="text" placeholder="GlobalID" size={40} />
      <button id="id-submit" className="external-button hidden">
        Log Lesson Data in Console
      </button>
      <button id="pull-text" className="external-button">
        Download All Text
      </button>
    </div>
  );
};
export default Downloader;
