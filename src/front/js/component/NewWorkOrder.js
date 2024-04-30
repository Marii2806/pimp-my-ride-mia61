import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext"
import { useNavigate } from "react-router-dom";
import { GenerateWoSteps } from "../component/GenerateWoSteps";
import { SearchBar } from "./SearchBar";

const NewWorkOrder = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context)

  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: ""
  })
  const [makeList, setMakeList] = useState([]);
  const [modelsList, setModelsList] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [license, setLicense] = useState("");
  const [color, setColor] = useState("");
  const [estCompletion, setEstCompletion] = useState("");

  const [uploadedImages, setUploadedImages] = useState([]);
  const [woStages, setWoStages] = useState([]);
  const [comments, setComments] = useState([]);
  const [imageSizeError, setImageSizeError] = useState(false)

  // Defining vechicle models for each make:


  useEffect(() => {
    const fetchedMakes = [
      "Acura",
      "Alfa Romeo",
      "Aston Martin",
      "Audi",
      "Bentley",
      "BMW",
      "Buick",
      "Cadillac",
      "Chevrolet",
      "Chrysler",
      "Dodge",
      "Ferrari",
      "Fiat",
      "Ford",
      "Genesis",
      "GMC",
      "Honda",
      "Hyundai",
      "Infiniti",
      "Jaguar",
      "Jeep",
      "Kia",
      "Lamborghini",
      "Land Rover",
      "Lexus",
      "Lincoln",
      "Lotus",
      "Maserati",
      "Mazda",
      "McLaren",
      "Mercedes-Benz",
      "MINI",
      "Mitsubishi",
      "Nissan",
      "Porsche",
      "Ram",
      "Rolls-Royce",
      "Subaru",
      "Tesla",
      "Toyota",
      "Volkswagen",
      "Volvo",
    ];
    setMakeList(fetchedMakes);
  }, []);

  useEffect(() => {
    if (make) {
      setModelsList(store.vehicleModels[make] || []);
    } else {
      setModelsList([]);
    }
  }, [make]);

  const handleMakeChange = (event) => {
    setMake(event.target.value);
  };

  // const handleYearChange = (e) => {
  //   setYear(e.target.value);
  // };

  const years = Array.from({ length: 30 }, (_, index) =>
    (new Date().getFullYear() + 1 - index).toString()
  );

  const handleImageUpload = (event) => {
    const files = event.target.files;
    let file_size = event.target.files[0].size;
    console.log (file_size)
    if (file_size <= 100000 ){
      console.log(">>> files", files);
      setImageSizeError (false)
    const images = [];
    for (let index = 0; index < files.length; index++) {
      images.push(files.item(index));
    }
    setUploadedImages((prev) => ([
      ...prev,
      ...images
    ]));
    } else {
      setImageSizeError (true)
    }
    
    
  };

  const handleNewWorkOrder = async (event) => {
    event.preventDefault()
    const success = await actions.createNewWorkOrder({
      customer_id: customer.id,
      wo_stages: woStages,
      make: make,
      model: model,
      year: year,
      color: color,
      vin: vin,
      license_plate: license,
      comments: comments,
      images: uploadedImages,
      estCompletion: estCompletion
    });
    if (success) {
      await actions.getAllWorkOrders()
      setCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: ""
      });
      setMake("");
      setModel("");
      setYear("");
      setVin("");
      setLicense("");
      setColor("");
      setUploadedImages([]);
      setWoStages([]);
      setComments([]);
      setImageSizeError(false);
      setEstCompletion("");
      document.querySelector("#imageInput").value=null
      // alert("Work Order Created Successfully!");
    } else {
      alert("Something went wrong");
    }

  }



  return (
    <div className="form-container" style={{
      width: '100%',
      maxWidth: '98%',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#f3f2f2',
      borderRadius: '5px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
      color: '#fff'
    }}>
      <SearchBar setCustomer={setCustomer} />

      <form onSubmit={handleNewWorkOrder} >
        <div className="row input-group mb-3 mt-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              name="first_name"
              value={customer.first_name}
              placeholder="First name *"
              onChange={() => setCustomer({ firstName: event.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={customer.last_name}
              name="last_name"
              placeholder="Last name *"
              onChange={() => setCustomer({ lastName: event.target.value })}
              required
            />
          </div>
        </div>

        <div className="row input-group mb-3">
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email *"
              value={customer.email}
              onChange={() => setCustomer({ email: event.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              name="phone_number"
              placeholder="Phone number *"
              value={customer.phone}
              onChange={() => setCustomer({ phone: event.target.value })}
              required
            />
          </div>

        </div>
        <div className="row input-group mb-3">
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              name="address"
              placeholder="123 Main St."
              value={customer.address}
              onChange={() => setCustomer({ address: event.target.value })}
              required
            />
          </div>
        </div>
        <div className="row input-group mb-3">
          <div className="col-md-4">
            <select
              className="form-select"
              aria-label="Make"
              onChange={handleMakeChange}
              value={make}
            >
              <option value="" selected disabled>
                Select Make
              </option>
              {makeList.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              aria-label="Model"
              disabled={!make}
              onChange={(event) => setModel(event.target.value)}
              value={model}
            >
              <option value="" selected disabled>
                Select Model
              </option>
              {modelsList.sort().map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              aria-label="Year"
              disabled={!make || !modelsList.length}
              onChange={(event) => setYear(event.target.value)}
              value={year}
            >
              <option value="" selected disabled>
                Select Year
              </option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row input-group mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              name="vin_number"
              placeholder="VIN Number *"
              maxLength={17}
              onInput={(event) => {
                event.target.value = event.target.value.toUpperCase();
              }}
              onChange={(event) => setVin(event.target.value)}
              value={vin}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              name="license_plate"
              placeholder="License plate *"
              onChange={(event) => setLicense(event.target.value)}
              value={license}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              name="color"
              placeholder="Color *"
              onChange={(event) => setColor(event.target.value)}
              value={color}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <div></div>
          <input
            type="file"
            className="form-control"
            id="imageInput"
            aria-describedby="inputGroupFileAddon04"
            aria-label="Upload"
            multiple
            onChange={handleImageUpload}
            filename={`${uploadedImages.length > 0 ? uploadedImages.length : "No"} selected file${uploadedImages.length === 1 ? "" : "s"}`}
            
          />
          {imageSizeError ? (
            <p className="text-danger">The image file you chose is too large to upload</p>

          ): ""}
        </div>
        {/* Conditionally render the preview section */}
        {uploadedImages.length > 0 && (
          <div className="d-flex flex-wrap">
            {uploadedImages.map((image, index) => (
              <div key={index} className="position-relative d-inline-block">
                <img
                  key={index}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    margin: "5px",
                  }}
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded Preview ${index}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setUploadedImages((imageList) =>
                      imageList.filter((_, imageIndex) => imageIndex !== index)
                    )
                  }
                  className="btn btn-outline-danger position-absolute top-0 end-0 m-2"
                  style={{
                    borderRadius: "15%",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  x
                </button>
              </div>
            ))}
            {/* Render empty preview placeholders if less than 12 images */}
          </div>
        )}

        <div className="mb-3"></div>

        <div className="input-group">
          <span className="input-group-text mb-3">Notes:</span>
          <textarea
            className="form-control mb-3"
            name="text_area"
            placeholder="Comments"
            onChange={(event) => setComments(event.target.value)}
            value={comments}
          ></textarea>
        </div>
        <div className="input-group">
          <span className="input-group-text">Completion date:</span>
          <input
            className="form-control"
            name="est_completion"
            placeholder="est_completion"
            type="date"
            onChange={(event) => {
              const newDate = event.target.value;
              setEstCompletion(newDate)
            } }
            value={estCompletion}
          ></input>
        </div>

        <div className="mb-3"></div>

        <div>
          <GenerateWoSteps setWoStages={setWoStages} woStages={woStages} />
        </div>

        <div>
          <button
            type="submit" className="btn btn-primary mt-3"
            onClick={handleNewWorkOrder}>
            Create new order
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWorkOrder;

//  for picutrse send 2 fourmat fields,,
//  second request to send a file 

//  Flux and make a new fetch that takes a arr []