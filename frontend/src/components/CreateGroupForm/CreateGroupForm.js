import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addNewGroup } from "../../store/group";
import "./CreateGroupForm.css";
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
    if (groupSetting === "(select one)") {
      validationErrors.push("Group type is required");
    }
    if (privacy === "(select one)") {
      validationErrors.push("Visibility type is required");
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
      // console.log("******", addedNewGroup);
      // console.log(addNewGroup);
      if (addedNewGroup) {
        history.push(`/groups/${addedNewGroup.id}`);
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
      <div className="form-container">
        <div className="form-title">
          <h2>Start a new group, we'll walk you through the process</h2>
        </div>
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
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </p>
          <div className="name-input">
            <input
              style={{ width: "352px" }}
              type="text"
              name="name"
              placeholder="What is your group name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="form-section3">
          <h3>Describe the purpose of your Group</h3>
          <p>
            People will see this when we promote your group, but you'll be able
            to add to it later, too.
          </p>
          <div className="criteria1">
            <p>1. What's the purpose of the group? </p>
          </div>
          <div className="criteria2">
            <p> 2. Who should join? </p>
          </div>
          <div className="criteria3">
            <p> 3. What will you do at your events?</p>
          </div>

          <textarea
            style={{ width: "352px", height: "200px" }}
            type="text"
            name="about"
            placeholder="Please write at least 50 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div className="form-section4">
          <h3>Final Steps...</h3>
          <div className="in-person-online">
            <label>Is this an in-person or online group?</label>
          </div>
          <div className="group-setting">
            <select
              // defaultValue="(select one)"
              onChange={(e) => setGroupSetting(e.target.value)}
              name="type"
              style={{ height: "25px", width: "100px" }}
            >
              {/* <option value="(select one)">(select one)</option> */}

              <option value={groupSetting}>In person</option>
              <option value={groupSetting}>Online</option>
            </select>
          </div>
          <label>Is this group private or public?</label>
          <div className="private-setting">
            <select
              // defaultValue="(select one)"
              name="private"
              value={privacy.toString()}
              onChange={(e) => setPrivacy(e.target.value === "true")}
              style={{ height: "25px", width: "100px" }}
            >
              {/* <option value="(select one)">(select one)</option> */}

              <option value={true}>Private</option>
              <option value={false}>Public</option>
            </select>
          </div>
          <label>Please add an image URL for your group below:</label>
          <input
            type="text"
            name="preview"
            value={preview}
            placeholder="Image Url"
            style={{ height: "25px", width: "352px" }}
            onChange={(e) => setPreview(e.target.value)}
          />
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={errors.length > 0}
        >
          Create Group
        </button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
