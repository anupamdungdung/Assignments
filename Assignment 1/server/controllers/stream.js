import fs from "fs";

export const streamVideo = (req, res) => {
    //Path to the video file
  const path = "./uploads/videos/2022-03-02T05-01-31.324ZLove Nwantiti.mp4";
  const stat = fs.statSync(path); //It returns a Stats object which contains the details of the file path
  const fileSize = stat.size;
  const range = req.headers.range;
  //   console.log(range);
  if (range) {
    console.log("Chunk part");
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);

    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;

    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};
