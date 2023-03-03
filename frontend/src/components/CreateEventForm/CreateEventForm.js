import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { addNewEvent } from "../../store/event";
import { useSelector } from "react-redux";

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

  useEffect(() => {
    const validationErrors = [];
    if (!name.length) {
      validationErrors.push("Name is required");
    }
    if (description.length < 50) {
      validationErrors.push("Description needs 50 or more characters");
    }
    setErrors(validationErrors);
  }, [name, description]);

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
      addedNewEvent = await dispatch(addNewEvent(eventFormInput));
      // console.log("******", addedNewGroup);
      // console.log(addNewGroup);
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
    <form onSubmit={handleSubmit}>
      <h2>Create a new event for {groups.name}</h2>
      <ul className="errors">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <div className="input-event-name">
        <label>What is the name of your event?</label>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="groupSetting">
        <label>Is this an in-person or online group?</label>
        <select name="groupSetting">
          <option value={groupSetting}>In person</option>
          <option value={groupSetting}>Online</option>
        </select>

        <label>Is this group private or public?</label>
        <select name="privacy">
          <option value={true}>Private</option>
          <option value={false}>Public</option>
        </select>
      </div>
      <div>
        <label>What is the price for your event?</label>
        <input
          type="number"
          name="price"
          value={price}
          placeholder="0"
          onChange={(e) => setPrice(e.target.value)}
        ></input>
      </div>
      <div>
        <label> When does your event start?</label>
        <input
          type="text"
          name="startDate"
          value={startDate}
          placeholder="MM/DD/YYYY, HH/mm AM"
          onChange={(e) => setStartDate(e.target.value)}
        ></input>
      </div>
      <div>
        <label> When does your event end?</label>
        <input
          type="text"
          name="endDate"
          value={endDate}
          placeholder="MM/DD/YYYY, HH/mm PM"
          onChange={(e) => setEndDate(e.target.value)}
        ></input>
      </div>
      <div>
        <label>Please add an image URL for your event below:</label>
        <input type="text" name="preview" placeholder="Image Url" />
      </div>

      <div className="event-description">
        <h3>Please describe your event</h3>
        <textarea
          type="text"
          name="description"
          placeholder="Please write at least 50 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="submit-form"></div>
      <button type="submit" disabled={errors.length > 0}>
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
