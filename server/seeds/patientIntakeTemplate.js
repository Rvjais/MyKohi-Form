const patientIntakeTemplate = {
  name: "New Patient Intake Form",
  description: "Please complete this medical and demographic intake form prior to your first visit.",
  slug: "patient-intake",
  isDefault: true,
  sections: [
    {
      id: "patient-info",
      title: "Patient Information",
      description: "Basic demographic information.",
      fields: [
        {
          id: "patientName",
          type: "fullname",
          label: "Patient Name",
          required: true,
          subFields: [
            { id: "firstName", label: "First Name", placeholder: "First" },
            { id: "lastName", label: "Last Name", placeholder: "Last" },
          ],
        },
        { id: "dateOfBirth", type: "text", label: "Date of Birth", required: true, placeholder: "MM/DD/YYYY" },
        { id: "email", type: "email", label: "Email Address", required: true },
        { id: "phone", type: "phone", label: "Phone Number", required: true },
        {
          id: "address",
          type: "address",
          label: "Home Address",
          required: true,
          subFields: [
            { id: "street1", label: "Street Address", placeholder: "Street Address" },
            { id: "street2", label: "Street Address Line 2", placeholder: "Apt/Suite" },
            { id: "city", label: "City", placeholder: "City" },
            { id: "state", label: "State", placeholder: "State" },
            { id: "zip", label: "Zip Code", placeholder: "Zip Code" },
          ],
        },
      ],
    },
    {
      id: "medical-history",
      title: "Medical History",
      description: "Brief overview of your medical history and current symptoms.",
      fields: [
        { id: "primaryReason", type: "textarea", label: "Primary reason for seeking treatment today", required: true },
        { id: "currentMedications", type: "textarea", label: "Current Medications (include dosages if known)" },
        { id: "pastTreatments", type: "textarea", label: "Past psychiatric or therapeutic treatments" },
        { id: "allergies", type: "textarea", label: "Any known allergies?" },
      ],
    },
    {
      id: "emergency-contact",
      title: "Emergency Contact",
      description: "Who should we contact in an emergency?",
      fields: [
        {
          id: "emergencyName",
          type: "fullname",
          label: "Emergency Contact Name",
          required: true,
          subFields: [
            { id: "firstName", label: "First Name" },
            { id: "lastName", label: "Last Name" },
          ],
        },
        { id: "emergencyRelationship", type: "text", label: "Relationship to Patient", required: true },
        { id: "emergencyPhone", type: "phone", label: "Emergency Contact Phone Number", required: true },
      ],
    },
  ],
};

export default patientIntakeTemplate;
