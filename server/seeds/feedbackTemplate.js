const feedbackTemplate = {
    name: "Patient Satisfaction & Feedback",
    description: "We value your experience and use your feedback to improve our care. Please let us know how we did.",
    slug: "patient-feedback",
    isDefault: true,
    sections: [
        {
            id: "visit-details",
            title: "Visit Details",
            description: "Tell us about your recent visit.",
            fields: [
                { id: "dateOfVisit", type: "text", label: "Date of Visit", placeholder: "MM/DD/YYYY", required: true },
                {
                    id: "providerSeen",
                    type: "text",
                    label: "Provider Seen",
                    description: "Which doctor or therapist did you see?",
                },
                {
                    id: "visitType",
                    type: "radio",
                    label: "Type of Visit",
                    options: ["In-person", "Telehealth / Virtual"],
                    required: true,
                },
            ],
        },
        {
            id: "experience-rating",
            title: "Experience Rating",
            description: "Rate various aspects of your care.",
            fields: [
                {
                    id: "easeOfScheduling",
                    type: "select",
                    label: "Ease of scheduling your appointment",
                    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
                },
                {
                    id: "waitTime",
                    type: "select",
                    label: "Wait time at the clinic or virtual room",
                    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
                },
                {
                    id: "providerCare",
                    type: "select",
                    label: "Quality of care from your provider",
                    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
                },
                {
                    id: "overallExperience",
                    type: "select",
                    label: "Overall Experience",
                    options: ["Excellent", "Good", "Average", "Poor", "Terrible"],
                    required: true,
                },
            ],
        },
        {
            id: "additional-comments",
            title: "Additional Comments",
            description: "Any other details you wish to share.",
            fields: [
                { id: "improveSuggestions", type: "textarea", label: "What is one thing we could do to improve your experience?" },
                { id: "generalFeedback", type: "textarea", label: "Any other comments or feedback?" },
                {
                    id: "contactPermission",
                    type: "radio",
                    label: "May we contact you regarding your feedback?",
                    options: ["Yes", "No"],
                },
                { id: "feedbackPhone", type: "phone", label: "If yes, please provide your phone number" },
            ],
        },
    ],
};

export default feedbackTemplate;
