import { format } from 'path';
import React from 'react';
import api from '../util/api';
import { itags } from '../util/constants';

export default class BodyItems extends React.Component {
  state = {
    url: '',
    isFetching: false,
    vData: null,
    info: null,
  };

  secondsToHms = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? `${h}: ` : "";
    var mDisplay = m > 0 ? `${m}: ` : "";
    var sDisplay = s > 0 ? `${s}` : "";
    return hDisplay + mDisplay + sDisplay;
  }

  bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  handleFetch = async () => {
    this.setState({ isFetching: true, info: null });
    const {url} = this.state;
    const video = await api.get(`/info?url=${url}`);
    const {data} = video;
    const {info} = data;
    const {videoDetails} = info;
    const title = videoDetails.title;
    const {description, length_seconds, related_videos, video_url, formats} = info;
    let vFormats = [];
    console.log(formats);
    formats.map((format) => {
      const {itag, url, contentLength} = format;
      const cInfo = itags[itag];
      const size = contentLength && this.bytesToSize(contentLength) || 0;
      cInfo && vFormats.push({...cInfo, url, size, itag});
    });
    console.log(info);
    
    const video_id = url.split("/")[3].split("?")[1].split("=")[1];
    const img = `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`;
    this.setState({ isFetching: false, vData: `${vFormats[0].itag}_${vFormats[0].format}`, info: {description, title, time: this.secondsToHms(length_seconds), related_videos, video_id, video_url, img, formats: vFormats} });
  }

  handleDownload = () => {
    const {download} = this.refs;
    download.click();
  }

  handleChange = ({target}) => this.setState({[target.name]: target.value});

  render() {
    const {url, isFetching, info, vData} = this.state;

    return (
      <div className="body-items">



        <div className="container-inner">
          {/* ##//Info Fetching Component Starts Here */}
          <div className="search-container">


            <div className="flex justify-center">

              <div className="input-group relative flex justify-center items-stretch w-full mb-4">
                <input type="text" className="orm-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none " name="url" placeholder="https://www.youtube.com/watch?v=vZqzVoFU0QY" value={url} onChange={this.handleChange} />
                <button className="btn inline-block px-6 py-2 border-2 border-blue-800 font-light text-blue-800 text-m font-menlo leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" onClick={this.handleFetch} disabled={isFetching}>{isFetching ? `Loading` : `Fetch`}</button>
              </div>

            </div>
          </div>
          {/* //Ends Here */}
        </div>




        <div className="flex justify-center">
          {info && (
            <div className="block p-6 rounded-lg shadow-lg bg-transparent border-blue-800 border-2 opacity-6 max-w-sm">


              <div className="video-thumbnail">
                <img className="border-2 border-blue-800" src={info.img} />
              </div>


              <div className="text-gray-700 text-base mb-4">

                <div className="flex flex-wrap">

                  <div className="formats">
                    <a target="_blank" href={`/api/download?url=${url}&vname=${info.title}&itag=${vData && vData.split('_')[0]}&format=${vData && vData.split('_')[1]}`} style={{display: 'none'}} ref={'download'}>Download Url</a>
                    <select className="dropdown-toggle
          btn inline-block px-2 py-2 border-2 border-blue-800 font-light text-blue-800 text-m font-menlo leading-tight uppercase rounded bg-transparent hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" name="vData" value={vData} onChange={this.handleChange}>
                    {info.formats.map((format, i) => (
                      <option className="format" value={`${format.itag}_${format.format}`} key={`format-${i}`}>{`${format.type}${format.quality !== '-' ? `_${format.quality}` : ''}.${format.format} ${format.disp ? `(${format.disp})` : ''} ${format.size ? `(${format.size})` : ''}`}</option>
                      /* selected={vData === `${format.itag}_${format.format}`} */
                    ))}
                    </select>
                  </div>


                  <button className="btn inline-block px-2 py-2 border-2 border-blue-800 font-light text-blue-800 text-m font-menlo leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" onClick={this.handleDownload}>Download</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}