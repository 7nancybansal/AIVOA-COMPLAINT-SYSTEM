import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ComplaintForm from "./components/ComplaintForm";
import Copilot from "./components/Copilot";

function App() {

  const [formData, setFormData] = useState({
    productName: "",
    batchNumber: "",
    strength: "",
    manufacturingDate: "",
    expiryDate: "",
    affectedQuantity: "",
    category: "",
    severity: "",
    description: "",
  });

  const handleAnalysis = (analysis) => {

    setFormData({
      productName: analysis.product_name || "",
      batchNumber: analysis.batch_number || "",
      strength: analysis.strength || "",
      manufacturingDate: analysis.manufacturing_date || "",
      expiryDate: analysis.expiry_date || "",
      affectedQuantity: analysis.affected_quantity || "",
      category: analysis.complaint_category || "",
      severity: analysis.severity || "",
      description: analysis.description || "",
    });
  };

  return (
    <div className="app">

      <Sidebar />

      <main className="main-content">

        <Header />

        <div className="page-content">

          <div className="workspace">

            <ComplaintForm
              formData={formData}
              setFormData={setFormData}
            />

            <Copilot
              onAnalysis={handleAnalysis}
            />

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;