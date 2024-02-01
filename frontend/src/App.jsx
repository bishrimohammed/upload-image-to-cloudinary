import { useState } from "react";

import "./App.css";
import { Button, Form, Image } from "react-bootstrap";
function App() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const URI = import.meta.env.VITE_REACT_APP_URL;
  const changeHanlder = (e) => {
    setImage(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image);
    //formData.append("upload_preset", import.meta.env.VITE_REACT_APP_UPLOAD_PRESENT);
    fetch(URI + "/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPreviewImage(result.secure_url);
      });
  };
  return (
    <div className="p-2 border border-1 w-100">
      <div className="app">
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Default file input example</Form.Label>
            <Form.Control
              type="file"
              onChange={changeHanlder}
              accept="image/png, image/jpeg"
            />{" "}
            {previewImage && (
              <div className="mt-2">
                {" "}
                <Image
                  src={previewImage}
                  /* {previewImage} */ width={70}
                  fluid
                />
              </div>
            )}
          </Form.Group>
          <Button type="submit">submit</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
