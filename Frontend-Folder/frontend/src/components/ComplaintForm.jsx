import { useState } from "react";
import { Bot, Sparkles , Send , Upload , X } from "lucide-react";
function ComplaintForm({ formData, setFormData }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveDraft = () => {
    console.log("Complaint draft:", formData);
    alert("Complaint draft saved.");
  };

const handleCommit = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/commit-complaint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          riskLevel: "Low",
          completeness: "Complete",
          summary: "Complaint logged through AI-assisted complaint analysis."
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to commit complaint");
    }

    alert(
      `Complaint committed to QMS Ledger. ID: ${data.complaint_id}`
    );

  } catch (error) {
    console.error("Commit failed:", error);
    alert("Could not commit complaint to QMS.");
  }
};

  return (
    <section className="complaint-card">
      <div className="section-heading">
        <div>
          <h2>Log Customer Complaint</h2>
          <p>Enter the complaint details below</p>
        </div>

        <span className="status-badge">Draft</span>
      </div>

      <div className="form-section">
        <h3>Product & Batch Identification</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>Batch Number</label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              placeholder="Enter batch number"
            />
          </div>

          <div className="form-group">
            <label>Strength / Dosage</label>
            <input
              type="text"
              name="strength"
              value={formData.strength}
              onChange={handleChange}
              placeholder="e.g. 500 mg"
            />
          </div>

          <div className="form-group">
            <label>Manufacturing Date</label>
            <input
              type="date"
              name="manufacturingDate"
              value={formData.manufacturingDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Affected Quantity</label>
            <input
              type="number"
              name="affectedQuantity"
              value={formData.affectedQuantity}
              onChange={handleChange}
              placeholder="Enter quantity"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Complaint Details</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Complaint Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option>Product Defect</option>
              <option>Packaging Issue</option>
              <option>Labeling Issue</option>
              <option>Adverse Event</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Severity</label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="">Select severity</option>
              <option>Minor</option>
              <option>Major</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Complaint Description</label>

          <textarea
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the customer complaint..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          className="secondary-button"
          onClick={handleSaveDraft}
        >
          Save Draft
        </button>

        <button
          className="primary-button"
          onClick={handleCommit}
        >
          Commit to QMS Ledger
        </button>
      </div>
    </section>
  );
}

export default ComplaintForm;