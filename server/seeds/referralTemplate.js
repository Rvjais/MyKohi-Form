const referralTemplate = {
    name: "Provider Referral Form",
    description: "Secure and quick form for healthcare providers to refer patients to our practice.",
    slug: "provider-referral",
    isDefault: true,
    sections: [
        {
            id: "referring-provider",
            title: "Referring Provider Information",
            description: "Details about your practice and you.",
            fields: [
                {
                    id: "referringProviderName",
                    type: "fullname",
                    label: "Referring Provider Name",
                    required: true,
                    subFields: [
                        { id: "firstName", label: "First Name" },
                        { id: "lastName", label: "Last Name" },
                    ],
                },
                { id: "practiceName", type: "text", label: "Practice/Clinic Name", required: true },
                { id: "providerNPI", type: "text", label: "Provider NPI (Optional)" },
                { id: "providerEmail", type: "email", label: "Provider Email", required: true },
                { id: "providerPhone", type: "phone", label: "Provider Direct Phone or Fax", required: true },
            ],
        },
        {
            id: "patient-details",
            title: "Patient Details",
            description: "Information about the patient being referred.",
            fields: [
                {
                    id: "patientName",
                    type: "fullname",
                    label: "Patient Name",
                    required: true,
                    subFields: [
                        { id: "firstName", label: "First Name" },
                        { id: "lastName", label: "Last Name" },
                    ],
                },
                { id: "patientDOB", type: "text", label: "Patient Date of Birth", placeholder: "MM/DD/YYYY", required: true },
                { id: "patientPhone", type: "phone", label: "Patient Phone Number", required: true },
                { id: "patientEmail", type: "email", label: "Patient Email Address" },
            ],
        },
        {
            id: "referral-reason",
            title: "Reason for Referral",
            description: "Clinical details supporting this referral.",
            fields: [
                {
                    id: "serviceRequested",
                    type: "checkbox",
                    label: "Service Requested (Check all that apply)",
                    options: ["Medication Management", "TMS Therapy", "Ketamine/Spravato", "Psychotherapy", "General Consultation"],
                },
                { id: "diagnosis", type: "textarea", label: "Current Diagnosis / ICD-10 Codes", required: true },
                { id: "clinicalNotes", type: "textarea", label: "Brief Clinical Summary", required: true },
                {
                    id: "attachments",
                    type: "file",
                    label: "Attach relevant patient records or demographics (if applicable)",
                },
            ],
        },
    ],
};

export default referralTemplate;
