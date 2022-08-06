const ytdl = require('ytdl-core');
const contentDisposition = require('content-disposition');
async function getTitle(videoUrl){
    let title;
    await ytdl.getInfo(videoUrl).then(info => {
     title = info.videoDetails.title;
})
return title;
}
export default async (req:any, res:any) => {
    const {url, vname,itag, format} = req.query;
    //res.json({...req.query, ct: contentDisposition(`${vname}.${format}`)});
    res.writeHead(200, {
        'Content-Disposition': `${contentDisposition(`${vname}.${format}`)}`,
        'Content-Transfer-Encoding': 'binary',
        'Content-Type': 'application/octet-stream'
    });
    await ytdl(url, {itag, format}).pipe(res);
    
};
