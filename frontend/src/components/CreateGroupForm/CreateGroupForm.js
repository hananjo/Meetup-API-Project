import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addNewGroup } from "../../store/group";

// import group from "../../../../backend/db/models/group";
const CreateGroupForm = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [about, setAbout] = useState("");
  const [privacy, setPrivacy] = useState(true);
  const [preview, setPreview] = useState("");
  const [groupSetting, setGroupSetting] = useState("In person");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const validationErrors = [];
    if (!name.length) {
      validationErrors.push("Name is required");
    }
    if (!city.length) {
      validationErrors.push("City is required");
    }
    if (!state.length) {
      validationErrors.push("State is required");
    }
    if (about.length < 50) {
      validationErrors.push("Description needs 50 or more characters");
    }
    setErrors(validationErrors);
  }, [name, city, state, about]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.length) {
      // if (!Object.keys(errors).length) {
      const groupFormInput = {
        name,
        city,
        state,
        about,
        private: privacy,
        preview,
        type: groupSetting,
      };
      let addedNewGroup;
      addedNewGroup = await dispatch(addNewGroup(groupFormInput));
      console.log("******", addedNewGroup);
      console.log(addNewGroup);
      if (addedNewGroup) {
        history.push(`/api/groups/${addedNewGroup.id}`);
        // hideForm();
      }
    }

    setName("");
    setCity("");
    setState("");
    setAbout("");
    setPrivacy("Private");
    setPreview("");
    setGroupSetting("In person");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Start a new Group</h2>
      <ul className="errors">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <div className="form-section1">
        <h3> Set your group's location</h3>
        <p>
          Meetup groups meet locally, in person, and online. We'll connect you
          with people in your area.
        </p>
        <label>
          City:
          <input
            type="text"
            name="city"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
      </div>
      <div className="form-section2">
        <h3>What will your group's name be?</h3>
        <p>
          Choose a name that will give people a clear idea of what the group is
          about. Feel free to get creative! You can edit this later if you
          change your mind.
        </p>
        <input
          type="text"
          name="name"
          placeholder="What is your group name?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-section3">
        <h3>Describe the purpose of your Group</h3>
        <p>
          People will see this when we promote your group, but you'll be able to
          add to it later, too. 1. What's the purpose of the group? 2. Who
          should join? 3. What will you do at your events?
        </p>
        <textarea
          type="text"
          name="about"
          placeholder="Please write at least 50 characters"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>
      <div className="form-section4">
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
        <label>Please add an image URL for your group below:</label>
        <input type="text" name="preview" placeholder="Image Url" />
      </div>
      <button type="submit" disabled={errors.length > 0}>
        Create Group
      </button>
    </form>
  );
};

export default CreateGroupForm;
