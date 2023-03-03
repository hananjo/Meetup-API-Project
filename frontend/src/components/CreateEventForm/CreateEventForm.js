// import React from "react";
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useHistory, useParams } from "react-router-dom";
// import { addNewEvent } from "../../store/event";
// import { useSelector } from "react-redux";

// const CreateEventForm = () => {
//   const [name, setName] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [description, setDescription] = useState("");
//   const [privacy, setPrivacy] = useState(true);
//   const [price, setPrice] = useState(0);
//   const [preview, setPreview] = useState("");
//   const [groupSetting, setGroupSetting] = useState("In person");
//   const [errors, setErrors] = useState([]);
//   const { groupId } = useParams();
//   const dispatch = useDispatch();
//   const history = useHistory();

//   const groups = useSelector((state) => {
//     return state?.group.details;
//   });

//   useEffect(() => {
//     const validationErrors = [];
//     if (!name.length) {
//       validationErrors.push("Name is required");
//     }
//     if (about.length < 50) {
//       validationErrors.push("Description needs 50 or more characters");
//     }
//     setErrors(validationErrors);
//   }, [name, description]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!errors.length) {
//       // if (!Object.keys(errors).length) {
//       const eventFormInput = {
//         name,
//         city,
//         state,
//         about,
//         private: privacy,
//         preview,
//         type: groupSetting,
//       };
//       let addedNewEvent;
//       addedNewEvent = await dispatch(addNewEvent(eventFormInput));
//       // console.log("******", addedNewGroup);
//       // console.log(addNewGroup);
//       if (addedNewEvent) {
//         history.push(`/api/groups/${addedNewEvent.id}/event`);
//         // hideForm();
//       }
//     }

//     setName("");
//     setCity("");
//     setState("");
//     setAbout("");
//     setPrivacy("Private");
//     setPreview("");
//     setGroupSetting("In person");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Create a new event for {groups.name}</h2>
//       <ul className="errors">
//         {errors.map((error) => (
//           <li key={error}>{error}</li>
//         ))}
//       </ul>
//       <div className="form-section1">
//         <h3> Set your group's location</h3>
//         <p>
//           Meetup groups meet locally, in person, and online. We'll connect you
//           with people in your area.
//         </p>
//         <label>
//           City:
//           <input
//             type="text"
//             name="city"
//             placeholder="City"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//           />
//         </label>
//         <label>
//           State:
//           <input
//             type="text"
//             name="state"
//             placeholder="State"
//             value={state}
//             onChange={(e) => setState(e.target.value)}
//           />
//         </label>
//       </div>
//       <div className="input-event-name">
//         <label>What is the name of your event?</label>
//         <input
//           type="text"
//           name="name"
//           placeholder="Event Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       </div>
//       <div className="form-section3">
//         <h3>Describe the purpose of your Group</h3>
//         <p>
//           People will see this when we promote your group, but you'll be able to
//           add to it later, too. 1. What's the purpose of the group? 2. Who
//           should join? 3. What will you do at your events?
//         </p>
//         <textarea
//           type="text"
//           name="about"
//           placeholder="Please write at least 50 characters"
//           value={about}
//           onChange={(e) => setAbout(e.target.value)}
//         />
//       </div>
//       <div className="form-section4">
//         <label>Is this an in-person or online group?</label>
//         <select name="groupSetting">
//           <option value={groupSetting}>In person</option>
//           <option value={groupSetting}>Online</option>
//         </select>
//         <label>Is this group private or public?</label>
//         <select name="privacy">
//           <option value={true}>Private</option>
//           <option value={false}>Public</option>
//         </select>
//         <label>Please add an image URL for your group below:</label>
//         <input type="text" name="preview" placeholder="Image Url" />
//       </div>
//       <button type="submit" disabled={errors.length > 0}>
//         Create Event
//       </button>
//     </form>
//   );
// };

// export default CreateEventForm;
