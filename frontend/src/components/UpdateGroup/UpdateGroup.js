import { updateGroup } from "../../store/group";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const UpdateGroupForm = () => {
  const { groupId } = useParams();
  const groups = useSelector((state) => {
    return state?.group.details;
  });


  const [name, setName] = useState(groups.name);
  const [city, setCity] = useState(groups.city);
  const [state, setState] = useState(groups.state);
  const [about, setAbout] = useState(groups.about);
  const [privacy, setPrivacy] = useState(groups.private);
  const [preview, setPreview] = useState(groups.GroupImages.preview);
  const [groupSetting, setGroupSetting] = useState(groups.type);
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
     
      let updatedGroup;

      updatedGroup = await dispatch(updateGroup(groupId, groupFormInput));

      if (updatedGroup) {
        history.push(`/api/groups/${groupId}`);
      }
    }
  };

  return groups ? (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="form-title">
          <h2>Update your Group</h2>
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
            <p> 1. What's the purpose of the group? </p>
          </div>
          <div className="criteria2">
            <p> 2. Who should join? </p>
          </div>
          <div className="criteria3">
            <p>3. What will you do at your events?</p>
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
          <div className="in-person-online">
            <label>Is this an in-person or online group?</label>
          </div>
          <div className="group-setting">
            <select
              name="groupSetting"
              style={{ height: "25px", width: "100px" }}
            >
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
          <label>Is this group private or public?</label>
          <div className="private-setting">
            <select
              name="privacy"
              value={privacy.toString()}
              style={{ height: "25px", width: "100px" }}
              onChange={(e) => setPrivacy(e.target.value === "true")}
            >
              <option value={true}>Private</option>
              <option value={false}>Public</option>
            </select>
          </div>
          {/* <label>Please add an image URL for your group below:</label>
          <input
            type="text"
            name="preview"
            placeholder="Image Url"
            value={preview}
            style={{ height: "25px", width: "352px" }}
            onChange={(e) => setPreview(e.target.value)}
          /> */}
        </div>
        <button
          className="submit-button"
          type="submit"
          disabled={errors.length > 0}
        >
          Update Group
        </button>
      </div>
    </form>
  ) : (
    <div>Group Loading...</div>
  );
};
export default UpdateGroupForm;
