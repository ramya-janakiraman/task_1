import React, { useState } from "react";
import "./App.css";

const schemaOptions = [
  { label: "First Name", value: "first_name", type: "user" },
  { label: "Last Name", value: "last_name", type: "user" },
  { label: "Gender", value: "gender", type: "user" },
  { label: "Age", value: "age", type: "user" },
  { label: "Account Name", value: "account_name", type: "group" },
  { label: "City", value: "city", type: "user" },
  { label: "State", value: "state", type: "user" },
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");

  const handleAddSchema = () => {
    if (selectedSchema) {
      const selected = schemaOptions.find((opt) => opt.value === selectedSchema);
      setSchemas([...schemas, selected]);
      setSelectedSchema("");
    }
  };

  const handleRemoveSchema = (index) => {
    const updated = [...schemas];
    updated.splice(index, 1);
    setSchemas(updated);
  };

  const handleSaveSegment = async () => {
    if (!segmentName) {
      alert("Please enter a segment name!");
      return;
    }
    if (schemas.length === 0) {
      alert("Please add at least one schema!");
      return;
    }

    const formatted = {
      segment_name: segmentName,
      schema: schemas.map((s) => ({ [s.value]: s.label })),
    };

    try {
      const res = await fetch("http://localhost:5000/save-segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatted),
      });

      if (res.ok) {
        alert("Segment saved and sent to webhook!");
        setShowPopup(false);
        setSegmentName("");
        setSchemas([]);
      } else {
        alert("Failed to send segment. Try again.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error sending segment.");
    }
  };

  const availableSchemas = schemaOptions.filter(
    (opt) => !schemas.find((s) => s.value === opt.value)
  );

  return (
    <div className="app-container">
      <button className="open-btn" onClick={() => setShowPopup(true)}>
        Save segment
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-panel">
            <div className="popup-header">
              <span className="back-arrow" onClick={() => setShowPopup(false)}>
                ←
              </span>
              <h3>Saving Segment</h3>
            </div>

            <div className="popup-content">
              <label>Enter the Name of the Segment</label>
              <input
                type="text"
                placeholder="Name of the segment"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />

              <p className="info-text">
                To save your segment, you need to add the schemas to build the query
              </p>

              <div className="traits-info">
                <span className="dot user"></span> User Traits &nbsp;&nbsp;
                <span className="dot group"></span> Group Traits
              </div>

              <div className="schema-box">
                {schemas.map((schema, index) => (
                  <div key={index} className="schema-row">
                    <span
                      className={`dot ${schema.type === "user" ? "user" : "group"}`}
                    ></span>
                    <select
                      value={schema.value}
                      onChange={(e) => {
                        const updated = [...schemas];
                        const newOpt = schemaOptions.find(
                          (opt) => opt.value === e.target.value
                        );
                        updated[index] = newOpt;
                        setSchemas(updated);
                      }}
                    >
                      {schemaOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          disabled={schemas.some(
                            (s, i) => s.value === opt.value && i !== index
                          )}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveSchema(index)}
                    >
                      −
                    </button>
                  </div>
                ))}

                <div className="schema-row">
                  <span className="dot neutral"></span>
                  <select
                    value={selectedSchema}
                    onChange={(e) => setSelectedSchema(e.target.value)}
                  >
                    <option value="">Add schema to segment</option>
                    {availableSchemas.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="add-link" onClick={handleAddSchema}>
                  + Add new schema
                </p>
              </div>
            </div>

            <div className="popup-footer">
              <button className="save-btn" onClick={handleSaveSegment}>
                Save the Segment
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
