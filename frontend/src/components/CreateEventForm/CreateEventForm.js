import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { addNewEvent } from "../../store/event";
import { useSelector } from "react-redux";
import "./CreateEventForm.css";

const CreateEventForm = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(true);
  const [price, setPrice] = useState(0);
  const [preview, setPreview] = useState("");
  const [groupSetting, setGroupSetting] = useState("In person");
  const [errors, setErrors] = useState([]);
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const groups = useSelector((state) => {
    return state?.group.details;
  });
  console.log(groups);
  useEffect(() => {
    const validationErrors = [];
    if (!name.length) {
      validationErrors.push("Name is required");
    }
    if (description.length < 50) {
      validationErrors.push("Description needs 50 or more characters");
    }
    if (price <= 0) {
      validationErrors.push("Price is required");
    }
    if (!startDate.length) {
      validationErrors.push("Start date is required");
    }
    if (!endDate.length) {
      validationErrors.push("End date is required");
    }
    setErrors(validationErrors);
  }, [name, description, price, startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.length) {
      // if (!Object.keys(errors).length) {
      const eventFormInput = {
        name,
        endDate,
        startDate,
        description,
        price,
        private: privacy,
        preview,
        type: groupSetting,
      };
      let addedNewEvent;
      addedNewEvent = await dispatch(addNewEvent(groupId, eventFormInput));
      if (addedNewEvent) {
        history.push(`/api/events/${addedNewEvent.id}`);
      }
    }

    setName("");
    setPrice(0);
    setStartDate("");
    setEndDate("");
    setDescription("");
    setPrivacy("Private");
    setPreview("");
    setGroupSetting("In person");
  };

  return (
    <div className="event-form-container">
      {groups && (
        <form onSubmit={handleSubmit}>
          {/* <div></div> */}
          <div className="event-form-title">
            <h2>Create a new event for {groups.name}</h2>
          </div>
          {/* {errors ? ( */}
          <ul className="event-form-errors">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          {/* ) : null} */}
          <div className="event-form-section-1">
            <div>
              <div className="event-form-q1">
                <label>What is the name of your event?</label>
              </div>
              <input
                className="event-form-input-q1"
                type="text"
                name="name"
                placeholder="Event Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="event-form-section-2">
            <div className="event-form-groupSetting">
              <div className="event-form-inperson-online">
                <div className="event-form-q2">
                  <label>Is this an in-person or online group?</label>
                </div>
                <select className="event-setting-input" name="groupSetting">
                  <option
                    value={groupSetting}
                    onChange={(e) => setGroupSetting(e.target.value)}
                  >
                    In person
                  </option>
                  <option
                    value={groupSetting}
                    onChange={(e) => setGroupSetting(e.target.value)}
                  >
                    Online
                  </option>
                </select>
              </div>
              <div className="event-form-q3">
                <label>Is this group private or public?</label>
              </div>
              <select className="event-privacy-input" name="privacy">
                <option
                  value={true}
                  onChange={(e) => setPrivacy(e.target.value)}
                >
                  Private
                </option>
                <option
                  value={false}
                  onChange={(e) => setPrivacy(e.target.value)}
                >
                  Public
                </option>
              </select>
            </div>
            <div>
              <div className="event-form-q4">
                <label>What is the price for your event?</label>
              </div>
              <input
                className="event-price-input"
                type="number"
                name="price"
                value={price}
                placeholder="0"
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="event-form-section-3">
            <div>
              <div className="event-form-q5">
                <label> When does your event start?</label>
              </div>
              <input
                className="event-form-q-5-6-input"
                type="text"
                name="startDate"
                value={startDate}
                placeholder="MM/DD/YYYY, HH/mm AM"
                onChange={(e) => setStartDate(e.target.value)}
              ></input>
            </div>
            <div>
              <div className="event-form-q6">
                <label> When does your event end?</label>
              </div>
              <input
                className="event-form-q-5-6-input"
                type="text"
                name="endDate"
                value={endDate}
                placeholder="MM/DD/YYYY, HH/mm PM"
                onChange={(e) => setEndDate(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="event-form-section-4">
            <div className="event-form-q7">
              <label>Please add an image URL for your event below:</label>
            </div>
            <input
              className="event-form-q7-input"
              type="text"
              name="preview"
              value={preview}
              placeholder="Image Url"
              onChange={(e) => setPreview(e.target.value)}
            />
          </div>
          <div className="event-form-section-5">
            <div className="event-form-description">
              <div className="event-form-q8">
                <label>Please describe your event:</label>
              </div>
              <textarea
                className="event-form-description-input"
                type="text"
                name="description"
                placeholder="Please write at least 50 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="submit-event-form"></div>
          <button
            className="submit-event-button"
            type="submit"
            disabled={errors.length > 0}
          >
            Create Event
          </button>
        </form>
      )}
    </div>
  );
  // ) : (
  //   <div> Page Loading ... </div>
  // );
};

export default CreateEventForm;
