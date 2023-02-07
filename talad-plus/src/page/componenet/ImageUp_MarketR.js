import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

export default function ImageUpload() {
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e) {
    setImages([...e.target.files]);
  }

  console.log("Images : ", images);
  console.log("imageURLs : ", imageURLs);

  return (
    <div className="App">
      <label>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#ffc422",
            fontSize: "18px",
            width: "45%",
          }}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageChange}
          />

          {imageURLs.map((imageSrc, idx) => (
            <img
              key={idx}
              width="80%"
              height="50%"
              src={imageSrc}
              alt="Market Ricesne"
            />
          ))}
        </Button>
      </label>
    </div>
  );
}
