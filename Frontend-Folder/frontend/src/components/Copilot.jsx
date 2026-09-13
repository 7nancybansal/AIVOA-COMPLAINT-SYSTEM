import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAnalysis } from "../store/complaintSlice";
import {
  Bot,
  Sparkles,
  Send,
  Upload,
  FileText,
  X,
} from "lucide-react";

function Copilot({ onAnalysis }) {
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysisLocal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-complaint",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("AI Analysis:", data);

      setAnalysisLocal(data.analysis);

      dispatch(setAnalysis(data.analysis));

      if (onAnalysis) {
        onAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Could not analyze complaint.");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisLocal(null);
  };

  return (
    <aside className="copilot-card">

      <div className="copilot-header">

        <div className="copilot-title">

          <div className="copilot-icon">
            <Bot size={18} />
          </div>

          <div>
            <h2>AI Copilot</h2>
            <p>Complaint Risk Assistant</p>
          </div>

        </div>

        <span className="ai-status">
          <span></span>
          AI Ready
        </span>

      </div>
        <div className="copilot-content">
        <div className="upload-section">

          <h3>Complaint Source</h3>

          {!selectedFile ? (

            <label className="upload-box">

              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                hidden
              />

              <Upload size={20} />

              <strong>Upload complaint</strong>

              <span>
                PDF or text file
              </span>

            </label>

          ) : (

            <div className="selected-file">

              <div className="file-info">

                <FileText size={20} />

                <div>

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>

                </div>

              </div>

              <button onClick={removeFile}>
                <X size={16} />
              </button>

            </div>

          )}

        </div>

        <div className="ai-welcome">

          <Sparkles size={18} />

          <div>

            <strong>
              {loading
                ? "AI is analyzing..."
                : "How can I help?"}
            </strong>

            <p>
              Upload a complaint document and I'll
              extract the complaint details and assess risk.
            </p>

          </div>

        </div>

        <div className="copilot-section">

          <h3>AI Assessment</h3>

          <div className="assessment-item">

            <span>
              Complaint completeness
            </span>

            <strong>
              {analysis?.completeness || "Pending"}
            </strong>

          </div>

          <div className="assessment-item">

            <span>
              Risk classification
            </span>

            <strong>
              {analysis?.risk_level || "Pending"}
            </strong>

          </div>

          <div className="assessment-item">

            <span>
              Complaint severity
            </span>

            <strong>
              {analysis?.severity || "Pending"}
            </strong>

          </div>

        </div>

        {analysis && (

          <div className="copilot-section">

            <h3>AI Summary</h3>

            <p>
              {analysis.summary}
            </p>

          </div>

        )}

        <div className="copilot-section">

          <h3>Quick Actions</h3>

          <button className="ai-action">
            Check complaint completeness
          </button>

          <button className="ai-action">
            Assess complaint risk
          </button>

          <button className="ai-action">
            Generate complaint summary
          </button>

        </div>

      </div>

      <div className="copilot-input">

        <input
          type="text"
          placeholder="Ask AI Copilot..."
        />

        <button>
          <Send size={17} />
        </button>

      </div>

    </aside>
  );
}

export default Copilot;